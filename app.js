// Família Pinheiro Bernt Eymael — tarefas, rotina das crianças, agenda e pontos.
// Os dados ficam no banco compartilhado da página (quando aberta pelo claude.ai) ou no próprio aparelho.

const KEY = 'familia-pbe-v1';
const PERIODS = [['manha', 'Manhã'], ['tarde', 'Tarde'], ['noite', 'Noite'], ['livre', 'Qualquer hora']];
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
let S = { config: null, days: {}, agenda: {}, ledger: {}, archive: { points: {}, through: '' } };
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
const saveLedger = m => put('ledger/' + m, S.ledger[m] || null);

async function connect() {
  if (!window.claude?.use) { mode = 'local'; loadLocal(); return start(); }
  render();
  let d = null;
  try { d = await window.claude.use('db'); } catch (e) { d = null; }
  if (!d) { mode = 'local'; loadLocal(); return start(); }
  db = d; mode = 'db';
  const ready = new Set();
  const done = name => { ready.add(name); if (ready.size === 5 && !loaded) { loaded = true; maintenance(); } if (loaded) render(); };
  const fail = () => { toast('Sem conexão com os dados da família. Recarregue a página.'); };
  const toMap = q => Object.fromEntries(q.docs.map(x => [x.id, clone(x.data())]));
  db.doc('config/main').onSnapshot(s => { S.config = s.exists ? clone(s.data()) : null; done('config'); }, fail);
  db.collection('days').onSnapshot(q => { S.days = toMap(q); done('days'); }, fail);
  db.collection('agenda').onSnapshot(q => { S.agenda = toMap(q); done('agenda'); }, fail);
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
  if (mode === 'local') saveLocal();
}

// ---------- Consultas ----------
let tab = 'hoje', viewDay = today(), lastDay = today();
let unlocked = false, editMode = false, lastActivity = Date.now();
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
const scheduled = (t, k) => t.date ? t.date === k : t.days.includes(parseDay(k).getDay());
function tasksOn(k, withSkipped = false) {
  const notes = S.days[k]?.notes || {};
  return (C()?.tasks || []).filter(t => scheduled(t, k)).map(t => {
    const o = notes[t.id] || {};
    return { ...t, memberIds: o.memberIds || t.memberIds, dayNote: o.note || '', skip: !!o.skip, passed: !!o.memberIds };
  }).filter(t => withSkipped || !t.skip);
}
const houseOn = (k, ws) => tasksOn(k, ws).filter(t => t.house);
const ownOn = (k, mid, ws) => tasksOn(k, ws).filter(t => !t.house && t.memberIds.includes(mid));
const agendaOn = k => Object.values(S.agenda).filter(a => a.date === k).sort((x, y) => (x.time || '99').localeCompare(y.time || '99'));

// Pontos: dias guardados + total arquivado + prêmios e pontos extras.
function doneEntries() {
  const through = S.archive.through || '';
  return Object.entries(S.days).filter(([k]) => k > through).flatMap(([k, d]) =>
    Object.entries(d.done || {}).map(([key, v]) => ({ day: k, key, t: v.t, memberId: v.by, points: v.pts || 0, label: v.title || '', type: 'task' })));
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
  const tabs = [['hoje', 'Dia', 'dia'], ['semana', 'Semana', 'semana'], ['agenda', 'Agenda', 'agenda'], ['placar', 'Placar', 'placar'], ['premios', 'Prêmios', 'premios'], ['config', 'Ajustes', unlocked ? 'ajustes' : 'cadeado']];
  $('#tabs').innerHTML = tabs.map(([k, l, i]) => `<button class="${tab === k ? 'on' : ''}" data-action="tab" data-tab="${k}">${ui(i)}<span>${l}</span></button>`).join('');
  if (!loaded) { $('#app').innerHTML = `<div class="empty-page">${tucano('big')}<p>Carregando a rotina da família…</p></div>`; return; }
  if (!C()) {
    $('#app').innerHTML = `<div class="empty-page">${tucano('big')}<h2>Nenhuma rotina cadastrada ainda</h2>
      <p>Comece cadastrando as pessoas da casa e as tarefas de cada um.</p><button class="btn primary" data-action="setup">Começar</button></div>`;
    return;
  }
  $('#app').innerHTML = { hoje: viewDayScreen, semana: viewWeek, agenda: viewAgenda, placar: viewScore, premios: viewRewards, config: viewConfig }[tab]();
}

