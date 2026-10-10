// Ajustes de texto que valem só para o app (o site continua igual).
// Cada troca vale para todas as páginas; o montar-www avisa se uma frase
// deixar de existir no conteúdo copiado do site.
export const TROCAS = [
  // Como a trilha avança (painel para educadores, nas 10 trilhas)
  ['A criança começa na primeira parada. As outras ficam apagadas, com um cadeado, e se acendem uma a uma.',
   'A criança começa na primeira parada. As outras ficam apagadas, com um cadeado, e se acendem uma a uma. No aplicativo, as paradas 1 e 2 de cada trilha são gratuitas; as demais, com o cadeado amarelo, abrem depois da compra única.'],
  ['Nada é enviado pela internet.', 'Os dados da criança não são enviados pela internet.'],
  ['Trilha livre: deixar todas as paradas abertas (para a roda com a turma ou para escolher uma atividade).',
   'Trilha livre: deixar todas as paradas abertas (para a roda com a turma ou para escolher uma atividade). As paradas com cadeado amarelo só abrem depois da compra.'],
  // Página inicial
  ['Sem cadastro, sem anúncios e sem coleta de dados das crianças.',
   'Itens 1 e 2 de cada trilha grátis; o restante com uma compra única de R$ 19,90, sem assinatura. Sem anúncios e sem coleta de dados das crianças.'],
  // "página" vira "atividade" / "início" no app
  ['ao abrir a página', 'ao abrir a atividade'],
  ['Voltar para a página principal', 'Voltar para o início'],
  ['foram desenhados para esta página', 'foram desenhados para esta atividade'],
  ['foram feitos para esta página', 'foram feitos para esta atividade'],
  ['foram escritos para esta página', 'foram escritos para esta atividade'],
];

// Página inicial do app: os quadros Fichas, BNCC, voz e aparelho vão para
// depois da lista de trilhas; o título "Para educadores e famílias" fica no lugar.
export function ajustarInicio(html) {
  const grade = '<div class="ab-g" id="abG"></div>';
  const lista = '<div class="acts" id="acts"></div>';
  if (html.split(grade).length !== 2 || !html.includes(lista)) throw new Error('index.html: não achei os quadros ou a lista de atividades');
  html = html.replace(grade, '');
  return html.replace(lista, lista + '\n  <section class="about">' + grade + '</section>');
}
