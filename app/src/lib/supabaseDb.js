// Guarda os dados do app no Supabase com o mesmo jeito de ler e gravar que o app já usa:
// db.doc('config/main').onSnapshot / set / delete e db.collection('days').onSnapshot.
// Cada documento é uma linha da tabela "docs": família + coleção + id + conteúdo (JSON).

export function createDb(supabase, familyId) {
  const cache = {};        // coleção -> { id: dados }
  const loaded = {};       // coleção -> Promise da primeira leitura
  const listeners = {};    // 'c:coleção' ou 'd:coleção/id' -> [{ ok, fail }]
  const pending = {};      // 'coleção/id' -> gravações ainda em andamento

  const split = path => {
    const i = path.indexOf('/');
    return [path.slice(0, i), path.slice(i + 1)];
  };
  const docSnap = (col, id) => {
    const data = cache[col]?.[id];
    return { id, exists: data !== undefined, data: () => data };
  };
  const colSnap = col => ({
    docs: Object.entries(cache[col] || {}).map(([id, data]) => ({ id, exists: true, data: () => data }))
  });
  const emit = (col, id) => {
    (listeners['c:' + col] || []).forEach(l => l.ok(colSnap(col)));
    if (id !== undefined) (listeners['d:' + col + '/' + id] || []).forEach(l => l.ok(docSnap(col, id)));
  };
  const emitAll = col => {
    (listeners['c:' + col] || []).forEach(l => l.ok(colSnap(col)));
    Object.keys(listeners).filter(k => k.startsWith('d:' + col + '/')).forEach(k => {
      const id = k.slice(col.length + 3);
      listeners[k].forEach(l => l.ok(docSnap(col, id)));
    });
  };

  async function fetchCollection(col) {
    const rows = [];
    // O Supabase entrega no máximo 1000 linhas por vez.
    for (let from = 0; ; from += 1000) {
      const { data, error } = await supabase.from('docs').select('id, data')
        .eq('family_id', familyId).eq('collection', col).range(from, from + 999);
      if (error) throw error;
      rows.push(...data);
      if (data.length < 1000) break;
    }
    const map = {};
    rows.forEach(r => { map[r.id] = r.data; });
    // Não perde o que este aparelho acabou de gravar e ainda está a caminho.
    Object.keys(pending).filter(k => pending[k] && k.startsWith(col + '/')).forEach(k => {
      const id = k.slice(col.length + 1);
      if (cache[col] && id in cache[col]) map[id] = cache[col][id]; else delete map[id];
    });
    cache[col] = map;
  }
  function load(col) {
    if (!loaded[col]) loaded[col] = fetchCollection(col).catch(e => { delete loaded[col]; throw e; });
    return loaded[col];
  }
  function listen(key, col, ok, fail, first) {
    (listeners[key] = listeners[key] || []).push({ ok, fail });
    load(col).then(first, e => fail && fail(e));
  }

  // Mudanças feitas em outro aparelho chegam ao vivo.
  const onChange = payload => {
    const row = payload.eventType === 'DELETE' ? payload.old : payload.new;
    if (!row || row.family_id !== familyId || !cache[row.collection]) return;
    const key = row.collection + '/' + row.id;
    if (pending[key]) return;
    if (payload.eventType === 'DELETE') delete cache[row.collection][row.id];
    else cache[row.collection][row.id] = row.data;
    emit(row.collection, row.id);
  };
  // Depois de ficar sem internet ou com a tela apagada, lê tudo de novo.
  async function refresh() {
    for (const col of Object.keys(cache)) {
      try { await fetchCollection(col); emitAll(col); } catch (e) { /* tenta na próxima vez */ }
    }
  }
  let joined = false;
  const channel = supabase.channel('familia-' + familyId)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'docs' }, onChange)
    .subscribe(status => {
      if (status !== 'SUBSCRIBED') return;
      if (joined) refresh();
      joined = true;
    });
  let hiddenAt = 0;
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) hiddenAt = Date.now();
    else if (hiddenAt && Date.now() - hiddenAt > 30000) refresh();
  });
  window.addEventListener('online', refresh);

  async function write(col, id, data) {
    const key = col + '/' + id;
    cache[col] = cache[col] || {};
    if (data === null) delete cache[col][id]; else cache[col][id] = data;
    pending[key] = (pending[key] || 0) + 1;
    try {
      const q = data === null
        ? supabase.from('docs').delete().eq('family_id', familyId).eq('collection', col).eq('id', id)
        : supabase.from('docs').upsert({ family_id: familyId, collection: col, id, data, updated_at: new Date().toISOString() });
      const { error } = await q;
      if (error) throw error;
    } finally {
      pending[key]--;
      if (!pending[key]) delete pending[key];
    }
  }

  return {
    doc(path) {
      const [col, id] = split(path);
      return {
        onSnapshot(ok, fail) { listen('d:' + path, col, ok, fail, () => ok(docSnap(col, id))); },
        set: data => write(col, id, JSON.parse(JSON.stringify(data))),
        delete: () => write(col, id, null)
      };
    },
    collection(col) {
      return { onSnapshot(ok, fail) { listen('c:' + col, col, ok, fail, () => ok(colSnap(col))); } };
    },
    close() { supabase.removeChannel(channel); }
  };
}
