// Família Pinheiro Bernt Eymael — tarefas, rotina das crianças, agenda e pontos.
// Os dados ficam no banco compartilhado da página (quando aberta pelo claude.ai) ou no próprio aparelho.

const KEY = 'familia-pbe-v1';
const PERIODS = [['manha', 'Manhã'], ['tarde', 'Tarde'], ['noite', 'Noite'], ['livre', 'Qualquer hora']];
// Grupos da rotina da casa (como no PDF da rotina semanal).
const GROUPS = [['diaria', 'Todos os dias'], ['limpeza', 'Limpeza do dia'], ['criancas', 'Crianças'], ['fechamento', 'Fechamento do dia'], ['outras', 'Outras']];
const KINDS = [['lembrete', 'Lembrete'], ['compromisso', 'Compromisso']];
const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0];
const WEEKDAYS = [1, 2, 3, 4, 5];
const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6];
const COLORS = ['#e8a0b4', '#8fb3e8', '#f2c46b', '#8fd6b6', '#b9a6ee', '#f2a77a', '#7fcfd6', '#c7c9d6'];
const AGENDA_ICONS = ['recado', 'calendario', 'festa', 'medico', 'escola', 'futebol', 'lancheira', 'presente', 'carro', 'familia', 'mochila', 'compras'];
const LOCK_AFTER = 15 * 60 * 1000; // a edição trava sozinha depois de 15 min parado

// Mascote: o tucano.
const TUCANO = '<path d="M14 108 C40 104 80 104 104 108" fill="none" stroke="#b98560" stroke-width="7" stroke-linecap="round"/><path d="M38 92 L30 116 L46 116 L50 94 Z" fill="#3d4260"/><path d="M28 44 C26 24 40 12 56 14 C70 16 76 30 74 46 C72 66 64 86 52 98 C44 104 36 102 33 94 C28 80 28 60 28 44 Z" fill="#3d4260"/><path d="M33 50 C44 54 50 70 44 90 C37 82 32 66 33 50 Z" fill="#555b7d"/><path d="M58 30 C70 28 77 40 74 54 C70 62 60 62 56 54 C52 46 52 34 58 30 Z" fill="#fff6dc"/><path d="M56 58 C62 60 68 58 72 54 C70 62 64 66 58 64 Z" fill="#ffd166"/><path d="M42 94 C50 90 56 94 54 100 C50 103 44 101 42 94 Z" fill="#ef8a80"/><path d="M64 22 C80 10 108 12 124 32 C126 36 122 40 116 38 C102 34 86 34 70 40 C64 34 62 28 64 22 Z" fill="#ffb347"/><path d="M70 40 C86 35 102 35 116 38 C108 46 90 50 72 46 Z" fill="#f4845f"/><path d="M112 22 C118 26 124 30 124 32 C126 36 122 40 116 38 C116 32 115 27 112 22 Z" fill="#3d4260"/><circle cx="56" cy="27" r="8" fill="#7aa7e8"/><circle cx="56" cy="27" r="4.6" fill="#fff"/><circle cx="57" cy="27" r="3" fill="#3d4260"/><circle cx="58" cy="25.8" r="1.1" fill="#fff"/>';
const tucano = (cls = '') => `<svg class="tucano ${cls}" viewBox="0 0 130 120" aria-hidden="true">${TUCANO}</svg>`;

// Ícones de interface (traço simples).
const UI = {
  dia: '<path d="M5 12l4 4 10-10"/><rect x="3" y="3" width="18" height="18" rx="4"/>',
  semana: '<path d="M5 20V10M12 20V4M19 20v-7"/>',
  agenda: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  placar: '<path d="M7 4h10v5a5 5 0 01-10 0zM12 14v4M8 21h8M7 6H4a3 3 0 003 5M17 6h3a3 3 0 01-3 5"/>',
  premios: '<rect x="3" y="9" width="18" height="12" rx="2"/><path d="M3 13h18M12 9v12M12 9c-2-5-7-5-7-2s7 2 7 2zM12 9c2-5 7-5 7-2s-7 2-7 2z"/>',
  ajustes: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2"/>',
  cardapio: '<path d="M7 3v8a2 2 0 002 2v8M5 3v6M9 3v6M17 3c-2 2-2 8 0 9v9"/>',
  bandeira: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
  foto: '<rect x="3" y="6" width="18" height="14" rx="3"/><circle cx="12" cy="13" r="3.5"/><path d="M8 6l2-3h4l2 3"/>',
  link: '<path d="M10 14a4 4 0 006 0l3-3a4 4 0 00-6-6l-1 1M14 10a4 4 0 00-6 0l-3 3a4 4 0 006 6l1-1"/>',
  coracao: '<path d="M12 20s-7-4.5-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.5-7 10-7 10z"/>',
  lixeira: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
  relogio: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6"/>',
  cadeado: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/>',
  voltar: '<path d="M15 5l-7 7 7 7"/>',
  avancar: '<path d="M9 5l7 7-7 7"/>',
  mais: '<path d="M12 5v14M5 12h14"/>',
  lapis: '<path d="M4 20l4-1 11-11-3-3L5 16z"/>',
  ok: '<path d="M5 12l5 5 9-10"/>',
  estrela: '<path d="M12 3l2.6 5.6 6 .6-4.5 4 1.3 6-5.4-3.2L6.6 19.2l1.3-6-4.5-4 6-.6z"/>',
  casa: '<path d="M3 11l9-7 9 7M5 10v10h14V10"/>',
  nota: '<path d="M5 4h14v12l-4 4H5z"/><path d="M15 20v-4h4"/>',
  pular: '<path d="M5 5l7 7-7 7M13 5l7 7-7 7"/>',
};
const ui = (k, cls = '') => `<svg class="ui ${cls}" viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${UI[k]}</g></svg>`;
const star = () => `<svg class="star" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.6 5.6 6 .6-4.5 4 1.3 6-5.4-3.2L6.6 19.2l1.3-6-4.5-4 6-.6z" fill="currentColor"/></svg>`;

const uid = () => Math.random().toString(36).slice(2, 10);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const $ = s => document.querySelector(s);
const cap = s => s ? s[0].toUpperCase() + s.slice(1) : s;
const clone = o => JSON.parse(JSON.stringify(o ?? null));

function dayKey(d = new Date()) {
  const z = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
}
const today = () => dayKey();
const parseDay = k => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); };
const addDays = (k, n) => { const d = parseDay(k); d.setDate(d.getDate() + n); return dayKey(d); };
const mondayOf = k => addDays(k, -((parseDay(k).getDay() + 6) % 7));
const fmtDay = (k, o = { weekday: 'long', day: 'numeric', month: 'long' }) => cap(parseDay(k).toLocaleDateString('pt-BR', o));
const shortDay = k => parseDay(k).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
function dayLabel(k) {
  const t = today();
  return k === t ? 'Hoje' : k === addDays(t, 1) ? 'Amanhã' : k === addDays(t, -1) ? 'Ontem' : fmtDay(k, { weekday: 'long' });
}
const periodOf = time => !time ? 'livre' : parseInt(time, 10) < 12 ? 'manha' : parseInt(time, 10) < 18 ? 'tarde' : 'noite';
const monthOf = k => k.slice(0, 7);

// ---------- Dados ----------
// config: pessoas, tarefas, prêmios e PIN · days: o que foi feito e as notas de cada dia
// agenda: compromissos e lembretes · ledger: prêmios trocados e pontos extras · archive: pontos de dias antigos
let S = { config: null, days: {}, agenda: {}, ledger: {}, archive: { points: {}, through: '' },
  priorities: {}, recipes: {}, menus: {}, shopping: {}, templates: {}, recados: {} };
// Coleções simples (um documento por item), guardadas do mesmo jeito.
const COLLECTIONS = ['agenda', 'priorities', 'recipes', 'menus', 'shopping', 'templates', 'recados'];
let mode = 'loading', db = null, loaded = false;

function loadLocal() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) Object.assign(S, JSON.parse(raw));
  } catch (e) { /* sem armazenamento: começa do zero */ }
  if (!S.config && typeof familySeed === 'function') { S.config = familySeed(); saveLocal(); }
}
function saveLocal() {
  try { localStorage.setItem(KEY, JSON.stringify(S)); }
  catch (e) { toast('Não foi possível salvar neste aparelho'); }
}

// Uma gravação por vez em cada documento.
const queues = {};
function put(path, body, quiet = false) {
  if (mode !== 'db') return saveLocal();
  const data = body ? clone(body) : null;
  queues[path] = (queues[path] || Promise.resolve())
    .then(() => data ? db.doc(path).set(data) : db.doc(path).delete())
    .catch(e => {
      if (quiet) return;
      toast(e?.code === 'invalid_argument' ? 'Você só tem acesso para ver. Peça para ser editor.' :
        e?.code === 'quota_exceeded' ? 'O espaço de dados acabou. Apague lembretes antigos.' : 'Não foi possível salvar. Tente de novo.');
    });
}
const saveConfig = () => put('config/main', S.config);
const saveDay = k => put('days/' + k, S.days[k] || null);
const saveAgenda = id => put('agenda/' + id, S.agenda[id] || null);
const saveItem = (col, id) => put(col + '/' + id, S[col][id] || null);
const saveLedger = m => put('ledger/' + m, S.ledger[m] || null);

async function connect() {
  if (!window.claude?.use) { mode = 'local'; loadLocal(); return start(); }
  render();
  let d = null;
  try { d = await window.claude.use('db'); } catch (e) { d = null; }
  if (!d) { mode = 'local'; loadLocal(); return start(); }
  db = d; mode = 'db';
  const ready = new Set();
  const done = name => { ready.add(name); if (ready.size === 4 + COLLECTIONS.length && !loaded) { loaded = true; maintenance(); } if (loaded) render(); };
  const fail = () => { toast('Sem conexão com os dados da família. Recarregue a página.'); };
  const toMap = q => Object.fromEntries(q.docs.map(x => [x.id, clone(x.data())]));
  db.doc('config/main').onSnapshot(s => { S.config = s.exists ? clone(s.data()) : null; done('config'); }, fail);
  db.collection('days').onSnapshot(q => { S.days = toMap(q); done('days'); }, fail);
  COLLECTIONS.forEach(col => db.collection(col).onSnapshot(q => { S[col] = toMap(q); done(col); }, fail));
  db.collection('ledger').onSnapshot(q => { S.ledger = toMap(q); done('ledger'); }, fail);
  db.doc('meta/archive').onSnapshot(s => { S.archive = s.exists ? clone(s.data()) : { points: {}, through: '' }; done('archive'); }, fail);
}
function start() { loaded = true; maintenance(); render(); }
// Marca o dia em que a família começou a usar o app (a semana não mostra dias anteriores como "não feito").
function markSince() {
  if (C() && !C().since) { C().since = today(); saveConfig(); }
}

// Dias com mais de 4 meses viram só um total de pontos; lembretes com mais de 6 meses são apagados.
function maintenance() {
  if (!S.config) return;
  markSince();
  const cutoff = addDays(today(), -120);
  const old = Object.keys(S.days).filter(k => k <= cutoff).sort();
  if (old.length) {
    const fresh = old.filter(k => k > (S.archive.through || ''));
    if (fresh.length) {
      S.archive.points ||= {};
      fresh.forEach(k => Object.values(S.days[k].done || {}).forEach(v => { S.archive.points[v.by] = (S.archive.points[v.by] || 0) + (v.pts || 0); }));
      S.archive.through = old.at(-1);
      put('meta/archive', S.archive, true);
    }
    old.forEach(k => { delete S.days[k]; put('days/' + k, null, true); });
  }
  Object.values(S.agenda).filter(a => a.date < addDays(today(), -180)).forEach(a => { delete S.agenda[a.id]; put('agenda/' + a.id, null, true); });
  Object.values(S.recados).filter(r => r.t < Date.now() - 30 * 864e5).forEach(r => { delete S.recados[r.id]; put('recados/' + r.id, null, true); });
  Object.values(S.priorities).filter(p => p.done && p.doneOn < addDays(today(), -30)).forEach(p => { delete S.priorities[p.id]; put('priorities/' + p.id, null, true); });
  for (const col of ['menus', 'shopping']) Object.keys(S[col]).filter(w => w < addDays(today(), -120)).forEach(w => { delete S[col][w]; put(col + '/' + w, null, true); });
  if (mode === 'local') saveLocal();
}

// ---------- Consultas ----------
let tab = 'hoje', viewDay = today(), lastDay = today();
let unlocked = false, editMode = false, lastActivity = Date.now();
let houseOpen = false;
try { houseOpen = localStorage.getItem(KEY + '-casa-aberta') === '1'; } catch (e) { /* sem armazenamento */ }
let weekFrom = mondayOf(today()), weekWho = 'resumo', showPast = false, cfgWho = 'todos', cfgDay = 'todos';

const C = () => S.config;
const members = () => C()?.members || [];
const adults = () => members().filter(m => m.adult);
const member = id => members().find(m => m.id === id);
const names = ids => ids.map(member).filter(Boolean).map(m => esc(m.name)).join(', ');
const periodIdx = p => PERIODS.findIndex(x => x[0] === p);
const keyOf = (t, mid) => t.house ? t.id : t.id + '|' + mid;
const dayDoc = k => S.days[k] || { date: k, done: {}, notes: {} };
const doneOf = (k, t, mid) => S.days[k]?.done?.[keyOf(t, mid)];

function avatar(m, cls = '') {
  if (!m) return '';
  return m.photo ? `<img class="avatar ${cls}" src="${esc(m.photo)}" alt="${esc(m.name)}">`
    : `<span class="avatar ${cls}" style="--c:${esc(m.color)}">${esc(m.name[0] || '?')}</span>`;
}

// Tarefas sem horário ficam logo depois da última com horário do mesmo período (mantém a sequência da rotina).
function sortTasks(list) {
  const last = {};
  return list.map((t, i) => {
    const key = t.time || last[t.period] || '';
    last[t.period] = key;
    return { t, i, key };
  }).sort((x, y) => periodIdx(x.t.period) - periodIdx(y.t.period) || x.key.localeCompare(y.key) || x.i - y.i).map(x => x.t);
}
// Casa: ordem do grupo e, dentro dele, a ordem em que foram cadastradas.
const groupIdx = t => { const i = GROUPS.findIndex(g => g[0] === (t.group || 'outras')); return i < 0 ? GROUPS.length : i; };
const houseSort = list => list.map((t, i) => ({ t, i })).sort((a, b) => groupIdx(a.t) - groupIdx(b.t) || a.i - b.i).map(x => x.t);
const WEEKDAY_NAMES = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
function groupLabel(g, k) {
  if (g !== 'limpeza') return GROUPS.find(x => x[0] === g)?.[1] || 'Outras';
  const wd = parseDay(k).getDay(), focus = C()?.focus?.[wd];
  return focus ? `Foco de ${WEEKDAY_NAMES[wd]}: ${focus}` : `Limpeza de ${WEEKDAY_NAMES[wd]}`;
}

