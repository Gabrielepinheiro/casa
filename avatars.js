// Avatares prontos (no lugar de foto): crianças, adultos e bichos do Brasil, no mesmo traço do tucano.
// Cada um é um desenho de 100x100 com fundo próprio.
const AV_INK = '#3d4260';
const AV_SKIN = { clara: '#f7d6bd', morena: '#d9a074', negra: '#8a5636' };
const AV_HAIR = { escuro: '#3b2a24', castanho: '#7a4a2c', claro: '#e9c46a', ruivo: '#d9773b' };

const avFace = (y = 0) => `<circle cx="41" cy="${50 + y}" r="2.8" fill="${AV_INK}"/><circle cx="59" cy="${50 + y}" r="2.8" fill="${AV_INK}"/>
  <circle cx="42" cy="${49 + y}" r=".9" fill="#fff"/><circle cx="60" cy="${49 + y}" r=".9" fill="#fff"/>
  <circle cx="35" cy="${58 + y}" r="4" fill="#f4845f" opacity=".25"/><circle cx="65" cy="${58 + y}" r="4" fill="#f4845f" opacity=".25"/>
  <path d="M43 ${59 + y} Q50 ${65 + y} 57 ${59 + y}" fill="none" stroke="${AV_INK}" stroke-width="2.4" stroke-linecap="round"/>`;

const AV_HAIRSTYLES = {
  // menino: curto e liso
  curto: c => ({ front: `<path d="M25 47 C23 27 36 19 50 19 C64 19 77 27 75 47 C72 40 66 36 58 35 C56 39 49 41 42 39 C36 38 30 41 25 47Z" fill="${c}"/>` }),
  // cacheado curtinho
  cachos: c => ({ front: `<g fill="${c}"><circle cx="30" cy="38" r="8"/><circle cx="37" cy="29" r="8.5"/><circle cx="48" cy="25" r="9"/><circle cx="60" cy="27" r="8.5"/><circle cx="69" cy="35" r="8"/><circle cx="26" cy="46" r="5.5"/><circle cx="74" cy="45" r="5.5"/></g>` }),
  // menina: comprido e liso
  comprido: c => ({ back: `<path d="M23 50 C21 27 35 17 50 17 C65 17 79 27 77 50 L79 80 C71 84 63 82 61 76 L39 76 C37 82 29 84 21 80Z" fill="${c}"/>`,
    front: `<path d="M25 46 C24 28 36 20 50 20 C64 20 76 28 75 46 C68 38 60 33 53 31 C48 37 37 41 25 46Z" fill="${c}"/>` }),
  // cachos volumosos
  volume: c => ({ back: `<g fill="${c}"><circle cx="50" cy="44" r="33"/><circle cx="22" cy="58" r="12"/><circle cx="78" cy="58" r="12"/><circle cx="25" cy="70" r="9"/><circle cx="75" cy="70" r="9"/></g>`,
    front: `<g fill="${c}"><circle cx="33" cy="33" r="9"/><circle cx="44" cy="27" r="9"/><circle cx="56" cy="27" r="9"/><circle cx="67" cy="33" r="9"/></g>` }),
  // maria-chiquinha (dois coquinhos)
  chiquinha: c => ({ back: `<g fill="${c}"><circle cx="21" cy="36" r="11"/><circle cx="79" cy="36" r="11"/></g><g fill="#f4845f"><circle cx="28" cy="40" r="3"/><circle cx="72" cy="40" r="3"/></g>`,
    front: `<path d="M25 47 C23 27 36 19 50 19 C64 19 77 27 75 47 C71 38 61 33 50 33 C39 33 29 38 25 47Z" fill="${c}"/>` }),
  // adulto: coque
  coque: c => ({ back: `<circle cx="50" cy="17" r="10" fill="${c}"/>`,
    front: `<path d="M25 48 C23 28 36 21 50 21 C64 21 77 28 75 48 C71 39 61 34 50 34 C39 34 29 39 25 48Z" fill="${c}"/>` }),
  // adulto: barba curtinha (usa com cabelo curto)
  barba: c => ({ front: AV_HAIRSTYLES.curto(c).front, chin: `<path d="M27 52 C28 66 38 74 50 74 C62 74 72 66 73 52 C70 60 66 63 60 64 C56 61 44 61 40 64 C34 63 30 60 27 52Z" fill="${c}"/>` }),
};

