// Rotina inicial da família. Usada quando o app abre pela primeira vez sem dados salvos.
function familySeed() {
  const id = () => Math.random().toString(36).slice(2, 10);
  const ALL = [0, 1, 2, 3, 4, 5, 6], WEEK = [1, 2, 3, 4, 5], MON_THU = [1, 2, 3, 4];
  const g = id(), b = id(), a = id(), s = id();
  const pais = [g, b], kids = [a, s];
  const periodOf = t => !t ? 'livre' : parseInt(t, 10) < 12 ? 'manha' : parseInt(t, 10) < 18 ? 'tarde' : 'noite';
  const tasks = [];
  const add = (o, list) => list.forEach(([title, icon, points, note = '']) => tasks.push({
    id: id(), title, icon, points, note, time: o.time || '', period: o.period || periodOf(o.time),
    memberIds: o.who, house: !!o.house, days: o.days || ALL, alert: !!o.alert,
  }));

  // Arthur (6) e Sophie (2)
  add({ period: 'manha', who: kids }, [
    ['Acordar', 'acordar', 5], ['Ir ao banheiro', 'banheiro', 5], ['Lavar o rosto', 'rosto', 5], ['Escovar os dentes', 'dentes', 5],
    ['Se trocar', 'trocar', 10], ['Pentear o cabelo', 'pentear', 5], ['Arrumar a cama', 'cama', 10],
    ['Tomar café da manhã', 'cafe', 5], ['Levar o que usou para a pia', 'pia', 5]]);
  add({ period: 'manha', who: kids, days: WEEK }, [['Colocar o casaco', 'casaco', 5], ['Pegar a mochila e sair', 'mochila', 5]]);
  add({ time: '07:55', who: [a], days: [2], alert: true }, [['Escola às 08:00 em ponto', 'escola', 10, 'Atividade extra de terça · chegar 5 min antes']]);
  add({ period: 'tarde', time: '16:00', who: kids, days: WEEK }, [['Tirar casaco e sapatos e guardar', 'sapato', 5]]);
  add({ period: 'tarde', who: kids, days: WEEK }, [['Lavar as mãos', 'maos', 5], ['Lancheira na pia', 'lancheira', 5], ['Comer um lanche', 'lanche', 5]]);
  add({ time: '16:30', who: [a], days: [4], alert: true }, [['Futebol', 'futebol', 10]]);
  add({ period: 'noite', time: '17:40', who: kids }, [['Arrumar os brinquedos', 'brinquedos', 10]]);
  add({ period: 'noite', who: kids }, [['Tomar banho', 'banho', 5], ['Colocar o pijama', 'pijama', 5]]);
  add({ period: 'noite', who: [a], days: WEEK }, [['Lição de casa', 'licao', 15]]);
  add({ period: 'noite', who: kids }, [
    ['Colocar a mesa', 'mesa', 10], ['Jantar', 'jantar', 5], ['Ajudar a tirar a mesa', 'tirar_mesa', 10], ['Colocar a mesa do café', 'mesa_cafe', 5],
    ['Fazer xixi', 'xixi', 5], ['Escovar os dentes', 'dentes', 5], ['Leitura', 'leitura', 5], ['Dormir', 'dormir', 5]]);

  tasks.push(...houseTasks(pais, id, b));

  return {
    pin: '1234',
    members: [
      { id: g, name: 'Gabriele', color: '#e8a0b4', adult: true },
      { id: b, name: 'Bruno', color: '#8fb3e8', adult: true },
      { id: a, name: 'Arthur', color: '#f2c46b', adult: false },
      { id: s, name: 'Sophie', color: '#8fd6b6', adult: false },
    ],
    tasks,
    focus: HOUSE_FOCUS,
    rewards: [
      { id: id(), title: 'Escolher o desenho', icon: 'tv', cost: 30 },
      { id: id(), title: 'Escolher a sobremesa', icon: 'sorvete', cost: 50 },
      { id: id(), title: 'Ir ao parquinho', icon: 'parquinho', cost: 80 },
      { id: id(), title: 'Escolher o jantar', icon: 'pizza', cost: 100 },
      { id: id(), title: 'Noite de cinema', icon: 'cinema', cost: 150 },
      { id: id(), title: 'Folga de uma tarefa', icon: 'folga', cost: 150 },
      { id: id(), title: 'Passeio especial', icon: 'passeio', cost: 300 },
    ],
  };
}

