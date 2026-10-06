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

  // Rotina da casa: Gabriele ou Bruno, ganha quem fizer.
  const casa = (o, list) => add({ who: pais, house: true, ...o }, list);
  casa({ period: 'manha' }, [
    ['Abrir as janelas dos quartos', 'janela', 5], ['Arrumar as camas', 'cama', 5, 'Esticar bem os lençóis'],
    ['Travesseiros e home spray', 'spray', 5], ['Banheiro rápido', 'banheiro', 5, 'Pia, secar, escova rápida no vaso'],
    ['Cozinha em ordem', 'fogao', 5, 'Pia limpa, bancada, fogão'], ['Entrada arrumada', 'sapato', 5, 'Sapatos alinhados e casacos pendurados'],
    ['Guardar o que está fora do lugar', 'brinquedos', 5]]);
  casa({ time: '06:30', days: WEEK }, [['Rotina da manhã + Kindergarten', 'manha', 10, '06:30–08:10']]);
  casa({ time: '07:55', days: [2] }, [['Levar o Arthur na escola', 'escola', 10, '08:00 em ponto · chegar 5 min antes']]);

  // Limpeza do dia (10:45)
  const day = (d, list) => casa({ time: '10:45', days: [d] }, list);
  day(1, [
    ['Ligar o robô aspirador', 'robo', 5], ['Separar roupas e ver bolsos', 'roupa', 5], ['Lavar roupas', 'roupa', 5],
    ['Secadora ou varal', 'varal', 5], ['Limpar filtro da secadora', 'roupa', 5], ['Máquina aberta e gaveta seca', 'roupa', 5],
    ['Aspirar rodapés e cantos', 'aspirador', 10], ['Escritório: mesa e papéis', 'escritorio', 5], ['Escritório: superfície e lixo', 'lixo', 5]]);
  day(2, [
    ['Esvaziar e limpar bancada', 'fogao', 5], ['Desengordurar fogão', 'fogao', 10], ['Pia e ralo da cozinha', 'pia', 5],
    ['Armários e puxadores', 'spray', 5], ['Limpar eletrodomésticos', 'spray', 5], ['Limpar 1 gaveta ou armário', 'lista', 5],
    ['Regar plantas', 'planta', 5, 'Grandes 500 ml · médias 250 ml · pequenas 100 ml'], ['Borrifar suculentas', 'suculenta', 5],
    ['Lixo e lavar a lixeira', 'lixo', 10]]);
  day(3, [
    ['Aspirar cantos e base das camas', 'aspirador', 5], ['Roupa de cama das crianças', 'cama', 10],
    ['Roupa de cama do casal', 'cama', 10, 'Semana sim, semana não'], ['Lavar e secar roupa de cama', 'roupa', 5],
    ['Rotina da máquina', 'roupa', 5], ['Organizar 1 parte do armário', 'lista', 5, 'Gaveta ou prateleira']]);
  day(4, [
    ['Abrir janelas dos banheiros', 'janela', 5], ['Produto forte no vaso', 'banheiro', 5], ['Limpar espelho', 'espelho', 5],
    ['Pia: multiuso, torneira e ralo', 'pia', 5], ['Vaso por dentro e por fora', 'banheiro', 5], ['Esfregar a banheira', 'banho', 10],
    ['Ralo do chuveiro', 'banho', 5], ['Aspirar e passar pano', 'vassoura', 10], ['Toalhas, papel e home spray', 'toalha', 5],
    ['Lavar toalhas', 'roupa', 5], ['Plantas: rega leve e folhas', 'planta', 5], ['Limpar 1 armário ou gaveta', 'lista', 5]]);
  day(5, [
    ['Verificar estoque', 'lista', 5, 'Papel, limpeza, cozinha, lancheira'], ['Lista e compras', 'compras', 15],
    ['Guardar as compras', 'compras', 5], ['Lavar e organizar frutas', 'frutas', 5], ['Geladeira: organizar e 1 prateleira', 'geladeira', 5],
    ['Keller: organizar e reciclagem', 'reciclar', 10], ['Lavar roupas da escola', 'roupa', 5], ['Limpar o carro por dentro', 'carro', 10]]);

  // Tarde e noite com as crianças
  casa({ time: '15:26', days: WEEK }, [['Buscar as crianças', 'carro', 5]]);
  casa({ time: '16:00', days: WEEK }, [['Tempo das crianças', 'familia', 10, '16:00–17:40']]);
  casa({ time: '16:30', days: [4] }, [['Levar o Arthur no futebol', 'futebol', 10]]);
  casa({ time: '17:30', days: WEEK }, [['Preparar o jantar', 'panela', 10]]);
  casa({ time: '17:40', days: WEEK }, [['Banho e pijama das crianças', 'banho', 10]]);
  casa({ time: '18:00', days: WEEK }, [['Jantar em família', 'familia', 5]]);
  casa({ time: '18:45', days: WEEK }, [['Limpar mesa e cozinha', 'pia', 10]]);
  casa({ time: '19:00', days: WEEK }, [['Início da rotina noturna', 'noite', 15, 'Xixi, dentes, leitura e dormir']]);

  // Fechamento do dia (19:40)
  const close = (days, list) => casa({ time: '19:40', days }, list);
  close(WEEK, [['Lava-louças', 'lava_loucas', 5, 'Tirar ou colocar']]);
  close(MON_THU, [
    ['Cozinha: secar a pia', 'pia', 5], ['Cozinha: bancada e lixo', 'lixo', 5], ['Roupa das crianças para amanhã', 'trocar', 5],
    ['Verificar banheiros', 'banheiro', 5], ['Verificar entrada', 'sapato', 5], ['Deixar a sala arrumada', 'sofa', 5],
    ['Lancheiras (parte seca)', 'lancheira', 5], ['Mochilas e itens da escola', 'mochila', 5], ['Mesa de estudo com a lição', 'licao', 5]]);
  close([5], [
    ['Cozinha: pia e bancada', 'pia', 5], ['Roupa das crianças para segunda', 'trocar', 5], ['Verificar banheiros e entrada', 'banheiro', 5],
    ['Separar roupas da semana', 'trocar', 5, 'Domingo: reset'], ['Lancheiras e mochilas', 'mochila', 5], ['Mesa de estudo para segunda', 'licao', 5]]);

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
