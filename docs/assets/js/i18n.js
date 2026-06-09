const strings = {
  en: {
    nav_docs: 'Docs',
    nav_skills: 'Skills',
    nav_about: 'About',
    nav_contact: 'Contact',
    docs_title: 'Skill Reference',
    docs_sub: 'All plugins and skills — with why, how, and what.',
    label_why: 'Why',
    label_how: 'How to use',
    label_what: 'What it does',
    hero_title: '>_ Emil "Machine"',
    hero_sub: 'Staff-level agentic coding.\nBuilt for teams that learn while shipping.',
    hero_cta: 'Skillhub docs',
    skills_heading: 'Launch Skills',
    about_heading: 'About',
    about_cred1: 'ex-Spotify Staff Data Scientist',
    about_cred2: 'Ph.D. Applied Physics, DTU',
    about_cred3: 'HYPERIGHT NORDIC 100 in Data Analytics & AI, 2023',
    about_body: 'I build Agentic developer tools that help engineering team move faster while becoming smarter. Build not just for machines but humans - spend the time where it matters.',
    contact_heading: 'Get in touch',
    contact_sub: 'Interested in workshops, consulting, or just want to talk agentic dev?',
    contact_cta: 'Send a message',
    nav_blog: 'Blog',
    blog_title: 'Blog',
    blog_sub: 'Hands-on guides, concepts, and takes on agentic dev.',
    blog_type_all: 'All',
    blog_type_hands_on: 'Hands-on',
    blog_type_concepts: 'Concepts',
    blog_type_believes: 'Believes',
    blog_label_created: 'Published',
    blog_label_updated: 'Updated',
    blog_back: '← All posts',
    blog_no_translation: 'Not yet available in Danish — showing English.',
  },
  da: {
    nav_docs: 'Docs',
    nav_skills: 'Skills',
    nav_about: 'Om',
    nav_contact: 'Kontakt',
    docs_title: 'Skill Reference',
    docs_sub: 'Alle plugins og skills — med hvorfor, hvordan og hvad.',
    label_why: 'Hvorfor',
    label_how: 'Sådan bruger du det',
    label_what: 'Hvad det gør',
    hero_title: '>_ Emil "Machine"',
    hero_sub: 'Staff-niveau agentic coding.\nBygget til teams der lærer mens de leverer.',
    hero_cta: 'Installer skillhub',
    skills_heading: 'Launch Skills',
    about_heading: 'Om mig',
    about_cred1: 'Tidligere Staff Data Scientist hos Spotify',
    about_cred2: 'Ph.d. i anvendt fysik, DTU',
    about_cred3: 'HYPERIGHT NORDIC 100 inden for Data Analytics & AI, 2023',
    about_body: 'Jeg bygger agentiske udviklerværktøjer der hjælper teams med at bevæge sig hurtigere mens de bliver klogere. Bygget ikke bare til maskiner men til mennesker — brug tiden der hvor det betyder noget.',
    contact_heading: 'Kontakt mig',
    contact_sub: 'Interesseret i workshops, rådgivning, eller vil du bare tale agentic dev?',
    contact_cta: 'Send en besked',
    nav_blog: 'Blog',
    blog_title: 'Blog',
    blog_sub: 'Praktiske guides, koncepter og holdninger om agentic dev.',
    blog_type_all: 'Alle',
    blog_type_hands_on: 'Hands-on',
    blog_type_concepts: 'Koncepter',
    blog_type_believes: 'Holdninger',
    blog_label_created: 'Udgivet',
    blog_label_updated: 'Opdateret',
    blog_back: '← Alle indlæg',
    blog_no_translation: 'Ikke tilgængelig på dansk endnu — viser engelsk.',
  }
};

let currentLang = localStorage.getItem('lang') || 'en';

function applyLang(lang) {
  currentLang = lang;
  const map = strings[lang] || strings.en;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc && map.hero_sub) {
    metaDesc.setAttribute('content', map.hero_sub.replace(/\n/g, ' '));
  }
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (map[key] === undefined) return;
    if (map[key].includes('\n')) {
      el.innerHTML = map[key].replace(/\n/g, '<br>');
    } else {
      el.textContent = map[key];
    }
  });
  const btn = document.getElementById('lang-toggle');
  if (btn) {
    btn.textContent = lang === 'en' ? '🇩🇰' : '🇬🇧';
    btn.setAttribute('aria-label', lang === 'en' ? 'Skift til dansk' : 'Switch to English');
  }
  if (typeof renderSkills === 'function') renderSkills(lang);
  if (typeof renderSkillDocs === 'function') renderSkillDocs(lang);
  if (typeof renderBlog === 'function') renderBlog(lang);
}

function toggleLang() {
  const next = currentLang === 'en' ? 'da' : 'en';
  localStorage.setItem('lang', next);
  applyLang(next);
}

document.addEventListener('DOMContentLoaded', () => {
  applyLang(currentLang);
});