function avPerson(skin, hairColor, style, shirt, bg, adult = false) {
  const h = AV_HAIRSTYLES[style](AV_HAIR[hairColor]), s = AV_SKIN[skin];
  const shoulders = adult ? 'M14 100 C16 80 32 73 50 73 C68 73 84 80 86 100Z' : 'M20 100 C22 82 35 76 50 76 C65 76 78 82 80 100Z';
  return `<circle cx="50" cy="50" r="50" fill="${bg}"/>${h.back || ''}
    <path d="${shoulders}" fill="${shirt}"/><rect x="44" y="66" width="12" height="12" rx="5" fill="${s}"/>
    <circle cx="26" cy="52" r="5" fill="${s}"/><circle cx="74" cy="52" r="5" fill="${s}"/>
    <circle cx="50" cy="50" r="24" fill="${s}"/>${h.chin || ''}${h.front}${avFace()}`;
}

const AV_KIDS = [
  ['m1', 'Menino de pele clara e cabelo claro', 'clara', 'claro', 'curto', '#7aa7e8', '#e3eefc'],
  ['m2', 'Menino de pele clara e cabelo escuro', 'clara', 'escuro', 'curto', '#3fa57f', '#dff3ea'],
  ['m3', 'Menino moreno de cabelo escuro', 'morena', 'escuro', 'curto', '#f4845f', '#fde6dc'],
  ['m4', 'Menino moreno de cabelo cacheado', 'morena', 'castanho', 'cachos', '#fcc934', '#fff4cf'],
  ['m5', 'Menino negro de cabelo cacheado', 'negra', 'escuro', 'cachos', '#7aa7e8', '#e3eefc'],
  ['m6', 'Menino ruivo', 'clara', 'ruivo', 'curto', '#3fa57f', '#dff3ea'],
  ['f1', 'Menina de pele clara e cabelo claro', 'clara', 'claro', 'comprido', '#f4845f', '#fde6dc'],
  ['f2', 'Menina de pele clara e cabelo escuro', 'clara', 'escuro', 'chiquinha', '#b58be0', '#f0e6fb'],
  ['f3', 'Menina morena de cabelo escuro', 'morena', 'escuro', 'comprido', '#fcc934', '#fff4cf'],
  ['f4', 'Menina morena de cabelo cacheado', 'morena', 'castanho', 'volume', '#3fa57f', '#dff3ea'],
  ['f5', 'Menina negra de cabelo cacheado', 'negra', 'escuro', 'volume', '#f4845f', '#fde6dc'],
  ['f6', 'Menina negra de maria-chiquinha', 'negra', 'escuro', 'chiquinha', '#7aa7e8', '#e3eefc'],
];
const AV_ADULTS = [
  ['h1', 'Homem de pele clara e cabelo claro', 'clara', 'claro', 'curto', '#5b8fd9', '#e3eefc'],
  ['h2', 'Homem de pele clara e barba', 'clara', 'castanho', 'barba', '#3fa57f', '#dff3ea'],
  ['h3', 'Homem moreno de barba', 'morena', 'escuro', 'barba', '#3d4260', '#e6e8f2'],
  ['h4', 'Homem negro de cabelo cacheado', 'negra', 'escuro', 'cachos', '#f4845f', '#fde6dc'],
  ['w1', 'Mulher de pele clara e cabelo claro', 'clara', 'claro', 'comprido', '#b58be0', '#f0e6fb'],
  ['w2', 'Mulher de pele clara e coque', 'clara', 'escuro', 'coque', '#f4845f', '#fde6dc'],
  ['w3', 'Mulher morena de cabelo comprido', 'morena', 'escuro', 'comprido', '#3fa57f', '#dff3ea'],
  ['w4', 'Mulher negra de cabelo cacheado', 'negra', 'escuro', 'volume', '#fcc934', '#fff4cf'],
];

