// Figuras das tarefas (desenhos próprios, sem emoji), para quem ainda não lê reconhecer cada tarefa.
// Cada figura usa viewBox 0 0 64 64; o contorno escuro vem do <g> em icon().
const ICONS = {
  // Rotina das crianças
  acordar: ['Acordar', '<circle cx="32" cy="35" r="19" fill="#ef8a80"/><circle cx="32" cy="35" r="14" fill="#fff"/><path d="M32 26v9l6 4"/><path d="M14 18l7-6M50 18l-7-6" stroke-width="4"/><path d="M20 53l-3 5M44 53l3 5"/>'],
  banheiro: ['Banheiro', '<path d="M18 10h24v18H18z" fill="#dfe8f7"/><path d="M12 28h40c0 12-8 18-20 18S12 40 12 28z" fill="#fff"/><path d="M24 45l-2 11h20l-2-11" fill="#fff"/><ellipse cx="32" cy="31" rx="13" ry="3" fill="#bcd2f2"/>'],
  rosto: ['Lavar o rosto', '<circle cx="30" cy="34" r="18" fill="#f7cba8"/><path d="M22 32q3-3 6 0M32 32q3-3 6 0"/><path d="M25 42q5 4 10 0"/><path d="M50 10c-4 6-6 9-6 12a6 6 0 0012 0c0-3-2-6-6-12z" fill="#7cc3f0"/><path d="M14 8c-3 4-4 6-4 8a4 4 0 008 0c0-2-1-4-4-8z" fill="#7cc3f0"/>'],
  dentes: ['Escovar os dentes', '<path d="M8 50l30-30" stroke-width="7" stroke="#7aa7e8"/><path d="M8 50l30-30" stroke-width="2.5"/><rect x="34" y="10" width="20" height="12" rx="3" transform="rotate(-45 44 16)" fill="#fff"/><path d="M38 8q6 2 4 8 6-2 8 4" fill="#bfe6ff"/><path d="M40 40c0-6 3-8 6-8s4 2 6 2 6-2 8 2-1 10-3 14-3 6-5 4-2-6-4-6-2 6-4 6-4-8-4-14z" fill="#fff"/>'],
  trocar: ['Se trocar', '<path d="M16 8l-10 8 5 8 5-3v19h20V21l5 3 5-8-10-8c-2 4-5 6-10 6s-8-2-10-6z" fill="#7aa7e8"/><path d="M36 34h20l-2 24h-6l-2-14-2 14h-6z" fill="#f7c948"/>'],
  pentear: ['Pentear o cabelo', '<ellipse cx="38" cy="22" rx="16" ry="13" fill="#f0a35e"/><path d="M28 20h20M28 26h20M30 14h16"/><path d="M28 32L10 54" stroke-width="8" stroke="#f0a35e"/><path d="M28 32L10 54"/>'],
  cama: ['Arrumar a cama', '<path d="M6 20v36M58 40v16"/><path d="M6 40h52v8H6z" fill="#b98560"/><path d="M10 26h14v10H10z" fill="#fff"/><path d="M24 30h30q4 0 4 4v6H24z" fill="#a891f0"/><path d="M30 34h22"/>'],
  cafe: ['Café da manhã', '<path d="M6 30h34c0 12-7 20-17 20S6 42 6 30z" fill="#fff"/><path d="M10 30c2-4 26-4 26 0" fill="#f7d79a"/><path d="M30 12l-6 18" stroke-width="3"/><path d="M42 26h14v22a6 6 0 01-6 6h-2a6 6 0 01-6-6z" fill="#7cc3f0"/><path d="M56 32h3a3 3 0 010 9h-3"/><path d="M42 34h14v14a6 6 0 01-6 6h-2a6 6 0 01-6-6z" fill="#fff"/>'],
  pia: ['Louça na pia', '<path d="M6 34h52v6a14 14 0 01-14 14H20A14 14 0 016 40z" fill="#dfe8f7"/><path d="M40 34V16a6 6 0 0112 0v4"/><ellipse cx="22" cy="30" rx="12" ry="5" fill="#fff"/><ellipse cx="22" cy="30" rx="6" ry="2" fill="#f7d79a"/>'],
  casaco: ['Casaco', '<path d="M24 8l-12 6-6 20 6 2 2-8v28h36V28l2 8 6-2-6-20-12-6-8 8z" fill="#e0692b"/><path d="M32 16v40"/><path d="M24 8l8 8 8-8"/><path d="M18 40h6M40 40h6"/>'],
  mochila: ['Mochila', '<path d="M24 12a8 8 0 0116 0"/><rect x="12" y="14" width="40" height="44" rx="12" fill="#6cc7a0"/><rect x="20" y="36" width="24" height="16" rx="4" fill="#4fae86"/><path d="M20 26h24"/>'],
  escola: ['Escola', '<path d="M6 28l26-16 26 16" fill="#ef8a80"/><path d="M10 28h44v28H10z" fill="#f7d79a"/><path d="M26 56V42h12v14" fill="#b98560"/><path d="M16 34h6v6h-6zM42 34h6v6h-6z" fill="#bfe6ff"/><path d="M32 12V2"/><path d="M32 2h10v6H32" fill="#7aa7e8"/>'],
  sapato: ['Sapatos', '<path d="M6 40V24h14l6 8c8 2 20 4 28 8 4 2 4 8 0 8H6z" fill="#7aa7e8"/><path d="M6 48h48"/><path d="M24 30l4 4M30 32l3 3"/>'],
  maos: ['Lavar as mãos', '<path d="M18 58V34c0-3 4-3 4 0v-8c0-3 4-3 4 0v-4c0-3 4-3 4 0v4c0-3 4-3 4 0v14l4-4c2-2 5 0 4 2l-8 14c-2 4-4 6-8 6z" fill="#f7cba8"/><circle cx="48" cy="14" r="6" fill="#dff3ff"/><circle cx="54" cy="26" r="4" fill="#dff3ff"/><circle cx="12" cy="18" r="5" fill="#dff3ff"/>'],
  lancheira: ['Lancheira', '<rect x="8" y="22" width="48" height="32" rx="8" fill="#a891f0"/><path d="M8 34h48"/><path d="M24 22v-6h16v6"/><path d="M28 30h8" stroke-width="4"/>'],
  lanche: ['Lanche', '<path d="M32 18c-6-6-24-4-24 14 0 14 10 26 18 24 4-1 8-1 12 0 8 2 18-10 18-24 0-18-18-20-24-14z" fill="#ef8a80"/><path d="M32 18c0-6 2-10 6-12"/><path d="M34 12c4-6 12-6 14-4-4 6-10 6-14 4z" fill="#6cc7a0"/>'],
  futebol: ['Futebol', '<circle cx="32" cy="32" r="24" fill="#fff"/><path d="M32 22l9 6-3 10H26l-3-10z" fill="#3d4260"/><path d="M32 22V8M41 28l13-4M38 38l8 12M26 38l-8 12M23 28l-13-4"/>'],
  brinquedos: ['Arrumar os brinquedos', '<path d="M8 32h48v24H8z" fill="#f7c948"/><path d="M8 32h48"/><circle cx="20" cy="24" r="8" fill="#ef8a80"/><path d="M32 30V12l12 6-12 6" fill="#7aa7e8"/><rect x="42" y="18" width="12" height="14" rx="2" fill="#6cc7a0"/><path d="M24 44h16" stroke-width="4"/>'],
  banho: ['Banho', '<path d="M6 32h52v6a16 16 0 01-16 16H22A16 16 0 016 38z" fill="#fff"/><path d="M14 32V12a6 6 0 0112 0"/><circle cx="34" cy="26" r="6" fill="#dff3ff"/><circle cx="44" cy="24" r="8" fill="#dff3ff"/><circle cx="52" cy="28" r="4" fill="#dff3ff"/><path d="M14 54l-2 6M50 54l2 6"/>'],
  pijama: ['Pijama', '<path d="M18 8l-12 8 5 10 5-3v35h32V23l5 3 5-10-12-8c-2 4-6 6-14 6S20 12 18 8z" fill="#a891f0"/><path d="M36 30a7 7 0 1010 8 6 6 0 01-10-8z" fill="#f7c948"/><path d="M22 44l1 2 2 0-1 2 1 2-2-1-2 1 1-2-1-2 2 0z" fill="#fff"/>'],
  licao: ['Lição de casa', '<path d="M6 14h22c2 0 4 2 4 4v38c0-2-2-4-4-4H6z" fill="#fff"/><path d="M58 14H36c-2 0-4 2-4 4v38c0-2 2-4 4-4h22z" fill="#fff"/><path d="M12 24h12M12 32h12M40 24h12"/><path d="M50 50l8-26 4 2-8 26-5 3z" fill="#f7c948"/>'],
  mesa: ['Colocar a mesa', '<circle cx="32" cy="32" r="16" fill="#fff"/><circle cx="32" cy="32" r="9" fill="#dfe8f7"/><path d="M8 14v12q0 4 3 4v24M14 14v12q0 4-3 4"/><path d="M54 14c-4 4-4 14 0 16v24"/>'],
  jantar: ['Jantar', '<ellipse cx="32" cy="38" rx="26" ry="16" fill="#fff"/><path d="M16 36c4-8 28-8 32 0-4 6-28 6-32 0z" fill="#f7c948"/><circle cx="26" cy="34" r="3" fill="#ef8a80"/><circle cx="38" cy="33" r="3" fill="#ef8a80"/><path d="M30 30q4-3 8 0"/>'],
  tirar_mesa: ['Tirar a mesa', '<ellipse cx="32" cy="48" rx="22" ry="7" fill="#fff"/><ellipse cx="32" cy="40" rx="22" ry="7" fill="#fff"/><ellipse cx="32" cy="32" rx="22" ry="7" fill="#fff"/><path d="M32 6v14M26 14l6 6 6-6"/>'],
  mesa_cafe: ['Mesa do café', '<path d="M12 22h26v20a10 10 0 01-10 10h-6a10 10 0 01-10-10z" fill="#ef8a80"/><path d="M38 28h4a5 5 0 010 10h-4"/><path d="M18 8q-3 4 0 8M26 8q-3 4 0 8"/><path d="M40 52c0-8 4-12 10-12s10 4 10 12z" fill="#f7d79a"/><path d="M6 56h52"/>'],
  leitura: ['Leitura', '<path d="M4 16c10-4 20-2 28 4v36c-8-6-18-8-28-4z" fill="#fff"/><path d="M60 16c-10-4-20-2-28 4v36c8-6 18-8 28-4z" fill="#bfe6ff"/><path d="M10 26c6-2 12-1 16 2M10 34c6-2 12-1 16 2M38 28c4-3 10-4 16-2M38 36c4-3 10-4 16-2"/>'],
  dormir: ['Dormir', '<path d="M38 8a22 22 0 1016 34A18 18 0 0138 8z" fill="#f7c948"/><path d="M42 12h8l-8 8h8M50 26h6l-6 6h6"/>'],
  xixi: ['Xixi', '<path d="M20 10h24v16H20z" fill="#dfe8f7"/><path d="M14 26h36c0 12-8 18-18 18S14 38 14 26z" fill="#fff"/><path d="M24 43l-2 13h20l-2-13" fill="#fff"/><path d="M54 36c-3 4-4 6-4 8a4 4 0 008 0c0-2-1-4-4-8z" fill="#f7e27a"/>'],

  // Casa
  janela: ['Abrir janelas', '<rect x="10" y="8" width="44" height="48" rx="3" fill="#bfe6ff"/><path d="M32 8v48M10 32h44"/><path d="M6 56h52"/>'],
  spray: ['Spray', '<path d="M20 26h20v30H20z" fill="#a891f0"/><path d="M24 26V16h12v10"/><path d="M24 16h-8v-6h20v6"/><path d="M46 10l8-3M46 14h9M46 18l8 3"/>'],
  fogao: ['Fogão', '<rect x="8" y="22" width="48" height="36" rx="4" fill="#fff"/><path d="M8 32h48"/><circle cx="20" cy="27" r="2"/><circle cx="32" cy="27" r="2"/><circle cx="44" cy="27" r="2"/><rect x="16" y="38" width="32" height="14" rx="2" fill="#dfe8f7"/><path d="M14 22c0-6 8-6 8-12M40 22c0-6 8-6 8-12"/>'],
  lixo: ['Lixo', '<path d="M14 18h36l-4 40H18z" fill="#9aa5bd"/><path d="M10 18h44"/><path d="M26 18v-6h12v6"/><path d="M26 28v20M38 28v20"/>'],
  roupa: ['Lavar roupa', '<rect x="10" y="6" width="44" height="52" rx="6" fill="#fff"/><path d="M10 18h44"/><circle cx="18" cy="12" r="2"/><circle cx="32" cy="38" r="13" fill="#bfe6ff"/><path d="M22 40c4 4 8-4 12 0s6-2 8 0"/>'],
  varal: ['Varal', '<path d="M4 14h56"/><path d="M10 14l-4 12 6 2v18h16V28l6-2-4-12" fill="#7aa7e8"/><path d="M38 14h18v24H38z" fill="#f7c948"/><path d="M42 14v-4M52 14v-4"/>'],
  aspirador: ['Aspirar', '<path d="M40 6L22 44"/><path d="M8 44h28l4 8H4z" fill="#a891f0"/><rect x="38" y="20" width="18" height="30" rx="8" fill="#ef8a80"/><circle cx="47" cy="52" r="5" fill="#fff"/>'],
  robo: ['Robô aspirador', '<circle cx="32" cy="34" r="24" fill="#3d4260"/><circle cx="32" cy="34" r="16" fill="#9aa5bd"/><circle cx="32" cy="26" r="3" fill="#6cc7a0"/><path d="M20 58h24"/>'],
  vassoura: ['Varrer', '<path d="M44 4L28 36" stroke-width="4" stroke="#b98560"/><path d="M44 4L28 36"/><path d="M18 34l16 8-6 18-22-10z" fill="#f7c948"/><path d="M14 52l4-10M20 55l4-10"/>'],
  planta: ['Regar plantas', '<path d="M18 40h28l-4 18H22z" fill="#e0692b"/><path d="M32 40V22"/><path d="M32 30c-10 0-14-8-14-14 8 0 14 4 14 14z" fill="#6cc7a0"/><path d="M32 24c0-8 6-14 16-14 0 8-6 14-16 14z" fill="#6cc7a0"/>'],
  suculenta: ['Suculentas', '<path d="M16 42h32l-4 16H20z" fill="#e0692b"/><path d="M32 42c-6-2-12-8-12-16 6 2 10 8 12 16zM32 42c6-2 12-8 12-16-6 2-10 8-12 16zM32 42c-3-8-3-18 0-26 3 8 3 18 0 26z" fill="#6cc7a0"/>'],
  compras: ['Compras', '<path d="M4 10h8l6 32h32l6-22H16" fill="#fff"/><circle cx="22" cy="52" r="5" fill="#9aa5bd"/><circle cx="46" cy="52" r="5" fill="#9aa5bd"/><path d="M24 26h4v8h-4zM32 24h6v10h-6zM42 26h6v8h-6z" fill="#6cc7a0"/>'],
  carro: ['Carro', '<path d="M6 44V34l6-14h40l6 14v10z" fill="#ef8a80"/><path d="M16 22l-4 12h40l-4-12" fill="#bfe6ff"/><circle cx="18" cy="46" r="6" fill="#3d4260"/><circle cx="46" cy="46" r="6" fill="#3d4260"/>'],
  geladeira: ['Geladeira', '<rect x="14" y="4" width="36" height="56" rx="6" fill="#fff"/><path d="M14 24h36"/><path d="M20 12v6M20 30v10"/>'],
  frutas: ['Frutas', '<path d="M6 34h52l-6 20H12z" fill="#b98560"/><circle cx="22" cy="28" r="8" fill="#ef8a80"/><circle cx="40" cy="26" r="9" fill="#f0a35e"/><path d="M28 30c4-14 20-18 26-12-6 4-14 8-26 12z" fill="#f7c948"/>'],
  lava_loucas: ['Lava-louças', '<rect x="8" y="8" width="48" height="50" rx="4" fill="#fff"/><path d="M8 20h48"/><path d="M20 14h24"/><path d="M16 50V30M24 50V30M32 50V30" stroke="#7aa7e8"/><circle cx="44" cy="38" r="8" fill="#dfe8f7"/>'],
  escritorio: ['Escritório', '<path d="M4 34h56"/><path d="M10 34v22M54 34v22"/><rect x="18" y="12" width="28" height="18" rx="2" fill="#bfe6ff"/><path d="M32 30v4"/><path d="M40 26h14l-2 8H40z" fill="#fff"/>'],
  espelho: ['Espelho', '<ellipse cx="32" cy="28" rx="18" ry="22" fill="#bfe6ff"/><path d="M24 18l-6 8M30 16l-10 16"/><path d="M32 50v8M22 58h20"/>'],
  toalha: ['Toalhas', '<path d="M8 10h48"/><path d="M14 10h24v44H14z" fill="#6cc7a0"/><path d="M38 10h12v34H38z" fill="#a891f0"/><path d="M14 44h24"/>'],
  sofa: ['Sala', '<path d="M10 30V20a6 6 0 016-6h32a6 6 0 016 6v10" fill="#7aa7e8"/><path d="M4 30a4 4 0 018 0v6h40v-6a4 4 0 018 0v16H4z" fill="#7aa7e8"/><path d="M8 46v6M56 46v6"/>'],
  lista: ['Lista', '<rect x="12" y="8" width="40" height="50" rx="4" fill="#fff"/><path d="M24 8v-2h16v2"/><path d="M20 22l3 3 5-6M20 34l3 3 5-6M20 46l3 3 5-6M32 23h12M32 35h12M32 47h12"/>'],
  reciclar: ['Reciclagem', '<path d="M14 18h36l-4 40H18z" fill="#6cc7a0"/><path d="M10 18h44"/><path d="M26 32l6-6 6 6M32 26v16M26 42h12"/>'],
  panela: ['Fazer o jantar', '<path d="M10 28h44v18a10 10 0 01-10 10H20a10 10 0 01-10-10z" fill="#ef8a80"/><path d="M4 30h6M54 30h6M8 28h48"/><path d="M24 22q-3-4 0-8M32 22q-3-4 0-8M40 22q-3-4 0-8"/>'],
  familia: ['Família', '<circle cx="18" cy="18" r="7" fill="#f7cba8"/><circle cx="44" cy="18" r="7" fill="#f7cba8"/><circle cx="31" cy="32" r="5" fill="#f7cba8"/><path d="M8 56V36a10 10 0 0120 0v20z" fill="#7aa7e8"/><path d="M34 56V36a10 10 0 0120 0v20z" fill="#ef8a80"/><path d="M24 56V46a7 7 0 0114 0v10z" fill="#f7c948"/>'],
  noite: ['Rotina da noite', '<rect x="6" y="6" width="52" height="52" rx="10" fill="#5b6aa8"/><path d="M34 16a14 14 0 1010 22 12 12 0 01-10-22z" fill="#f7c948"/><circle cx="18" cy="20" r="2" fill="#fff"/><circle cx="48" cy="46" r="2" fill="#fff"/><circle cx="16" cy="44" r="1.5" fill="#fff"/>'],
  manha: ['Rotina da manhã', '<rect x="6" y="6" width="52" height="52" rx="10" fill="#bfe6ff"/><circle cx="32" cy="38" r="10" fill="#f7c948"/><path d="M32 20v-6M18 26l-4-4M46 26l4-4M12 40H6M58 40h-6"/><path d="M6 48h52v10H6z" fill="#6cc7a0"/>'],
  relogio: ['Relógio', '<circle cx="32" cy="32" r="24" fill="#fff"/><path d="M32 18v14l9 6"/>'],
  grama: ['Cortar a grama', '<path d="M4 50c2-8 4-8 6 0M12 50c2-10 4-10 6 0M44 50c2-8 4-8 6 0M52 50c2-10 4-10 6 0" stroke="#4fae86"/><path d="M4 52h56"/><path d="M22 24l8 16" stroke-width="3"/><rect x="24" y="36" width="24" height="12" rx="4" fill="#ef8a80"/><circle cx="28" cy="50" r="4" fill="#3d4260"/><circle cx="44" cy="50" r="4" fill="#3d4260"/><path d="M18 22h8"/>'],
  coifa: ['Coifa', '<path d="M26 6h12v12H26z" fill="#dfe8f7"/><path d="M14 18h36l8 14H6z" fill="#c7cede"/><path d="M14 26h36M18 22h28" stroke-width="1.5"/><path d="M8 44h48v6H8z" fill="#3d4260"/><path d="M20 40q-3-4 0-8M32 40q-3-4 0-8M44 40q-3-4 0-8"/>'],
  po: ['Tirar o pó', '<path d="M8 50h48v6H8z" fill="#b98560"/><path d="M42 6L30 30" stroke-width="4" stroke="#b98560"/><path d="M42 6L30 30"/><path d="M22 26c4-4 14 0 12 8-2 10-14 10-18 4s2-8 6-12z" fill="#f2c4dc"/><circle cx="50" cy="40" r="2" fill="#c7cede"/><circle cx="12" cy="40" r="2" fill="#c7cede"/><circle cx="46" cy="30" r="1.5" fill="#c7cede"/>'],
  vidro: ['Limpar vidros', '<rect x="8" y="6" width="48" height="52" rx="3" fill="#bfe6ff"/><path d="M8 32h48M32 6v52"/><path d="M14 20l8-8M18 24l10-10M38 46l8-8M42 50l10-10" stroke="#fff" stroke-width="3"/>'],
  saco_lixo: ['Levar o lixo', '<path d="M18 22c-6 8-8 20-6 30 1 6 6 8 20 8s19-2 20-8c2-10 0-22-6-30z" fill="#5b6aa8"/><path d="M22 22c2-4 6-6 10-6s8 2 10 6"/><path d="M28 16l4-8 4 8"/><path d="M24 36q8 4 16 0"/>'],
  inducao: ['Fogão de indução', '<rect x="6" y="14" width="52" height="36" rx="6" fill="#3d4260"/><circle cx="22" cy="32" r="9" fill="none" stroke="#9aa5bd"/><circle cx="44" cy="32" r="7" fill="none" stroke="#9aa5bd"/><path d="M12 44h8" stroke="#ef8a80"/><path d="M48 6l4 4M52 6l-4 4" stroke="#7cc3f0"/>'],
  estrela: ['Estrela', '<path d="M32 6l7 16 18 2-13 12 4 18-16-9-16 9 4-18L7 24l18-2z" fill="#f7c948"/>'],

  // Agenda e prêmios
  festa: ['Festa', '<path d="M24 8c-8 0-12 8-12 14s6 14 12 14 12-8 12-14-4-14-12-14z" fill="#ef8a80"/><path d="M44 14c-6 0-10 6-10 11s5 11 10 11 10-6 10-11-4-11-10-11z" fill="#a891f0"/><path d="M24 36q-4 10 2 22M44 36q4 10-2 22"/>'],
  medico: ['Consulta', '<rect x="8" y="14" width="48" height="40" rx="6" fill="#fff"/><path d="M24 14v-6h16v6"/><path d="M32 24v20M22 34h20" stroke="#ef8a80" stroke-width="6"/>'],
  calendario: ['Compromisso', '<rect x="8" y="12" width="48" height="44" rx="6" fill="#fff"/><path d="M8 12h48v12H8z" fill="#ef8a80"/><path d="M20 6v10M44 6v10"/><path d="M18 34h6M30 34h6M42 34h4M18 44h6M30 44h6"/>'],
  recado: ['Lembrete', '<path d="M8 12h48v32H28l-12 10v-10H8z" fill="#f7c948"/><path d="M18 24h28M18 32h18"/>'],
  presente: ['Presente', '<path d="M10 26h44v30H10z" fill="#ef8a80"/><path d="M6 18h52v10H6z" fill="#f7c948"/><path d="M32 18v38"/><path d="M32 18c-6-10-16-8-14-2 2 4 14 2 14 2zM32 18c6-10 16-8 14-2-2 4-14 2-14 2z" fill="#f7c948"/>'],
  tv: ['Desenho', '<rect x="6" y="12" width="52" height="36" rx="6" fill="#3d4260"/><rect x="12" y="18" width="40" height="24" rx="2" fill="#bfe6ff"/><path d="M24 4l8 8 8-8M20 56h24"/>'],
  sorvete: ['Sorvete', '<path d="M20 30l12 30 12-30z" fill="#f0a35e"/><circle cx="26" cy="24" r="9" fill="#fd9dbb"/><circle cx="38" cy="22" r="9" fill="#bfe6ff"/><circle cx="32" cy="12" r="7" fill="#fff"/>'],
  parquinho: ['Parquinho', '<path d="M8 58L18 8h28l10 50"/><path d="M18 8h28" stroke-width="4"/><path d="M26 8v30M38 8v30"/><path d="M22 38h20v6H22z" fill="#ef8a80"/>'],
  pizza: ['Escolher o jantar', '<path d="M32 58L6 14c16-8 36-8 52 0z" fill="#f7c948"/><path d="M8 18c14-6 34-6 48 0" stroke="#e0692b" stroke-width="5"/><circle cx="28" cy="28" r="4" fill="#ef8a80"/><circle cx="40" cy="30" r="4" fill="#ef8a80"/><circle cx="32" cy="42" r="4" fill="#ef8a80"/>'],
  cinema: ['Cinema', '<path d="M14 22h36l-6 36H20z" fill="#fff"/><path d="M22 22l2 36M32 22v36M42 22l-2 36" stroke="#ef8a80" stroke-width="3"/><circle cx="20" cy="16" r="6" fill="#fff6d6"/><circle cx="30" cy="12" r="7" fill="#fff6d6"/><circle cx="42" cy="15" r="7" fill="#fff6d6"/>'],
  folga: ['Folga', '<path d="M8 40h48l-4 14H12z" fill="#7aa7e8"/><path d="M16 40c0-10 6-18 16-18s16 8 16 18" fill="#f7c948"/><path d="M44 10h8l-8 8h8"/>'],
  passeio: ['Passeio', '<path d="M4 54l18-28 12 16 8-10 18 22z" fill="#6cc7a0"/><circle cx="46" cy="16" r="8" fill="#f7c948"/>'],
};

