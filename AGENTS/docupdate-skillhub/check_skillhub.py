#!/usr/bin/env python3
"""
Compare docs/assets/js/skills-data.js against the skillhub GitHub repo.

Checks:
  1. Plugin versions in PLUGINS match the canonical versions in marketplace.json
  2. Every skill directory on GitHub exists in SKILLS_DATA
  3. Every skill in SKILLS_DATA exists on GitHub
  4. Every skill's version in SKILLS_DATA matches its plugin's version in PLUGINS

Usage:
  python3 AGENTS/skillhub-sync/check_skillhub.py

Exit: 0 if everything matches, 1 if any issues found.
"""

import json
import re
import sys
import urllib.request
import urllib.error
from pathlib import Path

REPO = "EmilMachine/skillhub"
MARKETPLACE_PATH = ".claude-plugin/marketplace.json"
ROOT = Path(__file__).resolve().parent.parent.parent
SKILLS_DATA = ROOT / "docs/assets/js/skills-data.js"

# Use the GitHub API (not raw.githubusercontent.com) to avoid CDN caching
GH_API = "https://api.github.com"
GH_HEADERS = {
    "Accept": "application/vnd.github+json",
    "User-Agent": "check-skillhub/1.0",
}


# ── GitHub helpers ────────────────────────────────────────────────────────────

def gh_fetch_json(path):
    """Fetch a file from the repo via the GitHub API (bypasses CDN cache)."""
    url = f"{GH_API}/repos/{REPO}/contents/{path}"
    req = urllib.request.Request(url, headers=GH_HEADERS)
    with urllib.request.urlopen(req, timeout=10) as resp:
        meta = json.loads(resp.read())
    # API returns base64-encoded content
    import base64
    return json.loads(base64.b64decode(meta["content"]))


def gh_plugin_versions():
    """Return dict of plugin_id -> version from marketplace.json on GitHub."""
    data = gh_fetch_json(MARKETPLACE_PATH)
    plugins = data.get("plugins", [])
    return {p["name"]: p["version"] for p in plugins if "name" in p and "version" in p}


def gh_skill_dirs(plugin_id):
    """Return set of skill directory names for a plugin from GitHub."""
    url = f"{GH_API}/repos/{REPO}/contents/plugins/{plugin_id}/skills"
    req = urllib.request.Request(url, headers=GH_HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            entries = json.loads(resp.read())
            return {e["name"] for e in entries if e["type"] == "dir"}
    except urllib.error.HTTPError as e:
        print(f"  GitHub API error for {plugin_id}: HTTP {e.code}")
        return None
    except Exception as e:
        print(f"  GitHub API error for {plugin_id}: {e}")
        return None


# ── Local JS parsers ──────────────────────────────────────────────────────────

def parse_plugins(text):
    """Return dict of plugin_id -> version from PLUGINS array."""
    m = re.search(r"const PLUGINS\s*=\s*\[(.+?)\];", text, re.DOTALL)
    if not m:
        return {}
    block = m.group(1)
    plugins = {}
    for pm in re.finditer(r"id:\s*'([^']+)'[^}]*?version:\s*'([^']+)'", block, re.DOTALL):
        plugins[pm.group(1)] = pm.group(2)
    return plugins


def parse_skills(text):
    """Return list of dicts with id, plugin, version from SKILLS_DATA array."""
    m = re.search(r"const SKILLS_DATA\s*=\s*\[(.+)\];", text, re.DOTALL)
    if not m:
        return []
    block = m.group(1)
    skills = []
    for obj_m in re.finditer(r"\{([^{}]+)\}", block, re.DOTALL):
        entry = {}
        for kv in re.finditer(r"(\w+):\s*'([^']+)'", obj_m.group(1)):
            entry[kv.group(1)] = kv.group(2)
        if "id" in entry and "plugin" in entry:
            skills.append(entry)
    return skills


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    text = SKILLS_DATA.read_text()
    local_plugins = parse_plugins(text)
    local_skills  = parse_skills(text)

    if not local_plugins:
        print("ERROR: could not parse PLUGINS from skills-data.js")
        sys.exit(1)
    if not local_skills:
        print("ERROR: could not parse SKILLS_DATA from skills-data.js")
        sys.exit(1)

    print("Fetching marketplace.json from GitHub...")
    try:
        gh_versions = gh_plugin_versions()
    except Exception as e:
        print(f"ERROR: could not fetch marketplace.json: {e}")
        sys.exit(1)

    issues = []
    ok_count = 0

    for plugin_id, local_ver in local_plugins.items():
        gh_ver = gh_versions.get(plugin_id)
        ver_label = f"local={local_ver}  gh={gh_ver or '(not found)'}"
        print(f"\n{'─'*55}")
        print(f"Plugin: {plugin_id}  ({ver_label})")
        print(f"{'─'*55}")

        # 1. Plugin version vs GitHub marketplace
        if gh_ver is None:
            issues.append(f"[{plugin_id}] not found in marketplace.json")
        elif local_ver != gh_ver:
            issues.append(
                f"[{plugin_id}] plugin version out of date: local={local_ver!r} gh={gh_ver!r}"
            )

        # Skills in local JS for this plugin
        local_ids = {s["id"] for s in local_skills if s.get("plugin") == plugin_id}

        # Skills on GitHub
        print(f"  Fetching GitHub skill list...")
        gh_ids = gh_skill_dirs(plugin_id)
        if gh_ids is None:
            issues.append(f"[{plugin_id}] could not fetch skills from GitHub — skipping skill checks")
            continue

        # 2. Missing from local
        for name in sorted(gh_ids - local_ids):
            issues.append(f"[{plugin_id}] '{name}' exists on GitHub but not in SKILLS_DATA")

        # 3. Missing from GitHub
        for name in sorted(local_ids - gh_ids):
            issues.append(f"[{plugin_id}] '{name}' is in SKILLS_DATA but not found on GitHub")

        # 4. Skill version must match plugin version in PLUGINS
        for skill in local_skills:
            if skill.get("plugin") != plugin_id:
                continue
            skill_ver = skill.get("version", "")
            if skill_ver != local_ver:
                issues.append(
                    f"[{plugin_id}] '{skill['id']}' version mismatch: "
                    f"skill={skill_ver!r} vs plugin={local_ver!r}"
                )

        # Print skill status
        matched = local_ids & gh_ids
        ok_count += len(matched)
        for name in sorted(matched):
            print(f"  ✓ {name}")
        for name in sorted(gh_ids - local_ids):
            print(f"  ✗ {name}  ← missing from SKILLS_DATA")
        for name in sorted(local_ids - gh_ids):
            print(f"  ✗ {name}  ← not found on GitHub")

    # Warn about plugins on GitHub not tracked locally
    for plugin_id in sorted(gh_versions):
        if plugin_id not in local_plugins:
            issues.append(f"[{plugin_id}] exists in marketplace.json but not in local PLUGINS array")

    print(f"\n{'═'*55}")
    if issues:
        print(f"ISSUES FOUND ({len(issues)}):")
        for issue in issues:
            print(f"  • {issue}")
        print()
        sys.exit(1)
    else:
        print(f"All {ok_count} skills present and versions consistent.")
    print()


if __name__ == "__main__":
    main()
