<script>
  import { onMount, tick } from 'svelte';
  import '../../../styles.css';
  import iconsSrc from '../../../icons.js?raw';
  import seedSrc from '../../../seed.js?raw';
  import appSrc from '../../../app.js?raw';
  import { getSupabase } from '../lib/supabase.js';
  import { createDb } from '../lib/supabaseDb.js';

  const FAMILY_NAME = 'Família Pinheiro Bernt Eymael';
  const supabase = getSupabase();

  // Telas: carregando, entrar, nova senha, família (criar ou entrar com código) e o app.
  let screen = $state(supabase ? 'loading' : 'missing');
  let authMode = $state('entrar');
  let email = $state('');
  let password = $state('');
  let code = $state('');
  let message = $state('');
  let busy = $state(false);
  let user = null;
  let started = false;

  const errorText = e => {
    const m = String(e?.message || e || '');
    if (/invalid login/i.test(m)) return 'E-mail ou senha errados.';
    if (/email not confirmed/i.test(m)) return 'Confirme o e-mail primeiro (veja a caixa de entrada).';
    if (/already registered/i.test(m)) return 'Este e-mail já tem conta. Use Entrar.';
    if (/password should be/i.test(m)) return 'A senha precisa de pelo menos 6 caracteres.';
    if (/código não encontrado/i.test(m)) return 'Código não encontrado. Confira as letras e números.';
    return m || 'Algo deu errado. Tente de novo.';
  };

  async function run(fn) {
    busy = true; message = '';
    try { await fn(); } catch (e) { message = errorText(e); }
    busy = false;
  }

  async function afterLogin(u) {
    user = u;
    const { data, error } = await supabase.from('family_members').select('family_id').eq('user_id', u.id).limit(1);
    if (error) throw error;
    if (!data.length) { screen = 'family'; return; }
    const { data: fam, error: e2 } = await supabase.from('families').select('id, name, join_code').eq('id', data[0].family_id).single();
    if (e2) throw e2;
    await openApp(fam);
  }

  function login() {
    return run(async () => {
      if (authMode === 'criar') {
        const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: location.origin } });
        if (error) throw error;
        if (!data.session) { message = 'Conta criada. Abra o e-mail que chegou para confirmar e depois entre aqui.'; authMode = 'entrar'; return; }
        await afterLogin(data.user);
      } else if (authMode === 'esqueci') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: location.origin });
        if (error) throw error;
        message = 'Enviamos um link para o seu e-mail para criar uma senha nova.';
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        await afterLogin(data.user);
      }
    });
  }

  function newPassword() {
    return run(async () => {
      const { data, error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      password = '';
      await afterLogin(data.user);
    });
  }

  function createFamily() {
    return run(async () => {
      const { data: fam, error } = await supabase.rpc('create_family', { p_name: FAMILY_NAME });
      if (error) throw error;
      // Começa com a mesma rotina inicial do app (tarefas, prêmios, foco de cada dia).
      const familySeed = new Function(seedSrc + '\nreturn familySeed;')();
      const { error: e2 } = await supabase.from('docs').insert({ family_id: fam.id, collection: 'config', id: 'main', data: familySeed() });
      if (e2) throw e2;
      await openApp(fam);
    });
  }

  function joinFamily() {
    return run(async () => {
      const { data: fam, error } = await supabase.rpc('join_family', { p_code: code });
      if (error) throw error;
      await openApp(fam);
    });
  }

  async function signOut() {
    await supabase.auth.signOut();
    location.reload();
  }

  // Abre o app de sempre (os mesmos arquivos do tablet), agora lendo e gravando no Supabase.
  async function openApp(fam) {
    if (started) return;
    started = true;
    const db = createDb(supabase, fam.id);
    window.familyAccount = { name: fam.name, code: fam.join_code, email: user?.email, signOut };
    window.claude = { use: async name => (name === 'db' ? db : null) };
    screen = 'app';
    await tick();
    for (const src of [iconsSrc, appSrc]) {
      const s = document.createElement('script');
      s.textContent = src;
      document.body.appendChild(s);
    }
  }

  onMount(() => {
    if (!supabase) return;
    supabase.auth.onAuthStateChange(event => {
      if (event === 'PASSWORD_RECOVERY') { screen = 'recovery'; message = ''; }
    });
    supabase.auth.getSession().then(async ({ data }) => {
      if (screen === 'recovery') return;
      if (!data.session) { screen = 'login'; return; }
      try { await afterLogin(data.session.user); }
      catch (e) { message = errorText(e); screen = 'login'; }
    });
  });
</script>

{#if screen === 'app'}
  <header class="top">
    <div class="brand">
      <svg class="tucano" viewBox="0 0 130 120" aria-hidden="true"><path d="M14 108 C40 104 80 104 104 108" fill="none" stroke="#b98560" stroke-width="7" stroke-linecap="round"/><path d="M38 92 L30 116 L46 116 L50 94 Z" fill="#3d4260"/><path d="M28 44 C26 24 40 12 56 14 C70 16 76 30 74 46 C72 66 64 86 52 98 C44 104 36 102 33 94 C28 80 28 60 28 44 Z" fill="#3d4260"/><path d="M58 30 C70 28 77 40 74 54 C70 62 60 62 56 54 C52 46 52 34 58 30 Z" fill="#fff6dc"/><path d="M64 22 C80 10 108 12 124 32 C126 36 122 40 116 38 C102 34 86 34 70 40 C64 34 62 28 64 22 Z" fill="#ffb347"/><path d="M70 40 C86 35 102 35 116 38 C108 46 90 50 72 46 Z" fill="#f4845f"/><path d="M112 22 C118 26 124 30 124 32 C126 36 122 40 116 38 C116 32 115 27 112 22 Z" fill="#3d4260"/><circle cx="56" cy="27" r="8" fill="#7aa7e8"/><circle cx="56" cy="27" r="4.6" fill="#fff"/><circle cx="57" cy="27" r="3" fill="#3d4260"/></svg>
      <div><h1>{FAMILY_NAME}</h1><small id="date"></small></div>
    </div>
    <nav class="tabs" id="tabs"></nav>
  </header>
  <main id="app"></main>
  <div id="timer" class="timer" hidden></div>
  <dialog id="dlg"><form id="dlgForm" method="dialog"></form></dialog>
  <input type="file" id="importFile" accept="application/json,.json" hidden>
{:else}
  <main class="gate">
    <section class="card">
      <svg class="tucano" viewBox="0 0 130 120" aria-hidden="true"><path d="M14 108 C40 104 80 104 104 108" fill="none" stroke="#b98560" stroke-width="7" stroke-linecap="round"/><path d="M38 92 L30 116 L46 116 L50 94 Z" fill="#3d4260"/><path d="M28 44 C26 24 40 12 56 14 C70 16 76 30 74 46 C72 66 64 86 52 98 C44 104 36 102 33 94 C28 80 28 60 28 44 Z" fill="#3d4260"/><path d="M58 30 C70 28 77 40 74 54 C70 62 60 62 56 54 C52 46 52 34 58 30 Z" fill="#fff6dc"/><path d="M64 22 C80 10 108 12 124 32 C126 36 122 40 116 38 C102 34 86 34 70 40 C64 34 62 28 64 22 Z" fill="#ffb347"/><path d="M70 40 C86 35 102 35 116 38 C108 46 90 50 72 46 Z" fill="#f4845f"/><path d="M112 22 C118 26 124 30 124 32 C126 36 122 40 116 38 C116 32 115 27 112 22 Z" fill="#3d4260"/><circle cx="56" cy="27" r="8" fill="#7aa7e8"/><circle cx="56" cy="27" r="4.6" fill="#fff"/><circle cx="57" cy="27" r="3" fill="#3d4260"/></svg>
      <h1>{FAMILY_NAME}</h1>

      {#if screen === 'missing'}
        <p class="muted">Falta ligar o app ao Supabase: coloque VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY nas configurações do site (veja o GUIA.md).</p>
      {:else if screen === 'loading'}
        <p class="muted">Carregando…</p>
      {:else if screen === 'login'}
        <div class="chips">
          <button class="chip" class:on={authMode === 'entrar'} onclick={() => { authMode = 'entrar'; message = ''; }}>Entrar</button>
          <button class="chip" class:on={authMode === 'criar'} onclick={() => { authMode = 'criar'; message = ''; }}>Criar conta</button>
        </div>
        <form onsubmit={e => { e.preventDefault(); login(); }}>
          <label class="field"><span>E-mail</span><input type="email" bind:value={email} autocomplete="email" required></label>
          {#if authMode !== 'esqueci'}
            <label class="field"><span>Senha</span><input type="password" bind:value={password} minlength="6"
              autocomplete={authMode === 'criar' ? 'new-password' : 'current-password'} required></label>
          {/if}
          <button class="btn primary full" disabled={busy}>
            {authMode === 'criar' ? 'Criar conta' : authMode === 'esqueci' ? 'Enviar link' : 'Entrar'}
          </button>
        </form>
        {#if authMode === 'entrar'}
          <button class="btn ghost full" onclick={() => { authMode = 'esqueci'; message = ''; }}>Esqueci a senha</button>
        {:else if authMode === 'esqueci'}
          <button class="btn ghost full" onclick={() => { authMode = 'entrar'; message = ''; }}>Voltar</button>
        {/if}
      {:else if screen === 'recovery'}
        <form onsubmit={e => { e.preventDefault(); newPassword(); }}>
          <label class="field"><span>Senha nova</span><input type="password" bind:value={password} minlength="6" autocomplete="new-password" required></label>
          <button class="btn primary full" disabled={busy}>Salvar senha</button>
        </form>
      {:else if screen === 'family'}
        <p>Primeira vez aqui? Crie a família. Se alguém já criou, entre com o código que ela mostra em <b>Ajustes → Convidar alguém</b>.</p>
        <button class="btn primary full" disabled={busy} onclick={createFamily}>Criar a família</button>
        <form class="join" onsubmit={e => { e.preventDefault(); joinFamily(); }}>
          <label class="field"><span>Código da família</span><input type="text" bind:value={code} autocomplete="off" autocapitalize="characters" required></label>
          <button class="btn soft full" disabled={busy}>Entrar com código</button>
        </form>
        <button class="btn ghost full" onclick={signOut}>Sair</button>
      {/if}

      {#if message}<p class="gate-msg">{message}</p>{/if}
    </section>
  </main>
{/if}

<style>
  .gate { max-width: 420px; margin: 0 auto; padding: 40px 16px; }
  .gate .card { display: flex; flex-direction: column; gap: 6px; }
  .gate .tucano { width: 72px; height: auto; align-self: center; }
  .gate h1 { font-size: 1.15rem; text-align: center; margin-bottom: 10px; }
  .gate form { margin-top: 8px; }
  .gate input[type=email], .gate .join input { width: 100%; padding: 10px 12px; border: 1px solid var(--line); border-radius: 12px; background: var(--card); font: inherit; font-size: 1rem; }
  .gate .join { margin-top: 18px; padding-top: 14px; border-top: 1px solid var(--line); }
  .gate-msg { margin-top: 10px; padding: 10px 12px; border-radius: 12px; background: var(--accent-soft); font-size: .9rem; }
</style>
