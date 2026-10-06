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

  tasks.push(...houseTasks(pais, id));

  return {
    pin: '1234',
    members: [
      { id: g, name: 'Gabriele', color: '#e8a0b4', adult: true },
      { id: b, name: 'Bruno', color: '#8fb3e8', adult: true },
      { id: a, name: 'Arthur', color: '#f2c46b', adult: false },
      { id: s, name: 'Sophie', color: '#8fd6b6', adult: false },
    ],
    tasks,
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

// Rotina da casa, como no PDF "Rotina semanal": Gabriele ou Bruno fazem, ganha quem fizer. Sem horário.
// group: diaria (todos os dias) · limpeza (a limpeza de cada dia) · criancas · fechamento (fim do dia)
function houseTasks(pais, id) {
  const ALL = [0, 1, 2, 3, 4, 5, 6], WEEK = [1, 2, 3, 4, 5], MON_THU = [1, 2, 3, 4];
  const tasks = [];
  const add = (group, days, list) => list.forEach(([title, icon, points = 5, note = '']) => tasks.push({
    id: id(), title, icon, points, note, time: '', period: 'livre', group, memberIds: pais, house: true, days, alert: false,
  }));

  add('diaria', ALL, [
    ['Abrir janelas de todos os quartos', 'janela'],
    ['Arrumar camas (esticar bem os lençóis)', 'cama'],
    ['Alinhar travesseiros e borrifar home spray', 'spray'],
    ['Banheiro: limpar pia, secar, escova rápida no vaso', 'banheiro'],
    ['Cozinha: pia limpa, bancada, fogão superficial', 'fogao'],
    ['Entrada: alinhar sapatos e pendurar casacos', 'sapato'],
    ['Guardar brinquedos e itens fora do lugar', 'brinquedos']]);

  add('limpeza', [1], [
    ['Ligar robô aspirador em cada andar', 'robo'],
    ['Separar roupas por volume e verificar bolsos', 'roupa'],
    ['Lavar roupas', 'roupa'],
    ['Transferir para secadora ou varal', 'varal'],
    ['Limpar filtro da secadora', 'roupa'],
    ['Deixar máquina aberta e secar gaveta de sabão', 'roupa'],
    ['Aspirar rodapés e cantos', 'aspirador', 10],
    ['Escritório: organizar mesa e guardar papéis', 'escritorio'],
    ['Escritório: limpar superfície e verificar lixo', 'lixo']]);
  add('limpeza', [2], [
    ['Esvaziar e limpar bancada da cozinha', 'fogao'],
    ['Desengordurar fogão (inclusive peças)', 'fogao', 10],
    ['Limpar pia profundamente e ralo', 'pia'],
    ['Limpar armários externos e puxadores', 'spray'],
    ['Limpar eletrodomésticos visíveis', 'spray'],
    ['Limpar 1 gaveta ou armário interno', 'lista'],
    ['Regar plantas: grandes 500 ml, médias 250 ml, pequenas 100 ml', 'planta'],
    ['Borrifar suculentas e verificar folhas', 'suculenta'],
    ['Retirar lixo e lavar lixeira por dentro', 'lixo', 10]]);
  add('limpeza', [3], [
    ['Aspirar cantos e base das camas', 'aspirador'],
    ['Trocar roupa de cama das crianças', 'cama', 10],
    ['Trocar roupa de cama do casal (alternado)', 'cama', 10],
    ['Lavar e secar roupa de cama', 'roupa'],
    ['Aplicar rotina da máquina', 'roupa'],
    ['Organizar 1 parte do armário (gaveta ou prateleira)', 'lista']]);
  add('limpeza', [4], [
    ['Abrir janelas dos banheiros', 'janela'],
    ['Aplicar produto forte no vaso', 'banheiro'],
    ['Limpar espelho com produto específico', 'espelho'],
    ['Limpar pia: multiuso + torneira + ralo', 'pia'],
    ['Limpar vaso por dentro e por fora', 'banheiro'],
    ['Esfregar banheira, enxaguar e secar bordas', 'banho', 10],
    ['Ralo: remover cabelo, água quente, produto', 'banho'],
    ['Aspirar e passar pano com desinfetante no chão', 'vassoura', 10],
    ['Alinhar toalhas, dobrar papel, home spray', 'toalha'],
    ['Lavar toalhas', 'roupa'],
    ['Plantas: rega leve e limpar folhas', 'planta'],
    ['Limpar 1 armário interno ou gaveta', 'lista']]);
  add('limpeza', [5], [
    ['Verificar estoque: papel, limpeza, cozinha, lancheira', 'lista'],
    ['Fazer lista e ir às compras', 'compras', 15],
    ['Guardar tudo imediatamente ao chegar', 'compras'],
    ['Lavar frutas, secar e organizar', 'frutas'],
    ['Organizar geladeira e limpar 1 prateleira', 'geladeira'],
    ['Keller: organização, fora do lugar, reciclagem', 'reciclar', 10],
    ['Lavar roupas da escola', 'roupa'],
    ['Organizar e limpar carro por dentro', 'carro', 10]]);

  add('criancas', WEEK, [['Rotina matinal + Kindergarten', 'manha', 10]]);
  add('criancas', [2], [['Levar o Arthur na escola', 'escola', 10, '08:00 em ponto · chegar 5 min antes']]);
  add('criancas', WEEK, [['Buscar as crianças', 'carro'], ['Tempo das crianças', 'familia', 10]]);
  add('criancas', [4], [['Levar o Arthur no futebol', 'futebol', 10, 'Às 16:30']]);
  add('criancas', WEEK, [
    ['Preparar jantar', 'panela', 10], ['Banho e pijama das crianças', 'banho', 10], ['Jantar em família', 'familia'],
    ['Limpar mesa e cozinha', 'pia', 10], ['Início da rotina noturna', 'noite', 15]]);

  add('fechamento', WEEK, [['Cozinha: lava-louças (tirar ou colocar)', 'lava_loucas']]);
  add('fechamento', MON_THU, [
    ['Cozinha: limpar e secar pia', 'pia'],
    ['Cozinha: limpar bancada e verificar lixo', 'lixo'],
    ['Separar roupa das crianças para amanhã', 'trocar'],
    ['Separar as próprias roupas para amanhã', 'trocar'],
    ['Verificar banheiros rapidamente', 'banheiro'],
    ['Verificar entrada: sapatos e bolsas', 'sapato'],
    ['Deixar sala arrumada', 'sofa'],
    ['Preparar lancheiras (parte seca)', 'lancheira'],
    ['Preparar mochilas e itens da escola', 'mochila'],
    ['Colocar mesa do café da manhã', 'mesa_cafe'],
    ['Preparar mesa de estudo com lição de amanhã', 'licao']]);
  add('fechamento', [5], [
    ['Cozinha: limpar e secar pia e bancada', 'pia'],
    ['Separar roupa das crianças para segunda', 'trocar'],
    ['Separar as próprias roupas', 'trocar'],
    ['Verificar banheiros e entrada', 'banheiro'],
    ['Separar roupas da semana (domingo: reset)', 'trocar'],
    ['Preparar lancheiras e mochilas', 'mochila'],
    ['Colocar mesa do café da manhã', 'mesa_cafe'],
    ['Preparar mesa de estudo para segunda', 'licao']]);
  return tasks;
}