// Repetição: toda semana em dias fixos · a cada N dias/semanas/meses (conta da última vez que foi feita) · uma vez só.
const UNITS = [['dias', 'dias'], ['semanas', 'semanas'], ['meses', 'meses']];
const isFlexible = t => !!t.date || t.repeat === 'interval';
function addInterval(k, n, unit) {
  if (unit === 'meses') { const d = parseDay(k); d.setMonth(d.getMonth() + n); return dayKey(d); }
  return addDays(k, unit === 'semanas' ? n * 7 : n);
}
// Próxima data em que a tarefa precisa ser feita.
function nextDue(t) {
  if (t.date) return t.date;
  let k = t.last ? addInterval(t.last, t.every || 1, t.unit || 'semanas') : (t.start || C()?.since || today());
  if (t.weekday !== '' && t.weekday != null) for (let i = 0; i < 7 && parseDay(k).getDay() !== Number(t.weekday); i++) k = addDays(k, 1);
  return k;
}
const doneOnDay = (t, k) => Object.keys(S.days[k]?.done || {}).some(key => key === t.id || key.startsWith(t.id + '|'));
// Atrasada: se tem dia de cômodo, volta no próximo dia daquele cômodo (não acumula tudo no "hoje");
// sem dia fixo, aparece hoje até ser feita.
function showDate(t) {
  const due = nextDue(t), t0 = today();
  if (due >= t0) return due;
  if (t.weekday === '' || t.weekday == null || t.date) return t0;
  let k = t0;
  while (parseDay(k).getDay() !== Number(t.weekday)) k = addDays(k, 1);
  return k;
}
function scheduled(t, k) {
  if (!isFlexible(t)) return t.days.includes(parseDay(k).getDay());
  if (doneOnDay(t, k)) return true;
  if (t.date && t.last) return false; // tarefa única já feita
  return k < today() ? k === nextDue(t) : k === showDate(t);
}
function repeatLabel(t) {
  if (t.date) return `uma vez · ${shortDay(t.date)}`;
  if (t.repeat === 'interval') {
    const n = t.every || 1, u = t.unit || 'semanas';
    const txt = n === 1 ? { dias: 'todo dia', semanas: 'toda semana', meses: 'todo mês' }[u] : n === 2 && u === 'semanas' ? 'a cada 15 dias' : `a cada ${n} ${u}`;
    return txt + (t.weekday !== '' && t.weekday != null ? ` (${DAYS[t.weekday]})` : '');
  }
  return daysLabel(t.days);
}
function tasksOn(k, withSkipped = false) {
  const notes = S.days[k]?.notes || {};
  return (C()?.tasks || []).filter(t => scheduled(t, k)).map(t => {
    const o = notes[t.id] || {};
    const due = isFlexible(t) ? nextDue(t) : '';
    return { ...t, memberIds: o.memberIds || t.memberIds, dayNote: o.note || '', skip: !!o.skip, passed: !!o.memberIds,
      late: due && due < k && !doneOnDay(t, k) ? due : '' };
  }).filter(t => withSkipped || !t.skip);
}
const houseOn = (k, ws) => tasksOn(k, ws).filter(t => t.house);
const ownOn = (k, mid, ws) => tasksOn(k, ws).filter(t => !t.house && t.memberIds.includes(mid));
const agendaOn = k => Object.values(S.agenda).filter(a => a.date === k).sort((x, y) => (x.time || '99').localeCompare(y.time || '99'));

// Pontos: dias guardados + total arquivado + prêmios e pontos extras.
function doneEntries() {
  const through = S.archive.through || '';
  return Object.entries(S.days).filter(([k]) => k > through).flatMap(([k, d]) =>
    Object.entries(d.done || {}).filter(([, v]) => !v.pending).map(([key, v]) => ({ day: k, key, t: v.t, memberId: v.by, points: v.pts || 0, label: v.title || '', type: 'task' })));
}
const ledgerEntries = () => Object.values(S.ledger).flatMap(l => l.entries || []);
function balance(mid) {
  return (S.archive.points?.[mid] || 0) +
    doneEntries().filter(e => e.memberId === mid).reduce((s, e) => s + e.points, 0) +
    ledgerEntries().filter(e => e.memberId === mid).reduce((s, e) => s + e.points, 0);
}
function pointsBetween(mid, from, to) {
  return doneEntries().filter(e => e.memberId === mid && e.day >= from && e.day < to).reduce((s, e) => s + e.points, 0) +
    ledgerEntries().filter(e => e.memberId === mid && e.type === 'bonus' && e.day >= from && e.day < to).reduce((s, e) => s + e.points, 0);
}

// ---------- Telas ----------
function render() {
  $('#date').textContent = fmtDay(today());
  const tabs = [['hoje', 'Dia', 'dia'], ['casa', 'Casa', 'casa'], ['semana', 'Semana', 'semana'], ['agenda', 'Agenda', 'agenda'], ['cardapio', 'Cardápio', 'cardapio'], ['premios', 'Pontos', 'premios'], ['config', 'Ajustes', unlocked ? 'ajustes' : 'cadeado']];
  $('#tabs').innerHTML = tabs.map(([k, l, i]) => `<button class="${tab === k ? 'on' : ''}" data-action="tab" data-tab="${k}">${ui(i)}<span>${l}</span></button>`).join('');
  if (!loaded) { $('#app').innerHTML = `<div class="empty-page">${tucano('big')}<p>Carregando a rotina da família…</p></div>`; return; }
  if (!C()) {
    $('#app').innerHTML = `<div class="empty-page">${tucano('big')}<h2>Nenhuma rotina cadastrada ainda</h2>
      <p>Comece cadastrando as pessoas da casa e as tarefas de cada um.</p><button class="btn primary" data-action="setup">Começar</button></div>`;
    return;
  }
  // Mantém o quadro onde estava (no tablet ou celular ele rola para o lado).
  const boardX = document.querySelector('.board-wrap')?.scrollLeft || 0;
  $('#app').innerHTML = { hoje: viewDayScreen, casa: viewHouse, semana: viewWeek, agenda: viewAgenda, placar: viewScore, premios: viewRewards, cardapio: viewMenu, config: viewConfig }[tab]();
  const board = document.querySelector('.board-wrap');
  if (board && boardX) board.scrollLeft = boardX;
}

function taskRow(k, t, mid, big) {
  const v = !t.skip && doneOf(k, t, mid);
  const by = t.house && v ? member(v.by) : null;
  const check = by ? avatar(by, 'mini') : v?.pending ? `<span class="check wait">${ui('relogio')}</span>` : `<span class="check">${v ? ui('ok') : ''}</span>`;
  const sub = [t.note ? esc(t.note) : '', t.passed ? `repassada para ${names(t.memberIds)}` : '',
    t.repeat === 'interval' ? repeatLabel(t) : t.date ? 'tarefa única' : '', t.minutes && !big ? `~${fmtMin(t.minutes)}` : '',
    v?.pending ? 'esperando confirmação' : ''].filter(Boolean).join(' · ');
  return `<button class="task ${big ? 'big' : ''} ${v ? 'done' : ''} ${v?.pending ? 'pending' : ''} ${t.skip ? 'skipped' : ''} ${editMode ? 'editing' : ''}" data-action="task" data-day="${k}" data-task="${t.id}" data-member="${mid || ''}">
    ${icon(t.icon)}
    <span class="text">
      <span class="title">${t.time && !t.house ? `<span class="time">${esc(t.time)}</span>` : ''}${esc(t.title)}</span>
      ${sub ? `<span class="note">${sub}</span>` : ''}
      ${t.late && !v ? `<span class="late">Atrasada desde ${esc(shortDay(t.late))}</span>` : ''}
      ${t.skip ? `<span class="daynote">Não precisa neste dia${t.dayNote ? ': ' + esc(t.dayNote) : ''}</span>` : t.dayNote ? `<span class="daynote">${esc(t.dayNote)}</span>` : ''}
    </span>
    ${editMode ? `<span class="edit-dot">${ui('lapis')}</span>` : check}
  </button>`;
}
function tileRow(k, t, mid) {
  const v = !t.skip && doneOf(k, t, mid);
  const mark = v?.pending ? `<span class="tile-mark wait">${ui('relogio')}</span>` : v ? `<span class="tile-mark">${ui('ok')}</span>` : '';
  const extra = t.skip ? `Não precisa${t.dayNote ? ': ' + esc(t.dayNote) : ''}` : t.dayNote ? esc(t.dayNote) : t.passed ? `repassada para ${names(t.memberIds)}` : '';
  return `<button class="tile ${v ? 'done' : ''} ${v?.pending ? 'pending' : ''} ${t.skip ? 'skipped' : ''} ${editMode ? 'editing' : ''}" data-action="task" data-day="${k}" data-task="${t.id}" data-member="${mid || ''}">
    ${icon(t.icon)}${mark}${editMode ? `<span class="tile-mark edit">${ui('lapis')}</span>` : ''}
    <span class="tile-text"><span class="tile-title">${t.time ? `<span class="time">${esc(t.time)}</span>` : ''}${esc(t.title)}</span>
    ${extra ? `<span class="tile-note">${extra}</span>` : ''}</span>
  </button>`;
}
function taskList(k, tasks, mid, big) {
  return PERIODS.map(([p, label]) => {
    const list = tasks.filter(t => t.period === p);
    if (!list.length) return '';
    // Crianças: cartões com a figura grande e o nome embaixo, como na tabela de rotina.
    const away = awayOf();
    const gap = big && p === 'tarde' && away.days.includes(parseDay(k).getDay())
      ? `<div class="away">${icon('t_escola', 'away-ico')}<div><b>${esc(away.label)}</b><small>${esc(away.from)} – ${esc(away.to)}</small></div></div>` : '';
    return big ? `${gap}<div class="period">${label}</div><div class="tiles">${list.map(t => tileRow(k, t, mid)).join('')}</div>`
      : `<div class="period">${label}</div>` + list.map(t => taskRow(k, t, mid, big)).join('');
  }).join('');
}
// Casa em blocos do dia: manhã, tarde e noite (com o tempo de cada bloco).
function houseList(k, tasks) {
  return PERIODS.map(([p, label]) => {
    const list = tasks.filter(t => (t.period || 'livre') === p);
    if (!list.length) return '';
    const mins = minutesOf(list.filter(t => !t.skip));
    return `<div class="period">${label}${mins ? ` · ~${fmtMin(mins)}` : ''}</div>` + houseGroups(k, list);
  }).join('');
}
// Dentro de cada bloco, as tarefas ficam com o título do grupo (o foco do dia aparece como "Foco de quarta: quartos").
function houseGroups(k, list) {
  return GROUPS.map(([g]) => {
    const items = list.filter(t => (t.group || 'outras') === g);
    if (!items.length) return '';
    return `<div class="subgroup ${g === 'limpeza' ? 'focus' : ''}">${g === 'limpeza' ? ui('casa') : ''}${esc(groupLabel(g, k))}</div>` + items.map(t => taskRow(k, t, '', false)).join('');
  }).join('');
}
// Pontos pelo tempo: 1 ponto por minuto, arredondado de 5 em 5 (mínimo 5).
const pointsFor = min => Math.max(5, Math.round((min || 0) / 5) * 5);
// Horário em que as crianças estão fora (escolinha), mostrado como um intervalo na rotina delas.
const awayOf = () => C()?.away || { days: [1, 2, 3, 4, 5], from: '08:00', to: '16:00', label: 'Na escolinha' };
function skippedList(list) {
  const sk = list.filter(t => t.skip);
  return sk.length && !editMode ? `<div class="skipped-list">${sk.map(t => `<div>${ui('pular')} ${esc(t.title)}${t.dayNote ? ` — ${esc(t.dayNote)}` : ''}</div>`).join('')}</div>` : '';
}
function progress(done, total, color) {
  return `<div class="progress" style="--c:${color}"><div style="width:${total ? Math.round(done / total * 100) : 0}%"></div></div>`;
}
function agendaItem(a, withDate = false) {
  return `<li><button class="agenda-item" data-action="edit-agenda" data-id="${a.id}">
    ${icon(a.icon || 'recado', 'sm')}
    <span>${a.time ? `<span class="time">${esc(a.time)}</span>` : ''}${withDate ? `<b>${esc(fmtDay(a.date, { weekday: 'short', day: '2-digit', month: '2-digit' }))}</b> · ` : ''}${a.memberIds?.length ? `<b>${names(a.memberIds)}:</b> ` : ''}${esc(a.title)}
    ${a.note ? `<small>${esc(a.note)}</small>` : ''}</span></button></li>`;
}

