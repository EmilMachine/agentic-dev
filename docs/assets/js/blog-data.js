const POSTS = [
  {
    slug: "0_what_is_a_coding_agent",
    type: "hands_on",
    langs: ["en"],
    title: { en: "What Is a Coding Agent?", da: "" },
    created: "2026-06-01",
    last_updated: "2026-06-09",
    body: {
      en: `<p><strong>TL;DR</strong> —
<code>npm install -g @anthropic/claude-code</code> →
<code>claude login</code> → <code>claude</code>. ESC to stop, ctrl+c
twice to exit, <code>/usage</code> to check spend. <code>/clear</code>
or <code>/new</code> to clear context. <a
href="https://anthropic.com/pricing">Pricing</a>: use Plans for personal
use, API keys for products.</p>
<hr />
<p>If you already have Claude Code installed and running, you can skip
to <a href="#">Post 1</a>.</p>
<h1>What Is a Coding Agent?</h1>
<p>A coding agent is an AI that doesn't just answer questions — it takes
actions in your codebase. It reads files, writes code, runs commands,
and iterates until a task is done. Think of it less like a chatbot and
more like a junior intern sitting at your terminal.</p>
<p>In practice it is LLM model (AI) + a harness (regular code) to help
split tasks, take actions into the "thinking" power of LLMs.</p>
<p>This series focuses on Claude Code, Anthropic's CLI agent. Other
options exist (Cursor, Copilot, Opencode, Aider), but Claude Code is
what we'll use throughout.</p>
<h2>Getting Claude Code</h2>
<ol>
<li>Sign up at claude.ai — you need a paid plan (Pro or above) to use
Claude Code meaningfully.</li>
<li>Install the CLI:
<code>npm install -g @anthropic/claude-code</code></li>
<li>Authenticate: <code>claude login</code></li>
<li>Open a terminal in your project folder and run:
<code>claude</code></li>
</ol>
<p>That's the entry point.</p>
<p>It is similar to a chat, and you can write any request like "write me
a haiku poem about trees" or "make me a python function to convert
celsius to fahrenheit"</p>
<h2>Basic controls</h2>
<p>You control the agent. It has reading access to the repo you started
it in, but asks you for all changes where it will run commands.</p>
<ul>
<li>Stop execution midway: ESC or Ctrl+C</li>
<li>Exit: Ctrl+C twice</li>
<li>Rewind: ESC twice</li>
<li>Run commands: <code>/usage</code>, <code>/clear</code>, <code>/new</code></li>
</ul>
<h2>Pricing</h2>
<p>Pricing changes — check the <a
href="https://anthropic.com/pricing">Anthropic pricing page</a> for current numbers.</p>
<p>Two billing methods: Plans (monthly fee, periodic limits) and API keys (pay per token).
For personal use, Plans give predictable spend. API keys suit product or project settings.</p>
<h2>What you can do from here</h2>
<p>Next post covers the core workflow: how to reference files, write
prompts as files, and get output as files. That's where the productivity
jump happens.</p>`,
      da: ``
    }
  },
  {
    slug: "1_files_as_input_and_output",
    type: "hands_on",
    langs: ["en"],
    title: { en: "0→1: First Real Workflow with Claude Code", da: "" },
    created: "2026-06-01",
    last_updated: "2026-06-09",
    body: {
      en: `<p><strong>TL;DR</strong> — Reference files with <code>@filename</code>.
Pass prompts as files: <code>follow @filename</code> or without entering
the CLI: <code>claude &lt; tasks/task.md</code>. Write output to files:
<code>analyze @src/ and write report to myreports/out.md</code>. Enable
and disable auto-edit with shift+tab.</p>
<hr />
<h1>0→1: First Real Workflow with Claude Code</h1>
<p>Most people use Claude Code the way they use ChatGPT: type a
question, read the answer. That works, but it misses the point. This
post is about the three patterns that actually change how you work.</p>
<p>Assumes you have Claude Code installed. If not, start with <a
href="blog.html?post=0_what_is_a_coding_agent">Post 0</a>.</p>
<h2>Pattern 1: Reference files directly</h2>
<p>Instead of copying code into the chat, point at it:</p>
<pre><code>add error handling to @src/api/fetch.ts</code></pre>
<p>The <code>@filename</code> syntax pulls the file into context. Claude
reads it, edits it, and writes the result back. You don't paste, you
don't copy out.</p>
<p>(Note: Claude can also figure it out if you omit the @)</p>
<h2>Pattern 2: Prompt as a file</h2>
<p>For anything more than one sentence, write your prompt in a
<code>.md</code> file and pass it:</p>
<pre><code class="language-sh">claude &lt; tasks/add-auth.md</code></pre>
<p>Or reference it inline:
<code>see @tasks/add-auth.md and implement it</code>.</p>
<p>This makes prompts version-controllable, repeatable, and sharable. A
file you can commit is better than a chat message you'll lose.</p>
<h2>Pattern 3: Output as a file</h2>
<p>Ask Claude to write its output somewhere specific:</p>
<pre><code>analyze the performance bottlenecks in @src/ and write a report to myreports/perf-notes.md</code></pre>
<p>Now the output is in your repo, not buried in a chat window.</p>
<h2>Putting it together</h2>
<p>A real session (assume folders <code>myprompts/task1</code>):</p>
<ol>
<li>Write a task description in <code>myprompts/task1/0_context.md</code></li>
<li>Run <code>claude</code> and reference it: <code>implement @myprompts/task1/0_context.md write a changelog to myprompts/task1/1_changelog.md</code></li>
<li>Review the diff, commit what you want</li>
</ol>
<p>Enable auto-edit with shift+tab — it shows as "⏵⏵ accept edits on". Shift+tab twice more to disable.</p>
<p>You still have git version control and <code>git diff</code> as a safety net, though it's rarely needed.</p>
<p>Keep <code>myprompts/</code> with a <code>.gitignore *</code> so messy scratch notes stay local. Distill the important stuff into clean artifacts like README.md.</p>`,
      da: ``
    }
  },
  {
    slug: "2_skills_and_dev_essentials",
    type: "hands_on",
    langs: ["en"],
    title: { en: "Skills: What They Are and How to Use Dev-Essentials", da: "" },
    created: "2026-06-01",
    last_updated: "2026-06-09",
    body: {
      en: `<p><strong>TL;DR</strong> — Install:
<code>/plugin marketplace add https://github.com/EmilMachine/skillhub</code>
→ <code>/plugin install dev-essentials</code>. Key skills:
<code>/pc3</code> (pick between options), <code>/issue</code> (open GitHub issues).
Update: <code>/skillhub-update</code>.</p>
<hr />
<h1>Skills: What They Are and How to Use Dev-Essentials</h1>
<p>Claude Code has a skill system — slash commands that extend what the
agent can do. This post shows what skills are and walks through three
from the <code>dev-essentials</code> pack.</p>
<h2>What is a skill?</h2>
<p>A skill is a reusable prompt, packaged as a slash command. When you type <code>/procon3</code>,
Claude executes a structured decision-making prompt. Like a function, skills can also take arguments.</p>
<p>Skills live in <code>.claude/skills/</code> in your repo (or globally in <code>~/.claude/skills/</code>).
They're just markdown files — readable, editable, version-controllable.</p>
<h2>Installing dev-essentials</h2>
<p>Inside a Claude Code session:</p>
<pre><code>/plugin marketplace add https://github.com/EmilMachine/skillhub
/plugin install dev-essentials</code></pre>
<p>The skills are now available as slash commands in any project. To update later:</p>
<pre><code>/skillhub-update</code></pre>
<h2>Skills worth knowing</h2>
<h3><code>/procon3</code> (or <code>/pc3</code>) — Pick between options</h3>
<p>Use it when choosing between approaches and want structured reasoning:</p>
<pre><code>/pc3 should we use zod or yup for schema validation in this project?</code></pre>
<p>Returns 3 alternatives, each with pros and cons. Outlining 3 options gives a clear
"wait for user input" signal and highlights tradeoffs — unlike asking "what's the best way to do X"
which can kick off implementation immediately.</p>
<h3><code>/skillhub-update</code> — Keep plugins current</h3>
<p>Detects installed plugins, diffs versions, and updates anything stale. Run it periodically or after pulling.</p>
<blockquote>
<p>Skill names and behaviors can change between versions. Check the <a
href="https://github.com/EmilMachine/skillhub">source</a> if something behaves differently.</p>
</blockquote>
<h3><code>/issue</code> — Report a problem with a Skillhub skill</h3>
<p>Describe a bug and create a GitHub issue from the conversation context.
Use as <code>/issue</code> or <code>/issue &lt;your summary&gt;</code>.</p>
<p>The skill populates the issue from context while avoiding project-specific details or secrets.</p>
<h2>The point</h2>
<p>Skills let you build a personal toolkit on top of the base agent. The next post covers
setting up an opinionated environment — including which skills to install and why.</p>`,
      da: ``
    }
  },
  {
    slug: "3_opinionated_setup",
    type: "hands_on",
    langs: ["en"],
    title: { en: "My Opinionated Claude Code Setup", da: "" },
    created: "2026-06-01",
    last_updated: "2026-06-09",
    body: {
      en: `<p><strong>TL;DR</strong> — Run <code>/setup</code> to bootstrap.
Structure: <code>AGENTS.md</code> (index) + <code>AGENTS/{topic}.md</code> + <code>CLAUDE.md</code>
→ all pointing to <code>AGENTS.md</code>. Add <code>myprompts/</code> and
<code>myreports/</code> each with <code>.gitignore *</code> for local scratch work.</p>
<hr />
<h1>My Opinionated Claude Code Setup</h1>
<p>I want a setup that is: A) agent-framework agnostic, B) flexible enough for most projects.</p>
<h2>Agent-agnostic configuration</h2>
<ul>
<li><strong>AGENTS.md</strong> — main entry point; short index pointing to other files.
It's read on every agent startup, so keep it lean.</li>
<li><strong>AGENTS/{topic}.md</strong> — each file holds context for one topic.
Any given agent reads only the relevant parts.</li>
<li><strong>CLAUDE.md / opencode.json</strong> — agent-specific files that point to AGENTS.md.
(Actual files, not symlinks — more robust.)</li>
</ul>
<h2>Flexible local folders</h2>
<ul>
<li><code>myprompts/</code> — prompt input and iteration. <code>.gitignore *</code> keeps it local.</li>
<li><code>myreports/</code> — single-turn analysis outputs (code review, cleanup suggestions). Same gitignore.</li>
</ul>
<p>The <code>my*</code> + gitignore pattern extends to any folder you need.
It signals "messy mid-way artifact, useful locally." Important things get distilled into
clean artifacts: code, AGENTS/ files, README.md, changelogs.</p>
<h2>Dev-essentials skills for this setup</h2>
<h3><code>/codereview &lt;branch&gt;</code> — Review a branch</h3>
<p>Fetches the diff between a branch and main, writes a terse major/minor/nit review to <code>myreports/</code>.
Good before opening a PR. Falls back to local compare if remote isn't available.</p>
<h3><code>/cleanup [path]</code> — Find dead code</h3>
<p>Scans a path for dead code, unused tests, redundant logic, and outdated docs.
Writes a report to <code>myreports/</code> — it suggests, doesn't act.</p>
<h3><code>/secure [path]</code> — Security audit</h3>
<p>OWASP Top 10 checks, secrets scanning, dependency CVE checks.
Severity-ranked report to <code>myreports/</code>.
For serious projects, put these checks in CI/CD instead.</p>
<h3><code>/setup [path]</code> — Bootstrap agent config</h3>
<p>Creates <code>AGENTS.md</code>, <code>CLAUDE.md</code>, AGENTS folder, and private prompt dirs.
Idempotent — safe to run on existing projects.</p>`,
      da: ``
    }
  },
  {
    slug: "4_md3step",
    type: "hands_on",
    langs: ["en"],
    title: { en: "The md3step Loop: Research, Plan, Implement", da: "" },
    created: "2026-06-01",
    last_updated: "2026-06-09",
    body: {
      en: `<p><strong>TL;DR</strong> — Install: <code>/plugin install md3step</code>.
Write <code>0_context.md</code> → <code>/mdresearch 0_context.md</code> → edit <code>1_research.md</code>
→ <code>/mdplan 1_research.md</code> → edit <code>2_plan.md</code>
→ <code>/mdimplement 2_plan.md</code> → review <code>3_changelog.md</code>.
Use <code>/mdupdate &lt;file&gt;</code> after inline edits. Skip for small tasks.</p>
<hr />
<h1>The md3step Loop: Research, Plan, Implement</h1>
<p>This is the power-user pattern. Instead of one-shotting a complex task,
you break it into three bounded steps — each producing a file the next step builds on.
You stay in control at every transition.</p>
<p>Install via skillhub:</p>
<pre><code>/plugin marketplace add https://github.com/EmilMachine/skillhub
/plugin install md3step</code></pre>
<h2>Why the <code>md</code> prefix?</h2>
<p>The skills are named <code>/mdresearch</code>, <code>/mdplan</code>,
<code>/mdimplement</code>, <code>/mdupdate</code> — not <code>/research</code>, <code>/plan</code>, etc.
Words like <code>plan</code> and <code>research</code> collide with system-level keywords in various
agents. The <code>md</code> prefix avoids silent collisions and signals "works with markdown files."</p>
<h3>Why .md files?</h3>
<ol>
<li><strong>Editable.</strong> Unlike live chat, you can remove, change, or add to research and plans.</li>
<li><strong>Persistent.</strong> Close your computer, come back next week — the files are still there.</li>
<li><strong>Atomic steps.</strong> Clear context between steps. Clean, detailed input means less ambiguity.</li>
</ol>
<h2>The workflow</h2>
<pre><code>0_context.md       ← you write this
1_research.md      ← /mdresearch produces this
2_plan.md          ← /mdplan produces this
3_changelog.md     ← /mdimplement produces this</code></pre>
<h3>Step 0: Write context</h3>
<p>Create <code>myprompts/my-feature/0_context.md</code> and describe what you want,
plus any relevant context. This is your input to the whole flow.</p>
<h3>Step 1: Research</h3>
<pre><code>/mdresearch myprompts/my-feature/0_context.md</code></pre>
<p>The agent reads the codebase and writes <code>1_research.md</code> — current state, gaps,
relevant <code>file:line</code> refs. Open questions surface at the top. Answer them inline,
then run <code>/mdupdate</code> to fold them into the body.</p>
<h3>Step 2: Plan</h3>
<pre><code>/mdplan myprompts/my-feature/1_research.md</code></pre>
<p>Produces <code>2_plan.md</code>: numbered, atomic, testable steps with Actions, Files, and Verify.
<strong>This is the step to edit.</strong> Cut scope, add constraints, reorder steps.
The agent drafted the plan — you own it.</p>
<h3>Step 2.5 (optional): Update after edits</h3>
<pre><code>/mdupdate myprompts/my-feature/2_plan.md</code></pre>
<p>Integrates your inline edits and clears resolved questions. Skip if you made no edits.</p>
<h3>Step 3: Implement</h3>
<pre><code>/mdimplement myprompts/my-feature/2_plan.md</code></pre>
<p>Executes each step, verifies after each, writes <code>3_changelog.md</code> with per-step status,
files changed (<code>path:line</code>), and a Gotchas section. No automatic git commits — review the diff yourself.</p>
<h2>When not to use this</h2>
<p>md3step adds overhead. For small tasks — fixing a bug, renaming a function, adding a field —
just do it in one shot. Use this process for anything that touches multiple files,
involves architectural choices, or needs careful scoping.</p>`,
      da: ``
    }
  }
];