function icon(key, cls = '') {
  const [label, body, vb] = ICONS[key] || ICONS.estrela;
  // Cenas do tucano: já vêm com fundo e cores próprias.
  if (vb) return `<svg class="ico scene ${cls}" viewBox="${vb}" role="img" aria-label="${label}">${body}</svg>`;
  return `<svg class="ico ${cls}" viewBox="0 0 64 64" role="img" aria-label="${label}"><g fill="none" stroke="#3d4260" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round">${body}</g></svg>`;
}

// Cenas do tucano fazendo cada atividade (viewBox 0 0 100 100), no estilo dos cartões de rotina infantil.
const TC_INK = '#3d4260';
function tc({ x = 2, y = 10, s = .8, eyes = 'open', wing = 'side', outfit = '', feet = true, body = true } = {}) {
  const wings = {
    side: '<path d="M20 58c-6 6-6 18 2 24 4-8 6-16 4-24z" fill="#555b7d"/>',
    front: '<path d="M44 56c8-6 18-8 26-6-2 6-14 12-24 12z" fill="#555b7d"/>',
    up: '<path d="M22 54c-6-10-2-24 6-30 2 8 0 20-2 30z" fill="#555b7d"/>',
    wave: '<path d="M20 58c-6 6-6 18 2 24 4-8 6-16 4-24z" fill="#555b7d"/><path d="M50 52c6-8 12-16 20-18 0 8-8 18-16 22z" fill="#555b7d"/>',
  };
  const eye = eyes === 'closed' ? '<path d="M38 38q5 4 10 0" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/>'
    : eyes === 'happy' ? '<path d="M38 39q5-5 10 0" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/>'
    : '<circle cx="43" cy="37" r="7" fill="#7aa7e8"/><circle cx="43" cy="37" r="4.2" fill="#fff"/><circle cx="44.5" cy="37" r="2.6" fill="' + TC_INK + '"/><circle cx="45.5" cy="35.8" r="1" fill="#fff"/>';
  const outfits = {
    shirt: '<path d="M18 52c4-6 10-8 18-8s14 2 18 8l-2 22H20z" fill="#7aa7e8"/>',
    jacket: '<path d="M16 54c4-8 12-10 20-10s16 2 20 10l-2 26H18z" fill="#e0692b"/><path d="M36 46v34" stroke="' + TC_INK + '" stroke-width="1.5"/><circle cx="40" cy="58" r="1.5" fill="' + TC_INK + '"/><circle cx="40" cy="68" r="1.5" fill="' + TC_INK + '"/>',
    pajama: '<path d="M16 54c4-8 12-10 20-10s16 2 20 10l-2 30H18z" fill="#a891f0"/><circle cx="28" cy="62" r="2" fill="#fff6dc"/><circle cx="44" cy="72" r="2" fill="#fff6dc"/><circle cx="30" cy="78" r="1.6" fill="#fff6dc"/><path d="M42 58a4 4 0 104 5 3 3 0 01-4-5z" fill="#f7c948"/>',
    backpack: '<rect x="4" y="48" width="16" height="26" rx="6" fill="#6cc7a0" stroke="' + TC_INK + '" stroke-width="1.5"/><path d="M22 50c6 4 14 6 22 6" stroke="#4fae86" stroke-width="3" fill="none"/>',
  };
  return `<g transform="translate(${x} ${y}) scale(${s})">
    ${outfit === 'backpack' ? outfits.backpack : ''}
    ${feet ? '<path d="M30 88l-3 6M36 88l0 6M44 88l3 6" stroke="#f4845f" stroke-width="3" stroke-linecap="round"/>' : ''}
    ${body ? `<ellipse cx="36" cy="64" rx="20" ry="25" fill="${TC_INK}"/>` : ''}
    <ellipse cx="34" cy="38" rx="17" ry="16" fill="${TC_INK}"/>
    ${body ? '<ellipse cx="40" cy="62" rx="11" ry="16" fill="#fff6dc"/>' : ''}
    ${outfit && outfit !== 'backpack' ? outfits[outfit] : ''}
    ${body ? wings[wing] || '' : ''}
    <path d="M47 30c10-7 30-6 38 6 2 3-1 6-5 5-10-2-22-2-33 3z" fill="#ffb347"/>
    <path d="M47 44c11-4 23-4 33-3-5 6-18 9-31 7z" fill="#f4845f"/>
    <path d="M80 33c3 2 6 4 5 7-1 2-3 2-5 1 0-3 0-5 0-8z" fill="${TC_INK}"/>
    ${eye}
    <ellipse cx="34" cy="46" rx="4" ry="2.4" fill="#ff8fa3" opacity=".6"/>
  </g>`;
}
const tcCard = (bg, inner) => `<rect x="2" y="2" width="96" height="96" rx="20" fill="${bg}"/>${inner}`;
const TC_S = 'stroke="' + TC_INK + '" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"';
const tcToilet = (x, y) => `<g transform="translate(${x} ${y})" ${TC_S}><rect x="8" y="0" width="18" height="16" rx="2" fill="#dfe8f7"/><path d="M0 18h34c0 10-7 16-17 16S0 28 0 18z" fill="#fff"/><path d="M8 32l-2 10h22l-2-10" fill="#fff"/></g>`;
const tcSink = (x, y) => `<g transform="translate(${x} ${y})" ${TC_S}><path d="M0 14h36v4a12 12 0 01-12 12H12A12 12 0 010 18z" fill="#fff"/><path d="M26 14V4a5 5 0 0110 0" fill="none"/><path d="M14 30v14h8V30" fill="#dfe8f7"/></g>`;
const tcDrops = (pts) => pts.map(([x, y, r = 3]) => `<path d="M${x} ${y - r * 1.6}c-${r} ${r * 1.5}-${r} ${r * 2.2} 0 ${r * 2.6}c${r}-.4 ${r}-1.1 0-${r * 2.6}z" fill="#7cc3f0"/>`).join('');
const tcTable = y => `<path d="M2 ${y}h96v8H2z" fill="#c99a6b"/>`;
const SCENES = {
  t_acordar: tcCard('#fff3c4', `<circle cx="80" cy="22" r="10" fill="#f7c948"/><path d="M80 6v-4M92 12l3-3M96 22h4M68 12l-3-3" stroke="#f7c948" stroke-width="2.5" stroke-linecap="round"/>` + tc({ wing: 'wave', eyes: 'happy' }) + `<g ${TC_S}><circle cx="82" cy="76" r="10" fill="#ef8a80"/><circle cx="82" cy="76" r="7" fill="#fff"/><path d="M82 72v4l3 2M74 66l-3-3M90 66l3-3"/></g>`),
  t_banheiro: tcCard('#e3efff', tc({ x: 0 }) + tcToilet(60, 46)),
  t_xixi: tcCard('#d9dcf2', `<rect x="66" y="10" width="24" height="22" rx="3" fill="#5b6aa8"/><path d="M80 14a6 6 0 105 9 5 5 0 01-5-9z" fill="#f7c948"/>` + tc({ x: 0 }) + tcToilet(60, 50)),
  t_rosto: tcCard('#dff3ff', tc({ x: 0, eyes: 'closed', wing: 'front' }) + tcSink(58, 58) + tcDrops([[52, 24], [62, 30, 2.5], [30, 20, 2.5]])),
  t_dentes: tcCard('#dff3ff', tc({ x: 0, wing: 'front' }) + `<path d="M54 58l20-18" stroke="#7aa7e8" stroke-width="5" stroke-linecap="round"/><rect x="70" y="30" width="12" height="8" rx="2" transform="rotate(-42 76 34)" fill="#fff" ${TC_S}/>` + `<g fill="#fff" stroke="#bfe6ff" stroke-width="1.5"><circle cx="66" cy="54" r="3.5"/><circle cx="74" cy="60" r="2.5"/><circle cx="60" cy="62" r="2"/></g><g ${TC_S}><path d="M76 70c0-5 2-7 5-7s3 2 5 2 5-2 6 2-1 9-3 12-3 5-4 3-1-5-3-5-2 5-3 5-3-7-3-12z" fill="#fff"/></g>`),
  t_trocar: tcCard('#e9f8f1', tc({ x: 0, outfit: 'shirt', wing: 'front' }) + `<g ${TC_S}><path d="M66 48h18l-2 30h-5l-2-16-2 16h-5z" fill="#f7c948"/></g>`),
  t_pentear: tcCard('#fdeef2', `<path d="M14 18c4-10 16-14 26-8" stroke="#f0a35e" stroke-width="3" fill="none" stroke-linecap="round"/>` + tc({ x: 4, wing: 'up' }) + `<g ${TC_S}><ellipse cx="22" cy="10" rx="9" ry="6" fill="#f0a35e"/><path d="M15 9h14M16 12h12"/><path d="M14 14L8 22" stroke-width="4" stroke="#f0a35e"/></g>`),
  t_cama: tcCard('#efe9ff', `<g ${TC_S}><path d="M50 62h46v20H50z" fill="#a891f0"/><path d="M50 82v10M96 54v38M50 54v8"/><rect x="54" y="54" width="16" height="9" rx="4" fill="#fff"/><path d="M56 70h36M56 76h36" stroke="#fff"/></g>` + tc({ x: -4, wing: 'front' })),
  t_cafe: tcCard('#fff3e0', tc({ x: 0, feet: false }) + tcTable(76) + `<g ${TC_S}><path d="M46 62h26c0 9-6 14-13 14s-13-5-13-14z" fill="#fff"/><path d="M50 62c2-3 18-3 20 0" fill="#f7d79a"/><path d="M66 48l-6 14" stroke-width="2.5"/><path d="M78 56h12v16a4 4 0 01-4 4h-4a4 4 0 01-4-4z" fill="#fff"/><path d="M90 60h3a3 3 0 010 7h-3"/></g>`),
  t_pia: tcCard('#e3efff', tc({ x: 0, wing: 'front' }) + `<g ${TC_S}><ellipse cx="66" cy="52" rx="12" ry="4" fill="#fff"/><ellipse cx="66" cy="51" rx="6" ry="1.8" fill="#f7d79a"/></g>` + tcSink(62, 62)),
  t_casaco: tcCard('#fdebe0', tc({ x: 4, outfit: 'jacket', wing: 'side' }) + `<path d="M74 30v58" stroke="#b98560" stroke-width="3"/><path d="M66 40h16" stroke="#b98560" stroke-width="3" stroke-linecap="round"/>`),
  t_mochila: tcCard('#e9f8f1', `<g ${TC_S}><rect x="68" y="20" width="26" height="70" rx="2" fill="#c99a6b"/><circle cx="74" cy="56" r="2" fill="${TC_INK}"/></g>` + tc({ x: 4, outfit: 'backpack', wing: 'wave' })),
  t_escola: tcCard('#fff3c4', `<g ${TC_S}><path d="M58 40l18-12 18 12" fill="#ef8a80"/><path d="M60 40h32v42H60z" fill="#f7d79a"/><path d="M71 82V68h10v14" fill="#b98560"/><path d="M64 48h8v8h-8zM80 48h8v8h-8z" fill="#bfe6ff"/><path d="M76 28V18h8v5h-8" fill="#7aa7e8"/></g>` + tc({ x: 0, outfit: 'backpack', wing: 'wave' })),
  t_sapato: tcCard('#e3efff', tc({ x: 0, wing: 'front' }) + `<g ${TC_S}><path d="M58 74h38M58 88h38M60 74v14M94 74v14"/><path d="M62 72v-8h6l3 4c4 1 8 2 10 4z" fill="#7aa7e8"/><path d="M78 86v-8h6l3 4c4 1 7 2 8 4z" fill="#ef8a80"/><path d="M58 52v-6h5l2 3c3 1 6 2 7 3z" fill="#7aa7e8"/></g>`),
  t_maos: tcCard('#dff3ff', tc({ x: 0, wing: 'front' }) + tcSink(56, 62) + `<g fill="#fff" stroke="#bfe6ff" stroke-width="1.5"><circle cx="64" cy="50" r="4"/><circle cx="72" cy="44" r="3"/><circle cx="58" cy="44" r="2.5"/><circle cx="76" cy="54" r="2"/></g>` + tcDrops([[86, 52, 2.5]])),
  t_lancheira: tcCard('#efe9ff', tc({ x: 0, wing: 'front' }) + `<g ${TC_S}><rect x="56" y="48" width="30" height="20" rx="5" fill="#a891f0"/><path d="M56 56h30M65 48v-4h12v4"/></g>` + tcSink(60, 70).replace('translate(60 70)', 'translate(60 72) scale(.9)')),
  t_lanche: tcCard('#fdeef2', tc({ x: 0, wing: 'front', eyes: 'happy' }) + `<g ${TC_S}><path d="M66 46c-4-4-14-3-14 7 0 8 6 15 10 14 2 0 4 0 6 0 4 1 10-6 10-14 0-10-10-11-12-7z" fill="#ef8a80"/><path d="M66 46c0-4 1-6 3-7"/><path d="M68 42c2-4 7-4 8-2-2 4-6 4-8 2z" fill="#6cc7a0"/></g>`),
  t_futebol: tcCard('#e9f8f1', `<path d="M2 84h96v14H2z" fill="#9ad8a8"/>` + tc({ x: 0 }) + `<g ${TC_S}><circle cx="76" cy="76" r="12" fill="#fff"/><path d="M76 70l5 4-2 6h-6l-2-6z" fill="${TC_INK}"/></g><path d="M58 68l6 4M58 76h6" stroke="${TC_INK}" stroke-width="1.6" stroke-linecap="round"/>`),
  t_brinquedos: tcCard('#fff3c4', tc({ x: 0, wing: 'front' }) + `<g ${TC_S}><path d="M58 66h38v24H58z" fill="#f7c948"/><path d="M58 66h38"/><circle cx="68" cy="60" r="7" fill="#ef8a80"/><rect x="78" y="54" width="12" height="12" rx="2" fill="#6cc7a0"/><path d="M66 46l4-6 4 6z" fill="#7aa7e8"/></g>`),
  t_banho: tcCard('#dff3ff', tc({ x: 4, y: 14, eyes: 'happy', feet: false }) + `<g ${TC_S}><path d="M2 62h96v10a18 18 0 01-18 18H20A18 18 0 012 72z" fill="#fff"/></g><g fill="#fff" stroke="#bfe6ff" stroke-width="1.5"><circle cx="22" cy="58" r="6"/><circle cx="34" cy="56" r="7"/><circle cx="52" cy="58" r="6"/><circle cx="66" cy="54" r="5"/><circle cx="80" cy="57" r="6"/><circle cx="70" cy="44" r="3"/><circle cx="78" cy="38" r="2.5"/></g>`),
  t_pijama: tcCard('#d9dcf2', `<path d="M84 12a10 10 0 1010 14 8 8 0 01-10-14z" fill="#f7c948"/><circle cx="70" cy="20" r="1.6" fill="#fff"/><circle cx="90" cy="40" r="1.4" fill="#fff"/>` + tc({ x: 4, outfit: 'pajama', eyes: 'happy' })),
  t_licao: tcCard('#fff3e0', tc({ x: 0, wing: 'front', feet: false }) + tcTable(76) + `<g ${TC_S}><path d="M50 68l14-6 16 6-16 6z" fill="#fff"/><path d="M64 62v12"/><path d="M80 52l8-14 3 2-8 14-4 2z" fill="#f7c948"/></g>`),
  t_mesa: tcCard('#fff3e0', tc({ x: 0, wing: 'front', feet: false }) + tcTable(78) + `<g ${TC_S}><ellipse cx="72" cy="74" rx="14" ry="4" fill="#fff"/><path d="M54 66v10M90 66v10"/></g>`),
  t_jantar: tcCard('#fdebe0', tc({ x: 0, eyes: 'happy', feet: false }) + tcTable(78) + `<g ${TC_S}><ellipse cx="70" cy="72" rx="18" ry="6" fill="#fff"/><path d="M58 70c4-6 20-6 24 0" fill="#f7c948"/><circle cx="66" cy="68" r="2" fill="#ef8a80"/><circle cx="74" cy="67" r="2" fill="#ef8a80"/><path d="M92 58v18"/></g>`),
  t_tirar_mesa: tcCard('#e3efff', tc({ x: 0, wing: 'front' }) + `<g ${TC_S}><ellipse cx="68" cy="56" rx="13" ry="3.5" fill="#fff"/><ellipse cx="68" cy="51" rx="13" ry="3.5" fill="#fff"/><ellipse cx="68" cy="46" rx="13" ry="3.5" fill="#fff"/></g><path d="M84 72h10M88 66l6 6-6 6" stroke="${TC_INK}" stroke-width="2" fill="none" stroke-linecap="round"/>`),
  t_mesa_cafe: tcCard('#fff3c4', tc({ x: 0, wing: 'front', feet: false }) + tcTable(78) + `<g ${TC_S}><path d="M58 62h14v10a5 5 0 01-5 5h-4a5 5 0 01-5-5z" fill="#ef8a80"/><path d="M72 66h3a3 3 0 010 6h-3"/><path d="M80 76c0-6 3-9 7-9s7 3 7 9z" fill="#f7d79a"/></g>`),
  t_leitura: tcCard('#efe9ff', tc({ x: 0, wing: 'front', feet: true }) + `<g ${TC_S}><path d="M50 64c6-4 13-4 18 0v18c-5-4-12-4-18 0z" fill="#fff"/><path d="M86 64c-6-4-13-4-18 0v18c5-4 12-4 18 0z" fill="#bfe6ff"/></g>`),
  t_dormir: tcCard('#d9dcf2', `<path d="M80 12h8l-8 8h8M90 26h6l-6 6h6" fill="none" stroke="${TC_INK}" stroke-width="2" stroke-linecap="round"/>` + `<g ${TC_S}><path d="M4 74h92v14H4z" fill="#b98560"/><path d="M4 50v40M96 66v24"/><rect x="6" y="50" width="30" height="16" rx="7" fill="#fff"/></g>` + tc({ x: -2, y: 24, s: .72, eyes: 'closed', body: false, feet: false }) + `<g ${TC_S}><path d="M30 64h66v14H30z" fill="#a891f0"/><path d="M36 70h56" stroke="#fff"/></g>`),
};