function taskRow(k, t, mid, big) {
  const v = !t.skip && doneOf(k, t, mid);
  const by = t.house && v ? member(v.by) : null;
  const check = by ? avatar(by, 'mini') : `<span class="check">${v ? ui('ok') : ''}</span>`;
  const sub = [t.note ? esc(t.note) : '', t.passed ? `repassada para ${names(t.memberIds)}` : '', t.date ? 'só neste dia' : ''].filter(Boolean).join(' · ');
  return `<button class="task ${big ? 'big' : ''} ${v ? 'done' : ''} ${t.skip ? 'skipped' : ''} ${editMode ? 'editing' : ''}" data-action="task" data-day="${k}" data-task="${t.id}" data-member="${mid || ''}">
    ${icon(t.icon)}
    <span class="text">
      <span class="title">${t.time ? `<span class="time">${esc(t.time)}</span>` : ''}${esc(t.title)}</span>
      ${sub ? `<span class="note">${sub}</span>` : ''}
      ${t.skip ? `<span class="daynote">Não precisa neste dia${t.dayNote ? ': ' + esc(t.dayNote) : ''}</span>` : t.dayNote ? `<span class="daynote">${esc(t.dayNote)}</span>` : ''}
    </span>
    ${editMode ? `<span class="edit-dot">${ui('lapis')}</span>` : check}
  </button>`;
}
function taskList(k, tasks, mid, big) {
  return PERIODS.map(([p, label]) => {
    const list = tasks.filter(t => t.period === p);
    return list.length ? `<div class="period">${label}</div>` + list.map(t => taskRow(k, t, mid, big)).join('') : '';
  }).join('');
}
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
  const house = sortTasks(houseOn(k, editMode));
  const houseReal = house.filter(t => !t.skip);
  const houseDone = houseReal.filter(t => doneOf(k, t)).length;
  const houseCol = `<section class="col house-col">
      <header class="col-head"><span class="avatar house">${ui('casa')}</span>
        <div><h2>Casa</h2><small>${houseDone} de ${houseReal.length} · toque e diga quem fez</small></div></header>
      ${progress(houseDone, houseReal.length, 'var(--accent)')}
      ${house.length ? taskList(k, house, '', false) : '<p class="muted pad">Nada da casa neste dia.</p>'}
      ${skippedList(houseOn(k, true))}
    </section>`;

  const cols = members().map(m => {
    const own = sortTasks(ownOn(k, m.id, editMode));
    const real = own.filter(t => !t.skip);
    const done = real.filter(t => doneOf(k, t, m.id)).length;
    const did = m.adult ? sortTasks(houseOn(k).filter(t => doneOf(k, t)?.by === m.id)) : [];
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
  return `${nav}${editBanner}${futureHint}${banner}<div class="board-wrap"><div class="board" style="--cols:${members().length + 1}">${houseCol}${cols}</div></div>`;
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
    const rows = sortTasks([...seen.values()]);
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

function viewScore() {
  const ws = mondayOf(today()), we = addDays(ws, 7);
  const ranked = members().map(m => ({ m, w: pointsBetween(m.id, ws, we), b: balance(m.id) })).sort((a, b) => b.w - a.w);
  const rows = ranked.map((r, i) => `<div class="rank"><span class="pos">${i + 1}</span>${avatar(r.m)}
      <span class="name">${esc(r.m.name)}</span><span class="rank-pts"><b>${r.w}</b><small>na semana · saldo ${r.b}</small></span></div>`).join('');
  const recent = [...doneEntries(), ...ledgerEntries()].sort((a, b) => b.t - a.t).slice(0, 25).map(e => {
    const m = member(e.memberId);
    const when = new Date(e.t).toLocaleString('pt-BR', { weekday: 'short', hour: '2-digit', minute: '2-digit' });
    return `<li><time>${when}</time>${avatar(m, 'mini')}<span>${esc(e.label)}</span><span class="p ${e.points < 0 ? 'neg' : ''}">${e.points > 0 ? '+' : ''}${e.points}</span></li>`;
  }).join('');
  return `<div class="two">
    <section class="card"><h2>Ranking da semana</h2>${rows}</section>
    <section class="card"><h2>Últimas atividades</h2>${recent ? `<ul class="log">${recent}</ul>` : '<p class="muted">Nenhuma atividade ainda.</p>'}</section>
  </div>`;
}

function viewRewards() {
  const list = C().rewards || [];
  if (!list.length) return `<div class="empty-page">${tucano('big')}<p>Nenhum prêmio cadastrado. Adicione em Ajustes.</p></div>`;
  const best = Math.max(0, ...members().map(m => balance(m.id)));
  return `<div class="rewards">${list.map(r => `<section class="card reward">
      ${icon(r.icon, 'lg')}<div class="title">${esc(r.title)}</div><span class="pill">${star()}${r.cost}</span>
      <button class="btn primary" data-action="redeem" data-id="${r.id}" ${best < r.cost ? 'disabled' : ''}>Trocar pontos</button>
    </section>`).join('')}</div>`;
}

function viewConfig() {
  if (!unlocked) return `<div class="empty-page">${tucano('big')}<p>Área dos pais: pessoas, tarefas e prêmios.</p>
    <button class="btn primary" data-action="unlock">${ui('cadeado')} Entrar com PIN</button></div>`;
  const people = members().map(m => `<div class="row">${avatar(m)}
      <div class="info"><b>${esc(m.name)}</b><small>${m.adult ? 'Adulto' : 'Criança'} · ${balance(m.id)} pontos</small></div>
      <div class="acts"><button class="btn soft" data-action="edit-member" data-id="${m.id}">Editar</button></div></div>`).join('');
  const whoChips = [['todos', 'Todas'], ['casa', 'Casa'], ...members().filter(m => !m.adult || C().tasks.some(t => !t.house && t.memberIds.includes(m.id))).map(m => [m.id, esc(m.name)])]
    .map(([v, l]) => `<button class="chip ${cfgWho === v ? 'on' : ''}" data-action="cfg-who" data-v="${v}">${l}</button>`).join('');
  const dayChips = [['todos', 'Todos os dias'], ...WEEK_ORDER.map(d => [String(d), DAYS[d]]), ['once', 'Só um dia']]
    .map(([v, l]) => `<button class="chip ${cfgDay === v ? 'on' : ''}" data-action="cfg-day" data-v="${v}">${l}</button>`).join('');
  const filtered = C().tasks.filter(t => (cfgWho === 'todos' || (cfgWho === 'casa' ? t.house : !t.house && t.memberIds.includes(cfgWho))) &&
    (cfgDay === 'todos' || (cfgDay === 'once' ? !!t.date : !t.date && t.days.includes(Number(cfgDay)))));
  const sorted = [...sortTasks(filtered.filter(t => !t.house)), ...sortTasks(filtered.filter(t => t.house))];
  const tasks = sorted.map(t => `<div class="row">${icon(t.icon, 'sm')}
      <div class="info"><b>${t.time ? esc(t.time) + ' · ' : ''}${esc(t.title)}</b>
        <small>${t.house ? 'Casa' : names(t.memberIds)} · ${t.date ? esc(fmtDay(t.date, { weekday: 'short', day: '2-digit', month: '2-digit' })) : daysLabel(t.days)} · ${t.points} pontos${t.alert ? ' · aparece no aviso' : ''}</small></div>
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
    <div class="row-btns"><button class="btn soft" data-action="bonus">Dar ou tirar pontos</button>
      <button class="btn soft" data-action="change-pin">Trocar PIN</button>
      ${mode === 'local' ? `<button class="btn soft" data-action="export">Baixar backup</button>
      <button class="btn soft" data-action="import">Restaurar backup</button>` : ''}
      <button class="btn danger" data-action="reset-points">Zerar pontos</button>
      <button class="btn ghost" data-action="lock">${ui('cadeado')} Travar</button></div>
    <p class="legend">${mode === 'db' ? 'Os dados ficam salvos na página e aparecem em todos os aparelhos. Para o Bruno editar pelo celular, compartilhe a página com ele como Editor.' : 'Os dados ficam salvos neste aparelho. Baixe um backup de vez em quando.'}</p>
  </section>`;
}
function daysLabel(days) {
  if (days.length === 7) return 'todo dia';
  if (days.length === 5 && WEEKDAYS.every(d => days.includes(d))) return 'seg a sex';
  return WEEK_ORDER.filter(d => days.includes(d)).map(d => DAYS[d]).join(', ');
}

// ---------- Diálogos ----------
const dlg = $('#dlg'), dlgForm = $('#dlgForm');
let dlgHandler = null;
function openDlg(title, body, onOk, okLabel = 'Salvar', extra = '') {
  dlgForm.innerHTML = `<h2>${title}</h2>${body}<div class="dlg-actions">${extra}<span class="spacer"></span>
    <button type="button" class="btn ghost" data-action="dlg-cancel">Cancelar</button>
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
dlgForm.addEventListener('change', e => {
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
  if (e.target.name === 'when') {
    const once = e.target.value === 'once';
    dlgForm.querySelector('.when-weekly').hidden = once;
    dlgForm.querySelector('.when-once').hidden = !once;
  }
  if (e.target.name === 'house') dlgForm.querySelector('.who-members').hidden = e.target.checked;
});

function editTask(id, onDay) {
  const t = C().tasks.find(x => x.id === id) || { title: '', icon: 'estrela', points: 5, note: '', time: '', period: 'livre', memberIds: [], house: false, days: ALL_DAYS, alert: false, date: onDay };
  openDlg(id ? 'Editar tarefa' : onDay ? `Nova tarefa · ${esc(dayLabel(onDay))}` : 'Nova tarefa fixa',
    field('Tarefa', `<input type="text" id="f-title" name="title" value="${esc(t.title)}" required>`, 'f-title') +
    iconPicker(t.icon) +
    `<div class="field"><span>Para quem</span><div class="opts"><label><input type="checkbox" name="house" ${t.house ? 'checked' : ''}> Rotina da casa (Gabriele ou Bruno marcam quem fez)</label></div>
      <div class="who-members" ${t.house ? 'hidden' : ''}>${memberChecks(t.house ? [] : t.memberIds)}</div></div>` +
    field('Quando', `<select id="f-when" name="when"><option value="weekly" ${t.date ? '' : 'selected'}>Toda semana, nos dias abaixo</option>
      <option value="once" ${t.date ? 'selected' : ''}>Só uma vez, na data abaixo</option></select>`, 'f-when') +
    `<div class="field when-weekly" ${t.date ? 'hidden' : ''}><span>Dias</span><div class="opts">${WEEK_ORDER.map(d => `<label>
      <input type="checkbox" name="days" value="${d}" ${!t.date && t.days.includes(d) ? 'checked' : ''}>${DAYS[d]}</label>`).join('')}</div></div>` +
    `<label class="field when-once" for="f-date" ${t.date ? '' : 'hidden'}><span>Data</span><input type="date" id="f-date" name="date" value="${esc(t.date || today())}"></label>` +
    `<div class="field-row">${field('Horário (opcional)', `<input type="time" id="f-time" name="time" value="${esc(t.time)}">`, 'f-time')}
      ${field('Período (sem horário)', `<select id="f-period" name="period">${opt(PERIODS, t.period)}</select>`, 'f-period')}
      ${field('Pontos', `<input type="number" id="f-points" name="points" min="0" max="1000" value="${t.points}" required>`, 'f-points')}</div>` +
    field('Observação (opcional)', `<input type="text" id="f-note" name="note" value="${esc(t.note)}" placeholder="Ex.: o que levar, quantidade">`, 'f-note') +
    `<div class="field"><div class="opts"><label><input type="checkbox" name="alert" ${t.alert ? 'checked' : ''}> Mostrar no aviso do tucano (compromisso importante)</label></div></div>`,
    fd => {
      const time = fd.get('time') || '', once = fd.get('when') === 'once', house = fd.has('house');
      const data = {
        title: fd.get('title').trim(), icon: fd.get('icon') || 'estrela', note: fd.get('note').trim(),
        points: Math.max(0, parseInt(fd.get('points'), 10) || 0), time, period: time ? periodOf(time) : fd.get('period'),
        house, memberIds: house ? adults().map(m => m.id) : fd.getAll('members'), alert: fd.has('alert'),
        days: once ? [] : fd.getAll('days').map(Number),
      };
      if (!data.memberIds.length) { toast('Escolha para quem é a tarefa'); return false; }
      if (once ? !fd.get('date') : !data.days.length) { toast(once ? 'Escolha a data' : 'Escolha pelo menos um dia'); return false; }
      if (id) { Object.assign(t, data); if (once) t.date = fd.get('date'); else delete t.date; }
      else C().tasks.push({ id: uid(), ...data, ...(once ? { date: fd.get('date') } : {}) });
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
        if (base.date) {
          base.date = move;
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
  d.done[keyOf(t, mid)] = { by: mid, t: k === today() ? Date.now() : parseDay(k).getTime() + 12 * 3600e3, pts: t.points, title: t.title };
  saveDay(k);
  const left = t.house ? 1 : ownOn(k, mid).filter(x => !doneOf(k, x, mid)).length;
  celebrate(left ? `+${t.points} ${m.name}` : `${m.name} terminou tudo!`, !left);
  render();
}

function exportData() {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(S, null, 2)], { type: 'application/json' }));
  a.download = `familia-backup-${today()}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
$('#importFile').addEventListener('change', async e => {
  const file = e.target.files[0];
  e.target.value = '';
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    if (!data.config?.members) throw new Error();
    askConfirm('Substituir todos os dados atuais por este backup?', () => { S = { ...S, ...data }; saveLocal(); render(); toast('Backup restaurado'); }, 'Substituir');
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
  'tab': el => { tab = el.dataset.tab; if (tab !== 'hoje') editMode = false; render(); scrollTo(0, 0); },
  'day': el => { const n = Number(el.dataset.n); viewDay = n ? addDays(viewDay, n) : today(); render(); },
  'goto-day': el => { viewDay = el.dataset.day; tab = 'hoje'; render(); scrollTo(0, 0); },
  'week': el => { const n = Number(el.dataset.n); weekFrom = n ? addDays(weekFrom, n) : mondayOf(today()); render(); },
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