function viewDayScreen() {
  const k = viewDay, isToday = k === today(), future = k > today();
  const nav = `<div class="daynav">
    <button class="btn icon-btn" data-action="day" data-n="-1" aria-label="Dia anterior">${ui('voltar')}</button>
    <div class="daynav-label"><b>${esc(dayLabel(k))}</b><small>${esc(fmtDay(k, { day: 'numeric', month: 'long' }))}</small></div>
    <button class="btn icon-btn" data-action="day" data-n="1" aria-label="Próximo dia">${ui('avancar')}</button>
    ${isToday ? '' : '<button class="btn soft" data-action="day" data-n="0">Voltar para hoje</button>'}
    <span class="spacer"></span>
    <button class="btn soft" data-action="timer">${ui('relogio')} Cronômetro</button>
    <button class="btn soft" data-action="new-agenda" data-day="${k}">${ui('mais')} Lembrete</button>
    <button class="btn ${editMode ? 'primary' : 'soft'}" data-action="edit-mode">${editMode ? `${ui('ok')} Concluir` : `${ui('lapis')} Editar`}</button>
  </div>`;

  const alerts = sortTasks(tasksOn(k).filter(t => t.alert));
  const items = agendaOn(k), tomorrow = agendaOn(addDays(k, 1));
  const banner = alerts.length || items.length || tomorrow.length ? `<section class="notice">${tucano()}<div class="notice-body">
      ${alerts.length || items.length ? `<h3>${isToday ? 'Hoje tem' : 'Neste dia tem'}</h3><ul>
        ${items.map(a => agendaItem(a)).join('')}
        ${alerts.map(t => `<li><div class="agenda-item">${icon(t.icon, 'sm')}<span>${t.time ? `<span class="time">${esc(t.time)}</span>` : ''}<b>${names(t.memberIds)}:</b> ${esc(t.title)}${t.note ? `<small>${esc(t.note)}</small>` : ''}</span></div></li>`).join('')}
      </ul>` : ''}
      ${tomorrow.length ? `<h3 class="muted">${isToday ? 'Amanhã' : 'No dia seguinte'}</h3><ul>${tomorrow.map(a => agendaItem(a)).join('')}</ul>` : ''}
    </div></section>` : '';
  const editBanner = editMode ? `<section class="hint">${ui('lapis')}<div><b>Modo edição.</b> Toque numa tarefa para escrever uma nota, repassar para outra pessoa,
    marcar que não precisa ou mudar de dia — só para ${isToday ? 'hoje' : 'este dia'}.
    <div class="row-btns"><button class="btn primary" data-action="new-task" data-day="${k}">${ui('mais')} Tarefa só neste dia</button>
    <button class="btn soft" data-action="new-task">${ui('mais')} Tarefa fixa</button></div></div></section>` : '';
  const futureHint = future && !editMode ? `<section class="hint">${ui('agenda')}<div>Este dia ainda não chegou. Toque em <b>Editar</b> para planejar: notas, repassar ou tirar tarefas.</div></section>` : '';

  // Coluna da casa
  const house = houseSort(houseOn(k, editMode));
  const houseReal = house.filter(t => !t.skip);
  const houseDone = houseReal.filter(t => doneOf(k, t)).length;
  // A coluna da casa pode ficar recolhida (as crianças também usam o tablet). Cada aparelho lembra a escolha.
  const blocks = PERIODS.map(([p, label]) => {
    const l = houseReal.filter(t => (t.period || 'livre') === p);
    return l.length ? `<span>${label} <b>${l.filter(t => doneOf(k, t)).length}/${l.length}</b></span>` : '';
  }).join('');
  const houseCol = `<section class="col house-col ${houseOpen ? '' : 'closed'}">
      <header class="col-head"><span class="avatar house">${ui('casa')}</span>
        <div><h2>Casa</h2><small>${houseDone} de ${houseReal.length} feitas${minutesOf(houseReal) ? ` · faltam ~${fmtMin(minutesOf(houseReal.filter(t => !doneOf(k, t))))}` : ''}</small></div>
        <button class="btn soft small" data-action="toggle-house" aria-expanded="${houseOpen}">${houseOpen ? 'Recolher' : 'Abrir'}</button></header>
      ${progress(houseDone, houseReal.length, 'var(--accent)')}
      ${houseOpen ? `${house.length ? houseList(k, house) : '<p class="muted pad">Nada da casa neste dia.</p>'}
        ${skippedList(houseOn(k, true))}
        <button class="btn ghost small full" data-action="tab" data-tab="casa">Ver a semana da casa</button>`
      : `${C()?.focus?.[parseDay(k).getDay()] ? `<p class="focus-mini">${ui('casa')} Foco: <b>${esc(C().focus[parseDay(k).getDay()])}</b></p>` : ''}<div class="house-blocks">${blocks}</div>`}
    </section>`;

  const cols = members().map(m => {
    const own = sortTasks(ownOn(k, m.id, editMode));
    const real = own.filter(t => !t.skip);
    const done = real.filter(t => doneOf(k, t, m.id)).length;
    const did = m.adult ? houseSort(houseOn(k).filter(t => doneOf(k, t)?.by === m.id)) : [];
    const dayPts = [...real.filter(t => doneOf(k, t, m.id)), ...did].reduce((s, t) => s + t.points, 0);
    const body = m.adult
      ? `${own.length ? taskList(k, own, m.id, false) : ''}
         <div class="period">Fez na casa</div>
         ${did.length ? did.map(t => `<div class="did">${icon(t.icon, 'sm')}<span>${esc(t.title)}</span><span class="pts">+${t.points}</span></div>`).join('')
           : '<p class="muted pad">Ainda nada. Toque numa tarefa da casa e escolha seu nome.</p>'}`
      : (own.length ? taskList(k, own, m.id, true) : '<p class="muted pad">Nada para este dia.</p>');
    return `<section class="col" style="--c:${esc(m.color)}">
      <header class="col-head">${avatar(m)}<div><h2>${esc(m.name)}</h2>
        <small>${m.adult ? `${did.length + done} feitas · +${dayPts}` : `${done} de ${real.length} feitas`}</small></div>
        <span class="pill">${star()}${balance(m.id)}</span></header>
      ${m.adult ? '' : progress(done, real.length, m.color)}
      ${body}
      ${skippedList(ownOn(k, m.id, true))}
      ${!m.adult && real.length && done === real.length ? `<div class="alldone">${tucano()}<b>Tudo feito!</b></div>` : ''}
    </section>`;
  }).join('');
  return `${nav}${editBanner}${futureHint}${banner}${isToday ? `<div class="top-cards">${approvalsCard()}${prioritiesCard()}${notesCard()}</div>` : approvalsCard()}<div class="board-wrap"><div class="board" style="grid-template-columns: ${houseOpen ? 'minmax(280px, 1.3fr)' : 'minmax(170px, .6fr)'} ${members().map(m => m.adult ? 'minmax(190px, .75fr)' : 'minmax(220px, 1.15fr)').join(' ')}">${houseCol}${cols}</div></div>`;
}

// ---------- Casa: panorama da semana ----------
let houseDay = today();
function viewHouse() {
  const from = mondayOf(houseDay), days = WEEK_ORDER.map((_, i) => addDays(from, i));
  const isThis = from === mondayOf(today());
  const nav = `<div class="daynav">
    <button class="btn icon-btn" data-action="house-week" data-n="-7" aria-label="Semana anterior">${ui('voltar')}</button>
    <div class="daynav-label"><b>Casa · ${isThis ? 'esta semana' : 'semana'}</b><small>${shortDay(from)} a ${shortDay(addDays(from, 6))}</small></div>
    <button class="btn icon-btn" data-action="house-week" data-n="7" aria-label="Próxima semana">${ui('avancar')}</button>
    ${isThis ? '' : '<button class="btn soft" data-action="house-week" data-n="0">Voltar para esta semana</button>'}
    <span class="spacer"></span>
    <button class="btn soft" data-action="timer">${ui('relogio')} Cronômetro</button>
    <button class="btn ${editMode ? 'primary' : 'soft'}" data-action="edit-mode">${editMode ? `${ui('ok')} Concluir` : `${ui('lapis')} Editar`}</button>
  </div>`;
  const chips = days.map(k => {
    const l = houseOn(k), done = l.filter(t => doneOf(k, t)).length;
    return `<button class="day-chip ${k === houseDay ? 'on' : ''} ${k === today() ? 'is-today' : ''}" data-action="house-day" data-day="${k}">
      <b>${DAYS[parseDay(k).getDay()]} <small>${parseDay(k).getDate()}</small></b><span class="${l.length && done === l.length ? 'full' : ''}">${done}/${l.length}</span></button>`;
  }).join('');
  const k = houseDay;
  const list = houseSort(houseOn(k, true));
  const groups = PERIODS.map(([p, label]) => {
    const items = list.filter(t => (t.period || 'livre') === p);
    if (!items.length) return '';
    const real = items.filter(t => !t.skip), done = real.filter(t => doneOf(k, t)).length;
    const mins = minutesOf(real);
    return `<section class="card group-card"><div class="section-head"><h2>${label}</h2><span class="pill">${done}/${real.length}${mins ? ` · ~${fmtMin(mins)}` : ''}</span></div>
      ${houseGroups(k, items)}</section>`;
  }).join('');
  const focus = C()?.focus?.[parseDay(k).getDay()];
  return `${nav}<div class="day-chips">${chips}</div>${from === mondayOf(today()) ? `<div class="top-cards">${healthCard()}${prioritiesCard()}</div>` : ''}
    ${k > today() && !editMode ? `<section class="hint">${ui('agenda')}<div>${esc(dayLabel(k))} ainda não chegou. Aqui você vê o que precisa ser feito. Use <b>Editar</b> para anotar, tirar ou mudar de dia.</div></section>` : ''}
    ${focus ? `<p class="focus-line">${ui('casa')} Foco de ${esc(WEEKDAY_NAMES[parseDay(k).getDay()])}: <b>${esc(focus)}</b></p>` : ''}
    <div class="groups">${groups || '<section class="card"><p class="muted">Nada da casa neste dia.</p></section>'}</div>`;
}

// ---------- Semana ----------
const weekDays = () => WEEK_ORDER.map((_, i) => addDays(weekFrom, i));
const before = k => k < (C()?.since || '');
function cellState(k, t, mid) {
  if (before(k) && !doneOf(k, t, mid)) return { cls: 'later', html: '', title: 'Antes de começar a usar o app' };
  if (t.skip) return { cls: 'skip', html: ui('pular'), title: t.dayNote || 'Não precisa' };
  const v = doneOf(k, t, mid);
  if (v) return t.house ? { cls: 'ok', html: avatar(member(v.by), 'mini'), title: `Feito por ${member(v.by)?.name || ''}` } : { cls: 'ok', html: ui('ok'), title: 'Feito' };
  if (k < today()) return { cls: 'miss', html: '–', title: 'Não feito' };
  if (k === today()) return { cls: 'todo', html: '', title: 'Para hoje' };
  return { cls: 'later', html: '', title: 'Programado' };
}

function viewWeek() {
  const days = weekDays(), end = addDays(weekFrom, 6), next = addDays(weekFrom, 7);
  const isThis = weekFrom === mondayOf(today());
  const nav = `<div class="daynav">
    <button class="btn icon-btn" data-action="week" data-n="-7" aria-label="Semana anterior">${ui('voltar')}</button>
    <div class="daynav-label"><b>${isThis ? 'Esta semana' : 'Semana'}</b><small>${shortDay(weekFrom)} a ${shortDay(end)}</small></div>
    <button class="btn icon-btn" data-action="week" data-n="7" aria-label="Próxima semana">${ui('avancar')}</button>
    ${isThis ? '' : '<button class="btn soft" data-action="week" data-n="0">Voltar para esta semana</button>'}
  </div>`;
  const chips = [['resumo', 'Resumo'], ['casa', 'Casa'], ...members().map(m => [m.id, esc(m.name)])]
    .map(([v, l]) => `<button class="chip ${weekWho === v ? 'on' : ''}" data-action="week-who" data-v="${v}">${l}</button>`).join('');
  const head = `<tr><th></th>${days.map(k => `<th class="${k === today() ? 'is-today' : ''}">${DAYS[parseDay(k).getDay()]}<small>${shortDay(k)}</small></th>`).join('')}`;

  let table;
  if (weekWho === 'resumo') {
    const frac = (done, total, k) => {
      if (!total) return '<td class="none">–</td>';
      const cls = k > today() || (before(k) && !done) ? 'later' : k === today() && done < total ? 'todo' : done === total ? 'ok' : done / total >= .5 ? 'half' : 'miss';
      return `<td class="${cls}">${done}/${total}</td>`;
    };
    const rows = [
      `<tr><th>${ui('casa')} Casa</th>${days.map(k => { const l = houseOn(k); return frac(l.filter(t => doneOf(k, t)).length, l.length, k); }).join('')}<td></td></tr>`,
      ...members().map(m => `<tr><th>${avatar(m, 'mini')} ${esc(m.name)}</th>${days.map(k => {
        if (m.adult) {
          const n = houseOn(k).filter(t => doneOf(k, t)?.by === m.id).length + ownOn(k, m.id).filter(t => doneOf(k, t, m.id)).length;
          return `<td class="${n ? 'ok' : 'none'}">${n || '–'}</td>`;
        }
        const l = ownOn(k, m.id);
        return frac(l.filter(t => doneOf(k, t, m.id)).length, l.length, k);
      }).join('')}<td class="pts-cell">${star()}${pointsBetween(m.id, weekFrom, next)}</td></tr>`),
    ];
    table = `<table class="week"><thead>${head}<th>Pontos</th></tr></thead><tbody>${rows.join('')}</tbody></table>
      <p class="legend">Crianças e casa: feitas / programadas. Gabriele e Bruno: quantas tarefas fizeram no dia.</p>`;
  } else {
    const who = weekWho === 'casa' ? null : member(weekWho);
    const listFor = k => !who ? houseOn(k, true) : who.adult
      ? [...ownOn(k, who.id, true), ...houseOn(k).filter(t => doneOf(k, t)?.by === who.id)]
      : ownOn(k, who.id, true);
    const perDay = Object.fromEntries(days.map(k => [k, listFor(k)]));
    const seen = new Map();
    days.forEach(k => perDay[k].forEach(t => { if (!seen.has(t.id)) seen.set(t.id, t); }));
    const rows = who ? sortTasks([...seen.values()]) : houseSort([...seen.values()]);
    const mid = who && !who.adult ? who.id : who?.id || '';
    table = rows.length ? `<table class="week detail"><thead>${head}</tr></thead><tbody>${rows.map(r => `<tr><th>${icon(r.icon, 'xs')}<span>${r.time ? `<span class="time">${esc(r.time)}</span>` : ''}${esc(r.title)}</span></th>${days.map(k => {
      const t = perDay[k].find(x => x.id === r.id);
      if (!t) return '<td class="none"></td>';
      const c = cellState(k, t, mid);
      return `<td class="${c.cls}" title="${esc(c.title)}" data-action="week-cell" data-day="${k}" data-task="${t.id}" data-member="${t.house ? '' : mid}">${c.html}</td>`;
    }).join('')}</tr>`).join('')}</tbody></table>
      <p class="legend">${unlocked ? 'Toque numa célula para marcar ou desmarcar.' : 'Esqueceu de marcar? Entre em Editar (PIN) e toque na célula.'}</p>`
      : '<p class="muted pad">Nada nesta semana.</p>';
  }

  const notes = days.flatMap(k => [
    ...agendaOn(k).map(a => `<li>${icon(a.icon || 'recado', 'xs')}<b>${esc(fmtDay(k, { weekday: 'short', day: '2-digit' }))}</b> ${a.time ? esc(a.time) + ' · ' : ''}${esc(a.title)}${a.note ? ` <small>(${esc(a.note)})</small>` : ''}</li>`),
    ...Object.entries(S.days[k]?.notes || {}).map(([id, o]) => {
      const t = C().tasks.find(x => x.id === id);
      if (!t) return '';
      const what = [o.skip ? 'não precisa' : '', o.memberIds ? `repassada para ${names(o.memberIds)}` : '', o.note ? esc(o.note) : ''].filter(Boolean).join(' · ');
      return `<li>${icon(t.icon, 'xs')}<b>${esc(fmtDay(k, { weekday: 'short', day: '2-digit' }))}</b> ${esc(t.title)} — ${what}</li>`;
    }),
  ]).filter(Boolean);
  return `${nav}<div class="chips">${chips}</div>
    <section class="card"><div class="table-wrap">${table}</div></section>
    <section class="card"><h2>Notas da semana</h2>${notes.length ? `<ul class="notes">${notes.join('')}</ul>` : '<p class="muted">Nenhuma nota ou lembrete nesta semana.</p>'}</section>`;
}

// ---------- Agenda ----------
function viewAgenda() {
  const t = today();
  const all = Object.values(S.agenda);
  const upcoming = all.filter(a => a.date >= t), past = all.filter(a => a.date < t);
  const changes = Object.entries(S.days).filter(([k]) => k >= t).flatMap(([k, d]) =>
    Object.entries(d.notes || {}).map(([id, v]) => ({ k, t: C().tasks.find(x => x.id === id), v }))).filter(x => x.t);
  const dates = [...new Set([...upcoming.map(a => a.date), ...changes.map(c => c.k)])].sort();
  const groups = dates.map(k => `<div class="agenda-day"><h3>${esc(dayLabel(k))} <small>${esc(fmtDay(k, { day: 'numeric', month: 'long' }))}</small></h3><ul>
      ${agendaOn(k).map(a => agendaItem(a)).join('')}
      ${changes.filter(c => c.k === k).map(c => `<li><button class="agenda-item change" data-action="goto-day" data-day="${k}">${icon(c.t.icon, 'sm')}
        <span>${esc(c.t.title)} — ${[c.v.skip ? 'não precisa' : '', c.v.memberIds ? `repassada para ${names(c.v.memberIds)}` : '', c.v.note ? esc(c.v.note) : ''].filter(Boolean).join(' · ')}</span></button></li>`).join('')}
    </ul></div>`).join('');
  return `<div class="row-btns top">
      <button class="btn primary" data-action="new-agenda" data-kind="lembrete">${ui('mais')} Lembrete</button>
      <button class="btn soft" data-action="new-agenda" data-kind="compromisso">${ui('mais')} Compromisso</button>
    </div>
    <section class="card">${groups || `<div class="empty-page small">${tucano('big')}<p>Nada marcado nos próximos dias.</p>
      <p class="muted">Anote festas, consultas ou recados como “amanhã não precisa levar lancheira”. Todo mundo da casa vê no tablet.</p></div>`}</section>
    ${past.length ? `<button class="btn ghost" data-action="past-agenda">${showPast ? 'Esconder' : 'Ver'} anteriores (${past.length})</button>
      ${showPast ? `<section class="card"><ul>${past.sort((a, b) => b.date.localeCompare(a.date)).map(a => agendaItem(a, true)).join('')}</ul></section>` : ''}` : ''}`;
}