// Cenas do tucano entram na lista de figuras (aparecem primeiro na escolha de figura).
const SCENE_LABELS = { t_acordar: 'Acordar', t_banheiro: 'Ir ao banheiro', t_xixi: 'Xixi antes de dormir', t_rosto: 'Lavar o rosto', t_dentes: 'Escovar os dentes',
  t_trocar: 'Se trocar', t_pentear: 'Pentear o cabelo', t_cama: 'Arrumar a cama', t_cafe: 'Café da manhã', t_pia: 'Levar para a pia', t_casaco: 'Casaco',
  t_mochila: 'Mochila e sair', t_escola: 'Escola', t_sapato: 'Sapatos no lugar', t_maos: 'Lavar as mãos', t_lancheira: 'Lancheira na pia', t_lanche: 'Lanche',
  t_futebol: 'Futebol', t_brinquedos: 'Guardar os brinquedos', t_banho: 'Banho', t_pijama: 'Pijama', t_licao: 'Lição de casa', t_mesa: 'Colocar a mesa',
  t_jantar: 'Jantar', t_tirar_mesa: 'Tirar a mesa', t_mesa_cafe: 'Mesa do café', t_leitura: 'Leitura', t_dormir: 'Dormir' };
{
  const drawn = { ...ICONS };
  Object.keys(ICONS).forEach(k => delete ICONS[k]);
  Object.entries(SCENES).forEach(([k, body]) => { ICONS[k] = [SCENE_LABELS[k] || k, body, '0 0 100 100']; });
  Object.assign(ICONS, drawn);
}