// Rotina da casa enxuta: nada da lista original saiu, só ganhou ritmo (todo dia, toda semana, a cada 15 dias, todo mês).
// Cada dia útil tem um cômodo de foco. Gabriele ou Bruno fazem; ganha quem fizer.
// group: diaria · criancas · limpeza (foco do dia) · fechamento (fim da tarde, com as crianças acordadas)
const HOUSE_FOCUS = { 1: 'roupas e escritório', 2: 'cozinha', 3: 'quartos', 4: 'banheiros', 5: 'sala e geladeira', 6: 'carro e compras' };

function houseTasks(pais, id, bruno) {
  const ALL = [0, 1, 2, 3, 4, 5, 6], WEEK = [1, 2, 3, 4, 5], SCHOOL_EVE = [0, 1, 2, 3, 4];
  const tasks = [];
  const push = (group, extra, list) => list.forEach(([title, icon, points = 5, note = '']) => tasks.push({
    id: id(), title, icon, points, note, time: '', period: 'livre', group, memberIds: pais, house: true, days: [], alert: false, ...extra,
  }));
  const weekly = (group, days, list) => push(group, { days }, list);
  // A cada N semanas (ou meses), no dia do cômodo. start = primeira vez.
  const every = (group, n, unit, weekday, start, list) => push(group, { repeat: 'interval', every: n, unit, weekday, start }, list);
  const nextLocal = wd => { const d = new Date(); while (d.getDay() !== wd) d.setDate(d.getDate() + 1); const z = n => String(n).padStart(2, '0'); return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`; };

  // Todos os dias
  weekly('diaria', WEEK, [['Sair de casa levando os lixos', 'saco_lixo']]);
  weekly('diaria', ALL, [
    ['Abrir janelas de todos os quartos', 'janela'],
    ['Arrumar camas (esticar bem os lençóis)', 'cama'],
    ['Alinhar travesseiros e borrifar home spray', 'spray'],
    ['Banheiro: limpar pia, secar, escova rápida no vaso', 'banheiro'],
    ['Cozinha: pia limpa e bancada', 'pia']]);

  // Com as crianças (dias de Kindergarten)
  weekly('criancas', WEEK, [['Rotina matinal + Kindergarten', 'manha', 10]]);
  weekly('criancas', [2], [['Levar o Arthur na escola', 'escola', 10, '08:00 em ponto · chegar 5 min antes']]);
  weekly('criancas', WEEK, [['Buscar as crianças', 'carro'], ['Tempo das crianças', 'familia', 10]]);
  weekly('criancas', [4], [['Levar o Arthur no futebol', 'futebol', 10, 'Às 16:30']]);
  weekly('criancas', WEEK, [['Preparar jantar', 'panela', 10], ['Banho e pijama das crianças', 'banho', 10], ['Jantar em família', 'familia'], ['Início da rotina noturna', 'noite', 15]]);

  // Foco do dia
  // Segunda: roupas e escritório
  weekly('limpeza', [1], [
    ['Separar roupas por volume e verificar bolsos', 'roupa'], ['Lavar roupas', 'roupa'], ['Transferir para secadora ou varal', 'varal'],
    ['Limpar filtro da secadora', 'roupa'], ['Deixar máquina aberta e secar gaveta de sabão', 'roupa']]);
  every('limpeza', 2, 'semanas', 1, nextLocal(1), [['Escritório: organizar mesa e guardar papéis', 'escritorio'], ['Escritório: limpar superfície e verificar lixo', 'lixo']]);
  every('limpeza', 1, 'meses', 1, nextLocal(1), [['Aplicar rotina da máquina de lavar', 'roupa'], ['Limpar a secadora', 'roupa']]);
  // Terça: cozinha
  weekly('limpeza', [2], [
    ['Esvaziar e limpar bancada da cozinha', 'fogao'], ['Limpar pia profundamente e ralo', 'pia'], ['Retirar lixo', 'lixo'],
    ['Regar plantas: grandes 500 ml, médias 250 ml, pequenas 100 ml', 'planta']]);
  every('limpeza', 2, 'semanas', 2, nextLocal(2), [['Limpar armários externos e puxadores', 'spray'], ['Limpar eletrodomésticos visíveis', 'spray'], ['Lavar lixeira por dentro', 'lixo', 10]]);
  every('limpeza', 1, 'meses', 2, nextLocal(2), [['Limpar as grelhas da coifa', 'coifa', 10], ['Limpar a lava-louças (filtro)', 'lava_loucas', 10], ['Limpar 1 gaveta ou armário interno', 'lista']]);
  // Quarta: quartos
  weekly('limpeza', [3], [['Trocar roupa de cama das crianças', 'cama', 10], ['Lavar e secar roupa de cama', 'roupa']]);
  every('limpeza', 2, 'semanas', 3, nextLocal(3), [['Trocar roupa de cama do casal', 'cama', 10], ['Aspirar cantos e base das camas', 'aspirador']]);
  every('limpeza', 1, 'meses', 3, nextLocal(3), [['Organizar 1 parte do armário (gaveta ou prateleira)', 'lista']]);
  // Quinta: banheiros
  weekly('limpeza', [4], [
    ['Abrir janelas dos banheiros', 'janela'], ['Aplicar produto forte no vaso', 'banheiro'], ['Limpar espelho com produto específico', 'espelho'],
    ['Limpar pia: multiuso + torneira + ralo', 'pia'], ['Limpar vaso por dentro e por fora', 'banheiro'], ['Esfregar banheira, enxaguar e secar bordas', 'banho', 10],
    ['Ralo: remover cabelo, água quente, produto', 'banho'], ['Aspirar e passar pano com desinfetante no chão', 'vassoura', 10],
    ['Alinhar toalhas, dobrar papel, home spray', 'toalha'], ['Lavar toalhas', 'roupa'], ['Plantas: rega leve e limpar folhas', 'planta']]);
  every('limpeza', 1, 'meses', 4, nextLocal(4), [['Limpar 1 armário interno ou gaveta do banheiro', 'lista']]);
  // Sexta: sala e geladeira (dia leve) e lista para o sábado
  weekly('limpeza', [5], [
    ['Tirar o pó dos móveis', 'po'], ['Organizar geladeira e limpar 1 prateleira', 'geladeira'],
    ['Verificar estoque: papel, limpeza, cozinha, lancheira', 'lista'], ['Lavar roupas da escola', 'roupa']]);
  every('limpeza', 2, 'semanas', 5, nextLocal(5), [['Limpar os vidros da sala', 'vidro', 10], ['Aspirar rodapés e cantos', 'aspirador', 10], ['Keller: organização, fora do lugar, reciclagem', 'reciclar', 10]]);
  // Sábado: compras e carro (Bruno)
  weekly('limpeza', [6], [['Guardar as compras ao chegar', 'compras'], ['Lavar frutas, secar e organizar', 'frutas']]);
  if (bruno) {
    push('limpeza', { days: [6], memberIds: [bruno], house: false, period: 'manha' }, [['Fazer as compras', 'compras', 15], ['Aspirar o carro', 'carro', 10]]);
    push('limpeza', { repeat: 'interval', every: 2, unit: 'semanas', weekday: 6, start: nextLocal(6), memberIds: [bruno], house: false, period: 'manha' }, [['Organizar e limpar o carro por dentro', 'carro', 15]]);
  }
  // Jardim: a cada 2 semanas, contando da última vez (feito hoje).
  const todayLocal = nextLocal(new Date().getDay());
  push('limpeza', { repeat: 'interval', every: 2, unit: 'semanas', weekday: '', start: todayLocal, last: todayLocal }, [['Cortar a grama', 'grama', 15]]);

  // Fechamento do dia: no fim da tarde, com as crianças acordadas
  weekly('fechamento', [1], [['Ligar robô aspirador em cada andar', 'robo']]);
  weekly('fechamento', ALL, [
    ['Cozinha: lava-louças (tirar ou colocar)', 'lava_loucas'], ['Limpar o fogão de indução', 'inducao'],
    ['Cozinha: limpar e secar pia e bancada, verificar lixo', 'pia'],
    ['Guardar brinquedos e itens fora do lugar', 'brinquedos'], ['Entrada: alinhar sapatos e pendurar casacos', 'sapato'],
    ['Deixar sala arrumada', 'sofa'], ['Colocar mesa do café da manhã', 'mesa_cafe']]);
  weekly('fechamento', SCHOOL_EVE, [
    ['Separar roupa das crianças para o dia seguinte', 'trocar'], ['Separar as próprias roupas para amanhã', 'trocar'],
    ['Verificar banheiros rapidamente', 'banheiro'], ['Preparar lancheiras (parte seca)', 'lancheira'],
    ['Preparar mochilas e itens da escola', 'mochila'], ['Preparar mesa de estudo com lição de amanhã', 'licao']]);
  weekly('fechamento', [6], [['Separar roupas da semana (domingo: reset)', 'trocar']]);
  return tasks;
}