// Aba Pontos, de cima para baixo: ranking, prêmios, trocas feitas e (fechadas) as últimas atividades.
function logRow(e) {
  const m = member(e.memberId);
  const when = new Date(e.t).toLocaleString('pt-BR', { weekday: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  return `<li>${avatar(m, 'mini')}<span class="log-text">${esc(e.label)}<small>${esc(m?.name || '')} · ${when}</small></span><span class="p ${e.points < 0 ? 'neg' : ''}">${e.points > 0 ? '+' : ''}${e.points}</span></li>`;
}
function viewRewards() {
  const ws = mondayOf(today()), we = addDays(ws, 7);
  const ranked = members().map(m => ({ m, w: pointsBetween(m.id, ws, we), b: balance(m.id) })).sort((a, b) => b.w - a.w);
  const ranking = `<section class="card"><h2>Ranking da semana</h2>${ranked.map((r, i) => `<div class="rank"><span class="pos">${i + 1}</span>${avatar(r.m)}
      <span class="name">${esc(r.m.name)}</span><span class="rank-pts"><b>${r.w}</b><small>na semana · saldo ${r.b}</small></span></div>`).join('')}</section>`;
  const list = C().rewards || [];
  const best = Math.max(0, ...members().map(m => balance(m.id)));
  const rewards = `<section class="card"><h2>Prêmios</h2>${list.length ? `<div class="rewards">${list.map(r => `<div class="reward">
      ${icon(r.icon, 'lg')}<div class="title">${esc(r.title)}</div><span class="pill">${star()}${r.cost}</span>
      <button class="btn primary" data-action="redeem" data-id="${r.id}" ${best < r.cost ? 'disabled' : ''}>Trocar pontos</button>
    </div>`).join('')}</div>` : '<p class="muted">Nenhum prêmio cadastrado. Adicione em Ajustes.</p>'}</section>`;
  const trades = ledgerEntries().filter(e => e.type === 'reward').sort((a, b) => b.t - a.t).slice(0, 20);
  const tradesCard = `<section class="card"><h2>Trocas feitas</h2>${trades.length ? `<ul class="log">${trades.map(logRow).join('')}</ul>` : '<p class="muted">Ninguém trocou pontos ainda.</p>'}</section>`;
  const recent = [...doneEntries(), ...ledgerEntries()].sort((a, b) => b.t - a.t).slice(0, 30);
  const activity = `<details class="card fold"><summary><h2>Últimas atividades</h2><span class="muted">${ui('avancar')}</span></summary>
    ${recent.length ? `<ul class="log">${recent.map(logRow).join('')}</ul>` : '<p class="muted">Nenhuma atividade ainda.</p>'}</details>`;
  return ranking + rewards + tradesCard + activity;
}
const viewScore = viewRewards;

function viewConfig() {
  if (!unlocked) return `<div class="empty-page">${tucano('big')}<p>Área dos pais: pessoas, tarefas e prêmios.</p>
    <button class="btn primary" data-action="unlock">${ui('cadeado')} Entrar com PIN</button></div>`;
  const people = members().map(m => `<div class="row">${avatar(m)}
      <div class="info"><b>${esc(m.name)}</b><small>${m.adult ? 'Adulto' : 'Criança'} · ${balance(m.id)} pontos</small></div>
      <div class="acts"><button class="btn soft" data-action="edit-member" data-id="${m.id}">Editar</button></div></div>`).join('');
  const whoChips = [['todos', 'Todas'], ['casa', 'Casa'], ...members().filter(m => !m.adult || C().tasks.some(t => !t.house && t.memberIds.includes(m.id))).map(m => [m.id, esc(m.name)])]
    .map(([v, l]) => `<button class="chip ${cfgWho === v ? 'on' : ''}" data-action="cfg-who" data-v="${v}">${l}</button>`).join('');
  const dayChips = [['todos', 'Todos os dias'], ...WEEK_ORDER.map(d => [String(d), DAYS[d]]), ['once', 'Sem dia fixo']]
    .map(([v, l]) => `<button class="chip ${cfgDay === v ? 'on' : ''}" data-action="cfg-day" data-v="${v}">${l}</button>`).join('');
  const filtered = C().tasks.filter(t => (cfgWho === 'todos' || (cfgWho === 'casa' ? t.house : !t.house && t.memberIds.includes(cfgWho))) &&
    (cfgDay === 'todos' || (cfgDay === 'once' ? isFlexible(t) && (t.date || t.weekday === '' || t.weekday == null)
      : t.days.includes(Number(cfgDay)) || (t.repeat === 'interval' && String(t.weekday) === cfgDay))));
  const sorted = [...sortTasks(filtered.filter(t => !t.house)), ...houseSort(filtered.filter(t => t.house))];
  const tasks = sorted.map(t => `<div class="row">${icon(t.icon, 'sm')}
      <div class="info"><b>${t.time ? esc(t.time) + ' · ' : ''}${esc(t.title)}</b>
        <small>${t.house ? `Casa · ${esc(GROUPS.find(g => g[0] === (t.group || 'outras'))[1])}` : names(t.memberIds)} · ${esc(repeatLabel(t))}${isFlexible(t) && !(t.date && t.last) ? ` · próxima ${esc(shortDay(nextDue(t)))}` : ''} · ${t.points} pontos${t.minutes ? ` · ~${fmtMin(t.minutes)}` : ''}${t.alert ? ' · aparece no aviso' : ''}</small></div>
      <div class="acts"><button class="btn soft" data-action="edit-task" data-id="${t.id}">Editar</button></div></div>`).join('');
  const rewards = (C().rewards || []).map(r => `<div class="row">${icon(r.icon, 'sm')}
      <div class="info"><b>${esc(r.title)}</b><small>${r.cost} pontos</small></div>
      <div class="acts"><button class="btn soft" data-action="edit-reward" data-id="${r.id}">Editar</button></div></div>`).join('');
  return `<section class="card">
    <div class="section-head"><h2>Pessoas</h2><button class="btn soft" data-action="edit-member">${ui('mais')} Pessoa</button></div>${people}
  </section>
  <section class="card">
    <div class="section-head"><h2>Tarefas fixas <small>(${filtered.length})</small></h2><button class="btn soft" data-action="new-task">${ui('mais')} Tarefa</button></div>
    <p class="legend">Para mudar só um dia (nota, repassar, não precisa), use <b>Editar</b> na tela do dia.</p>
    <div class="chips">${whoChips}</div><div class="chips">${dayChips}</div>
    ${tasks || '<p class="muted">Nenhuma tarefa com esse filtro.</p>'}
  </section>
  <section class="card">
    <div class="section-head"><h2>Prêmios</h2><button class="btn soft" data-action="edit-reward">${ui('mais')} Prêmio</button></div>${rewards}
  </section>
  <section class="card">
    <h2>Pontos e segurança</h2>
    <div class="row-btns"><button class="btn soft" data-action="settings">Aprovação dos pais: ${C().approval !== false ? 'ligada' : 'desligada'}</button></div>
    <div class="row-btns"><button class="btn soft" data-action="bonus">Dar ou tirar pontos</button>
      <button class="btn soft" data-action="change-pin">Trocar PIN</button>
      <button class="btn soft" data-action="export">Baixar backup</button>
      <button class="btn soft" data-action="import">Restaurar backup</button>
      <button class="btn danger" data-action="reset-points">Zerar pontos</button>
      <button class="btn ghost" data-action="lock">${ui('cadeado')} Travar</button></div>
    <p class="legend">${mode === 'db' ? 'Os dados ficam salvos na página e aparecem em todos os aparelhos. Para o Bruno editar pelo celular, compartilhe a página com ele como Editor. Baixe um backup de vez em quando (ex.: uma vez por mês) para ter uma cópia guardada.' : 'Os dados ficam salvos neste aparelho. Baixe um backup de vez em quando.'}</p>
  </section>`;
}
function daysLabel(days) {
  if (days.length === 7) return 'todo dia';
  if (days.length === 5 && WEEKDAYS.every(d => days.includes(d))) return 'seg a sex';
  return WEEK_ORDER.filter(d => days.includes(d)).map(d => DAYS[d]).join(', ');
}

// ---------- Prioridades da semana ----------
// O que acumulou e precisa de atenção (ex.: vidro da sala). Fica no topo até alguém marcar como feito.
function prioritiesCard() {
  const ws = mondayOf(today());
  const list = Object.values(S.priorities).filter(p => !p.done || p.doneOn >= ws)
    .sort((a, b) => (a.done ? 1 : 0) - (b.done ? 1 : 0) || (a.created || 0) - (b.created || 0));
  return `<section class="card priorities"><div class="section-head"><h2>${ui('bandeira')} Prioridades da semana</h2>
    <button class="btn soft small" data-action="new-priority">${ui('mais')} Prioridade</button></div>
    ${list.length ? list.map(p => `<div class="prio ${p.done ? 'done' : ''}">
      <button class="prio-check" data-action="toggle-priority" data-id="${p.id}" aria-label="${p.done ? 'Desmarcar' : 'Marcar como feita'}">${p.done ? ui('ok') : ''}</button>
      <button class="prio-text" data-action="edit-priority" data-id="${p.id}"><span>${esc(p.title)}</span>${p.memberId ? avatar(member(p.memberId), 'mini') : ''}</button></div>`).join('')
    : '<p class="muted pad">Nada urgente. Anote aqui o que acumulou, como “vidro da sala”.</p>'}</section>`;
}
function editPriority(id) {
  const p = S.priorities[id] || { title: '', memberId: '' };
  openDlg(id ? 'Prioridade' : 'Nova prioridade',
    field('O que precisa ser feito', `<input type="text" id="f-ptitle" name="title" value="${esc(p.title)}" required placeholder="Ex.: Limpar o vidro da sala">`, 'f-ptitle') +
    `<div class="field"><span>Quem vai fazer (opcional)</span><div class="opts"><label><input type="radio" name="member" value="" ${p.memberId ? '' : 'checked'}> Qualquer um</label>
      ${members().map(m => `<label><input type="radio" name="member" value="${m.id}" ${p.memberId === m.id ? 'checked' : ''}>${avatar(m, 'mini')} ${esc(m.name)}</label>`).join('')}</div></div>`,
    fd => {
      const key = id || uid();
      S.priorities[key] = { ...p, id: key, title: fd.get('title').trim(), memberId: fd.get('member') || '', created: p.created || Date.now(), done: !!p.done };
      saveItem('priorities', key);
    }, 'Salvar',
    id ? `<button type="button" class="btn danger" data-action="del-priority" data-id="${id}">Excluir</button>` : '');
}

// ---------- Cardápio, receitas e lista de compras ----------
let menuWeek = mondayOf(today()), menuView = 'semana', pendingRecipePhoto;
const menuDoc = w => S.menus[w] || { week: w, days: {} };
// Durante a semana é só jantar (o almoço é a sobra da noite); fim de semana tem almoço. Dá para ligar o almoço em qualquer dia.
const hasLunch = (w, k) => menuDoc(w).days?.[k]?.lunch ?? [0, 6].includes(parseDay(k).getDay());
const mealOf = (w, k, meal) => menuDoc(w).days?.[k]?.[meal] || null;
const mealName = m => !m ? '' : m.recipeId ? (S.recipes[m.recipeId]?.name || 'Receita apagada') : (m.text || '');
function editMenu(w, fn) {
  const doc = S.menus[w] = clone(menuDoc(w));
  doc.days ||= {};
  fn(doc);
  saveItem('menus', w);
}
const setMeal = (w, k, meal, val) => editMenu(w, doc => { const d = doc.days[k] ||= {}; if (val) d[meal] = val; else delete d[meal]; });

function viewMenu() {
  const sub = [['semana', 'Cardápio da semana'], ['receitas', 'Receitas'], ['compras', 'Lista de compras']]
    .map(([v, l]) => `<button class="chip ${menuView === v ? 'on' : ''}" data-action="menu-view" data-v="${v}">${l}</button>`).join('');
  return `<div class="chips">${sub}</div>${menuView === 'receitas' ? viewRecipes() : menuView === 'compras' ? viewShopping() : viewMenuWeek()}`;
}
function weekNav(action, w) {
  const isThis = w === mondayOf(today());
  return `<div class="daynav"><button class="btn icon-btn" data-action="${action}" data-n="-7" aria-label="Semana anterior">${ui('voltar')}</button>
    <div class="daynav-label"><b>${isThis ? 'Esta semana' : 'Semana'}</b><small>${shortDay(w)} a ${shortDay(addDays(w, 6))}</small></div>
    <button class="btn icon-btn" data-action="${action}" data-n="7" aria-label="Próxima semana">${ui('avancar')}</button>
    ${isThis ? '' : `<button class="btn soft" data-action="${action}" data-n="0">Voltar para esta semana</button>`}</div>`;
}
function viewMenuWeek() {
  const w = menuWeek, days = WEEK_ORDER.map((_, i) => addDays(w, i));
  const slot = (k, meal) => {
    const m = mealOf(w, k, meal), r = m?.recipeId ? S.recipes[m.recipeId] : null;
    return `<button class="meal ${m ? 'filled' : ''}" data-action="pick-meal" data-day="${k}" data-meal="${meal}">
      ${r?.photo ? `<img src="${esc(r.photo)}" alt="">` : `<span class="ph">${ui('cardapio')}</span>`}
      <span><small>${meal === 'almoco' ? 'Almoço' : 'Jantar'}</small>${m ? esc(mealName(m)) : 'Escolher'}</span></button>`;
  };
  const cards = days.map(k => `<section class="card menu-day ${k === today() ? 'is-today' : ''}">
    <div class="section-head"><h2>${esc(WEEKDAY_NAMES[parseDay(k).getDay()])} <small>${shortDay(k)}</small></h2>
      <label class="switch"><input type="checkbox" data-action="toggle-lunch" data-day="${k}" ${hasLunch(w, k) ? 'checked' : ''}> Almoço</label></div>
    ${hasLunch(w, k) ? slot(k, 'almoco') : ''}${slot(k, 'jantar')}</section>`).join('');
  return `${weekNav('menu-week', w)}
    <div class="row-btns top"><button class="btn soft" data-action="copy-last-week">Copiar a semana passada</button>
      ${Object.keys(S.templates).length ? '<button class="btn soft" data-action="use-template">Usar cardápio pronto</button>' : ''}
      <button class="btn soft" data-action="save-template">Salvar como cardápio pronto</button>
      <button class="btn primary" data-action="menu-view" data-v="compras">Lista de compras</button></div>
    <div class="menu-grid">${cards}</div>`;
}
function pickMeal(k, meal) {
  const w = mondayOf(k), cur = mealOf(w, k, meal);
  const rs = Object.values(S.recipes).sort((a, b) => (b.fav ? 1 : 0) - (a.fav ? 1 : 0) || a.name.localeCompare(b.name));
  openDlg(`${meal === 'almoco' ? 'Almoço' : 'Jantar'}<small class="dlg-sub">${esc(fmtDay(k))}</small>`,
    `<div class="field"><span>Receitas${rs.some(r => r.fav) ? ' (favoritas primeiro)' : ''}</span><div class="recipe-pick">${rs.map(r => `<label>
      <input type="radio" name="recipe" value="${r.id}" ${cur?.recipeId === r.id ? 'checked' : ''}>
      ${r.photo ? `<img src="${esc(r.photo)}" alt="">` : `<span class="ph">${ui('cardapio')}</span>`}<span>${r.fav ? ui('coracao', 'fav') : ''}${esc(r.name)}</span></label>`).join('')}
      <label><input type="radio" name="recipe" value="" ${cur && !cur.recipeId ? 'checked' : ''}><span class="ph">${ui('lapis')}</span><span>Outro (escrever abaixo)</span></label></div></div>` +
    (rs.length ? '' : '<p class="legend">Ainda não tem receitas. Cadastre na aba Receitas ou escreva abaixo.</p>') +
    field('Escrever (ex.: sobras, comer fora, pizza)', `<input type="text" id="f-mtext" name="text" value="${esc(cur?.text || '')}">`, 'f-mtext'),
    fd => {
      const rid = fd.get('recipe'), text = fd.get('text').trim();
      if (rid) return setMeal(w, k, meal, { recipeId: rid });
      if (!text) { toast('Escolha uma receita ou escreva o que vai ter'); return false; }
      setMeal(w, k, meal, { text });
    }, 'Salvar', cur ? `<button type="button" class="btn danger" data-action="clear-meal" data-day="${k}" data-meal="${meal}">Tirar</button>` : '');
}
function copyLastWeek() {
  const prev = menuDoc(addDays(menuWeek, -7));
  const days = Object.fromEntries(Object.entries(prev.days || {}).map(([k, v]) => [addDays(k, 7), v]));
  if (!Object.keys(days).length) return toast('A semana passada está vazia');
  const go = () => { editMenu(menuWeek, doc => { doc.days = days; }); render(); toast('Cardápio copiado'); };
  Object.keys(menuDoc(menuWeek).days || {}).length ? askConfirm('Trocar o cardápio desta semana pelo da semana passada?', go, 'Trocar') : go();
}
function saveTemplate() {
  if (!Object.keys(menuDoc(menuWeek).days || {}).length) return toast('Monte o cardápio da semana primeiro');
  openDlg('Salvar cardápio pronto', field('Nome', '<input type="text" id="f-tname" name="name" required placeholder="Ex.: Semana corrida">', 'f-tname'), fd => {
    const id = uid();
    const days = Object.fromEntries(Object.entries(menuDoc(menuWeek).days).map(([k, v]) => [parseDay(k).getDay(), v]));
    S.templates[id] = { id, name: fd.get('name').trim(), days };
    saveItem('templates', id);
    toast('Cardápio pronto salvo');
  });
}
function useTemplate() {
  const list = Object.values(S.templates);
  openDlg('Usar cardápio pronto', `<div class="field"><div class="opts column">${list.map(t => `<label><input type="radio" name="tpl" value="${t.id}" required> ${esc(t.name)}</label>`).join('')}</div></div>`, fd => {
    const t = S.templates[fd.get('tpl')];
    if (!t) return false;
    editMenu(menuWeek, doc => { doc.days = Object.fromEntries(WEEK_ORDER.map((d, i) => [addDays(menuWeek, i), t.days[d]]).filter(([, v]) => v)); });
    toast(`Cardápio “${t.name}” aplicado`);
  }, 'Usar', `<button type="button" class="btn danger" data-action="del-template">Apagar o marcado</button>`);
}

// Receitas: ingredientes um por linha ("2 tomates", "200 g de queijo", "1 xícara de arroz").
function viewRecipes() {
  const rs = Object.values(S.recipes).sort((a, b) => (b.fav ? 1 : 0) - (a.fav ? 1 : 0) || a.name.localeCompare(b.name));
  return `<div class="row-btns top"><button class="btn primary" data-action="edit-recipe">${ui('mais')} Receita</button></div>
    ${rs.length ? `<div class="recipes">${rs.map(r => `<button class="card recipe" data-action="show-recipe" data-id="${r.id}">
      ${r.photo ? `<img src="${esc(r.photo)}" alt="">` : `<span class="ph big">${ui('cardapio')}</span>`}
      <b>${r.fav ? ui('coracao', 'fav') : ''}${esc(r.name)}</b><small>${ingredientLines(r).length} ingredientes${r.link ? ' · tem link' : ''}</small></button>`).join('')}</div>`
    : `<div class="empty-page">${tucano('big')}<p>Nenhuma receita ainda.</p><p class="muted">Cadastre as receitas que vocês sempre fazem, com foto e link do Instagram. Depois é só escolher no cardápio e a lista de compras sai pronta.</p></div>`}`;
}
const ingredientLines = r => (r.ingredients || '').split('\n').map(l => l.trim()).filter(Boolean);
function showRecipe(id) {
  const r = S.recipes[id];
  if (!r) return;
  openDlg(esc(r.name),
    `${r.photo ? `<img class="recipe-photo" src="${esc(r.photo)}" alt="">` : ''}
    ${r.link ? `<p><a class="btn soft" href="${esc(r.link)}" target="_blank" rel="noopener">${ui('link')} Abrir a receita original</a></p>` : ''}
    ${r.servings ? `<p class="muted">Rende ${esc(r.servings)} porções</p>` : ''}
    <h3 class="sub-title">Ingredientes</h3><ul class="ing-list">${ingredientLines(r).map(l => `<li>${esc(l)}</li>`).join('')}</ul>
    ${r.steps ? `<h3 class="sub-title">Modo de preparo</h3><p class="steps">${esc(r.steps)}</p>` : ''}`,
    null, '', `<button type="button" class="btn soft" data-action="edit-recipe" data-id="${id}">${ui('lapis')} Editar</button>`);
}
function editRecipe(id) {
  const r = S.recipes[id] || { name: '', link: '', servings: '', ingredients: '', steps: '', fav: false, photo: '' };
  pendingRecipePhoto = undefined;
  openDlg(id ? 'Editar receita' : 'Nova receita',
    field('Nome', `<input type="text" id="f-rname" name="name" value="${esc(r.name)}" required placeholder="Ex.: Strogonoff de frango">`, 'f-rname') +
    `<div class="field"><span>Foto (opcional)</span><div class="photo-row">${r.photo ? `<img class="recipe-thumb" src="${esc(r.photo)}" alt="">` : `<span class="recipe-thumb ph">${ui('foto')}</span>`}
      <input type="file" id="f-rphoto" accept="image/*">${r.photo ? '<label><input type="checkbox" name="nophoto"> Tirar foto</label>' : ''}</div></div>` +
    `<div class="field-row">${field('Link (Instagram ou site)', `<input type="url" id="f-rlink" name="link" value="${esc(r.link)}" placeholder="https://www.instagram.com/…">`, 'f-rlink')}
      ${field('Porções', `<input type="text" id="f-rserv" name="servings" value="${esc(r.servings)}" placeholder="4">`, 'f-rserv')}</div>` +
    field('Ingredientes (um por linha)', `<textarea id="f-ring" name="ingredients" rows="7" placeholder="2 tomates&#10;200 g de queijo&#10;1 xícara de arroz&#10;sal a gosto">${esc(r.ingredients)}</textarea>`, 'f-ring') +
    field('Modo de preparo (opcional)', `<textarea id="f-rsteps" name="steps" rows="5">${esc(r.steps)}</textarea>`, 'f-rsteps') +
    `<div class="field"><div class="opts"><label><input type="checkbox" name="fav" ${r.fav ? 'checked' : ''}> Favorita (a gente sempre faz)</label></div></div>`,
    fd => {
      const key = id || uid();
      const photo = fd.has('nophoto') ? '' : pendingRecipePhoto ?? r.photo ?? '';
      S.recipes[key] = { id: key, name: fd.get('name').trim(), link: fd.get('link').trim(), servings: fd.get('servings').trim(),
        ingredients: fd.get('ingredients').trim(), steps: fd.get('steps').trim(), fav: fd.has('fav'), photo };
      pendingRecipePhoto = undefined;
      saveItem('recipes', key);
      toast('Receita salva');
    }, 'Salvar',
    id ? `<button type="button" class="btn danger" data-action="del-recipe" data-id="${id}">Excluir</button>` : '');
}

// Lê "2 tomates", "200 g de queijo", "1/2 xícara de leite", "sal a gosto".
const UNIT_ALIASES = [
  ['colher de sopa', ['colheres de sopa', 'colher de sopa']], ['colher de chá', ['colheres de chá', 'colher de chá', 'colheres de cha', 'colher de cha']],
  ['xícara', ['xícaras', 'xicaras', 'xícara', 'xicara']], ['kg', ['kg', 'quilos', 'quilo']], ['g', ['gramas', 'grama', 'gr', 'g']],
  ['ml', ['ml']], ['l', ['litros', 'litro', 'l']], ['colher', ['colheres', 'colher']], ['dente', ['dentes', 'dente']], ['lata', ['latas', 'lata']],
  ['pacote', ['pacotes', 'pacote']], ['caixa', ['caixas', 'caixa']], ['maço', ['maços', 'maço']], ['fatia', ['fatias', 'fatia']],
  ['pote', ['potes', 'pote']], ['pitada', ['pitadas', 'pitada']], ['copo', ['copos', 'copo']], ['unidade', ['unidades', 'unidade', 'un']]];
function parseQty(str) {
  str = str.replace(',', '.').trim();
  const frac = { '½': .5, '¼': .25, '¾': .75 };
  if (frac[str]) return frac[str];
  let m = str.match(/^(\d+)\s+(\d+)\/(\d+)$/);
  if (m) return +m[1] + m[2] / m[3];
  m = str.match(/^(\d+)\/(\d+)$/);
  if (m) return m[1] / m[2];
  return parseFloat(str);
}
function parseIngredient(line) {
  let s = line.trim().replace(/^[-•*·]\s*/, '');
  let qty = null, unit = '';
  const m = s.match(/^(\d+\s+\d+\/\d+|\d+\/\d+|\d+(?:[.,]\d+)?|[½¼¾])\s*/);
  if (m) { qty = parseQty(m[1]); s = s.slice(m[0].length); }
  const low = s.toLowerCase();
  outer: for (const [canon, aliases] of UNIT_ALIASES) for (const a of aliases) {
    if (low === a || low.startsWith(a + ' ')) { unit = canon; s = s.slice(a.length).trim(); break outer; }
  }
  s = s.replace(/^de\s+/i, '').trim();
  const loose = /\s*(a|à) gosto$/i.test(s);
  s = s.replace(/\s*(a|à) gosto$/i, '').trim();
  return { qty: Number.isFinite(qty) && !loose ? qty : null, unit, item: s || line.trim() };
}
// Mesma coisa escrita de jeitos parecidos ("tomate" e "tomates") soma junto.
const ingKey = ing => ing.unit + '|' + ing.item.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .split(/\s+/).map(w => w.length > 3 ? w.replace(/s$/, '') : w).join(' ');
const fmtQty = q => Number(q.toFixed(2)).toLocaleString('pt-BR');
function shoppingFromMenu(w) {
  const map = new Map();
  for (const [k, d] of Object.entries(menuDoc(w).days || {})) for (const meal of ['almoco', 'jantar']) {
    if (meal === 'almoco' && !hasLunch(w, k)) continue;
    const r = d?.[meal]?.recipeId && S.recipes[d[meal].recipeId];
    if (!r) continue;
    for (const line of ingredientLines(r)) {
      const ing = parseIngredient(line), key = ingKey(ing);
      const e = map.get(key) || { key, item: ing.item, unit: ing.unit, qty: 0, hasQty: false, loose: false, from: new Set() };
      if (ing.qty != null) { e.qty += ing.qty; e.hasQty = true; } else e.loose = true;
      e.from.add(r.name);
      map.set(key, e);
    }
  }
  return [...map.values()];
}
function viewShopping() {
  const w = menuWeek, doc = S.shopping[w] || { checked: {}, extras: [] };
  const fromMenu = shoppingFromMenu(w).map(e => ({ ...e, checked: !!doc.checked?.[e.key],
    label: `${e.hasQty ? fmtQty(e.qty) + ' ' + (e.unit ? e.unit + ' de ' : '') : ''}${e.item}${e.hasQty && e.loose ? ' (+ a gosto)' : ''}` }));
  const extras = (doc.extras || []).map(x => ({ ...x, extra: true, label: x.text }));
  const all = [...fromMenu, ...extras].sort((a, b) => (a.checked ? 1 : 0) - (b.checked ? 1 : 0) || a.label.localeCompare(b.label));
  const left = all.filter(x => !x.checked).length;
  return `${weekNav('menu-week', w)}
    <div class="row-btns top"><button class="btn primary" data-action="add-shop">${ui('mais')} Item</button>
      ${all.some(x => x.checked) ? '<button class="btn ghost" data-action="uncheck-shop">Desmarcar tudo</button>' : ''}</div>
    <section class="card"><div class="section-head"><h2>Lista de compras</h2><span class="pill">${left} para comprar</span></div>
      ${all.length ? all.map(x => `<div class="shop ${x.checked ? 'done' : ''}">
        <button class="prio-check" data-action="toggle-shop" data-key="${esc(x.extra ? 'x:' + x.id : x.key)}" aria-label="Marcar">${x.checked ? ui('ok') : ''}</button>
        <span class="shop-text"><b>${esc(x.label)}</b>${x.from ? `<small>${esc([...x.from].join(', '))}</small>` : '<small>item avulso</small>'}</span>
        ${x.extra ? `<button class="btn ghost small" data-action="del-shop" data-id="${x.id}" aria-label="Apagar">${ui('lixeira')}</button>` : ''}</div>`).join('')
      : '<p class="muted pad">A lista sai do cardápio da semana. Escolha as receitas ou adicione itens avulsos (papel, produtos de limpeza…).</p>'}
    </section>`;
}
function editShop(w, fn) {
  const doc = S.shopping[w] = clone(S.shopping[w] || { week: w, checked: {}, extras: [] });
  doc.checked ||= {}; doc.extras ||= [];
  fn(doc);
  saveItem('shopping', w);
}

// ---------- Tempo estimado ----------
const fmtMin = m => m < 60 ? `${m} min` : `${Math.floor(m / 60)}h${m % 60 ? String(m % 60).padStart(2, '0') : ''}`;
const minutesOf = list => list.reduce((s, t) => s + (t.skip ? 0 : t.minutes || 0), 0);

// ---------- Saúde da casa ----------
// Cada cômodo vai de verde a vermelho conforme as tarefas dele atrasam (só conta a partir do dia em que começaram a usar o app).
const ROOMS = [['cozinha', 'Cozinha'], ['banheiros', 'Banheiros'], ['quartos', 'Quartos'], ['sala', 'Sala e plantas'], ['lavanderia', 'Roupas'],
  ['escritorio', 'Escritório'], ['externa', 'Jardim e Keller'], ['carro', 'Carro']];
const diffDays = (a, b) => Math.round((parseDay(b) - parseDay(a)) / 864e5);
// Dias de atraso de uma tarefa (0 = em dia).
function lateDays(t, k = today()) {
  const since = C()?.since || '';
  if (isFlexible(t)) {
    if (t.date && t.last) return 0;
    const due = nextDue(t);
    return due < k && due >= since ? diffDays(due, k) : 0;
  }
  let d = null;
  for (let i = 1; i <= 7 && !d; i++) { const x = addDays(k, -i); if (t.days.includes(parseDay(x).getDay())) d = x; }
  if (!d || d < since || doneOnDay(t, d) || S.days[d]?.notes?.[t.id]?.skip) return 0;
  return diffDays(d, k);
}
function roomHealth(room) {
  const tasks = (C()?.tasks || []).filter(t => t.room === room);
  if (!tasks.length) return null;
  const late = tasks.map(t => ({ t, days: lateDays(t) })).filter(x => x.days > 0);
  const score = 1 - late.reduce((s, x) => s + Math.min(1, x.days / 7), 0) / tasks.length;
  return { score: Math.max(0, score), late };
}
function healthCard() {
  const rows = ROOMS.map(([key, label]) => ({ key, label, h: roomHealth(key) })).filter(r => r.h);
  if (!rows.length) return '';
  return `<section class="card health"><div class="section-head"><h2>Saúde da casa</h2><small class="muted">toque num cômodo para ver o que atrasou</small></div>
    <div class="health-grid">${rows.map(({ key, label, h }) => {
      const cls = h.score >= .85 ? 'good' : h.score >= .6 ? 'mid' : 'bad';
      return `<button class="room ${cls}" data-action="room" data-room="${key}"><span class="room-name">${label}</span>
        <span class="room-bar"><span style="width:${Math.round(h.score * 100)}%"></span></span>
        <small>${h.late.length ? `${h.late.length} atrasada${h.late.length > 1 ? 's' : ''}` : 'em dia'}</small></button>`;
    }).join('')}</div></section>`;
}
function roomDialog(room) {
  const h = roomHealth(room), label = ROOMS.find(r => r[0] === room)?.[1] || '';
  openDlg(`${esc(label)}<small class="dlg-sub">${h.late.length ? 'O que está atrasado' : 'Tudo em dia'}</small>`,
    h.late.length ? h.late.sort((a, b) => b.days - a.days).map(({ t, days }) => `<div class="row">${icon(t.icon, 'sm')}
      <div class="info"><b>${esc(t.title)}</b><small>${days} dia${days > 1 ? 's' : ''} de atraso${t.minutes ? ' · ~' + fmtMin(t.minutes) : ''}</small></div>
      <div class="acts"><button type="button" class="btn soft small" data-action="late-done" data-task="${t.id}">Feita</button></div></div>`).join('')
      : `<div class="empty-page small">${tucano('big')}<p>Nada atrasado aqui.</p></div>`);
}
// Marca uma tarefa atrasada: as "a cada…" contam hoje; as de dia fixo contam no dia em que deveriam ter sido feitas.
function lateDone(id) {
  const t = C().tasks.find(x => x.id === id);
  if (!t) return;
  let k = today();
  if (!isFlexible(t)) for (let i = 1; i <= 7; i++) { const x = addDays(k, -i); if (t.days.includes(parseDay(x).getDay())) { k = x; break; } }
  toggle(k, id, t.house ? '' : t.memberIds[0]);
}

// ---------- Aprovação dos pais ----------
const needsApproval = m => !!m && !m.adult && C()?.approval !== false;
function pendingList() {
  return Object.entries(S.days).filter(([k]) => k >= addDays(today(), -14)).flatMap(([k, d]) =>
    Object.entries(d.done || {}).filter(([, v]) => v.pending).map(([key, v]) => ({ k, key, ...v })))
    .sort((a, b) => a.t - b.t);
}
function approvalsCard() {
  const list = pendingList();
  if (!list.length) return '';
  return `<section class="card approvals"><div class="section-head"><h2>${ui('relogio')} Para aprovar <span class="pill">${list.length}</span></h2>
    <button class="btn primary small" data-action="approve-all">${ui('ok')} Aprovar todas</button></div>
    ${list.map(p => { const m = member(p.by); const t = C().tasks.find(x => x.id === p.key.split('|')[0]);
      return `<div class="row">${avatar(m, 'mini')}${t ? icon(t.icon, 'sm') : ''}<div class="info"><b>${esc(p.title)}</b>
        <small>${esc(m?.name || '')} · ${esc(dayLabel(p.k))} · +${p.pts}</small></div>
        <div class="acts"><button class="btn soft small" data-action="approve" data-day="${p.k}" data-key="${esc(p.key)}">Aprovar</button>
        <button class="btn ghost small" data-action="reject" data-day="${p.k}" data-key="${esc(p.key)}">Não fez</button></div></div>`; }).join('')}
  </section>`;
}
function setApproval(k, key, ok) {
  const d = S.days[k];
  if (!d?.done?.[key]) return;
  if (ok) d.done[key] = { ...d.done[key], pending: false };
  else delete d.done[key];
  saveDay(k);
}

// ---------- Recados ----------
function notesCard() {
  const list = Object.values(S.recados).sort((a, b) => b.t - a.t).slice(0, 6);
  return `<section class="card recados"><div class="section-head"><h2>${ui('nota')} Recados</h2>
    <button class="btn soft small" data-action="new-recado">${ui('mais')} Recado</button></div>
    ${list.length ? list.map(r => `<div class="recado">${avatar(member(r.by), 'mini')}<div class="info"><p>${esc(r.text)}</p>
      <small>${esc(member(r.by)?.name || '')} · ${esc(new Date(r.t).toLocaleString('pt-BR', { weekday: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' }))}</small></div>
      <button class="btn ghost small" data-action="del-recado" data-id="${r.id}" aria-label="Apagar recado">${ui('lixeira')}</button></div>`).join('')
    : '<p class="muted pad">Recados rápidos entre vocês. Ex.: “comprei o presente da festa”.</p>'}</section>`;
}
function newRecado() {
  let last = '';
  try { last = localStorage.getItem(KEY + '-autor') || ''; } catch (e) { /* sem armazenamento */ }
  const authors = adults().length ? adults() : members();
  if (!authors.some(m => m.id === last)) last = authors[0]?.id || '';
  openDlg('Novo recado',
    field('Recado', '<textarea id="f-recado" name="text" rows="3" required placeholder="Ex.: Amanhã o Arthur leva roupa de ginástica"></textarea>', 'f-recado') +
    `<div class="field"><span>De</span><div class="opts">${authors.map(m => `<label><input type="radio" name="by" value="${m.id}" ${m.id === last ? 'checked' : ''} required>${avatar(m, 'mini')} ${esc(m.name)}</label>`).join('')}</div></div>`,
    fd => {
      const id = uid();
      S.recados[id] = { id, text: fd.get('text').trim(), by: fd.get('by'), t: Date.now() };
      try { localStorage.setItem(KEY + '-autor', fd.get('by')); } catch (e) { /* sem armazenamento */ }
      saveItem('recados', id);
    }, 'Enviar');
}

// ---------- Cronômetro de foco ----------
let timer = null, timerTick = null, wakeLock = null;
function timerDialog(label = '') {
  openDlg('Cronômetro',
    `<div class="field"><span>Quanto tempo</span><div class="opts">${[5, 10, 15, 20, 30].map(m => `<label><input type="radio" name="min" value="${m}" ${m === 15 ? 'checked' : ''}> ${m} min</label>`).join('')}</div></div>` +
    field('Para quê (opcional)', `<input type="text" id="f-tlabel" name="label" value="${esc(label)}" placeholder="Ex.: Guardar os brinquedos antes do tucano">`, 'f-tlabel'),
    fd => { startTimer(Number(fd.get('min')) || 15, fd.get('label').trim()); }, 'Começar');
}
function startTimer(min, label) {
  timer = { total: min * 60, left: min * 60, end: Date.now() + min * 60000, paused: false, label, done: false };
  beep(1);
  navigator.wakeLock?.request('screen').then(l => { wakeLock = l; }).catch(() => {});
  clearInterval(timerTick);
  timerTick = setInterval(tickTimer, 250);
  renderTimer();
}
function tickTimer() {
  if (!timer || timer.paused || timer.done) return;
  timer.left = Math.max(0, Math.round((timer.end - Date.now()) / 1000));
  if (!timer.left) {
    timer.done = true;
    clearInterval(timerTick);
    wakeLock?.release?.().catch(() => {}); wakeLock = null;
    beep(3);
    celebrate(timer.label ? `Tempo! ${timer.label}` : 'Tempo! Muito bem!', true);
  }
  renderTimer();
}
function renderTimer() {
  const el = $('#timer');
  if (!timer) { el.hidden = true; el.innerHTML = ''; return; }
  const mm = String(Math.floor(timer.left / 60)).padStart(2, '0'), ss = String(timer.left % 60).padStart(2, '0');
  el.hidden = false;
  el.innerHTML = `${tucano()}<div class="timer-body">
      ${timer.label ? `<small>${esc(timer.label)}</small>` : ''}
      <b>${timer.done ? 'Acabou!' : `${mm}:${ss}`}</b>
      <span class="timer-bar"><span style="width:${100 - Math.round(timer.left / timer.total * 100)}%"></span></span></div>
    <div class="timer-acts">${timer.done ? '' : `<button class="btn soft small" data-action="timer-pause">${timer.paused ? 'Continuar' : 'Pausar'}</button>`}
      <button class="btn ghost small" data-action="timer-stop">${timer.done ? 'Fechar' : 'Parar'}</button></div>`;
}
function beep(times) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    for (let i = 0; i < times; i++) {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.value = 880; o.connect(g); g.connect(ctx.destination);
      const t0 = ctx.currentTime + i * .35;
      g.gain.setValueAtTime(.0001, t0); g.gain.exponentialRampToValueAtTime(.3, t0 + .02); g.gain.exponentialRampToValueAtTime(.0001, t0 + .25);
      o.start(t0); o.stop(t0 + .3);
    }
  } catch (e) { /* sem som */ }
}

// ---------- Diálogos ----------
const dlg = $('#dlg'), dlgForm = $('#dlgForm');
let dlgHandler = null;
function openDlg(title, body, onOk, okLabel = 'Salvar', extra = '') {
  dlgForm.innerHTML = `<h2>${title}</h2>${body}<div class="dlg-actions">${extra}<span class="spacer"></span>
    <button type="button" class="btn ghost" data-action="dlg-cancel">${onOk ? 'Cancelar' : 'Fechar'}</button>
    ${onOk ? `<button class="btn primary">${okLabel}</button>` : ''}</div>`;
  dlgHandler = onOk;
  if (!dlg.open) dlg.showModal();
  dlgForm.scrollTop = 0;
}
dlgForm.addEventListener('submit', e => {
  e.preventDefault();
  if (dlgHandler && dlgHandler(new FormData(dlgForm)) === false) return;
  dlg.close();
  render();
});
const field = (label, html, id) => `<label class="field" for="${id}"><span>${label}</span>${html}</label>`;
const memberChecks = (selected, list = members()) => `<div class="opts">${list.map(m => `<label>
  <input type="checkbox" name="members" value="${m.id}" ${selected.includes(m.id) ? 'checked' : ''}>${avatar(m, 'mini')} ${esc(m.name)}</label>`).join('')}</div>`;
const opt = (list, cur) => list.map(([k, l]) => `<option value="${k}" ${k === cur ? 'selected' : ''}>${l}</option>`).join('');
const iconPicker = (cur, keys = Object.keys(ICONS)) => `<div class="field"><span>Figura</span><div class="icon-pick">${keys.map(k =>
  `<label title="${esc(ICONS[k][0])}"><input type="radio" name="icon" value="${k}" ${k === cur ? 'checked' : ''}>${icon(k)}</label>`).join('')}</div></div>`;

function askConfirm(msg, onYes, yesLabel = 'Sim') {
  openDlg('Tem certeza?', `<p>${esc(msg)}</p>`, () => { setTimeout(onYes); }, yesLabel);
}
function withPin(then) {
  if (unlocked) return then();
  openDlg('PIN dos pais', field('Digite o PIN', '<input type="password" id="f-pin" name="pin" inputmode="numeric" autocomplete="off" required>', 'f-pin'), fd => {
    if (fd.get('pin') !== C().pin) { toast('PIN incorreto'); return false; }
    unlocked = true;
    setTimeout(then);
  }, 'Entrar');
}

function editMember(id) {
  const m = member(id) || { name: '', color: COLORS[members().length % COLORS.length], adult: false, photo: '' };
  openDlg(id ? 'Editar pessoa' : 'Nova pessoa',
    field('Nome', `<input type="text" id="f-name" name="name" value="${esc(m.name)}" required>`, 'f-name') +
    `<div class="field"><span>Foto (opcional)</span><div class="photo-row">${avatar(m)}<input type="file" id="f-photo" accept="image/*">
      ${m.photo ? '<label><input type="checkbox" name="nophoto"> Tirar foto</label>' : ''}</div></div>` +
    `<div class="field"><span>Cor</span><div class="opts">${COLORS.map(c => `<label class="swatch" style="background:${c}">
      <input type="radio" name="color" value="${c}" ${c === m.color ? 'checked' : ''}></label>`).join('')}</div></div>` +
    `<div class="field"><div class="opts"><label><input type="checkbox" name="adult" ${m.adult ? 'checked' : ''}> Adulto (faz as tarefas da casa)</label></div></div>`,
    fd => {
      const data = { name: fd.get('name').trim(), color: fd.get('color') || m.color, adult: fd.has('adult'), photo: fd.has('nophoto') ? '' : (pendingPhoto ?? m.photo ?? '') };
      pendingPhoto = null;
      if (id) Object.assign(m, data); else C().members.push({ id: uid(), ...data });
      saveConfig();
    }, 'Salvar',
    id ? `<button type="button" class="btn danger" data-action="del-member" data-id="${id}">Excluir</button>` : '');
}
// Foto: recorta quadrada e reduz para caber nos dados da página.
let pendingPhoto = null;
// Tempo médio digitado: sugere os pontos na hora.
dlgForm.addEventListener('input', e => {
  if (e.target.name !== 'minutes' || !e.target.value) return;
  const pts = dlgForm.querySelector('input[name=points]');
  if (pts) pts.value = pointsFor(parseInt(e.target.value, 10));
});
dlgForm.addEventListener('change', e => {
  if (e.target.id === 'f-rphoto' && e.target.files[0]) {
    const img = new Image();
    img.onload = () => {
      const max = 720, scale = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = Math.round(img.width * scale); c.height = Math.round(img.height * scale);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      pendingRecipePhoto = c.toDataURL('image/jpeg', .75);
      const prev = dlgForm.querySelector('.recipe-thumb');
      if (prev) prev.outerHTML = `<img class="recipe-thumb" src="${pendingRecipePhoto}" alt="">`;
      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(e.target.files[0]);
  }
  if (e.target.id === 'f-photo' && e.target.files[0]) {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas'), s = 160, side = Math.min(img.width, img.height);
      c.width = c.height = s;
      c.getContext('2d').drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, s, s);
      pendingPhoto = c.toDataURL('image/jpeg', .82);
      const prev = dlgForm.querySelector('.photo-row .avatar');
      if (prev) prev.outerHTML = `<img class="avatar" src="${pendingPhoto}" alt="">`;
      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(e.target.files[0]);
  }
  if (e.target.name === 'minutes' && e.target.value) {
    const pts = dlgForm.querySelector('input[name=points]');
    if (pts) pts.value = pointsFor(parseInt(e.target.value, 10));
  }
  if (e.target.name === 'when') {
    const v = e.target.value;
    dlgForm.querySelector('.when-weekly').hidden = v !== 'weekly';
    dlgForm.querySelector('.when-interval').hidden = v !== 'interval';
    dlgForm.querySelector('.when-once').hidden = v !== 'once';
  }
  if (e.target.name === 'house') {
    dlgForm.querySelector('.who-members').hidden = e.target.checked;
    dlgForm.querySelector('.house-group').hidden = !e.target.checked;
  }
});

function editTask(id, onDay) {
  const t = C().tasks.find(x => x.id === id) || { title: '', icon: 'estrela', points: 5, note: '', time: '', period: 'livre', memberIds: [], house: false, days: ALL_DAYS, alert: false, date: onDay };
  const rep0 = t.date ? 'once' : t.repeat === 'interval' ? 'interval' : 'weekly';
  openDlg(id ? 'Editar tarefa' : onDay ? `Nova tarefa · ${esc(dayLabel(onDay))}` : 'Nova tarefa fixa',
    field('Tarefa', `<input type="text" id="f-title" name="title" value="${esc(t.title)}" required>`, 'f-title') +
    iconPicker(t.icon) +
    `<div class="field"><span>Para quem</span><div class="opts"><label><input type="checkbox" name="house" ${t.house ? 'checked' : ''}> Rotina da casa (Gabriele ou Bruno marcam quem fez)</label></div>
      <div class="who-members" ${t.house ? 'hidden' : ''}>${memberChecks(t.house ? [] : t.memberIds)}</div>
      <label class="field house-group" for="f-group" ${t.house ? '' : 'hidden'}><span>Grupo da casa</span><select id="f-group" name="group">${opt(GROUPS, t.group || 'limpeza')}</select></label></div>` +
    field('Repetição', `<select id="f-when" name="when">
      <option value="weekly" ${rep0 === 'weekly' ? 'selected' : ''}>Toda semana, nos dias abaixo</option>
      <option value="interval" ${rep0 === 'interval' ? 'selected' : ''}>A cada… (conta da última vez que foi feita)</option>
      <option value="once" ${rep0 === 'once' ? 'selected' : ''}>Tarefa única (não se repete)</option></select>`, 'f-when') +
    `<div class="field when-weekly" ${rep0 === 'weekly' ? '' : 'hidden'}><span>Dias</span><div class="opts">${WEEK_ORDER.map(d => `<label>
      <input type="checkbox" name="days" value="${d}" ${rep0 === 'weekly' && t.days.includes(d) ? 'checked' : ''}>${DAYS[d]}</label>`).join('')}</div></div>` +
    `<div class="when-interval" ${rep0 === 'interval' ? '' : 'hidden'}><div class="field-row">
      ${field('A cada', `<input type="number" id="f-every" name="every" min="1" max="365" value="${t.every || 2}">`, 'f-every')}
      ${field('&nbsp;', `<select id="f-unit" name="unit">${opt(UNITS, t.unit || 'semanas')}</select>`, 'f-unit')}
      ${field('No dia da semana', `<select id="f-wd" name="weekday"><option value="">Qualquer dia</option>${WEEK_ORDER.map(d => `<option value="${d}" ${String(t.weekday) === String(d) ? 'selected' : ''}>${DAYS[d]}</option>`).join('')}</select>`, 'f-wd')}</div>
      ${field('Próxima vez', `<input type="date" id="f-start" name="start" value="${esc(rep0 === 'interval' ? nextDue(t) : today())}">`, 'f-start')}
      ${t.last ? `<p class="legend">Última vez: ${esc(fmtDay(t.last, { weekday: 'short', day: '2-digit', month: '2-digit' }))}</p>` : ''}</div>` +
    `<label class="field when-once" for="f-date" ${rep0 === 'once' ? '' : 'hidden'}><span>Data</span><input type="date" id="f-date" name="date" value="${esc(t.date || today())}"></label>` +
    `<div class="field-row">${field('Horário (opcional)', `<input type="time" id="f-time" name="time" value="${esc(t.time)}">`, 'f-time')}
      ${field('Bloco do dia', `<select id="f-period" name="period">${opt(PERIODS, t.period)}</select>`, 'f-period')}
      ${field('Pontos', `<input type="number" id="f-points" name="points" min="0" max="1000" value="${t.points}" required>`, 'f-points')}</div>` +
    `<div class="field-row">${field('Tempo médio (min) · ajusta os pontos', `<input type="number" id="f-min" name="minutes" min="0" max="600" value="${t.minutes || ''}" placeholder="Ex.: 15">`, 'f-min')}
      ${field('Cômodo (saúde da casa)', `<select id="f-room" name="room"><option value="">Nenhum</option>${opt(ROOMS, t.room || '')}</select>`, 'f-room')}</div>` +
    field('Observação (opcional)', `<input type="text" id="f-note" name="note" value="${esc(t.note)}" placeholder="Ex.: o que levar, quantidade">`, 'f-note') +
    `<div class="field"><div class="opts"><label><input type="checkbox" name="alert" ${t.alert ? 'checked' : ''}> Mostrar no aviso do tucano (compromisso importante)</label></div></div>`,
    fd => {
      const time = fd.get('time') || '', when = fd.get('when'), once = when === 'once', interval = when === 'interval', house = fd.has('house');
      const data = {
        title: fd.get('title').trim(), icon: fd.get('icon') || 'estrela', note: fd.get('note').trim(),
        points: Math.max(0, parseInt(fd.get('points'), 10) || 0), time, period: time ? periodOf(time) : fd.get('period'),
        minutes: Math.max(0, parseInt(fd.get('minutes'), 10) || 0) || undefined, room: fd.get('room') || undefined,
        house, memberIds: house ? adults().map(m => m.id) : fd.getAll('members'), alert: fd.has('alert'),
        ...(house ? { group: fd.get('group') || 'outras' } : {}),
        days: when === 'weekly' ? fd.getAll('days').map(Number) : [],
      };
      if (!data.memberIds.length) { toast('Escolha para quem é a tarefa'); return false; }
      if (once && !fd.get('date')) { toast('Escolha a data'); return false; }
      if (interval && !fd.get('start')) { toast('Escolha quando é a próxima vez'); return false; }
      if (when === 'weekly' && !data.days.length) { toast('Escolha pelo menos um dia'); return false; }
      const target = id ? t : { id: uid() };
      const prevStart = rep0 === 'interval' ? nextDue(t) : '', prevDate = t.date;
      Object.assign(target, data);
      for (const key of ['date', 'repeat', 'every', 'unit', 'weekday', 'start']) delete target[key];
      if (once) { target.date = fd.get('date'); if (fd.get('date') !== prevDate) { delete target.last; delete target.prevLast; } }
      if (interval) {
        Object.assign(target, { repeat: 'interval', every: Math.max(1, parseInt(fd.get('every'), 10) || 1), unit: fd.get('unit'), weekday: fd.get('weekday'), start: fd.get('start') });
        // Se a próxima data foi mudada à mão, ela passa a valer.
        if (fd.get('start') !== prevStart) { delete target.last; delete target.prevLast; }
      }
      if (when === 'weekly') { delete target.last; delete target.prevLast; }
      if (!id) C().tasks.push(target);
      saveConfig();
      toast('Tarefa salva');
    }, 'Salvar',
    id ? `<button type="button" class="btn danger" data-action="del-task" data-id="${id}">Excluir</button>` : '');
}

// Mudanças só para um dia: nota, repassar, não precisa, mudar de dia.
function dayMenu(k, taskId) {
  const base = C().tasks.find(x => x.id === taskId);
  if (!base) return;
  const o = dayDoc(k).notes?.[taskId] || {};
  const current = o.memberIds || base.memberIds;
  openDlg(`${esc(base.title)}<small class="dlg-sub">${esc(dayLabel(k))} · ${esc(fmtDay(k, { day: 'numeric', month: 'long' }))}</small>`,
    field('Nota para este dia', `<input type="text" id="f-dnote" name="note" value="${esc(o.note || '')}" placeholder="Ex.: lavei na quarta porque a Sophie fez xixi">`, 'f-dnote') +
    (base.house ? '' : `<div class="field"><span>Quem faz neste dia</span>${memberChecks(current)}</div>`) +
    `<div class="field"><div class="opts"><label><input type="checkbox" name="skip" ${o.skip ? 'checked' : ''}> Não precisa fazer neste dia</label></div></div>` +
    field('Mudar para outro dia (opcional)', `<input type="date" id="f-move" name="move" min="${today()}">`, 'f-move'),
    fd => {
      const note = fd.get('note').trim(), move = fd.get('move');
      const ms = base.house ? base.memberIds : fd.getAll('members');
      if (!ms.length) { toast('Escolha pelo menos uma pessoa'); return false; }
      const passed = base.house || ms.slice().sort().join() === base.memberIds.slice().sort().join() ? undefined : ms;
      if (move && move !== k) {
        if (isFlexible(base)) {
          if (base.date) base.date = move; else { base.start = move; delete base.last; delete base.prevLast; }
          setNote(move, taskId, { note, memberIds: passed });
          setNote(k, taskId, {});
        } else {
          const copy = { ...clone(base), id: uid(), days: [], date: move, alert: false };
          C().tasks.push(copy);
          setNote(move, copy.id, { note: note || `Mudou de ${shortDay(k)}`, memberIds: passed });
          setNote(k, taskId, { skip: true, note: note || `Mudou para ${shortDay(move)}` });
        }
        saveConfig();
        toast(`Mudou para ${dayLabel(move).toLowerCase()}`);
        return;
      }
      setNote(k, taskId, { note, skip: fd.has('skip'), memberIds: passed });
      toast('Anotado');
    }, 'Salvar',
    `<button type="button" class="btn soft" data-action="edit-task" data-id="${taskId}">Mudar a tarefa fixa</button>`);
}
function setNote(k, id, o) {
  const d = S.days[k] = S.days[k] || { date: k, done: {}, notes: {} };
  d.notes ||= {};
  const clean = {};
  if (o.note) clean.note = o.note;
  if (o.skip) clean.skip = true;
  if (o.memberIds) clean.memberIds = o.memberIds;
  if (Object.keys(clean).length) d.notes[id] = clean; else delete d.notes[id];
  saveDay(k);
}

function editAgenda(id, preset = {}) {
  const a = S.agenda[id] || { kind: 'lembrete', date: addDays(today(), 1), time: '', title: '', icon: 'recado', memberIds: [], note: '', ...preset };
  if (!id && a.kind === 'compromisso' && a.icon === 'recado') a.icon = 'calendario';
  openDlg(id ? 'Editar' : a.kind === 'lembrete' ? 'Novo lembrete' : 'Novo compromisso',
    field('O quê', `<input type="text" id="f-atitle" name="title" value="${esc(a.title)}" required placeholder="Ex.: Não precisa levar lancheira, festa no Kindergarten">`, 'f-atitle') +
    `<div class="field-row">${field('Dia', `<input type="date" id="f-adate" name="date" value="${esc(a.date)}" required>`, 'f-adate')}
      ${field('Horário (opcional)', `<input type="time" id="f-atime" name="time" value="${esc(a.time)}">`, 'f-atime')}
      ${field('Tipo', `<select id="f-akind" name="kind">${opt(KINDS, a.kind)}</select>`, 'f-akind')}</div>` +
    `<div class="field"><span>Para quem (opcional)</span>${memberChecks(a.memberIds || [])}</div>` +
    field('Observação (opcional)', `<input type="text" id="f-anote" name="note" value="${esc(a.note)}" placeholder="Ex.: levar presente">`, 'f-anote') +
    iconPicker(a.icon || 'recado', AGENDA_ICONS),
    fd => {
      const data = { kind: fd.get('kind'), title: fd.get('title').trim(), date: fd.get('date'), time: fd.get('time') || '',
        memberIds: fd.getAll('members'), note: fd.get('note').trim(), icon: fd.get('icon') || 'recado' };
      const key = id || uid();
      S.agenda[key] = { id: key, ...data };
      saveAgenda(key);
      toast(`Anotado para ${dayLabel(data.date).toLowerCase()}`);
    }, 'Salvar',
    id ? `<button type="button" class="btn danger" data-action="del-agenda" data-id="${id}">Excluir</button>` : '');
}

function editReward(id) {
  const r = (C().rewards || []).find(x => x.id === id) || { title: '', icon: 'presente', cost: 50 };
  openDlg(id ? 'Editar prêmio' : 'Novo prêmio',
    field('Prêmio', `<input type="text" id="f-rtitle" name="title" value="${esc(r.title)}" required>`, 'f-rtitle') +
    field('Custa quantos pontos', `<input type="number" id="f-cost" name="cost" min="1" max="100000" value="${r.cost}" required>`, 'f-cost') +
    iconPicker(r.icon),
    fd => {
      const data = { title: fd.get('title').trim(), icon: fd.get('icon') || 'presente', cost: Math.max(1, parseInt(fd.get('cost'), 10) || 1) };
      if (id) Object.assign(r, data); else (C().rewards ||= []).push({ id: uid(), ...data });
      saveConfig();
    }, 'Salvar',
    id ? `<button type="button" class="btn danger" data-action="del-reward" data-id="${id}">Excluir</button>` : '');
}

function addLedger(entry) {
  const m = monthOf(today());
  const l = S.ledger[m] = S.ledger[m] || { month: m, entries: [] };
  l.entries.push({ id: uid(), t: Date.now(), day: today(), ...entry });
  saveLedger(m);
}
function redeem(id) {
  const r = C().rewards.find(x => x.id === id);
  const who = members().map(m => {
    const b = balance(m.id);
    return `<label><input type="radio" name="member" value="${m.id}" ${b < r.cost ? 'disabled' : ''} required>${avatar(m, 'mini')} ${esc(m.name)} (${b})</label>`;
  }).join('');
  openDlg(`${esc(r.title)} · ${r.cost} pontos`,
    `<div class="field"><span>Quem vai trocar?</span><div class="opts">${who}</div></div>` +
    (unlocked ? '' : field('PIN dos pais', '<input type="password" id="f-rpin" name="pin" inputmode="numeric" autocomplete="off" required>', 'f-rpin')),
    fd => {
      if (!unlocked && fd.get('pin') !== C().pin) { toast('PIN incorreto'); return false; }
      const mid = fd.get('member');
      if (!mid || balance(mid) < r.cost) { toast('Pontos insuficientes'); return false; }
      addLedger({ memberId: mid, type: 'reward', label: `Trocou: ${r.title}`, points: -r.cost });
      celebrate(`${member(mid).name} ganhou: ${r.title}!`, true);
    }, 'Trocar');
}
function bonus() {
  openDlg('Dar ou tirar pontos',
    field('Pessoa', `<select id="f-bm" name="member">${members().map(m => `<option value="${m.id}">${esc(m.name)}</option>`).join('')}</select>`, 'f-bm') +
    field('Pontos (negativo para tirar)', '<input type="number" id="f-bp" name="points" value="10" required>', 'f-bp') +
    field('Motivo', '<input type="text" id="f-bl" name="label" placeholder="Ex.: Ajudou a irmã" required>', 'f-bl'),
    fd => {
      const points = parseInt(fd.get('points'), 10) || 0;
      if (!points) { toast('Informe os pontos'); return false; }
      addLedger({ memberId: fd.get('member'), type: 'bonus', label: fd.get('label').trim(), points });
    }, 'Confirmar');
}

// ---------- Marcar tarefas ----------
function toggle(k, taskId, mid) {
  const t = tasksOn(k, true).find(x => x.id === taskId);
  if (!t || t.skip) return;
  const v = doneOf(k, t, mid);
  if (v) {
    const by = member(v.by);
    return askConfirm(`Desmarcar "${t.title}"${by ? ` de ${by.name}` : ''}?`, () => {
      delete S.days[k].done[keyOf(t, mid)];
      saveDay(k);
      const base = C().tasks.find(x => x.id === t.id);
      if (base && isFlexible(base) && base.last === k && !doneOnDay(base, k)) {
        if (base.prevLast) base.last = base.prevLast; else delete base.last;
        delete base.prevLast;
        saveConfig();
      }
      render();
    }, 'Desmarcar');
  }
  if (t.house) {
    const opts = t.memberIds.map(member).filter(Boolean);
    if (opts.length === 1) return complete(k, t, opts[0].id);
    return openDlg(`Quem fez?<small class="dlg-sub">${esc(t.title)}</small>`, `<div class="who-pick">${opts.map(m =>
      `<button type="button" data-action="did-it" data-day="${k}" data-task="${t.id}" data-member="${m.id}">${avatar(m, 'xl')}<span>${esc(m.name)}</span></button>`).join('')}</div>`);
  }
  complete(k, t, mid);
}
function complete(k, t, mid) {
  const m = member(mid);
  if (!m || !t) return;
  const d = S.days[k] = S.days[k] || { date: k, done: {}, notes: {} };
  d.done ||= {};
  const pending = needsApproval(m);
  d.done[keyOf(t, mid)] = { by: mid, t: k === today() ? Date.now() : parseDay(k).getTime() + 12 * 3600e3, pts: t.points, title: t.title, ...(pending ? { pending: true } : {}) };
  saveDay(k);
  // Repetição "a cada…" e tarefa única: guarda quando foi feita (a próxima vez conta daqui).
  const base = C().tasks.find(x => x.id === t.id);
  if (base && isFlexible(base) && (!base.last || k >= base.last)) {
    base.prevLast = base.last || '';
    base.last = k;
    saveConfig();
  }
  const left = t.house ? 1 : ownOn(k, mid).filter(x => !doneOf(k, x, mid)).length;
  celebrate(left ? (pending ? `${m.name}: feito! Falta a mamãe ou o papai confirmar` : `+${t.points} ${m.name}`) : `${m.name} terminou tudo!`, !left);
  render();
}

// Backup: um arquivo com todos os dados (tarefas, dias, lembretes, receitas, cardápios, pontos).
async function exportData() {
  const filename = `familia-backup-${today()}.json`, data = JSON.stringify(S, null, 2);
  if (window.claude?.use) {
    // Dentro do claude.ai a página não pode baixar sozinha: o Claude pede para você confirmar o arquivo.
    const dl = await window.claude.use('downloads').catch(() => null);
    if (!dl) return toast('Não foi possível baixar o backup aqui.');
    try { await dl.save({ filename, data }); toast('Backup salvo'); }
    catch (e) { if (e?.code === 'rate_limited') toast('Já tem um pedido de download aberto'); else if (e?.code !== 'declined') toast('Não foi possível baixar o backup.'); }
    return;
  }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([data], { type: 'application/json' }));
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
// Restaurar: grava de volta cada parte (na página, documento por documento).
function restoreData(data) {
  S = { ...S, ...data };
  if (mode !== 'db') return saveLocal();
  saveConfig();
  Object.keys(S.days || {}).forEach(saveDay);
  Object.keys(S.ledger || {}).forEach(saveLedger);
  put('meta/archive', S.archive || { points: {}, through: '' });
  COLLECTIONS.forEach(col => Object.keys(S[col] || {}).forEach(id => saveItem(col, id)));
}
$('#importFile').addEventListener('change', async e => {
  const file = e.target.files[0];
  e.target.value = '';
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    if (!data.config?.members) throw new Error();
    askConfirm('Restaurar este backup? Os dados que estão nele substituem os atuais.', () => { restoreData(data); render(); toast('Backup restaurado'); }, 'Restaurar');
  } catch { toast('Arquivo de backup inválido'); }
});

function removeFrom(list, id, msg) {
  askConfirm(msg, () => {
    C()[list] = C()[list].filter(x => x.id !== id);
    if (list === 'members') C().tasks = C().tasks.map(t => ({ ...t, memberIds: t.memberIds.filter(x => x !== id) })).filter(t => t.memberIds.length);
    saveConfig();
    render();
  }, 'Excluir');
}

const actions = {
  'tab': el => { tab = el.dataset.tab; if (tab !== 'hoje' && tab !== 'casa') editMode = false; if (tab === 'casa') houseDay = viewDay; render(); scrollTo(0, 0); },
  'day': el => { const n = Number(el.dataset.n); viewDay = n ? addDays(viewDay, n) : today(); render(); },
  'goto-day': el => { viewDay = el.dataset.day; tab = 'hoje'; render(); scrollTo(0, 0); },
  'week': el => { const n = Number(el.dataset.n); weekFrom = n ? addDays(weekFrom, n) : mondayOf(today()); render(); },
  'house-day': el => { houseDay = el.dataset.day; render(); },
  'house-week': el => { const n = Number(el.dataset.n); houseDay = n ? addDays(houseDay, n) : today(); render(); },
  'room': el => roomDialog(el.dataset.room),
  'late-done': el => { dlg.close(); lateDone(el.dataset.task); },
  'approve': el => withPin(() => { setApproval(el.dataset.day, el.dataset.key, true); toast('Aprovado'); render(); }),
  'reject': el => withPin(() => { setApproval(el.dataset.day, el.dataset.key, false); render(); }),
  'approve-all': () => withPin(() => {
    const list = pendingList();
    const days = new Set(list.map(p => p.k));
    list.forEach(p => { S.days[p.k].done[p.key] = { ...S.days[p.k].done[p.key], pending: false }; });
    days.forEach(saveDay);
    celebrate(`${list.length} tarefa${list.length > 1 ? 's' : ''} aprovada${list.length > 1 ? 's' : ''}!`);
    render();
  }),
  'new-recado': newRecado,
  'del-recado': el => askConfirm('Apagar este recado?', () => { delete S.recados[el.dataset.id]; saveItem('recados', el.dataset.id); render(); }, 'Apagar'),
  'settings': () => openDlg('Aprovação dos pais',
    `<div class="field"><div class="opts column"><label><input type="checkbox" name="approval" ${C().approval !== false ? 'checked' : ''}> Pais aprovam as tarefas das crianças antes de dar os pontos</label></div></div>`,
    fd => { C().approval = fd.has('approval'); saveConfig(); }),
  'timer': () => timerDialog(),
  'timer-pause': () => {
    if (!timer) return;
    if (timer.paused) { timer.end = Date.now() + timer.left * 1000; timer.paused = false; } else timer.paused = true;
    renderTimer();
  },
  'timer-stop': () => { timer = null; clearInterval(timerTick); wakeLock?.release?.().catch(() => {}); wakeLock = null; renderTimer(); },
  'toggle-house': () => {
    houseOpen = !houseOpen;
    try { localStorage.setItem(KEY + '-casa-aberta', houseOpen ? '1' : '0'); } catch (e) { /* sem armazenamento */ }
    render();
  },
  'new-priority': () => editPriority(),
  'edit-priority': el => editPriority(el.dataset.id),
  'toggle-priority': el => {
    const p = S.priorities[el.dataset.id];
    if (!p) return;
    S.priorities[p.id] = { ...p, done: !p.done, doneOn: !p.done ? today() : '' };
    saveItem('priorities', p.id);
    if (!p.done) celebrate('Prioridade resolvida!');
    render();
  },
  'del-priority': el => askConfirm('Excluir esta prioridade?', () => { delete S.priorities[el.dataset.id]; saveItem('priorities', el.dataset.id); render(); }, 'Excluir'),
  'menu-view': el => { menuView = el.dataset.v; render(); scrollTo(0, 0); },
  'menu-week': el => { const n = Number(el.dataset.n); menuWeek = n ? addDays(menuWeek, n) : mondayOf(today()); render(); },
  'pick-meal': el => pickMeal(el.dataset.day, el.dataset.meal),
  'clear-meal': el => { dlg.close(); setMeal(mondayOf(el.dataset.day), el.dataset.day, el.dataset.meal, null); render(); },
  'toggle-lunch': el => { const k = el.dataset.day, on = el.checked; editMenu(mondayOf(k), doc => { (doc.days[k] ||= {}).lunch = on; }); render(); },
  'copy-last-week': copyLastWeek,
  'save-template': saveTemplate,
  'use-template': useTemplate,
  'del-template': () => {
    const id = dlgForm.querySelector('input[name=tpl]:checked')?.value;
    if (!id) return toast('Marque qual cardápio apagar');
    askConfirm(`Apagar o cardápio “${S.templates[id]?.name}”?`, () => { delete S.templates[id]; saveItem('templates', id); render(); }, 'Apagar');
  },
  'edit-recipe': el => editRecipe(el.dataset.id),
  'show-recipe': el => showRecipe(el.dataset.id),
  'del-recipe': el => askConfirm('Excluir esta receita?', () => { delete S.recipes[el.dataset.id]; saveItem('recipes', el.dataset.id); render(); }, 'Excluir'),
  'toggle-shop': el => {
    const key = el.dataset.key;
    editShop(menuWeek, doc => {
      if (key.startsWith('x:')) { const x = doc.extras.find(e => e.id === key.slice(2)); if (x) x.checked = !x.checked; }
      else if (doc.checked[key]) delete doc.checked[key]; else doc.checked[key] = true;
    });
    render();
  },
  'add-shop': () => openDlg('Adicionar à lista', field('Item', '<input type="text" id="f-shop" name="text" required placeholder="Ex.: 2 rolos de papel toalha">', 'f-shop'), fd => {
    editShop(menuWeek, doc => doc.extras.push({ id: uid(), text: fd.get('text').trim(), checked: false }));
  }, 'Adicionar'),
  'del-shop': el => { editShop(menuWeek, doc => { doc.extras = doc.extras.filter(x => x.id !== el.dataset.id); }); render(); },
  'uncheck-shop': () => { editShop(menuWeek, doc => { doc.checked = {}; doc.extras.forEach(x => { x.checked = false; }); }); render(); },
  'week-who': el => { weekWho = el.dataset.v; render(); },
  'week-cell': el => {
    if (!unlocked) return toast('Entre em Editar (PIN) para corrigir a semana');
    if (el.dataset.day > today()) return toast('Esse dia ainda não chegou');
    toggle(el.dataset.day, el.dataset.task, el.dataset.member);
  },
  'past-agenda': () => { showPast = !showPast; render(); },
  'edit-mode': () => editMode ? (editMode = false, render()) : withPin(() => { editMode = true; render(); }),
  'task': el => {
    const k = el.dataset.day;
    if (editMode) return dayMenu(k, el.dataset.task);
    if (k > today()) return toast('Esse dia ainda não chegou. Use Editar para planejar.');
    toggle(k, el.dataset.task, el.dataset.member);
  },
  'did-it': el => { dlg.close(); complete(el.dataset.day, tasksOn(el.dataset.day).find(t => t.id === el.dataset.task), el.dataset.member); },
  'redeem': el => redeem(el.dataset.id),
  'unlock': () => withPin(render),
  'lock': () => { unlocked = false; editMode = false; tab = 'hoje'; render(); },
  'setup': () => { S.config = { pin: '1234', members: [], tasks: [], rewards: [] }; saveConfig(); unlocked = true; tab = 'config'; render(); },
  'edit-member': el => withPin(() => editMember(el.dataset.id)),
  'edit-task': el => withPin(() => editTask(el.dataset.id)),
  'new-task': el => withPin(() => editTask(undefined, el.dataset.day)),
  'edit-reward': el => withPin(() => editReward(el.dataset.id)),
  'new-agenda': el => editAgenda(undefined, { ...(el.dataset.day ? { date: el.dataset.day } : {}), ...(el.dataset.kind ? { kind: el.dataset.kind } : {}) }),
  'edit-agenda': el => editAgenda(el.dataset.id),
  'del-agenda': el => askConfirm('Excluir este lembrete?', () => { delete S.agenda[el.dataset.id]; saveAgenda(el.dataset.id); render(); }, 'Excluir'),
  'del-member': el => removeFrom('members', el.dataset.id, `Excluir ${member(el.dataset.id)?.name}? As tarefas só dessa pessoa também saem.`),
  'del-task': el => removeFrom('tasks', el.dataset.id, 'Excluir esta tarefa de vez?'),
  'del-reward': el => removeFrom('rewards', el.dataset.id, 'Excluir este prêmio?'),
  'cfg-who': el => { cfgWho = el.dataset.v; render(); },
  'cfg-day': el => { cfgDay = el.dataset.v; render(); },
  'bonus': bonus,
  'reset-points': () => askConfirm('Zerar os pontos de todo mundo? O histórico de tarefas feitas também é apagado.', () => {
    Object.keys(S.days).forEach(k => { S.days[k].done = {}; saveDay(k); });
    Object.keys(S.ledger).forEach(m => { delete S.ledger[m]; saveLedger(m); });
    S.archive = { points: {}, through: S.archive.through || '' };
    put('meta/archive', S.archive);
    render();
  }, 'Zerar'),
  'change-pin': () => openDlg('Trocar PIN', field('Novo PIN (4 a 8 números)', '<input type="password" id="f-npin" name="pin" inputmode="numeric" pattern="[0-9]{4,8}" required>', 'f-npin'),
    fd => { C().pin = fd.get('pin'); saveConfig(); toast('PIN alterado'); }),
  'export': exportData,
  'import': () => $('#importFile').click(),
  'dlg-cancel': () => { pendingPhoto = null; dlg.close(); },
};
document.addEventListener('click', e => {
  lastActivity = Date.now();
  const el = e.target.closest('[data-action]');
  if (el && actions[el.dataset.action]) actions[el.dataset.action](el);
});

// ---------- Efeitos ----------
let toastTimer;
function toast(msg, withMascot = false) {
  document.querySelector('.toast')?.remove();
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = (withMascot ? tucano() : '') + `<span>${esc(msg)}</span>`;
  document.body.appendChild(el);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.remove(), 2400);
}
function celebrate(msg, big = false) {
  toast(msg, true);
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (big) {
    const j = document.createElement('div');
    j.className = 'mascot-fly';
    j.innerHTML = tucano();
    document.body.appendChild(j);
    setTimeout(() => j.remove(), 1900);
  }
  const colors = ['#fcc934', '#8fd6b6', '#8fb3e8', '#e8a0b4', '#b9a6ee'];
  for (let i = 0; i < 18; i++) {
    const s = document.createElement('span');
    s.className = 'confetti';
    s.style.background = colors[i % colors.length];
    s.style.left = innerWidth / 2 + 'px';
    s.style.top = innerHeight * .65 + 'px';
    s.style.setProperty('--dx', (Math.random() - .5) * 520 + 'px');
    s.style.setProperty('--dy', -(140 + Math.random() * 320) + 'px');
    s.style.setProperty('--r', (Math.random() - .5) * 720 + 'deg');
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 1100);
  }
}

setInterval(() => {
  if (today() !== lastDay) {
    if (viewDay === lastDay) viewDay = today();
    lastDay = today();
    if (loaded) maintenance();
    if (!dlg.open) render();
  }
  if (unlocked && Date.now() - lastActivity > LOCK_AFTER && !dlg.open) {
    unlocked = false; editMode = false; if (tab === 'config') tab = 'hoje'; render();
  }
}, 60000);

connect();
if ('serviceWorker' in navigator && location.protocol === 'https:' && !window.claude) navigator.serviceWorker.register('sw.js').catch(() => {});
