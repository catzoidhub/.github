/**
 * The art of the organisation profile (profile/assets/*.svg): the banner, one tile per cat and the closing strip,
 * each in a light and a dark version, in the colours of catzoid.com. The icons are embedded as base64 because
 * GitHub shows SVGs through <img>, where an outside image would not load. Run after a change:  node scripts/art.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';

const png = (name) => `data:image/png;base64,${readFileSync(new URL(`../profile/assets/${name}.png`, import.meta.url)).toString('base64')}`;
const FONT = `-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif`;
const MONO = `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
const out = (name, svg) => writeFileSync(new URL(`../profile/assets/${name}.svg`, import.meta.url), svg);

// the site's palette: --night / --primary in both schemes, and one colour per cat
const THEMES = {
  dark: { bg1: '#110e2d', bg2: '#1e1a4a', text: '#f3f2ff', muted: '#b8b4e6', dim: '#7d79b5', primary: '#9996ff', secondary: '#c190f6', line: '#2d2a55', card: '#171440', star: 0.55 },
  light: { bg1: '#f6f5ff', bg2: '#e9e6ff', text: '#2a2650', muted: '#5c5890', dim: '#8e8ab8', primary: '#6c5de7', secondary: '#a35de4', line: '#d9d5f5', card: '#ffffff', star: 0.14 },
};
const CATS = [
  { id: 'devcatz', name: 'DevCatz', color: '#6c5de7', light: '#9996ff', kind: 'Local dev environment', line: 'Every site on its own https://*.localhost — runtimes, databases, storage, mail, tunnels, Docker.', state: 'macOS · Windows' },
  { id: 'dbcatz', name: 'DBCatz', color: '#d9a03a', light: '#f2c25c', kind: 'Database client', line: 'MySQL, PostgreSQL, SQLite, Redis, MongoDB, Elasticsearch — with production safety.', state: 'macOS · Windows' },
  { id: 'dialcatz', name: 'DialCatz', color: '#2aa89a', light: '#4fd1c1', kind: 'API client', line: 'REST, GraphQL and WebSocket — collections, scripts, Git and a self-hosted team den.', state: 'macOS · Windows' },
  { id: 'docatz', name: 'DoCatz', color: '#3f93e3', light: '#6fb3f5', kind: 'Containers', line: 'A light Linux VM, every container on its own name, asleep when idle.', state: 'still a kitten' },
  { id: 'den', icon: 'dialcatz', name: 'DialCatz Den', color: '#2aa89a', light: '#4fd1c1', kind: 'Team server', line: 'Self-hosted sync for DialCatz: one small Go container, invite links instead of accounts.', state: 'Docker · SQLite or PostgreSQL' },
  { id: 'mcatzp', name: 'MCatzP', color: '#d6407f', light: '#f06aa4', kind: 'MCP server', line: 'One door for your AI into the whole litter. One connection, every cat.', state: 'coming with DoCatz' },
];

const stars = (t, seed, w, h, n) => {
  let s = seed, r = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  return Array.from({ length: n }, () => `<circle cx="${(r() * w).toFixed(0)}" cy="${(r() * h).toFixed(0)}" r="${(0.6 + r() * 1.2).toFixed(1)}" fill="${t.text}" opacity="${(t.star * (0.4 + r() * 0.6)).toFixed(2)}"/>`).join('');
};
const paw = (x, y, r, fill, o, a) =>
  `<g fill="${fill}" opacity="${o}" transform="translate(${x} ${y}) rotate(${a})"><ellipse cy="${r * 0.35}" rx="${r}" ry="${r * 0.78}"/>` +
  [[-1.05, -0.55], [-0.38, -1.05], [0.38, -1.05], [1.05, -0.55]].map(([dx, dy]) => `<circle cx="${(dx * r).toFixed(1)}" cy="${(dy * r).toFixed(1)}" r="${(r * 0.36).toFixed(1)}"/>`).join('') + `</g>`;
const trail = (t, from, to, y0, n) => Array.from({ length: n }, (_, i) => paw(from + ((to - from) / (n - 1)) * i, y0 - i * 6 + (i % 2 ? 12 : -12), 9, t.primary, 0.09, -24 + (i % 2 ? 8 : -8))).join('');

// ─── the banner: night sky, the Catzoid cat in a glow, the name and the two taglines ──────────────────────────
for (const [name, t] of Object.entries(THEMES)) {
  const W = 1200, H = 360;
  out(`banner-${name}`, `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Catzoid — dev tools with nine lives.">
<title>Catzoid — dev tools with nine lives.</title>
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${t.bg1}"/><stop offset="1" stop-color="${t.bg2}"/></linearGradient>
  <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${t.primary}" stop-opacity="0.45"/><stop offset="1" stop-color="${t.primary}" stop-opacity="0"/></radialGradient>
  <linearGradient id="ink" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${t.primary}"/><stop offset="1" stop-color="${t.secondary}"/></linearGradient>
  <linearGradient id="horizon" x1="0" y1="0" x2="1" y2="0">${CATS.filter((c) => !c.icon).map((c, i) => `<stop offset="${i / 4}" stop-color="${name === 'dark' ? c.light : c.color}"/>`).join('')}</linearGradient>
  <clipPath id="card"><rect width="${W}" height="${H}" rx="28"/></clipPath>
</defs>
<g clip-path="url(#card)">
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  ${stars(t, 7, W, H, 70)}
  <circle cx="190" cy="180" r="230" fill="url(#glow)"/>
  ${trail(t, 470, 1130, 300, 12)}
  <rect x="0" y="${H - 4}" width="${W}" height="4" fill="url(#horizon)"/>
</g>
<rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="28" fill="none" stroke="${t.line}"/>
<image href="${png('catzoid')}" x="80" y="70" width="220" height="220"/>
<g font-family="${FONT}">
  <text x="360" y="122" font-family="${MONO}" font-size="17" letter-spacing="3" fill="${t.dim}">$ catzoid --hello</text>
  <text x="360" y="194" font-size="66" font-weight="760" letter-spacing="-1" fill="${t.text}">Dev tools with <tspan fill="url(#ink)">nine lives.</tspan></text>
  <text x="360" y="236" font-size="23" fill="${t.muted}">A family of free, open-source desktop tools for developers —</text>
  <text x="360" y="266" font-size="23" fill="${t.muted}">each one a cat with its own job.</text>
  <text x="360" y="308" font-family="${MONO}" font-size="15" letter-spacing="2" fill="${t.dim}">ALL CATS, NO CATCH  ·  macOS  ·  WINDOWS  ·  catzoid.com</text>
</g>
</svg>
`);
}

// ─── one tile per cat: its icon on its colour, the name, what it is, one line, and where it runs ─────────────
for (const [name, t] of Object.entries(THEMES)) {
  for (const c of CATS) {
    const W = 380, H = 300, col = name === 'dark' ? c.light : c.color;
    const wrap = (s, max) => { const w = []; let l = ''; for (const x of s.split(' ')) { if ((l + ' ' + x).trim().length > max) { w.push(l.trim()); l = x; } else l += ' ' + x; } w.push(l.trim()); return w; };
    const lines = wrap(c.line, 36);
    out(`tile-${c.id}-${name}`, `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${c.name} — ${c.kind}">
<title>${c.name} — ${c.kind}</title>
<defs>
  <radialGradient id="g" cx="0.2" cy="0.1" r="0.9"><stop offset="0" stop-color="${col}" stop-opacity="${name === 'dark' ? 0.28 : 0.16}"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></radialGradient>
  <clipPath id="card"><rect width="${W}" height="${H}" rx="22"/></clipPath>
</defs>
<g clip-path="url(#card)">
  <rect width="${W}" height="${H}" fill="${t.card}"/>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  ${stars(t, c.id.length * 31, W, H, 18)}
  <rect x="0" y="0" width="5" height="${H}" fill="${col}"/>
</g>
<rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="22" fill="none" stroke="${t.line}"/>
<image href="${png(c.icon ?? c.id)}" x="34" y="36" width="76" height="76"/>
<g font-family="${FONT}">
  <text x="130" y="68" font-size="${c.name.length > 8 ? 26 : 30}" font-weight="740" letter-spacing="-0.5" fill="${t.text}">${c.name}</text>
  <text x="130" y="96" font-family="${MONO}" font-size="13" letter-spacing="1.5" fill="${col}">${c.kind.toUpperCase()}</text>
  ${lines.map((l, i) => `<text x="34" y="${152 + i * 26}" font-size="16.5" fill="${t.muted}">${l}</text>`).join('')}
  <text x="34" y="${H - 34}" font-family="${MONO}" font-size="13" letter-spacing="1" fill="${t.dim}">${c.state}</text>
</g>
</svg>
`);
  }
}

// ─── the closing strip: the promise, in the site's words ────────────────────────────────────────────────────
for (const [name, t] of Object.entries(THEMES)) {
  const W = 1200, H = 150;
  out(`closing-${name}`, `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="All cats, no catch.">
<title>All cats, no catch.</title>
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${t.bg2}"/><stop offset="1" stop-color="${t.bg1}"/></linearGradient>
  <clipPath id="card"><rect width="${W}" height="${H}" rx="22"/></clipPath>
</defs>
<g clip-path="url(#card)"><rect width="${W}" height="${H}" fill="url(#bg)"/>${stars(t, 99, W, H, 40)}${trail(t, 60, 1140, 100, 16)}</g>
<rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="22" fill="none" stroke="${t.line}"/>
<g font-family="${FONT}" text-anchor="middle">
  <text x="600" y="68" font-size="36" font-weight="740" letter-spacing="-0.5" fill="${t.text}">All cats, no catch.</text>
  <text x="600" y="104" font-size="18" fill="${t.muted}">No account. No Pro tier. Nothing locked behind a payment. Mac builds signed and notarized; everything built in the open.</text>
</g>
</svg>
`);
}
console.log('art written');