const avEyes = (x1, x2, y, r = 3.2) => `<circle cx="${x1}" cy="${y}" r="${r}" fill="${AV_INK}"/><circle cx="${x2}" cy="${y}" r="${r}" fill="${AV_INK}"/>
  <circle cx="${x1 + 1}" cy="${y - 1}" r="1" fill="#fff"/><circle cx="${x2 + 1}" cy="${y - 1}" r="1" fill="#fff"/>`;
const avSmile = (y, w = 6) => `<path d="M${50 - w} ${y} Q50 ${y + w * .9} ${50 + w} ${y}" fill="none" stroke="${AV_INK}" stroke-width="2.4" stroke-linecap="round"/>`;

const AV_ANIMALS = {
  tucano: ['Tucano', `<circle cx="50" cy="50" r="50" fill="#fff4cf"/>
    <g transform="translate(6 12) scale(.68)"><path d="M14 108 C40 104 80 104 104 108" fill="none" stroke="#b98560" stroke-width="7" stroke-linecap="round"/><path d="M38 92 L30 116 L46 116 L50 94 Z" fill="#3d4260"/><path d="M28 44 C26 24 40 12 56 14 C70 16 76 30 74 46 C72 66 64 86 52 98 C44 104 36 102 33 94 C28 80 28 60 28 44 Z" fill="#3d4260"/><path d="M58 30 C70 28 77 40 74 54 C70 62 60 62 56 54 C52 46 52 34 58 30 Z" fill="#fff6dc"/><path d="M64 22 C80 10 108 12 124 32 C126 36 122 40 116 38 C102 34 86 34 70 40 C64 34 62 28 64 22 Z" fill="#ffb347"/><path d="M70 40 C86 35 102 35 116 38 C108 46 90 50 72 46 Z" fill="#f4845f"/><path d="M112 22 C118 26 124 30 124 32 C126 36 122 40 116 38 C116 32 115 27 112 22 Z" fill="#3d4260"/><circle cx="56" cy="27" r="8" fill="#7aa7e8"/><circle cx="56" cy="27" r="4.6" fill="#fff"/><circle cx="57" cy="27" r="3" fill="#3d4260"/></g>`],
  arara: ['Arara-azul', `<circle cx="50" cy="50" r="50" fill="#e3eefc"/>
    <path d="M30 96 C24 70 26 40 50 28 C74 40 76 70 70 96Z" fill="#2f6fd0"/>
    <circle cx="50" cy="44" r="24" fill="#3b82e0"/>
    <ellipse cx="39" cy="42" rx="7" ry="6" fill="#fcc934"/><ellipse cx="61" cy="42" rx="7" ry="6" fill="#fcc934"/>
    ${avEyes(39, 61, 42, 3)}
    <path d="M43 52 C43 46 57 46 57 52 C57 60 53 66 50 70 C47 66 43 60 43 52Z" fill="#3d4260"/>
    <path d="M44 58 C46 62 54 62 56 58" fill="#fcc934"/>`],
  onca: ['Onça-pintada', `<circle cx="50" cy="50" r="50" fill="#fff4cf"/>
    <circle cx="27" cy="28" r="10" fill="#f2b14c"/><circle cx="73" cy="28" r="10" fill="#f2b14c"/>
    <circle cx="27" cy="28" r="5" fill="#3d4260"/><circle cx="73" cy="28" r="5" fill="#3d4260"/>
    <circle cx="50" cy="52" r="30" fill="#f2b14c"/>
    <g fill="none" stroke="#3d4260" stroke-width="2.4"><circle cx="34" cy="38" r="3.5"/><circle cx="66" cy="38" r="3.5"/><circle cx="50" cy="30" r="3.5"/><circle cx="27" cy="56" r="3"/><circle cx="73" cy="56" r="3"/></g>
    <ellipse cx="50" cy="64" rx="15" ry="11" fill="#fff6dc"/>
    ${avEyes(41, 59, 48)}
    <path d="M45 58 L55 58 L50 63Z" fill="#3d4260"/>${avSmile(66, 5)}`],
  capivara: ['Capivara', `<circle cx="50" cy="50" r="50" fill="#dff3ea"/>
    <ellipse cx="30" cy="28" rx="6" ry="5" fill="#8a5d3b"/><ellipse cx="70" cy="28" rx="6" ry="5" fill="#8a5d3b"/>
    <rect x="22" y="26" width="56" height="58" rx="26" fill="#a8774f"/>
    <rect x="30" y="58" width="40" height="26" rx="13" fill="#8a5d3b"/>
    ${avEyes(38, 62, 44, 3)}
    <ellipse cx="44" cy="64" rx="3" ry="2" fill="#3d4260"/><ellipse cx="56" cy="64" rx="3" ry="2" fill="#3d4260"/>${avSmile(73, 4)}`],
  preguica: ['Bicho-preguiça', `<circle cx="50" cy="50" r="50" fill="#f0e6fb"/>
    <circle cx="50" cy="52" r="32" fill="#a58a6c"/>
    <ellipse cx="50" cy="55" rx="25" ry="21" fill="#efe3cf"/>
    <path d="M30 46 C34 40 44 42 45 50 C42 56 33 55 30 46Z" fill="#5b4433"/><path d="M70 46 C66 40 56 42 55 50 C58 56 67 55 70 46Z" fill="#5b4433"/>
    ${avEyes(39, 61, 48, 2.8)}
    <ellipse cx="50" cy="58" rx="4" ry="3" fill="#3d4260"/>${avSmile(64, 6)}`],
  mico: ['Mico-leão-dourado', `<circle cx="50" cy="50" r="50" fill="#fde6dc"/>
    <g fill="#f09a2e"><circle cx="50" cy="48" r="34"/><circle cx="22" cy="40" r="10"/><circle cx="78" cy="40" r="10"/><circle cx="30" cy="72" r="10"/><circle cx="70" cy="72" r="10"/></g>
    <ellipse cx="50" cy="54" rx="18" ry="20" fill="#c8794a"/>
    ${avEyes(43, 57, 50, 3)}
    <ellipse cx="50" cy="60" rx="3" ry="2" fill="#3d4260"/>${avSmile(65, 4)}`],
  tamandua: ['Tamanduá-bandeira', `<circle cx="50" cy="50" r="50" fill="#e6e8f2"/>
    <path d="M18 90 C20 66 34 54 50 54 C66 54 80 66 82 90Z" fill="#9b8a78"/>
    <path d="M24 80 L76 66 L80 74 L28 88Z" fill="#3d4260"/><path d="M27 84 L78 70" stroke="#fff" stroke-width="3"/>
    <circle cx="36" cy="36" r="18" fill="#b8a690"/>
    <path d="M44 28 C62 30 80 40 90 52 C90 56 86 58 82 56 C70 48 56 46 44 46Z" fill="#b8a690"/>
    <circle cx="89" cy="54" r="3" fill="#3d4260"/>
    <ellipse cx="26" cy="22" rx="4" ry="5" fill="#9b8a78"/>
    <circle cx="38" cy="34" r="3" fill="#3d4260"/><circle cx="39" cy="33" r="1" fill="#fff"/>`],
  tatu: ['Tatu-bola', `<circle cx="50" cy="50" r="50" fill="#fff4cf"/>
    <path d="M18 74 C18 44 34 30 54 30 C74 30 86 46 86 74Z" fill="#b39478"/>
    <g fill="none" stroke="#8a6d55" stroke-width="3"><path d="M40 33 C34 46 32 60 32 74"/><path d="M54 30 C50 44 50 60 50 74"/><path d="M68 33 C66 46 66 60 68 74"/></g>
    <path d="M10 74 C10 60 18 52 28 52 C36 52 40 58 40 66 C40 72 34 76 26 76Z" fill="#c9ad90"/>
    <ellipse cx="22" cy="50" rx="4" ry="6" fill="#b39478"/>
    <circle cx="24" cy="62" r="2.8" fill="#3d4260"/><circle cx="25" cy="61" r=".9" fill="#fff"/><circle cx="12" cy="68" r="2" fill="#3d4260"/>
    <path d="M10 76 L90 76" stroke="#3fa57f" stroke-width="5" stroke-linecap="round"/>`],
  tartaruga: ['Tartaruga-marinha', `<circle cx="50" cy="50" r="50" fill="#e3eefc"/>
    <ellipse cx="22" cy="70" rx="12" ry="6" fill="#7cc4a4" transform="rotate(-25 22 70)"/><ellipse cx="78" cy="70" rx="12" ry="6" fill="#7cc4a4" transform="rotate(25 78 70)"/>
    <path d="M18 76 C18 54 32 44 50 44 C68 44 82 54 82 76Z" fill="#3fa57f"/>
    <g fill="none" stroke="#2e8566" stroke-width="2.5"><path d="M40 50 L36 62 L42 74 M60 50 L64 62 L58 74 M36 62 L64 62 M24 64 L36 62 M76 64 L64 62"/></g>
    <circle cx="50" cy="32" r="16" fill="#7cc4a4"/>
    ${avEyes(44, 56, 30, 2.8)}${avSmile(37, 4)}`],
  quati: ['Quati', `<circle cx="50" cy="50" r="50" fill="#dff3ea"/>
    <circle cx="30" cy="26" r="7" fill="#8a5d3b"/><circle cx="70" cy="26" r="7" fill="#8a5d3b"/>
    <path d="M22 44 C22 28 36 22 50 22 C64 22 78 28 78 44 C78 58 62 66 56 80 L44 80 C38 66 22 58 22 44Z" fill="#a8774f"/>
    <path d="M44 62 L56 62 L54 82 L46 82Z" fill="#efe3cf"/>
    <ellipse cx="38" cy="42" rx="8" ry="6" fill="#efe3cf"/><ellipse cx="62" cy="42" rx="8" ry="6" fill="#efe3cf"/>
    ${avEyes(38, 62, 42, 3)}
    <ellipse cx="50" cy="83" rx="5" ry="3.5" fill="#3d4260"/>`],
  beijaflor: ['Beija-flor', `<circle cx="50" cy="50" r="50" fill="#fde6dc"/>
    <path d="M62 30 C76 14 92 16 92 20 C88 30 76 40 62 44Z" fill="#7cc4a4"/>
    <path d="M30 44 C34 30 48 26 58 32 C70 40 66 62 52 70 C44 74 38 82 34 90 C30 80 30 70 34 62 C28 58 28 50 30 44Z" fill="#3fa57f"/>
    <path d="M40 52 C46 58 56 58 62 52 C60 62 50 66 42 62Z" fill="#f4845f"/>
    <path d="M32 44 L6 50" stroke="#3d4260" stroke-width="3" stroke-linecap="round"/>
    <circle cx="40" cy="40" r="3" fill="#3d4260"/><circle cx="41" cy="39" r="1" fill="#fff"/>
    <g transform="translate(14 74)"><circle cx="0" cy="0" r="4" fill="#fcc934"/><circle cx="-6" cy="0" r="4" fill="#f4845f"/><circle cx="6" cy="0" r="4" fill="#f4845f"/><circle cx="0" cy="-6" r="4" fill="#f4845f"/><circle cx="0" cy="6" r="4" fill="#f4845f"/><circle cx="0" cy="0" r="3" fill="#fcc934"/></g>`],
};

const AVATARS = {};
AV_KIDS.forEach(([k, label, ...a]) => { AVATARS['av_' + k] = [label, avPerson(...a)]; });
AV_ADULTS.forEach(([k, label, ...a]) => { AVATARS['av_' + k] = [label, avPerson(...a, true)]; });
Object.entries(AV_ANIMALS).forEach(([k, v]) => { AVATARS['av_' + k] = v; });
const avatarSvg = (key, cls = '') => AVATARS[key] ? `<svg class="${cls}" viewBox="0 0 100 100" role="img" aria-label="${AVATARS[key][0]}">${AVATARS[key][1]}</svg>` : '';
