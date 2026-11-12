/* Repositorio de AIRs: aplicacao do portal. Dados em dados/acervo.json (um registro por documento, valores por
   leitor na ordem de R.leitores), dados/resumo.json (medidas do gerador) e dados/doc/<id>.json (texto reconstituido,
   marcas dos trechos e fichas completas). Gerado e conferido por portal/site/gerar.py. */
(function () {
'use strict';
// ---------- vocabulario ----------
var I = {
  inicio: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v10h14V10"/>',
  acervo: '<rect x="3" y="4" width="18" height="16" rx="1.5"/><path d="M3 9h18M3 14h18M9 9v11"/>',
  busca: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  comparar: '<rect x="3" y="4" width="7" height="16" rx="1"/><rect x="14" y="4" width="7" height="16" rx="1"/><path d="M12 8v8"/>',
  evolucao: '<path d="M3 20h18"/><path d="m4 16 5-5 4 3 7-8"/><path d="M16 6h4v4"/>',
  insights: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3Z"/>',
  metodo: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5Z"/><path d="M4 19a2 2 0 0 1 2-2h13"/><path d="M9 7h6M9 11h6"/>',
  ajuda: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.3 2.4c-.5.2-.8.7-.8 1.2v.4"/><path d="M12 17h.01"/>',
  texto: '<path d="M5 4h14M5 9h14M5 14h10M5 19h8"/>',
  camadas: '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5"/>',
  ficha: '<rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M8 8h8M8 12h8M8 16h5"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5h.01"/>',
  externo: '<path d="M14 4h6v6"/><path d="M20 4 11 13"/><path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/>',
  seta: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  agencia: '<path d="M3 21h18M5 21V10M19 21V10M9 21v-7M15 21v-7"/><path d="m3 10 9-6 9 6"/>',
  ordem: '<path d="M7 4v16M3 16l4 4 4-4M17 20V4M13 8l4-4 4 4"/>',
  copiar: '<rect x="8" y="8" width="12" height="12" rx="1.5"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
  baixar: '<path d="M12 4v11M7 10l5 5 5-5"/><path d="M4 19h16"/>',
  dispersao: '<path d="M4 4v16h16"/><circle cx="9" cy="14" r="1.6"/><circle cx="13" cy="9" r="1.6"/><circle cx="17" cy="12" r="1.6"/><circle cx="16" cy="6" r="1.6"/>',
  palavras: '<path d="M4 7h7M4 12h11M4 17h6"/><path d="M15 6h5M17 17h3"/>',
  concorda: '<path d="M4 12.5 9 17 20 6"/>',
  tipo: '<path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4"/>'
};
function ic(n) { return '<svg class="i" viewBox="0 0 24 24" aria-hidden="true">' + I[n] + '</svg>'; }
var MENU = [['inicio', 'Início'], ['acervo', 'Acervo'], ['busca', 'Busca'], ['comparar', 'Comparação'], ['evolucao', 'Evolução'], ['insights', 'Insights'], ['metodo', 'Método']];
var SETOR = { aneel: 'energia elétrica', anatel: 'telecomunicações', anac: 'aviação civil', antt: 'transportes terrestres', anp: 'petróleo, gás e biocombustíveis', anvisa: 'vigilância sanitária', ans: 'saúde suplementar', ana: 'águas e saneamento', antaq: 'transportes aquaviários', ancine: 'cinema e audiovisual', anm: 'mineração', anpd: 'proteção de dados' };
var NAG = Object.keys(SETOR).length;
var PENDENTE = { anpd: 'Agência desde 2026 (Lei nº 15.352). Publica relatórios de AIR; a coleta ainda não foi feita.' };
var TIPO = { air: 'AIR', remai: 'REMAI', formulario: 'formulário de AIR', processo_integral: 'processo integral', sem_texto: 'escaneado (OCR)', arr: 'ARR', nt_com_air: 'nota técnica com AIR', outro: 'outro' };
var CB = [
  { k: 'status_quo_considerado', s: 'b', r: 'Considera não agir', c: 'Não agir' },
  { k: 'alternativa_nao_normativa', s: 'b', r: 'Tem alternativa não normativa', c: 'Não normativa' },
  { k: 'analise_sensibilidade', s: 'b', r: 'Faz análise de sensibilidade', c: 'Sensibilidade' },
  { k: 'analise_risco_alternativas', s: 'b', r: 'Analisa riscos das alternativas', c: 'Riscos' },
  { k: 'tendencia_declarada', s: 'b', r: 'Diz o que acontece sem intervenção', c: 'Tendência' },
  { k: 'incertezas_declaradas', s: 'b', r: 'Declara incertezas', c: 'Incertezas' },
  { k: 'participacao_social', s: 'b', r: 'Houve participação social', c: 'Participação' },
  { k: 'sumario_executivo', s: 'b', r: 'Tem sumário executivo', c: 'Sumário' },
  { k: 'metas', s: 'p', r: 'Tem metas quantitativas', c: 'Metas' },
  { k: 'estimativas', s: 'p', r: 'Tem estimativas de impacto', c: 'Estimativas' },
  { k: 'indicadores', s: 'p', r: 'Tem indicadores', c: 'Indicadores' },
  { k: 'internacional', s: 'p', r: 'Cita experiência internacional', c: 'Internacional' },
  { k: 'taxa', s: 'x', r: 'Declara taxa de desconto', c: 'Taxa' },
  { k: 'arr', s: 'x', r: 'Prevê ARR', c: 'ARR' }
];
var CL = {
  natureza_problema: { r: 'Natureza do problema', v: { falha_regulatoria: 'falha regulatória', desatualizacao_normativa: 'desatualização normativa', risco_saude_seguranca: 'risco à saúde ou segurança', assimetria_de_informacao: 'assimetria de informação', falha_de_mercado: 'falha de mercado', poder_de_mercado: 'poder de mercado', externalidade: 'externalidade', bem_publico: 'bem público', outra: 'outra' } },
  metodo_comparacao: { r: 'Método de comparação', v: { multicriterio: 'multicritério', custo_beneficio: 'custo-benefício', custo_efetividade: 'custo-efetividade', custo: 'custo', risco: 'risco', outro: 'outro', nenhum: 'nenhum' } },
  dimensoes_de_impacto: { r: 'Dimensões de impacto', v: { custos_regulatorios: 'custos regulatórios', economia: 'economia', orcamento_publico: 'orçamento público', concorrencia: 'concorrência', saude: 'saúde', mpe: 'micro e pequenas empresas', seguranca: 'segurança', comercio_internacional: 'comércio internacional', meio_ambiente: 'meio ambiente', outras: 'outras' } }
};
var ROT = { orgao_emissor: 'Órgão emissor', tipo_documento: 'Tipo de documento', identificacao: 'Identificação', numero_processo: 'Processo', data_documento: 'Data', assunto: 'Assunto', sumario_executivo: 'Tem sumário executivo', problema: 'Problema', natureza_problema: 'Natureza do problema', causas: 'Causas', consequencias: 'Consequências', tendencia_declarada: 'Diz o que acontece sem intervenção', grupos_afetados: 'Grupos afetados', base_legal: 'Base legal', experiencia_internacional: 'Experiência internacional', objetivos: 'Objetivos', metas_quantitativas: 'Metas quantitativas', alternativas: 'Alternativas', n_alternativas: 'Número de alternativas', status_quo_considerado: 'Considera não agir', alternativa_nao_normativa: 'Tem alternativa não normativa', dimensoes_de_impacto: 'Dimensões de impacto', estimativas: 'Estimativas', metodo_comparacao: 'Método de comparação', taxa_desconto: 'Taxa de desconto', analise_sensibilidade: 'Faz análise de sensibilidade', incertezas_declaradas: 'Declara incertezas', analise_risco_alternativas: 'Analisa riscos das alternativas', participacao_social: 'Houve participação social', mecanismos_participacao: 'Mecanismos de participação', participantes: 'Participantes', contribuicoes: 'Contribuições', implementacao: 'Implementação', resultados_esperados: 'Resultados esperados', indicadores: 'Indicadores', alternativa_recomendada: 'Alternativa recomendada', fontes_de_evidencia: 'Fontes de evidência' };
var SECOES = [
  ['identificacao', 'Identificação e sumário', ['orgao_emissor', 'tipo_documento', 'identificacao', 'numero_processo', 'data_documento', 'assunto', 'sumario_executivo']],
  ['problema', 'Problema e agentes afetados', ['problema', 'natureza_problema', 'causas', 'consequencias', 'tendencia_declarada', 'grupos_afetados']],
  ['fundamento', 'Fundamento legal e experiência internacional', ['base_legal', 'experiencia_internacional']],
  ['objetivos', 'Objetivos', ['objetivos', 'metas_quantitativas']],
  ['alternativas', 'Alternativas', ['alternativas', 'n_alternativas', 'status_quo_considerado', 'alternativa_nao_normativa']],
  ['impactos', 'Impactos e comparação das alternativas', ['dimensoes_de_impacto', 'estimativas', 'metodo_comparacao', 'taxa_desconto', 'analise_sensibilidade', 'incertezas_declaradas', 'analise_risco_alternativas']],
  ['participacao', 'Participação social', ['participacao_social', 'mecanismos_participacao', 'participantes', 'contribuicoes']],
  ['implementacao', 'Implementação, fiscalização e monitoramento', ['implementacao', 'resultados_esperados', 'indicadores']],
  ['conclusao', 'Conclusão e recomendação', ['alternativa_recomendada']],
  ['outras', 'Outras partes do documento', []],
  ['evidencia', 'Evidência citada', ['fontes_de_evidencia']]
];
var VLEG = { nota_tecnica: 'nota técnica', relatorio_air: 'relatório de AIR', formulario_air: 'formulário de AIR', remai: 'REMAI', processo_administrativo: 'processo administrativo', regulados: 'regulados', governo: 'governo', sociedade: 'sociedade', usuarios_consumidores: 'usuários e consumidores', trabalhadores: 'trabalhadores', outros: 'outros', associacoes_setoriais: 'associações setoriais', academia: 'academia', sociedade_civil: 'sociedade civil', relatorio_tecnico: 'relatório técnico', dado_administrativo: 'dado administrativo', estudo_academico: 'estudo acadêmico', base_de_dados: 'base de dados', pesquisa_de_opiniao: 'pesquisa de opinião', lei: 'lei', decreto: 'decreto', resolucao: 'resolução', portaria: 'portaria', instrucao_normativa: 'instrução normativa', outra: 'outra', outro: 'outro' };
Object.keys(CL).forEach(function (k) { Object.assign(VLEG, CL[k].v); });
var SUB = { prazo_vigencia: 'prazo de vigência', arr_prevista: 'ARR prevista', prazo_arr: 'prazo da ARR', numero_recebidas: 'número recebido', ha_resposta_as_contribuicoes: 'responde às contribuições' };
var PRINC = ['texto', 'grupo', 'entidade', 'fonte', 'mecanismo', 'indicador', 'meta', 'o_que', 'numero'];
var STOP = {};
('a ao aos as à às com como da das de do dos e em entre na nas no nos o os ou para pela pelas pelo pelos por que se sem sob sobre sua suas seu seus um uma umas uns não mais ser são foi está este esta estes estas isso essa esse nessa nesse dessa desse qual quais quando onde já também até após ante contra desde durante mediante perante tal tais cada outro outra outros outras mesmo mesma lhe lhes nº art arts inciso item itens anexo forma caso casos acerca bem ainda assim sendo sido ter tem têm deve devem pode podem poderá será serão haja houve partir meio fim tanto quanto conforme através acordo âmbito relação respeito qualquer quaisquer demais todo toda todos todas sido seja sejam vez vezes ano anos dia dias necessidade aprimoramento alteração atual atualizar ausência aplicação brasil regulamentação revisão proposta análise impacto regulatório regulatória regulatórias regulatórios air resolução normativa agência nacional').split(' ').forEach(function (w) { STOP[sa(w)] = 1; });
var SIGLAS = /^(AIR|ARR|SEI|ANP|ANEEL|ANATEL|ANAC|ANTT|ANTAQ|ANVISA|ANS|ANA|ANM|ANCINE|ANPD|CNPE|TCU|CGU|REMAI|MPE|PIS|COFINS|ICMS|TPC|GT|LGPD)$/;

// ---------- utilidades ----------
function e(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
function sa(s) { return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); }
function fmt(n) { return Number(n).toLocaleString('pt-BR'); }
function pct(a, b) { return b ? Math.round(100 * a / b) : 0; }
function leg(x) { return x === true ? 'sim' : x === false ? 'não' : (typeof x === 'string' ? (VLEG[x] || x) : String(x)); }
function vazio(v) { return v == null || v === '' || (Array.isArray(v) && !v.length) || (typeof v === 'object' && !Array.isArray(v) && !Object.keys(v).length); }
function unico(a) { return a.filter(function (x, i, s) { return s.indexOf(x) === i; }); }
function minus(t) { return String(t).split(' ').map(function (w, i) { var b = w.replace(/[^A-Za-zÀ-ú]/g, ''); if (SIGLAS.test(b.toUpperCase()) && w === w.toUpperCase()) return w; var l = w.toLowerCase(); return i ? l : l.charAt(0).toUpperCase() + l.slice(1); }).join(' '); }
var A = [], R = {}, CACHE = {}, LEITORES = [];
var EST = { modo: 'todos', tipos: [], ag: '', anoDe: '', anoAte: '', bool: {}, lista: {}, ordem: ['ano', -1], pag: 0, cols: ['ag', 'tipo', 'ident', 'ano', 'assunto', 'status_quo_considerado', 'metodo_comparacao', 'pg'], sel: [], q: '', b: { ag: '', tipo: '', top: '', campo: '', de: '', ate: '' }, nBusca: 60, abaAcervo: 'tabela', abaEvo: 'agencia', agEvo: '', campoEvo: 'status_quo_considerado', abaCmp: 'airs', abaIns: 'afirmacoes', insX: 'status_quo_considerado', insY: 'analise_sensibilidade', insModo: 'agencias', agPal: '', ajuda: {} };
try { var salvo = JSON.parse(localStorage.getItem('portal-air') || '{}'); if (salvo.cols) EST.cols = salvo.cols; if (salvo.modo === 'todos' || salvo.modo === 'qualquer') EST.modo = salvo.modo; } catch (x) {}
function guarda() { try { localStorage.setItem('portal-air', JSON.stringify({ cols: EST.cols, modo: EST.modo })); } catch (x) {} }
function nomeLeitor(id) { var l = LEITORES.filter(function (x) { return x.id === id; })[0]; return l ? l.nome : id; }
function regraTxt() { return EST.modo === 'todos' ? 'todos os leitores dizem sim' : 'pelo menos um leitor diz sim'; }

function par(r, f) { return f.s === 'b' ? (r.b[f.k] || []) : f.s === 'p' ? (r.p[f.k] || []) : (r[f.k] || []); }
function st(pr) {
  var v = pr.filter(function (x) { return x != null; }); if (!v.length) return 'nd';
  var t = v.filter(function (x) { return x === true; }).length;
  if (t && t < v.length) return 'div';
  if (v.length < pr.length) return t ? 'um' : 'nao';
  return t ? 'sim' : 'nao';
}
function sim(r, f, modo) { var pr = par(r, f); if (!pr.length) return false; return (modo || EST.modo) === 'todos' ? pr.every(function (x) { return x === true; }) : pr.some(function (x) { return x === true; }); }
function temL(r, k, v, modo) { var l = (r.l[k] || []).map(function (x) { return (x || []).indexOf(v) >= 0; }); if (!l.length) return false; return (modo || EST.modo) === 'todos' ? l.every(Boolean) : l.some(Boolean); }
var STROT = { sim: ['✓', 'todos os leitores dizem sim'], nao: ['–', 'nenhum leitor diz sim'], div: ['✕', 'os leitores divergem'], um: ['◐', 'só parte dos leitores leu; os que leram dizem sim'], nd: ['?', 'sem ficha'] };
function selo(pr) { var s = st(pr); return '<span class="selo st-' + s + '" title="' + STROT[s][1] + '"><span aria-hidden="true">' + STROT[s][0] + '</span><span class="sr">' + STROT[s][1] + '</span></span>'; }
function assunto(r) { return r.assunto.filter(Boolean)[0] || r.ident || ('documento ' + r.id); }
function campoF(k) { for (var i = 0; i < CB.length; i++) if (CB[i].k === k) return CB[i]; return null; }
function airs() { return A.filter(function (r) { return r.tipo === 'air'; }); }
function agsCom() { return Object.keys(SETOR).filter(function (k) { return A.some(function (r) { return r.ag === k && r.tipo === 'air'; }); }); }
function nAltTxt(r) { var u = unico(r.nAlt.filter(function (x) { return x != null; })); return !u.length ? '–' : u.length === 1 ? String(u[0]) : '<span class="st-div" title="os leitores divergem">' + u.join(' / ') + '</span>'; }

// ---------- filtro do acervo ----------
function filtra(ign) {
  var mod = EST.modo;
  return A.filter(function (r) {
    if (ign !== 'tipo' && EST.tipos.length && EST.tipos.indexOf(r.tipo) < 0) return false;
    if (ign !== 'ag' && EST.ag && r.ag !== EST.ag) return false;
    if (EST.anoDe && (!r.ano || r.ano < +EST.anoDe)) return false;
    if (EST.anoAte && (!r.ano || r.ano > +EST.anoAte)) return false;
    for (var k in EST.bool) { if (EST.bool[k] && ign !== 'b:' + k && !sim(r, campoF(k), mod)) return false; }
    for (var l in EST.lista) { var vs = EST.lista[l] || []; for (var i = 0; i < vs.length; i++) if (ign !== 'l:' + l + ':' + vs[i] && !temL(r, l, vs[i], mod)) return false; }
    return true;
  });
}
function limpaFiltros() { EST.ag = ''; EST.anoDe = ''; EST.anoAte = ''; EST.bool = {}; EST.lista = {}; EST.tipos = []; EST.pag = 0; }

// ---------- guias ----------
var GUIA = {
  inicio: ['A busca no alto procura nos metadados de todos os documentos. Para filtrar com precisão, use o Acervo.', 'Os números abaixo da busca levam ao recorte correspondente.', 'As faixas mais abaixo mostram o que há no acervo e o que cada parte do site faz.'],
  acervo: ['Escolha uma agência nas pílulas ou use os filtros à esquerda. Cada filtro mostra quantos documentos restam se você marcá-lo.', '“Contar como sim” define a regra dos filtros: quando todos os leitores concordam (mais estrito) ou quando pelo menos um diz sim. Hoje são dois leitores; outros entrarão depois.', 'Nas colunas, ✓ é “todos os leitores dizem sim”, ✕ é “os leitores divergem”, ◐ é “só parte dos leitores leu”. Divergência é onde uma pessoa deve olhar primeiro.', 'Marque até três linhas para comparar. “Colunas” escolhe o que aparece; “Copiar CSV” e “Baixar CSV” levam o recorte com os filtros aplicados.', 'Clique no assunto para abrir o documento, com o texto reconstituído e os metadados.'],
  busca: ['A busca procura palavras no assunto, problema, objetivos, alternativas e alternativa recomendada, como os leitores os extraíram. Ainda não procura no texto integral.', 'Todas as palavras precisam aparecer; acentos e maiúsculas não importam.', 'Os filtros (agência, tipo, tópico, característica, ano) funcionam com ou sem palavras: sem palavras, servem para explorar o acervo.'],
  comparar: ['“Documentos lado a lado” põe até três documentos em colunas, campo a campo. Escolha pelo número ou marque na tabela do Acervo.', '“Agências” mostra, para cada campo, a parte das AIRs de cada agência em que a característica aparece. O tom mais escuro é a parte maior.', 'Os percentuais seguem a regra “Contar como sim” escolhida no Acervo.'],
  evolucao: ['“Por agência”: quantas AIRs cada agência produziu por ano, na mesma escala, para comparar.', '“Por tipo de documento”: AIRs, formulários, REMAI e os demais, ano a ano.', '“Por tópico”: quantas AIRs por ano tratam de cada natureza de problema.', '“Por campo”: a parte das AIRs de cada ano em que uma característica aparece. Passe o cursor nos pontos para ver o número de AIRs do ano; anos com poucas AIRs oscilam mais.', 'Em “tópico”, “campo” e “tipo” dá para escolher uma agência. O ano é o da assinatura lida pelos leitores; sem assinatura, o registrado na coleta.'],
  insights: ['“Afirmações”: frases medidas no acervo, cada uma com o número, o total e o que ela não permite concluir.', '“Dispersão”: cada bolha é uma agência (ou cada ponto, uma AIR). Escolha as duas características nos eixos.', '“Palavras”: as palavras que mais aparecem nos assuntos e problemas, por agência. Clique numa palavra para buscá-la.', '“Concordância”: com que frequência os leitores concordam em cada campo. Concordar não prova acerto.'],
  metodo: ['Esta página explica de onde vêm os documentos, como o texto foi extraído, como os leitores trabalharam e o que já foi medido sobre a qualidade.', 'A tabela de diagnóstico mostra com que frequência o trecho citado vem da seção própria do assunto.'],
  doc: ['“Ler” mostra o texto da agência no modelo do repositório, limpo, para leitura.', '“Ler com metadados” liga as marcas dos trechos citados e, sob cada seção, os campos extraídos. Clique num trecho marcado para ver o campo.', '“Ficha” mostra todos os campos, com o valor de cada leitor e o estado da comparação entre eles.', '“Ordem original” mostra o texto na sequência do documento.', '“Sobre esta página” explica de onde veio o texto, o que foi retirado e o que foi conferido.', 'O menu à esquerda leva às seções; “copiar referência” aparece ao passar o cursor num parágrafo.']
};
function cabecalho(chave, titulo, sub) {
  var aberto = EST.ajuda[chave];
  var bt = '<button class="ajuda-bt" type="button" data-acao="ajuda" data-chave="' + chave + '" aria-expanded="' + !!aberto + '">' + ic('ajuda') + ' Como usar esta página</button>';
  return '<div class="vista-cab"' + (titulo ? '' : ' style="padding-block:4px 10px;justify-content:flex-end"') + '>' + (titulo ? '<div><p class="olho">' + ic(chave === 'doc' ? 'acervo' : chave) + '</p><h1>' + titulo + '</h1>' + (sub ? '<p>' + sub + '</p>' : '') + '</div>' : '') + bt + '</div>' +
    (aberto ? '<section class="guia"><h2>Como usar esta página</h2><ul>' + GUIA[chave].map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul></section>' : '');
}
function abas(acao, atual, lista) { return '<div class="abas" role="tablist">' + lista.map(function (a) { return '<button role="tab" type="button" data-acao="' + acao + '" data-aba="' + a[0] + '" aria-selected="' + (atual === a[0]) + '">' + ic(a[2]) + a[1] + '</button>'; }).join('') + '</div>'; }
function selAg(acao, atual, so) { return '<label class="sr" for="' + acao + '">Agência</label><select id="' + acao + '" data-acao="' + acao + '"><option value="">Todas as agências</option>' + (so || Object.keys(SETOR)).map(function (k) { return '<option value="' + k + '" ' + (atual === k ? 'selected' : '') + '>' + k.toUpperCase() + '</option>'; }).join('') + '</select>'; }
function barraH(p) { return '<span class="barra-h"><span style="width:' + p + '%"></span></span>'; }

// ---------- graficos ----------
function anosDe(lista) { var s = lista.map(function (r) { return r.ano; }).filter(Boolean); if (!s.length) return []; var mi = Math.min.apply(null, s), ma = Math.max.apply(null, s), o = []; for (var y = mi; y <= ma; y++) o.push(y); return o; }
function barras(cont, anos, ymax, alt, rot, op) {
  op = op || {}; var W = op.W || 260, H = alt || 90, ml = op.sem ? 0 : 22, mb = op.sem ? 2 : 16, w = anos.length ? (W - ml) / anos.length : 0;
  var s = '<svg class="graf' + (op.sem ? ' mini' : '') + '" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + e(rot || 'documentos por ano') + '">';
  s += '<line class="eixo" x1="' + ml + '" x2="' + W + '" y1="' + (H - mb) + '" y2="' + (H - mb) + '"/>';
  if (!op.sem) s += '<text x="' + (ml - 4) + '" y="10" text-anchor="end">' + ymax + '</text><text x="' + (ml - 4) + '" y="' + (H - mb) + '" text-anchor="end">0</text>';
  anos.forEach(function (a, i) {
    var v = cont[a] || 0, h = ymax ? (H - mb - 4) * v / ymax : 0, x = ml + i * w + 1, tip = a + ': ' + v + ' ' + (op.un || (v === 1 ? 'AIR' : 'AIRs'));
    if (v) s += '<path class="barra" d="M' + x + ' ' + (H - mb) + 'v' + (-Math.max(h - 2, 0)) + 'q0 -2 2 -2h' + Math.max(w - 6, 1) + 'q2 0 2 2v' + Math.max(h - 2, 0) + 'z" data-tip="' + tip + '"/>';
    s += '<rect class="alvo" x="' + (ml + i * w) + '" y="0" width="' + w + '" height="' + (H - mb) + '" data-tip="' + tip + '"/>';
  });
  if (op.W) anos.forEach(function (a, i) { s += '<text x="' + (ml + i * w + w / 2) + '" y="' + (H - 3) + '" text-anchor="middle">' + String(a).slice(2) + '</text>'; });
  else if (!op.sem && anos.length) s += '<text x="' + ml + '" y="' + (H - 3) + '">' + anos[0] + '</text><text x="' + W + '" y="' + (H - 3) + '" text-anchor="end">' + anos[anos.length - 1] + '</text>';
  return s + '</svg>';
}
function linhaPct(pontos, rot) {
  var W = 640, H = 220, ml = 34, mb = 22, mt = 8, n = pontos.length;
  function x(i) { return ml + (n === 1 ? (W - ml) / 2 : i * (W - ml - 10) / (n - 1)); }
  function y(v) { return mt + (H - mb - mt) * (1 - v / 100); }
  var s = '<svg class="graf" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + e(rot) + '">';
  [0, 25, 50, 75, 100].forEach(function (v) { s += '<line class="eixo" x1="' + ml + '" x2="' + W + '" y1="' + y(v) + '" y2="' + y(v) + '" stroke-dasharray="' + (v ? '2 4' : '') + '"/><text x="' + (ml - 6) + '" y="' + (y(v) + 3) + '" text-anchor="end">' + v + '%</text>'; });
  if (!n) return s + '</svg>';
  s += '<polyline class="linha" points="' + pontos.map(function (p, i) { return x(i) + ',' + y(p.v); }).join(' ') + '"/>';
  pontos.forEach(function (p, i) {
    var t = p.a + ': ' + p.v + '% (' + p.k + ' de ' + p.n + ' AIRs)';
    s += '<circle class="ponto" cx="' + x(i) + '" cy="' + y(p.v) + '" r="' + (p.n < 10 ? 3 : 4.5) + '" data-tip="' + t + '"/><circle class="alvo" cx="' + x(i) + '" cy="' + y(p.v) + '" r="12" data-tip="' + t + '"/>';
    if (i % Math.ceil(n / 9) === 0 || i === n - 1) s += '<text x="' + x(i) + '" y="' + (H - 6) + '" text-anchor="middle">' + p.a + '</text>';
  });
  return s + '</svg>';
}
var dica = document.getElementById('dica');
document.addEventListener('mouseover', function (ev) { var t = ev.target.closest && ev.target.closest('[data-tip]'); if (!t) { dica.hidden = true; return; } dica.textContent = t.getAttribute('data-tip'); dica.hidden = false; });
document.addEventListener('mousemove', function (ev) { if (!dica.hidden) { var x = Math.min(ev.clientX + 14, innerWidth - dica.offsetWidth - 8); dica.style.left = x + 'px'; dica.style.top = (ev.clientY + 14) + 'px'; } });

// ---------- INICIO ----------
function vInicio() {
  var ai = airs(), anos = anosDe(ai);
  var ags = Object.keys(SETOR).map(function (k) { return [k, ai.filter(function (r) { return r.ag === k; }), A.filter(function (r) { return r.ag === k; }).length]; }).sort(function (a, b) { return b[1].length - a[1].length; });
  var ymax = 0; ags.forEach(function (a) { var c = {}; a[1].forEach(function (r) { c[r.ano] = (c[r.ano] || 0) + 1; ymax = Math.max(ymax, c[r.ano]); }); a.push(c); });
  var naoAgir = ai.filter(function (r) { return sim(r, CB[0], 'todos'); }).length;
  var multi = ai.filter(function (r) { return temL(r, 'metodo_comparacao', 'multicriterio', 'todos'); }).length;
  var sens = ai.filter(function (r) { return sim(r, CB[2], 'todos'); }).length;
  var atalhos = [['b', 'status_quo_considerado', 'Consideram não agir'], ['l', 'metodo_comparacao:multicriterio', 'Multicritério'], ['b', 'analise_sensibilidade', 'Análise de sensibilidade'], ['b', 'metas', 'Metas quantitativas'], ['b', 'participacao_social', 'Participação social'], ['b', 'taxa', 'Taxa de desconto'], ['b', 'arr', 'Preveem ARR']];
  var h = '<section class="heroi"><div class="larg g"><h1>As análises de impacto regulatório das agências federais, <em>abertas para ler, comparar e pesquisar</em>.</h1>' +
    '<p class="sub">Cada documento com o texto da agência, os campos extraídos por leitores de máquina e a indicação de onde eles concordam e divergem.</p>' +
    '<form class="busca-grande" id="f-heroi" role="search"><label class="sr" for="q-heroi">Buscar</label><input id="q-heroi" type="search" placeholder="Tente “etanol”, “fadiga de tripulantes”, “tarifa”…"><button type="submit">' + ic('busca') + ' Buscar</button></form>' +
    '<div class="contadores"><a href="#acervo" data-acao="tipos" data-t="">' + ic('tipo') + '<b>' + fmt(A.length) + '</b> documentos</a><a href="#acervo" data-acao="tipos" data-t="air">' + ic('ficha') + '<b>' + fmt(ai.length) + '</b> AIRs</a><a href="#acervo" data-acao="aba-acervo" data-aba="agencias">' + ic('agencia') + '<b>' + NAG + '</b> agências</a><a href="#metodo">' + ic('acervo') + '<b>37</b> campos por documento</a><a href="#evolucao">' + ic('evolucao') + '<b>' + anos[0] + '–' + anos[anos.length - 1] + '</b></a></div>' +
    '<p class="pe">Todos os documentos com texto integral reconstituído · metadados ainda sem conferência humana</p></div></section>' +
    '<nav class="atalhos" aria-label="Atalhos"><div class="atalhos-in larg g"><span class="rot">Atalhos</span>' + atalhos.map(function (a) { return '<a class="pilula" href="#acervo" data-acao="atalho" data-t="' + a[0] + '" data-k="' + a[1] + '">' + a[2] + '</a>'; }).join('') + '</div></nav>';
  h += '<section class="faixa"><div class="larg g"><p class="olho">O desafio</p><h2>Um parágrafo de AIR contém mais do que mostra</h2><p class="lead">A agência escreve em prosa. O repositório lê cada documento inteiro, identifica o que ele diz sobre o problema, as alternativas, os impactos e a participação, e guarda cada resposta com o trecho e a página de onde saiu. Assim dá para filtrar ' + fmt(A.length) + ' documentos por uma característica e voltar à frase que a sustenta.</p><div id="desafio" class="desafio"><p class="vazio-st">Carregando o exemplo…</p></div></div></section>';
  h += '<section class="faixa alt"><div class="larg g"><p class="olho">O acervo</p><h2>' + fmt(A.length) + ' documentos de ' + NAG + ' agências, de ' + anos[0] + ' a ' + anos[anos.length - 1] + '</h2><p class="lead">Cada cartão leva aos documentos da agência. As barras mostram quantas AIRs ela produziu por ano, todas na mesma escala.</p><div class="agencias">' +
    ags.map(function (a) { var l = a[1], an = anosDe(l); return '<a class="ag" href="#acervo" data-acao="agencia" data-ag="' + a[0] + '"><div class="sig"><b>' + a[0].toUpperCase() + '</b><span>' + a[2] + '</span></div><div class="set">' + SETOR[a[0]] + ' · ' + l.length + ' AIRs</div>' + (l.length ? barras(a[3], anos, ymax, 30, a[0].toUpperCase() + ': AIRs por ano', { sem: true }) + '<div class="anos"><span>' + an[0] + '</span><span>' + an[an.length - 1] + '</span></div>' : '<p class="nota" style="margin:0">' + e(PENDENTE[a[0]] || 'Nenhum documento no acervo ainda.') + '</p>') + '</a>'; }).join('') +
    '</div><p class="nota">Número grande: documentos da agência no acervo (AIRs, formulários, REMAI e outros). Por que não há um mapa do Brasil: as AIRs são de agências federais e, em geral, valem para o país inteiro. Um mapa por estado sugeriria uma distribuição que o acervo não tem.</p></div></section>';
  var F = [['acervo', 'Acervo', 'Todos os documentos em tabela, por agência, com filtros por qualquer campo.'], ['busca', 'Busca', 'Encontre documentos por assunto, problema, objetivo ou alternativa.'], ['comparar', 'Comparação', 'Dois ou três documentos lado a lado, ou as agências entre si.'], ['evolucao', 'Evolução', 'Como a produção e cada característica mudam ao longo dos anos.'], ['insights', 'Insights', 'Afirmações medidas, dispersão, palavras e concordância entre leitores.'], ['metodo', 'Método', 'De onde vêm os documentos, como foram lidos e o que já foi conferido.']];
  h += '<section class="faixa"><div class="larg g"><p class="olho">O que você pode fazer aqui</p><h2>Seis maneiras de entrar no acervo</h2><div class="funcoes">' + F.map(function (f) { return '<a class="funcao" href="#' + f[0] + '"><span class="ic">' + ic(f[0]) + '</span><b>' + f[1] + '</b><span>' + f[2] + '</span></a>'; }).join('') + '</div></div></section>';
  h += '<section class="faixa alt"><div class="larg g"><p class="olho">Perguntas em destaque</p><h2>O que o acervo já permite perguntar</h2><div class="cartoes">' +
    cartao(naoAgir, ai.length, 'das AIRs consideram não agir como alternativa, segundo todos os leitores.', 'Considerar não é comparar: a AIR pode citar a opção sem analisá-la.', 'b', 'status_quo_considerado') +
    cartao(multi, ai.length, 'das AIRs declaram comparar alternativas por multicritério, segundo todos os leitores.', 'Declarar o método não mostra como ele foi aplicado.', 'l', 'metodo_comparacao:multicriterio') +
    cartao(sens, ai.length, 'das AIRs fazem análise de sensibilidade, segundo todos os leitores.', 'O campo diz se a análise existe, não se foi bem feita.', 'b', 'analise_sensibilidade') +
    '</div><p class="nota"><a href="#insights">Ver todos os insights →</a></p></div></section>';
  h += '<section class="faixa"><div class="larg g"><div class="aviso"><b>O que ainda não foi conferido.</b> Os campos foram extraídos por modelos de linguagem que leram cada documento inteiro e citaram o trecho e a página de cada resposta. Nenhum campo foi conferido por pessoa. Quando os leitores concordam, isso não prova que acertaram; quando divergem, é ali que se deve olhar primeiro. <a href="#metodo">Como foi feito →</a></div></div></section>';
  return h;
}
function cartao(k, n, frase, lim, t, chave) { return '<a class="cartao" href="#acervo" data-acao="atalho" data-t="' + t + '" data-k="' + chave + '"><span class="num">' + pct(k, n) + '%<small> · ' + fmt(k) + ' de ' + fmt(n) + '</small></span><p>' + frase + '</p><span class="lim">' + lim + '</span></a>'; }
function desafio() {
  var alvo = document.getElementById('desafio'); if (!alvo) return;
  carregaDoc('173').then(function (d) {
    var i = d.pars.findIndex(function (p) { return p.n === '2.2'; }); if (i < 0) i = 1;
    var p = d.pars[i], ms = d.marcas[i] || [], campos = unico(ms.map(function (m) { return m[3]; })).slice(0, 4);
    var f0 = d.fichas[LEITORES[0].id] || {};
    alvo.innerHTML = '<div class="folha marcas-on"><p class="fonte"><span>ANP · ' + e(f0.identificacao && f0.identificacao.valor) + ' · item ' + e(p.n) + ', p. ' + p.i + '</span><a href="#doc-173">Abrir o documento →</a></p><p class="doc">' + marcado(p.t, ms) + '</p></div><div class="setas">' +
      campos.map(function (k) { return '<div class="vira">' + ic('seta') + '<b>' + e(ROT[k] || k) + '</b><span class="v">' + resumoValor((f0[k] || {}).valor) + '</span></div>'; }).join('') + '<p class="nota" style="margin:0">Sublinhado: trecho citado pelo ' + e(nomeLeitor(LEITORES[0].id)) + '. Fundo: citado pelo ' + e(nomeLeitor((LEITORES[1] || LEITORES[0]).id)) + '.</p></div>';
  }).catch(function () { alvo.innerHTML = '<p class="vazio-st">Não foi possível carregar o exemplo.</p>'; });
}
function resumoValor(v) {
  if (Array.isArray(v)) return e(v.slice(0, 3).map(function (x) { return typeof x === 'object' ? (x.texto || x.grupo || x.o_que || '') : leg(x); }).join('; ') + (v.length > 3 ? '…' : ''));
  if (v && typeof v === 'object') return e(JSON.stringify(v));
  return e(leg(v));
}

// ---------- ACERVO ----------
var COLS = [['ag', 'Agência'], ['tipo', 'Tipo'], ['ident', 'Documento'], ['ano', 'Ano'], ['assunto', 'Assunto'], ['pg', 'Págs.'], ['metodo_comparacao', 'Método'], ['natureza_problema', 'Natureza do problema'], ['nAlt', 'Nº de alternativas']].concat(CB.map(function (f) { return [f.k, f.c]; }));
function vAcervo() {
  var h = '<div class="larg g">' + cabecalho('acervo', 'Acervo', 'Os documentos das ' + NAG + ' agências, com os campos extraídos. Filtre por qualquer campo, escolha as colunas e abra cada documento.');
  h += abas('aba-acervo', EST.abaAcervo, [['tabela', 'Tabela', 'acervo'], ['agencias', 'Por agência', 'agencia']]);
  if (EST.abaAcervo === 'agencias') return h + perfilAgencias() + '</div>';
  var base = filtra('ag'), total = {}; base.forEach(function (r) { total[r.ag] = (total[r.ag] || 0) + 1; });
  h += '<div class="chips"><button type="button" class="pilula" data-acao="agencia" data-ag="" aria-pressed="' + !EST.ag + '">Todas <span class="n">' + base.length + '</span></button>' + Object.keys(SETOR).map(function (k) { return '<button type="button" class="pilula" data-acao="agencia" data-ag="' + k + '" aria-pressed="' + (EST.ag === k) + '">' + k.toUpperCase() + ' <span class="n">' + (total[k] || 0) + '</span></button>'; }).join('') + '</div>';
  if (EST.ag && PENDENTE[EST.ag]) h += '<div class="aviso" style="margin-bottom:12px">' + e(PENDENTE[EST.ag]) + '</div>';
  var lista = filtra();
  return h + '<div class="duas"><aside class="lateral" aria-label="Filtros">' + facetas(lista) + '</aside><div style="min-width:0">' + tabela(lista) + '</div></div></div>';
}
function facetas(lista) {
  var anos = anosDe(A);
  var h = '<div class="barra-res" style="margin:0"><b>Filtros</b><button class="limpa" type="button" data-acao="limpa">limpar</button></div>';
  h += '<p class="grupo-t">Contar como “sim” quando</p><div class="faceta">' + [['todos', 'todos os leitores dizem sim'], ['qualquer', 'pelo menos um leitor diz sim']].map(function (m) { return '<label><input type="radio" name="modo" value="' + m[0] + '" ' + (EST.modo === m[0] ? 'checked' : '') + ' data-acao="modo"> ' + m[1] + '</label>'; }).join('') + '</div>';
  var semTipo = filtra('tipo'), tipos = {}; semTipo.forEach(function (r) { tipos[r.tipo] = (tipos[r.tipo] || 0) + 1; });
  h += '<p class="grupo-t">Tipo de documento</p><div class="faceta">' + Object.keys(TIPO).filter(function (t) { return A.some(function (r) { return r.tipo === t; }); }).map(function (t) { return '<label><input type="checkbox" data-acao="tipo" data-t="' + t + '" ' + (EST.tipos.indexOf(t) >= 0 ? 'checked' : '') + '> ' + TIPO[t] + ' <span class="n">' + (tipos[t] || 0) + '</span></label>'; }).join('') + '</div>';
  h += '<p class="grupo-t">Ano</p><div class="faceta" style="grid-template-columns:1fr 1fr;gap:6px"><select aria-label="De" data-acao="anoDe"><option value="">de</option>' + anos.map(function (a) { return '<option ' + (+EST.anoDe === a ? 'selected' : '') + '>' + a + '</option>'; }).join('') + '</select><select aria-label="Até" data-acao="anoAte"><option value="">até</option>' + anos.map(function (a) { return '<option ' + (+EST.anoAte === a ? 'selected' : '') + '>' + a + '</option>'; }).join('') + '</select></div>';
  [['Alternativas e impactos', ['status_quo_considerado', 'alternativa_nao_normativa', 'analise_sensibilidade', 'analise_risco_alternativas', 'incertezas_declaradas', 'estimativas', 'taxa']], ['Problema e objetivos', ['tendencia_declarada', 'metas', 'internacional']], ['Participação e acompanhamento', ['participacao_social', 'indicadores', 'arr', 'sumario_executivo']]].forEach(function (g, gi) {
    h += '<details ' + (gi === 0 ? 'open' : '') + '><summary>' + g[0] + '</summary><div class="faceta">' + g[1].map(function (k) { var f = campoF(k), n = filtra('b:' + k).filter(function (r) { return sim(r, f); }).length; return '<label><input type="checkbox" data-acao="bool" data-k="' + k + '" ' + (EST.bool[k] ? 'checked' : '') + '> ' + f.r + ' <span class="n">' + n + '</span></label>'; }).join('') + '</div></details>';
  });
  Object.keys(CL).forEach(function (l) {
    var sel = EST.lista[l] || [];
    h += '<details ' + (sel.length ? 'open' : '') + '><summary>' + CL[l].r + '</summary><div class="faceta">' + Object.keys(CL[l].v).map(function (v) { var n = filtra('l:' + l + ':' + v).filter(function (r) { return temL(r, l, v); }).length; return '<label><input type="checkbox" data-acao="lista" data-l="' + l + '" data-v="' + v + '" ' + (sel.indexOf(v) >= 0 ? 'checked' : '') + '> ' + CL[l].v[v] + ' <span class="n">' + n + '</span></label>'; }).join('') + '</div></details>';
  });
  return h;
}
function celula(r, c) {
  var f = campoF(c);
  if (f) return '<td>' + selo(par(r, f)) + '</td>';
  if (CL[c]) { var ls = (r.l[c] || []).map(function (x) { return x || []; }); var todos = unico([].concat.apply([], ls)); var em = todos.filter(function (x) { return ls.every(function (l) { return l.indexOf(x) >= 0; }); }), so = todos.filter(function (x) { return em.indexOf(x) < 0; }); return '<td>' + em.map(function (x) { return '<span class="tag">' + e(CL[c].v[x] || x) + '</span>'; }).join('') + (so.length ? '<span class="st-um" title="só parte dos leitores: ' + e(so.map(function (x) { return CL[c].v[x] || x; }).join(', ')) + '"> ◐' + so.length + '</span>' : '') + '</td>'; }
  if (c === 'ag') return '<td><b>' + r.ag.toUpperCase() + '</b></td>';
  if (c === 'assunto') return '<td class="assunto"><a href="#doc-' + r.id + '">' + e(assunto(r)) + '</a></td>';
  if (c === 'ano') return '<td class="num" title="' + e({ assinatura: 'ano da assinatura (leitores concordam)', 'um leitor': 'ano lido por um leitor', divergente: 'leitores divergem no ano', coleta: 'ano registrado na coleta' }[r.anoF] || '') + '">' + (r.ano || '–') + (r.anoF === 'assinatura' ? '' : '<span class="st-um">*</span>') + '</td>';
  if (c === 'pg') return '<td class="num">' + r.pg + '</td>';
  if (c === 'nAlt') return '<td class="num">' + nAltTxt(r) + '</td>';
  if (c === 'tipo') return '<td>' + TIPO[r.tipo] + '</td>';
  if (c === 'ident') return '<td>' + e(r.ident || '–') + '</td>';
  return '<td></td>';
}
function valorOrd(r, c) {
  var f = campoF(c); if (f) return ['sim', 'div', 'um', 'nao', 'nd'].indexOf(st(par(r, f)));
  if (c === 'assunto') return sa(assunto(r)); if (c === 'ident') return sa(r.ident); if (c === 'ano') return r.ano || 0; if (c === 'pg') return r.pg; if (c === 'nAlt') return r.nAlt[0] || 0; if (c === 'ag') return r.ag; if (c === 'tipo') return r.tipo;
  return sa(JSON.stringify(r.l[c] || ''));
}
function ordena(lista) { var o = EST.ordem; return lista.slice().sort(function (a, b) { var x = valorOrd(a, o[0]), y = valorOrd(b, o[0]); return (x < y ? -1 : x > y ? 1 : 0) * o[1]; }); }
function tabela(lista) {
  lista = ordena(lista);
  var por = 50, np = Math.max(1, Math.ceil(lista.length / por)); if (EST.pag >= np) EST.pag = np - 1;
  var pg = lista.slice(EST.pag * por, EST.pag * por + por), cols = EST.cols.filter(function (c) { return COLS.some(function (x) { return x[0] === c; }); });
  var h = '<div class="barra-res"><span><b>' + fmt(lista.length) + '</b> ' + (lista.length === 1 ? 'documento' : 'documentos') + (EST.ag ? ' da ' + EST.ag.toUpperCase() : '') + '</span><div class="acoes"><div class="colunas"><button class="bt" type="button" data-acao="cols" aria-expanded="false">' + ic('camadas') + ' Colunas</button><div hidden id="menu-cols">' + COLS.map(function (c) { return '<label><input type="checkbox" data-acao="col" data-c="' + c[0] + '" ' + (cols.indexOf(c[0]) >= 0 ? 'checked' : '') + '> ' + c[1] + '</label>'; }).join('') + '</div></div><button class="bt" type="button" data-acao="csv">' + ic('copiar') + ' Copiar CSV</button><button class="bt" type="button" data-acao="csv-baixar">' + ic('baixar') + ' Baixar CSV</button></div></div>';
  h += '<div class="tabela"><table><thead><tr><th><span class="sr">Selecionar</span></th>' + cols.map(function (c) { var rot = COLS.filter(function (x) { return x[0] === c; })[0][1], at = EST.ordem[0] === c ? (EST.ordem[1] > 0 ? ' ▲' : ' ▼') : ''; return '<th class="' + (c === 'ano' || c === 'pg' || c === 'nAlt' ? 'num' : '') + '"><button type="button" data-acao="ordena" data-c="' + c + '">' + rot + at + '</button></th>'; }).join('') + '</tr></thead><tbody>';
  h += pg.map(function (r) { return '<tr><td><input type="checkbox" aria-label="Selecionar para comparar" data-acao="sel" data-id="' + r.id + '" ' + (EST.sel.indexOf(r.id) >= 0 ? 'checked' : '') + '></td>' + cols.map(function (c) { return celula(r, c); }).join('') + '</tr>'; }).join('') || '<tr><td colspan="' + (cols.length + 1) + '"><p class="vazio-st">Nenhum documento com esses filtros. <button class="limpa" data-acao="limpa" type="button">Limpar filtros</button></p></td></tr>';
  h += '</tbody></table></div><div class="legenda-st">' + ['sim', 'div', 'um', 'nao'].map(function (s) { return '<span><span class="selo st-' + s + '">' + STROT[s][0] + '</span> ' + STROT[s][1] + '</span>'; }).join('') + '<span><span class="st-um">*</span> ano sem assinatura concordante</span></div>';
  if (np > 1) h += '<div class="pag"><button class="bt" type="button" data-acao="pag" data-p="' + (EST.pag - 1) + '" ' + (EST.pag ? '' : 'disabled') + '>anterior</button><span>página ' + (EST.pag + 1) + ' de ' + np + '</span><button class="bt" type="button" data-acao="pag" data-p="' + (EST.pag + 1) + '" ' + (EST.pag < np - 1 ? '' : 'disabled') + '>próxima</button></div>';
  if (EST.sel.length) h += '<div class="flutua"><div>' + EST.sel.length + ' selecionado' + (EST.sel.length > 1 ? 's' : '') + '<a class="bt forte" href="#comparar" data-acao="ir-comparar">' + ic('comparar') + ' Comparar</a><button class="limpa" style="color:var(--band-muted)" type="button" data-acao="desseleciona">limpar</button></div></div>';
  return h;
}
function csvTexto() {
  var cols = EST.cols, rot = cols.map(function (c) { return (COLS.filter(function (x) { return x[0] === c; })[0] || [c, c])[1]; });
  var linhas = ordena(filtra()).map(function (r) { return [r.id].concat(cols.map(function (c) { var f = campoF(c), v = f ? STROT[st(par(r, f))][1] : CL[c] ? (r.l[c] || []).map(function (x) { return (x || []).join('|'); }).join(' / ') : c === 'assunto' ? assunto(r) : c === 'ag' ? r.ag.toUpperCase() : c === 'nAlt' ? r.nAlt.join('/') : c === 'tipo' ? TIPO[r.tipo] : r[c]; return v; })).map(function (v) { return '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"'; }).join(','); });
  return { txt: '# Repositório de AIRs; gerado em ' + (R.geradoEm || '') + '; filtros: ' + JSON.stringify({ agencia: EST.ag, tipos: EST.tipos, regra: regraTxt(), sim: EST.bool, listas: EST.lista, de: EST.anoDe, ate: EST.anoAte }) + '\n' + ['id'].concat(rot).join(',') + '\n' + linhas.join('\n'), n: linhas.length };
}
function perfilAgencias() {
  var ai = airs(), anos = anosDe(ai), ks = ['status_quo_considerado', 'alternativa_nao_normativa', 'analise_sensibilidade', 'estimativas', 'participacao_social', 'indicadores'];
  var ymax = 0, porAg = Object.keys(SETOR).map(function (k) { var l = ai.filter(function (r) { return r.ag === k; }), c = {}; l.forEach(function (r) { c[r.ano] = (c[r.ano] || 0) + 1; ymax = Math.max(ymax, c[r.ano]); }); return [k, l, c]; }).sort(function (a, b) { return b[1].length - a[1].length; });
  return '<p class="nota" style="margin:0 0 14px">Cada cartão mostra, para uma agência, quantas AIRs ela tem por ano e, nas barras horizontais, em que parte dessas AIRs todos os leitores encontram cada característica. Por exemplo, “Não agir 80%” quer dizer que em 80% das AIRs da agência os leitores concordam que a AIR considera a alternativa de não agir. Clique no nome para ver a tabela da agência.</p><div class="grade-mult">' + porAg.map(function (a) {
    var l = a[1];
    if (!l.length) return '<div class="mult"><h3>' + a[0].toUpperCase() + '<span>0 AIRs</span></h3><p class="nota" style="margin:0">' + SETOR[a[0]] + '. ' + e(PENDENTE[a[0]] || '') + '</p></div>';
    return '<div class="mult"><h3><a href="#acervo" data-acao="agencia" data-ag="' + a[0] + '">' + a[0].toUpperCase() + '</a><span>' + l.length + ' AIRs</span></h3><p class="nota" style="margin:0 0 6px">' + SETOR[a[0]] + '</p>' + barras(a[2], anos, ymax, 70, a[0] + ' por ano') +
      '<div class="perfil">' + ks.map(function (k) { var f = campoF(k), n = l.filter(function (r) { return sim(r, f, 'todos'); }).length, p = pct(n, l.length); return '<div data-tip="' + a[0].toUpperCase() + ', ' + f.r.toLowerCase() + ': ' + n + ' de ' + l.length + ' AIRs"><span>' + f.c + '</span>' + barraH(p) + '<span class="mono">' + p + '%</span></div>'; }).join('') + '</div></div>';
  }).join('') + '</div><p class="nota"><a href="#evolucao">Ver a evolução por agência →</a></p>';
}

// ---------- BUSCA ----------
function blob(r) { return r._b || (r._b = sa([r.ident].concat(r.assunto, [r.problema, r.rec], r.obj, r.alt).join(' · '))); }
function marcaTermos(t, termos) {
  if (!termos.length) return t;
  var base = sa(t), out = '', i = 0, achou = [];
  termos.forEach(function (q) { if (q.length < 2) return; var k = base.indexOf(q); while (k >= 0) { achou.push([k, k + q.length]); k = base.indexOf(q, k + q.length); } });
  achou.sort(function (a, b) { return a[0] - b[0]; }).forEach(function (a) { if (a[0] < i) return; out += t.slice(i, a[0]) + '<mark class="q">' + t.slice(a[0], a[1]) + '</mark>'; i = a[1]; });
  return out + t.slice(i);
}
function filtroBusca(r, termos, ign) {
  var b = EST.b;
  if (ign !== 'ag' && b.ag && r.ag !== b.ag) return false;
  if (b.tipo && r.tipo !== b.tipo) return false;
  if (b.top && !temL(r, 'natureza_problema', b.top, 'todos')) return false;
  if (b.campo && !sim(r, campoF(b.campo), 'todos')) return false;
  if (b.de && (!r.ano || r.ano < +b.de)) return false;
  if (b.ate && (!r.ano || r.ano > +b.ate)) return false;
  var x = blob(r); return termos.every(function (q) { return x.indexOf(q) >= 0; });
}
function vBusca() {
  var termos = sa(EST.q).split(/\s+/).filter(Boolean), b = EST.b, anos = anosDe(A), filtros = b.ag || b.tipo || b.top || b.campo || b.de || b.ate;
  var h = '<div class="larg g">' + cabecalho('busca', 'Busca', 'Procure documentos por palavras do assunto, problema, objetivos e alternativas, ou explore pelos filtros.');
  h += '<form class="busca-grande" id="f-busca" role="search" style="margin:0 0 12px;max-width:none;border:1px solid var(--line)"><label class="sr" for="q-busca">Buscar</label><input id="q-busca" type="search" value="' + e(EST.q) + '" placeholder="Palavras, número do documento ou do processo"><button type="submit">' + ic('busca') + ' Buscar</button></form>';
  h += '<div class="filtros-busca">' + selAg('b-ag', b.ag) +
    '<label class="sr" for="b-tipo">Tipo</label><select id="b-tipo" data-acao="b-tipo"><option value="">Todos os tipos</option>' + Object.keys(TIPO).map(function (t) { return '<option value="' + t + '" ' + (b.tipo === t ? 'selected' : '') + '>' + TIPO[t] + '</option>'; }).join('') + '</select>' +
    '<label class="sr" for="b-top">Tópico</label><select id="b-top" data-acao="b-top"><option value="">Todos os tópicos</option>' + Object.keys(CL.natureza_problema.v).map(function (v) { return '<option value="' + v + '" ' + (b.top === v ? 'selected' : '') + '>' + CL.natureza_problema.v[v] + '</option>'; }).join('') + '</select>' +
    '<label class="sr" for="b-campo">Característica</label><select id="b-campo" data-acao="b-campo"><option value="">Qualquer característica</option>' + CB.map(function (f) { return '<option value="' + f.k + '" ' + (b.campo === f.k ? 'selected' : '') + '>' + f.r + '</option>'; }).join('') + '</select>' +
    '<label class="sr" for="b-de">De</label><select id="b-de" data-acao="b-de"><option value="">desde</option>' + anos.map(function (a) { return '<option ' + (+b.de === a ? 'selected' : '') + '>' + a + '</option>'; }).join('') + '</select>' +
    '<label class="sr" for="b-ate">Até</label><select id="b-ate" data-acao="b-ate"><option value="">até</option>' + anos.map(function (a) { return '<option ' + (+b.ate === a ? 'selected' : '') + '>' + a + '</option>'; }).join('') + '</select>' +
    (filtros || termos.length ? '<button class="limpa" type="button" data-acao="b-limpa">limpar</button>' : '') + '</div>';
  if (!termos.length && !filtros) {
    var cont = {}; airs().forEach(function (r) { Object.keys(CL.natureza_problema.v).forEach(function (v) { if (temL(r, 'natureza_problema', v, 'todos')) cont[v] = (cont[v] || 0) + 1; }); });
    return h + '<div class="explorar"><div><h2>Explore por tópico</h2><p class="nota" style="margin:0 0 8px">Natureza do problema, quando todos os leitores concordam (AIRs).</p><div class="chips">' + Object.keys(cont).sort(function (a, b) { return cont[b] - cont[a]; }).map(function (v) { return '<button type="button" class="pilula" data-acao="b-set" data-k="top" data-v="' + v + '">' + CL.natureza_problema.v[v] + ' <span class="n">' + cont[v] + '</span></button>'; }).join('') + '</div></div>' +
      '<div><h2>Explore por característica</h2><div class="chips">' + CB.slice(0, 9).map(function (f) { return '<button type="button" class="pilula" data-acao="b-set" data-k="campo" data-v="' + f.k + '">' + f.r + '</button>'; }).join('') + '</div></div>' +
      '<div><h2>Exemplos de busca</h2><div class="chips">' + ['etanol', 'fadiga', 'tarifa', 'consulta pública', 'drones', 'medicamentos', 'portos', 'barragens'].map(function (q) { return '<button type="button" class="pilula" data-acao="exemplo" data-q="' + q + '">' + q + '</button>'; }).join('') + '</div></div></div></div>';
  }
  var res = A.filter(function (r) { return filtroBusca(r, termos); });
  res.sort(function (a, z) { return (a.tipo === 'air' ? 0 : 1) - (z.tipo === 'air' ? 0 : 1) || (z.ano || 0) - (a.ano || 0); });
  var porAg = {}; A.forEach(function (r) { if (filtroBusca(r, termos, 'ag')) porAg[r.ag] = (porAg[r.ag] || 0) + 1; });
  h += '<div class="barra-res"><span><b>' + fmt(res.length) + '</b> resultado' + (res.length === 1 ? '' : 's') + (termos.length ? ' para “' + e(EST.q) + '”' : '') + '</span><span class="nota" style="margin:0">' + Object.keys(porAg).sort(function (a, z) { return porAg[z] - porAg[a]; }).map(function (k) { return k.toUpperCase() + ' ' + porAg[k]; }).join(' · ') + '</span></div><div class="lista-res">';
  h += res.slice(0, EST.nBusca).map(function (r) {
    var objs = r.obj.filter(function (o) { return termos.some(function (q) { return sa(o).indexOf(q) >= 0; }); }), alts = r.alt.filter(function (o) { return termos.some(function (q) { return sa(o).indexOf(q) >= 0; }); });
    return '<article class="resultado"><h3><a href="#doc-' + r.id + '">' + marcaTermos(e(assunto(r)), termos) + '</a></h3><dl><dt>Agência</dt><dd>' + r.ag.toUpperCase() + ' · ' + TIPO[r.tipo] + ' · ' + (r.ano || 's/ ano') + ' · ' + r.pg + ' p.</dd><dt>Documento</dt><dd>' + marcaTermos(e(r.ident || '–'), termos) + '</dd><dt>Problema</dt><dd>' + marcaTermos(e(r.problema || '–'), termos) + '</dd>' +
      (objs.length ? '<dt>Objetivo</dt><dd>' + marcaTermos(e(objs[0]), termos) + '</dd>' : '') + (alts.length ? '<dt>Alternativa</dt><dd>' + marcaTermos(e(alts[0]), termos) + '</dd>' : '') + '</dl></article>';
  }).join('') + '</div>' + (res.length > EST.nBusca ? '<p class="pag"><button class="bt" type="button" data-acao="mais-busca">Mostrar mais (' + (res.length - EST.nBusca) + ' restantes)</button></p>' : '') + '</div>';
  return h;
}

// ---------- COMPARACAO ----------
function vComparar() {
  var h = '<div class="larg g">' + cabecalho('comparar', 'Comparação', 'Documentos lado a lado, campo a campo, ou as agências entre si.');
  h += abas('aba-cmp', EST.abaCmp, [['airs', 'Documentos lado a lado', 'comparar'], ['agencias', 'Agências', 'agencia']]);
  if (EST.abaCmp === 'agencias') return h + calorAgencias() + '</div>';
  if (!EST.sel.length) { EST.sel = ['173']; ['anac', 'aneel'].forEach(function (ag) { var r = airs().filter(function (x) { return x.ag === ag; })[0]; if (r) EST.sel.push(r.id); }); }
  var rs = EST.sel.map(function (id) { return A.filter(function (r) { return r.id === id; })[0]; }).filter(Boolean);
  h += '<form class="escolha" id="f-cmp"><label for="add-cmp">Acrescentar documento (número ou palavra do assunto)</label><input id="add-cmp" list="dl-cmp" placeholder="ex.: 173"><datalist id="dl-cmp">' + A.map(function (r) { return '<option value="' + r.id + '">' + e(r.ag.toUpperCase() + ' · ' + TIPO[r.tipo] + ' · ' + assunto(r).slice(0, 70)) + '</option>'; }).join('') + '</datalist><button class="bt" type="submit">Acrescentar</button><span class="nota" style="margin:0">até 3 documentos</span></form>';
  if (!rs.length) return h + '<p class="vazio-st">Escolha documentos acima ou marque linhas na tabela do Acervo.</p></div>';
  function lin(rot, fn) { return '<tr><th scope="row">' + rot + '</th>' + rs.map(function (r) { return '<td>' + fn(r) + '</td>'; }).join('') + '</tr>'; }
  function grupo(t) { return '<tr class="grupo"><th scope="row">' + t + '</th>' + rs.map(function () { return '<td></td>'; }).join('') + '</tr>'; }
  function lst(r, k) { var ls = (r.l[k] || []).map(function (x) { return x || []; }), u = unico([].concat.apply([], ls)); return u.map(function (x) { var todos = ls.every(function (l) { return l.indexOf(x) >= 0; }); return '<span class="tag" title="' + (todos ? 'todos os leitores' : 'só parte dos leitores') + '">' + e(CL[k].v[x] || x) + (todos ? '' : ' ◐') + '</span>'; }).join('') || '<span class="nada">nada</span>'; }
  function bl(k) { return function (r) { var pr = par(r, campoF(k)); return selo(pr) + ' ' + STROT[st(pr)][1]; }; }
  h += '<div class="tabela"><table class="cmp"><thead><tr><th>Campo</th>' + rs.map(function (r) { return '<th>' + r.ag.toUpperCase() + ' · ' + TIPO[r.tipo] + ' · ' + (r.ano || '') + ' <button class="limpa" type="button" data-acao="tira-cmp" data-id="' + r.id + '">tirar</button></th>'; }).join('') + '</tr></thead><tbody>' +
    grupo('Identificação') + lin('Assunto', function (r) { return '<a href="#doc-' + r.id + '">' + e(assunto(r)) + '</a>'; }) + lin('Documento', function (r) { return e(r.ident || '–') + ' · ' + r.pg + ' p.'; }) +
    grupo('Problema') + lin('Problema', function (r) { return e(r.problema || '–'); }) + lin('Natureza', function (r) { return lst(r, 'natureza_problema'); }) + lin('Tendência sem intervenção', bl('tendencia_declarada')) +
    grupo('Objetivos') + lin('Objetivos', function (r) { return r.obj.length ? '<ul style="margin:0;padding-left:1em">' + r.obj.map(function (o) { return '<li>' + e(o) + '</li>'; }).join('') + '</ul>' : '<span class="nada">nenhum</span>'; }) + lin('Metas quantitativas', bl('metas')) +
    grupo('Alternativas') + lin('Número', nAltTxt) + lin('Alternativas', function (r) { return r.alt.length ? '<ol style="margin:0;padding-left:1.2em">' + r.alt.map(function (o) { return '<li>' + e(o) + '</li>'; }).join('') + '</ol>' : '–'; }) + lin('Considera não agir', bl('status_quo_considerado')) + lin('Não normativa', bl('alternativa_nao_normativa')) + lin('Recomendada', function (r) { return e(r.rec || '–'); }) +
    grupo('Impactos') + lin('Método de comparação', function (r) { return lst(r, 'metodo_comparacao'); }) + lin('Dimensões', function (r) { return lst(r, 'dimensoes_de_impacto'); }) + lin('Estimativas', bl('estimativas')) + lin('Taxa de desconto', bl('taxa')) + lin('Sensibilidade', bl('analise_sensibilidade')) + lin('Riscos das alternativas', bl('analise_risco_alternativas')) + lin('Incertezas', bl('incertezas_declaradas')) +
    grupo('Participação e acompanhamento') + lin('Participação social', bl('participacao_social')) + lin('Indicadores', bl('indicadores')) + lin('ARR prevista', bl('arr')) +
    '</tbody></table></div><p class="nota">Textos (problema, objetivos, alternativas) na leitura do ' + e(nomeLeitor(LEITORES[0].id)) + '; ◐ indica valor que só parte dos leitores encontrou. Abra cada documento para ver todos os leitores e os trechos.</p></div>';
  return h;
}
function calorAgencias() {
  var ai = airs(), ags = agsCom().sort(function (a, b) { return ai.filter(function (r) { return r.ag === b; }).length - ai.filter(function (r) { return r.ag === a; }).length; });
  function lin(rot, fn) { return '<tr><th scope="row">' + rot + '</th>' + ags.map(function (a) { var l = ai.filter(function (r) { return r.ag === a; }), n = l.filter(fn).length, p = pct(n, l.length); return '<td class="num c' + Math.min(5, Math.ceil(p / 20)) + '" data-tip="' + a.toUpperCase() + ': ' + n + ' de ' + l.length + ' AIRs">' + p + '%</td>'; }).join('') + '</tr>'; }
  var h = '<p class="nota" style="margin:0 0 12px">Cada célula: parte das AIRs da agência em que a característica aparece (regra: ' + regraTxt() + '). Passe o cursor para ver o número de AIRs. Agências sem AIR no acervo ficam de fora.</p><div class="tabela"><table class="cmp calor"><thead><tr><th>Característica</th>' + ags.map(function (a) { return '<th class="num">' + a.toUpperCase() + '<br><span style="font-weight:400">' + ai.filter(function (r) { return r.ag === a; }).length + '</span></th>'; }).join('') + '</tr></thead><tbody>';
  h += '<tr class="grupo"><th scope="row">Campos sim/não</th>' + ags.map(function () { return '<td></td>'; }).join('') + '</tr>';
  CB.forEach(function (f) { h += lin(f.r, function (r) { return sim(r, f); }); });
  h += '<tr class="grupo"><th scope="row">Método de comparação</th>' + ags.map(function () { return '<td></td>'; }).join('') + '</tr>';
  Object.keys(CL.metodo_comparacao.v).forEach(function (v) { h += lin(CL.metodo_comparacao.v[v], function (r) { return temL(r, 'metodo_comparacao', v); }); });
  return h + '</tbody></table></div><div class="legenda-st"><span>0%</span>' + [1, 2, 3, 4, 5].map(function (i) { return '<span style="display:inline-block;width:28px;height:12px;background:var(--s' + i + ')"></span>'; }).join('') + '<span>100%</span></div>';
}

// ---------- EVOLUCAO ----------
function vEvolucao() {
  var ai = airs(), anos = anosDe(A);
  var h = '<div class="larg g">' + cabecalho('evolucao', 'Evolução', 'Como a produção de documentos e as suas características mudam ao longo dos anos.');
  h += abas('aba-evo', EST.abaEvo, [['agencia', 'Por agência', 'agencia'], ['tipo', 'Por tipo de documento', 'tipo'], ['topico', 'Por tópico', 'insights'], ['campo', 'Por campo', 'evolucao']]);
  var base = EST.agEvo ? ai.filter(function (r) { return r.ag === EST.agEvo; }) : ai;
  if (EST.abaEvo === 'agencia') {
    var ymax = 0, g = agsCom().map(function (k) { var c = {}, l = ai.filter(function (r) { return r.ag === k; }); l.forEach(function (r) { c[r.ano] = (c[r.ano] || 0) + 1; ymax = Math.max(ymax, c[r.ano]); }); return [k, l.length, c]; }).sort(function (a, b) { return b[1] - a[1]; });
    var todos = {}; ai.forEach(function (r) { todos[r.ano] = (todos[r.ano] || 0) + 1; }); var tmax = Math.max.apply(null, Object.keys(todos).map(function (k) { return todos[k]; }));
    h += '<div class="mult" style="margin-bottom:14px"><h3>Todas as agências<span>' + ai.length + ' AIRs</span></h3>' + barras(todos, anosDe(ai), tmax, 190, 'Todas as agências por ano', { W: 900 }) + '</div>';
    h += '<div class="grade-mult">' + g.map(function (a) { return '<div class="mult"><h3><a href="#acervo" data-acao="agencia" data-ag="' + a[0] + '">' + a[0].toUpperCase() + '</a><span>' + a[1] + ' AIRs</span></h3>' + barras(a[2], anosDe(ai), ymax, 80, a[0] + ' por ano') + '</div>'; }).join('') + '</div>';
    h += '<p class="nota">Mesma escala vertical em todas as agências (máximo de ' + ymax + ' AIRs num ano). O último ano está incompleto: a coleta foi feita no próprio ano. A ANPD ainda não tem AIRs no acervo.</p>';
  } else {
    h += '<div class="controle">' + selAg('ag-evo', EST.agEvo, agsCom());
    if (EST.abaEvo === 'campo') h += '<label for="sel-campo">Característica</label><select id="sel-campo" data-acao="campo-evo">' + CB.map(function (c) { return '<option value="' + c.k + '" ' + (c.k === EST.campoEvo ? 'selected' : '') + '>' + c.r + '</option>'; }).join('') + '</select>';
    h += '<span class="nota" style="margin:0">regra: ' + regraTxt() + '</span></div>';
    if (EST.abaEvo === 'tipo') {
      var docs = EST.agEvo ? A.filter(function (r) { return r.ag === EST.agEvo; }) : A, ym = 0, ts = Object.keys(TIPO).map(function (t) { var c = {}, n = 0; docs.forEach(function (r) { if (r.tipo === t) { c[r.ano] = (c[r.ano] || 0) + 1; n++; ym = Math.max(ym, c[r.ano]); } }); return [t, n, c]; }).filter(function (x) { return x[1]; }).sort(function (a, b) { return b[1] - a[1]; });
      h += '<div class="grade-mult">' + ts.map(function (a) { return '<div class="mult"><h3>' + TIPO[a[0]] + '<span>' + a[1] + '</span></h3>' + barras(a[2], anos, ym, 80, TIPO[a[0]], { un: 'documentos' }) + '</div>'; }).join('') + '</div><p class="nota">Mesma escala em todos os tipos. REMAI, formulários e processos acompanham as AIRs e foram separados na coleta.</p>';
    } else if (EST.abaEvo === 'topico') {
      var ym2 = 0, gs = Object.keys(CL.natureza_problema.v).map(function (v) { var c = {}, n = 0; base.forEach(function (r) { if (temL(r, 'natureza_problema', v)) { c[r.ano] = (c[r.ano] || 0) + 1; n++; ym2 = Math.max(ym2, c[r.ano]); } }); return [v, n, c]; }).sort(function (a, b) { return b[1] - a[1]; });
      h += '<div class="grade-mult">' + gs.map(function (a) { return '<div class="mult"><h3><a href="#acervo" data-acao="atalho" data-t="l" data-k="natureza_problema:' + a[0] + '">' + CL.natureza_problema.v[a[0]] + '</a><span>' + a[1] + ' AIRs</span></h3>' + barras(a[2], anosDe(ai), ym2, 80, CL.natureza_problema.v[a[0]]) + '</div>'; }).join('') + '</div><p class="nota">“Tópico” aqui é a natureza do problema que a AIR declara (lista fechada do esquema). Uma AIR pode ter mais de uma. Um tópico temático (setor, objeto regulado) ainda não existe como campo.</p>';
    } else {
      var f = campoF(EST.campoEvo), pts = anosDe(ai).map(function (a) { var l = base.filter(function (r) { return r.ano === a; }), k = l.filter(function (r) { return sim(r, f); }).length; return { a: a, n: l.length, k: k, v: pct(k, l.length) }; }).filter(function (p) { return p.n; });
      h += '<div class="mult"><h3>' + f.r + ': parte das AIRs de cada ano' + (EST.agEvo ? ' · ' + EST.agEvo.toUpperCase() : '') + '<span>' + base.length + ' AIRs</span></h3>' + linhaPct(pts, f.r + ' por ano') + '</div><p class="nota">Pontos menores: anos com menos de 10 AIRs, em que o percentual oscila muito com poucos documentos.</p>';
    }
  }
  return h + '</div>';
}

// ---------- INSIGHTS ----------
function vInsights() {
  var h = '<div class="larg g">' + cabecalho('insights', 'Insights', 'Afirmações medidas, dispersão entre agências, palavras mais frequentes e concordância entre leitores.');
  h += abas('aba-ins', EST.abaIns, [['afirmacoes', 'Afirmações', 'insights'], ['dispersao', 'Dispersão', 'dispersao'], ['palavras', 'Palavras', 'palavras'], ['concordancia', 'Concordância', 'concorda']]);
  h += '<div class="aviso" style="margin-bottom:16px"><b>Leitura de máquina, sem conferência humana.</b> Os números contam AIRs em que todos os leitores concordam. Servem para orientar a leitura e escolher o que conferir, não para citar como resultado de pesquisa.</div>';
  var f = { afirmacoes: insAfirmacoes, dispersao: insDispersao, palavras: insPalavras, concordancia: insConcordancia }[EST.abaIns];
  return h + f() + '</div>';
}
function insAfirmacoes() {
  var ai = airs(), n = ai.length, ags = agsCom();
  function porAg(fn) { var m = {}; ags.forEach(function (k) { var l = ai.filter(function (r) { return r.ag === k; }); m[k] = [l.filter(fn).length, l.length]; }); return m; }
  function mini(m) { return '<div class="perfil">' + Object.keys(m).sort(function (a, b) { return pct(m[b][0], m[b][1]) - pct(m[a][0], m[a][1]); }).map(function (k) { var p = pct(m[k][0], m[k][1]); return '<div data-tip="' + k.toUpperCase() + ': ' + m[k][0] + ' de ' + m[k][1] + ' AIRs"><span class="mono">' + k.toUpperCase() + '</span>' + barraH(p) + '<span class="mono">' + p + '%</span></div>'; }).join('') + '</div>'; }
  function div(f) { return ai.filter(function (r) { return st(par(r, f)) === 'div'; }).length; }
  var L = [
    ['b', 'status_quo_considerado', function (r) { return sim(r, CB[0], 'todos'); }, 'consideram a opção de não agir', 'Considerar não é comparar: a AIR pode citar a opção sem analisá-la.', div(CB[0])],
    ['l', 'metodo_comparacao:multicriterio', function (r) { return temL(r, 'metodo_comparacao', 'multicriterio', 'todos'); }, 'declaram comparar as alternativas por multicritério', 'Declarar o método não mostra como ele foi aplicado. Menção não é uso.', null],
    ['l', 'metodo_comparacao:custo_beneficio', function (r) { return temL(r, 'metodo_comparacao', 'custo_beneficio', 'todos'); }, 'declaram análise custo-benefício', 'Os leitores divergem muito neste valor; ver a aba Concordância.', null],
    ['b', 'analise_sensibilidade', function (r) { return sim(r, CB[2], 'todos'); }, 'fazem análise de sensibilidade', 'O campo diz se a análise existe, não se foi bem feita.', div(CB[2])],
    ['b', 'taxa', function (r) { return sim(r, campoF('taxa'), 'todos'); }, 'declaram uma taxa de desconto', 'Taxa de desconto só faz sentido quando há fluxo de custos e benefícios no tempo.', null],
    ['b', 'metas', function (r) { return sim(r, campoF('metas'), 'todos'); }, 'trazem metas quantitativas', 'O campo não distingue meta da política de meta da própria norma.', null],
    ['b', 'participacao_social', function (r) { return sim(r, CB[6], 'todos'); }, 'registram participação social antes ou durante a AIR', 'Registrar não diz como as contribuições foram usadas.', div(CB[6])],
    ['b', 'arr', function (r) { return sim(r, campoF('arr'), 'todos'); }, 'preveem uma avaliação de resultado regulatório (ARR)', 'Prever não é fazer: a ARR acontece anos depois.', null],
    ['b', 'estimativas', function (r) { return sim(r, campoF('estimativas'), 'todos'); }, 'trazem alguma estimativa de impacto', 'Estimativa pode ser um número solto; não quer dizer análise de custo-benefício.', null]
  ];
  return '<div class="cartoes">' + L.map(function (x) { var k = ai.filter(x[2]).length; return '<article class="cartao" style="cursor:auto"><span class="num">' + pct(k, n) + '%<small> · ' + fmt(k) + ' de ' + fmt(n) + ' AIRs</small></span><p>' + x[3].charAt(0).toUpperCase() + x[3].slice(1) + ', segundo todos os leitores.' + (x[5] != null ? ' Em mais ' + x[5] + ' os leitores divergem.' : '') + '</p>' + mini(porAg(x[2])) + '<span class="lim">' + x[4] + '</span><a href="#acervo" data-acao="atalho" data-t="' + x[0] + '" data-k="' + x[1] + '">Ver no acervo →</a></article>'; }).join('') + '</div>';
}
function insDispersao() {
  var ai = airs(), h = '<div class="controle"><label for="ins-modo">Pontos</label><select id="ins-modo" data-acao="ins-modo"><option value="agencias" ' + (EST.insModo === 'agencias' ? 'selected' : '') + '>uma bolha por agência</option><option value="airs" ' + (EST.insModo === 'airs' ? 'selected' : '') + '>um ponto por AIR (páginas × alternativas)</option></select>';
  var W = 760, H = 440, ml = 54, mb = 44, mt = 14, mr = 20;
  if (EST.insModo === 'agencias') {
    h += '<label for="ins-x">Eixo horizontal</label><select id="ins-x" data-acao="ins-x">' + CB.map(function (f) { return '<option value="' + f.k + '" ' + (f.k === EST.insX ? 'selected' : '') + '>' + f.r + '</option>'; }).join('') + '</select><label for="ins-y">Eixo vertical</label><select id="ins-y" data-acao="ins-y">' + CB.map(function (f) { return '<option value="' + f.k + '" ' + (f.k === EST.insY ? 'selected' : '') + '>' + f.r + '</option>'; }).join('') + '</select></div>';
    var fx = campoF(EST.insX), fy = campoF(EST.insY), pts = agsCom().map(function (k) { var l = ai.filter(function (r) { return r.ag === k; }); return { k: k, n: l.length, x: pct(l.filter(function (r) { return sim(r, fx); }).length, l.length), y: pct(l.filter(function (r) { return sim(r, fy); }).length, l.length) }; });
    var nmax = Math.max.apply(null, pts.map(function (p) { return p.n; }));
    var X = function (v) { return ml + (W - ml - mr) * v / 100; }, Y = function (v) { return mt + (H - mb - mt) * (1 - v / 100); };
    var s = '<svg class="graf" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Dispersão entre agências">';
    [0, 25, 50, 75, 100].forEach(function (v) { s += '<line class="eixo" x1="' + ml + '" x2="' + (W - mr) + '" y1="' + Y(v) + '" y2="' + Y(v) + '" stroke-dasharray="2 4"/><text x="' + (ml - 6) + '" y="' + (Y(v) + 3) + '" text-anchor="end">' + v + '%</text><line class="eixo" y1="' + mt + '" y2="' + (H - mb) + '" x1="' + X(v) + '" x2="' + X(v) + '" stroke-dasharray="2 4"/><text x="' + X(v) + '" y="' + (H - mb + 16) + '" text-anchor="middle">' + v + '%</text>'; });
    s += '<text x="' + ((W + ml) / 2) + '" y="' + (H - 6) + '" text-anchor="middle">' + e(fx.r) + '</text><text transform="translate(12 ' + ((H - mb + mt) / 2) + ') rotate(-90)" text-anchor="middle">' + e(fy.r) + '</text>';
    pts.sort(function (a, b) { return b.n - a.n; }).forEach(function (p) { var r = 6 + 22 * Math.sqrt(p.n / nmax), t = p.k.toUpperCase() + ' (' + p.n + ' AIRs): ' + fx.c.toLowerCase() + ' ' + p.x + '%, ' + fy.c.toLowerCase() + ' ' + p.y + '%'; s += '<circle class="bolha" cx="' + X(p.x) + '" cy="' + Y(p.y) + '" r="' + r + '" data-tip="' + t + '"/><text class="rot-bolha" x="' + X(p.x) + '" y="' + (Y(p.y) - r - 4) + '" text-anchor="middle">' + p.k.toUpperCase() + '</text>'; });
    return h + '<div class="mult graf-contido">' + s + '</svg></div><p class="nota">Cada bolha é uma agência; o tamanho é o número de AIRs. As posições são a parte das AIRs da agência com cada característica (regra: ' + regraTxt() + '). Agências no canto superior direito têm as duas características com mais frequência.</p>';
  }
  h += '</div>';
  var ptsA = ai.filter(function (r) { return r.nAlt[0] != null && r.pg; }).map(function (r) { return { r: r, x: r.pg, y: r.nAlt[0] }; });
  var ymax = Math.min(12, Math.max.apply(null, ptsA.map(function (p) { return p.y; }))), lx = function (v) { return Math.log10(Math.max(1, v)); }, lmax = lx(Math.max.apply(null, ptsA.map(function (p) { return p.x; })));
  var X2 = function (v) { return ml + (W - ml - mr) * lx(v) / lmax; }, Y2 = function (v) { return mt + (H - mb - mt) * (1 - Math.min(v, ymax) / ymax); };
  var s2 = '<svg class="graf" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Páginas e número de alternativas por AIR">';
  [1, 3, 10, 30, 100, 300, 1000].filter(function (v) { return lx(v) <= lmax; }).forEach(function (v) { s2 += '<line class="eixo" y1="' + mt + '" y2="' + (H - mb) + '" x1="' + X2(v) + '" x2="' + X2(v) + '" stroke-dasharray="2 4"/><text x="' + X2(v) + '" y="' + (H - mb + 16) + '" text-anchor="middle">' + v + '</text>'; });
  for (var yv = 0; yv <= ymax; yv += 2) s2 += '<line class="eixo" x1="' + ml + '" x2="' + (W - mr) + '" y1="' + Y2(yv) + '" y2="' + Y2(yv) + '" stroke-dasharray="2 4"/><text x="' + (ml - 6) + '" y="' + (Y2(yv) + 3) + '" text-anchor="end">' + yv + (yv === ymax ? '+' : '') + '</text>';
  s2 += '<text x="' + ((W + ml) / 2) + '" y="' + (H - 6) + '" text-anchor="middle">páginas (escala logarítmica)</text><text transform="translate(12 ' + ((H - mb + mt) / 2) + ') rotate(-90)" text-anchor="middle">número de alternativas</text>';
  ptsA.forEach(function (p, i) { var j = ((i * 37) % 11 - 5) * 0.06; s2 += '<a href="#doc-' + p.r.id + '"><circle class="ponto-d" cx="' + X2(p.x) + '" cy="' + Y2(p.y + j) + '" r="3.5" data-tip="' + e(p.r.ag.toUpperCase() + ' · ' + p.x + ' p. · ' + p.y + ' alternativas · ' + assunto(p.r).slice(0, 70)) + '"/></a>'; });
  return h + '<div class="mult graf-contido">' + s2 + '</svg></div><p class="nota">Cada ponto é uma AIR, com o número de alternativas lido pelo ' + e(nomeLeitor(LEITORES[0].id)) + '. Os pontos foram levemente deslocados na vertical para não se sobreporem. Clique num ponto para abrir a AIR. Documentos maiores não trazem, necessariamente, mais alternativas.</p>';
}
function insPalavras() {
  var docs = A.filter(function (r) { return !EST.agPal || r.ag === EST.agPal; }), df = {};
  var forma = {};
  docs.forEach(function (r) { var vistos = {}; String(r.assunto.concat([r.problema]).join(' ')).toLowerCase().split(/[^a-z0-9à-öø-ÿ]+/).forEach(function (o) { var w = sa(o); if (w.length < 4 || STOP[w] || /^\d+$/.test(w)) return; var f = forma[w] = forma[w] || {}; f[o] = (f[o] || 0) + 1; if (vistos[w]) return; vistos[w] = 1; df[w] = (df[w] || 0) + 1; }); });
  function fw(w) { var f = forma[w] || {}; return Object.keys(f).sort(function (a, b) { return f[b] - f[a]; })[0] || w; }
  var top = Object.keys(df).sort(function (a, b) { return df[b] - df[a]; }).slice(0, 70), max = df[top[0]] || 1, min = df[top[top.length - 1]] || 1;
  var nuvem = top.slice().sort().map(function (w) { var t = 0.8 + 2.2 * Math.sqrt((df[w] - min) / Math.max(1, max - min)); return '<button type="button" data-acao="exemplo" data-q="' + e(fw(w)) + '" style="font-size:' + t.toFixed(2) + 'rem" data-tip="' + e(fw(w)) + ': ' + df[w] + ' documentos">' + e(fw(w)) + '</button>'; }).join('');
  return '<div class="controle">' + selAg('ag-pal', EST.agPal) + '<span class="nota" style="margin:0">' + docs.length + ' documentos; palavras do assunto e do problema, contadas uma vez por documento</span></div><div class="pal-grade"><div class="nuvem" aria-label="Nuvem de palavras">' + nuvem + '</div><div><div class="tabela"><table><thead><tr><th>Palavra</th><th class="num">Documentos</th></tr></thead><tbody>' + top.slice(0, 20).map(function (w) { return '<tr><td><a href="#busca" data-acao="exemplo" data-q="' + e(fw(w)) + '">' + e(fw(w)) + '</a></td><td class="num">' + df[w] + '</td></tr>'; }).join('') + '</tbody></table></div></div></div><p class="nota">Palavras comuns (artigos, preposições, “regulatório”, “análise”, “agência”) foram retiradas. Clique numa palavra para buscar os documentos que a contêm.</p>';
}
function insConcordancia() {
  var ai = airs(), linhas = CB.map(function (f) { var c = { sim: 0, nao: 0, div: 0, outro: 0 }; ai.forEach(function (r) { var s = st(par(r, f)); if (s === 'sim' || s === 'nao' || s === 'div') c[s]++; else c.outro++; }); return [f.r, c]; });
  Object.keys(CL).forEach(function (k) { var c = { sim: 0, nao: 0, div: 0, outro: 0 }; ai.forEach(function (r) { var ls = (r.l[k] || []).filter(function (x) { return x != null; }).map(function (x) { return JSON.stringify(x.slice().sort()); }); if (ls.length < LEITORES.length) c.outro++; else if (unico(ls).length === 1) c[ls[0] === '[]' ? 'nao' : 'sim']++; else c.div++; }); linhas.push([CL[k].r + ' (lista completa igual)', c]); });
  linhas.sort(function (a, b) { return (b[1].sim + b[1].nao) - (a[1].sim + a[1].nao); });
  return '<p class="nota" style="margin:0 0 12px">Para cada campo, em quantas das ' + ai.length + ' AIRs os leitores dão a mesma resposta. Verde: concordam (sim ou não); vermelho: divergem; cinza: só parte dos leitores leu. Concordar não prova acerto; o acerto só se mede contra o gabarito humano, ainda por fazer.</p><div class="mult"><div class="conc">' + linhas.map(function (l) { var c = l[1], t = c.sim + c.nao + c.div + c.outro, a = pct(c.sim + c.nao, t); return '<div class="conc-l"><span>' + e(l[0]) + '</span><span class="empilha" role="img" aria-label="' + a + '% concordam"><span class="seg ok" style="flex:' + (c.sim + c.nao) + '" data-tip="concordam: ' + (c.sim + c.nao) + ' (' + c.sim + ' sim, ' + c.nao + ' não)"></span><span class="seg bad" style="flex:' + c.div + '" data-tip="divergem: ' + c.div + '"></span><span class="seg neu" style="flex:' + c.outro + '" data-tip="só parte dos leitores: ' + c.outro + '"></span></span><span class="mono">' + a + '%</span></div>'; }).join('') + '</div></div><p class="nota">Nas listas fechadas (método, natureza, dimensões), “concordam” exige a lista inteira igual; por isso a concordância é menor que nos campos sim/não.</p>';
}

// ---------- METODO ----------
function vMetodo() {
  var tipos = R.tipos || {}, d = R.diagSecao || {}, campos = {};
  Object.keys(d).forEach(function (k) { var p = k.split('|'); (campos[p[1]] = campos[p[1]] || {})[p[0]] = d[k]; });
  var lids = LEITORES.map(function (l) { return l.id; });
  var linhas = Object.keys(campos).sort(function (a, b) { return (ROT[a] || a).localeCompare(ROT[b] || b); }).map(function (c) { var x = campos[c]; return '<tr><th scope="row">' + (ROT[c] || c) + '</th>' + lids.map(function (m) { var v = x[m]; if (!v) return '<td class="num">–</td><td class="num">–</td>'; var t = (v.na_secao || 0) + (v.fora || 0); return '<td class="num">' + pct(v.na_secao || 0, t) + '%</td><td class="num">' + t + '</td>'; }).join('') + '</tr>'; }).join('');
  var est = R.estrutura || {};
  var h = '<div class="larg g">' + cabecalho('metodo', 'Método', 'De onde vêm os documentos, como o texto foi extraído, como os leitores trabalharam e o que já foi medido.') + '<div class="prosa">';
  h += '<h2>1. Os documentos</h2><p>O acervo reúne ' + fmt(R.n) + ' documentos de ' + (NAG - 1) + ' das ' + NAG + ' agências reguladoras federais, depois de retirar as cópias repetidas: ' + fmt(R.nAir) + ' AIRs em sentido estrito e os documentos ligados a elas (' + Object.keys(tipos).filter(function (t) { return t !== 'air'; }).map(function (t) { return fmt(tipos[t]) + ' ' + (TIPO[t] || t); }).join(', ') + '). AIR é o que a agência publica como AIR. Cada PDF foi guardado com o endereço de onde veio e uma impressão digital do arquivo. A ANPD passou a agência em 2026 (Lei nº 15.352) e publica relatórios de AIR; a coleta dela ainda não foi feita.</p>';
  h += '<h2>2. O texto</h2><p>Quando o PDF tem camada de texto, o texto sai dela (programa pdftotext). Quando o PDF é imagem escaneada, ou quando a camada de texto é ilegível, o texto sai por reconhecimento óptico de caracteres (OCR, programa Tesseract, a 300 pontos por polegada, em português). Um teste de legibilidade conta a proporção de palavras comuns do português: abaixo de 5%, o texto é tratado como ilegível e vai para o OCR.</p>';
  h += '<h3>Reconstituição</h3><p>Para mostrar o texto no modelo do repositório, retiram-se as linhas que se repetem no alto e no pé de toda página (data de impressão, nome do sistema, endereço), juntam-se as linhas que o PDF quebra, cada linha de sumário vira um item próprio e cada seção do documento é posta numa seção do modelo pelas palavras do seu título. Nenhuma palavra da agência é acrescentada ou reescrita; na tela, o pontilhado dos sumários aparece encurtado, mas está inteiro no texto. Uma conferência automática compara, caractere por caractere, o texto do PDF (sem as linhas retiradas) com o reconstituído: as duas versões são iguais em ' + fmt(R.integro) + ' dos ' + fmt(R.nRecon) + ' documentos. Nas AIRs, ' + fmt(est['todas as seções no modelo'] || 0) + ' têm todas as seções postas no modelo, ' + fmt(est["parte em 'outras'"] || 0) + ' têm parte delas em “Outras partes” e ' + fmt(est['sem seções reconhecidas'] || 0) + ' não têm título de seção reconhecido.</p>';
  h += '<h2>3. Os leitores</h2><p>Hoje são ' + LEITORES.length + ' leitores, modelos de linguagem que leram cada documento inteiro, de uma vez, e preencheram uma ficha de 38 campos (esquema v1.1): ' + LEITORES.map(function (l) { return l.nome; }).join(' e ') + '. Outros leitores entrarão. Cada valor deve vir com o trecho do documento e a página. Um dos campos é um código de controle, inserido no texto para conferir que o leitor leu até o fim; ele não aparece no site. Os leitores trabalharam separados e não viram a resposta um do outro.</p>';
  h += '<h3>O que é conferido por máquina</h3><ul><li>Se cada trecho citado existe literalmente no documento. Quando não existe, a página do documento diz “não encontrado literalmente”: pode ser paráfrase do leitor ou erro de leitura.</li><li>Se o código de controle foi encontrado.</li><li>Se os leitores concordam, campo a campo. Em sim/não, número e listas fechadas, a comparação é exata. Em textos e listas de itens, a comparação é por palavras: duas respostas com as mesmas palavras de conteúdo, mesmo com uma ou duas a mais, contam como “concordam, com palavras diferentes”. Ainda não há leitura do sentido; um terceiro leitor que julgue se duas respostas dizem a mesma coisa é o próximo passo.</li></ul><h3>O que ainda não foi conferido</h3><p>Nenhum campo foi conferido por pessoa. O plano é um gabarito humano numa amostra, com o qual se mede o acerto de cada leitor por campo antes de usar os números como resultado.</p>';
  h += '<h2>4. De onde vem o trecho citado</h2><p>Os leitores recebem o documento inteiro e não são instruídos a citar a seção própria de cada assunto. Por isso o trecho de “Alternativas” pode vir do sumário executivo em vez da seção de alternativas: o valor pode estar certo, mas a prova citada é a menção, não a análise. A tabela mede isso nas AIRs que têm a seção correspondente.</p>';
  h += '<div class="tabela"><table class="cmp"><thead><tr><th>Campo</th>' + LEITORES.map(function (l) { return '<th class="num">' + e(l.nome) + ', na seção</th><th class="num">trechos</th>'; }).join('') + '</tr></thead><tbody>' + linhas + '</tbody></table></div>';
  h += '<p class="nota">Um trecho fora da seção não é erro em si: o sumário e a conclusão também falam das alternativas. É um sinal de que a busca do leitor pode ser mais dirigida.</p>';
  h += '<h3>Busca mais dirigida: próximos passos</h3><ol><li><b>Extração por seção.</b> Usar o mapa de seções da reconstituição para mandar ao leitor a seção própria de cada grupo de campos.</li><li><b>Trecho principal e menções.</b> Pedir, para cada valor, o trecho da seção dedicada e, separadamente, outras menções.</li><li><b>Medir antes de trocar.</b> Comparar as duas formas de extração contra o gabarito humano, campo a campo.</li><li><b>Busca no texto integral.</b> Um índice de texto de todos os documentos, para procurar qualquer palavra.</li></ol>';
  h += '<h2>5. Limites desta versão</h2><ul><li>Os textos de problema, objetivos e alternativas nas tabelas e na busca são os do ' + e(nomeLeitor(LEITORES[0].id)) + '; a página de cada documento mostra todos os leitores.</li><li>O ano é o da assinatura quando os leitores a encontram; senão, o registrado na coleta. Anos com asterisco merecem conferência.</li><li>Licença e política de redistribuição em definição. Dados gerados em ' + e(R.geradoEm || '') + '.</li></ul></div></div>';
  return h;
}

// ---------- DOCUMENTO ----------
function carregaDoc(id) { if (!CACHE[id]) CACHE[id] = fetch('dados/doc/' + id + '.json').then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }); return CACHE[id]; }
var LIDER = /((?:\.\s?){6,}|…{3,}|_{6,})/g;
function marcado(t, ms, sumario) {
  if (!ms || !ms.length) return sumario ? e(t).replace(LIDER, '<span class="pontos">$1</span>') : e(t);
  var cortes = unico([0, t.length].concat.apply([0, t.length], ms.map(function (m) { return [m[0], m[1]]; }))).sort(function (a, b) { return a - b; }), out = '';
  for (var i = 0; i < cortes.length - 1; i++) {
    var a = cortes[i], b = cortes[i + 1], cobre = ms.filter(function (m) { return m[0] <= a && m[1] >= b; }), pd = e(t.slice(a, b));
    if (!cobre.length) { out += pd; continue; }
    var quem = unico(cobre.map(function (m) { return m[2]; })), campos = unico(cobre.map(function (m) { return m[3]; }));
    var dica2 = unico(cobre.map(function (m) { return nomeLeitor(m[2]).split(' ')[0] + ': ' + (ROT[m[3]] || m[3]); })).join('; ');
    out += '<mark class="m ' + (quem.length > 1 ? 'm-ambos' : quem[0] === LEITORES[0].id ? 'm-claude' : 'm-glm') + '" data-campos="' + campos.join(' ') + '" title="' + e(dica2) + '">' + pd + '</mark>';
  }
  return out;
}
function valorHtml(v) {
  if (v && typeof v === 'object' && !Array.isArray(v) && 'valor' in v && Object.keys(v).every(function (k) { return ['valor', 'trecho', 'pagina'].indexOf(k) >= 0; })) return valorHtml(v.valor);
  if (vazio(v)) return '<span class="nada">não encontrado</span>';
  if (Array.isArray(v)) return '<ul>' + v.map(function (x) {
    if (x && typeof x === 'object') { var ch = PRINC.filter(function (k) { return x[k]; })[0]; var resto = Object.keys(x).filter(function (k) { return k !== ch && k !== 'trecho' && k !== 'pagina' && !vazio(x[k]); }).map(function (k) { return e(SUB[k] || k.replace(/_/g, ' ')) + ': ' + e(leg(x[k])); }); return '<li>' + (ch ? e(leg(x[ch])) : '') + (ch && resto.length ? ' · ' : '') + resto.join('; ') + (x.pagina ? ' <span class="mono">p. ' + e(x.pagina) + '</span>' : '') + '</li>'; }
    return '<li>' + e(leg(x)) + '</li>';
  }).join('') + '</ul>';
  if (typeof v === 'object') return '<ul>' + Object.keys(v).map(function (k) { var y = v[k]; if (y && typeof y === 'object' && 'valor' in y) y = y.valor; return '<li>' + e(SUB[k] || k.replace(/_/g, ' ')) + ': ' + (vazio(y) ? '<span class="nada">não encontrado</span>' : e(leg(y))) + '</li>'; }).join('') + '</ul>';
  return e(leg(v));
}
// comparacao entre leitores: exata em sim/nao, numero e lista fechada; por palavras em texto e listas de itens
function tok(s) { var o = {}; sa(s).split(/[^a-z0-9]+/).forEach(function (w) { if (w.length > 2 && !STOP[w]) o[w] = 1; }); return o; }
function sobrepoe(a, b) { var A1 = tok(a), B1 = tok(b), ka = Object.keys(A1), kb = Object.keys(B1); if (!ka.length || !kb.length) return sa(a).trim() === sa(b).trim() ? 1 : 0; var c = ka.filter(function (w) { return B1[w]; }).length; return c / Math.min(ka.length, kb.length); }
function desembrulha(v) { return (v && typeof v === 'object' && !Array.isArray(v) && 'valor' in v && Object.keys(v).every(function (k) { return ['valor', 'trecho', 'pagina'].indexOf(k) >= 0; })) ? desembrulha(v.valor) : v; }
function itemTxt(x) { if (x && typeof x === 'object') { var ch = PRINC.filter(function (k) { return x[k]; })[0]; return ch ? String(x[ch]) : JSON.stringify(x); } return String(x); }
var ORDEM_EST = ['igual', 'parecido', 'livre', 'parcial', 'difere'];
function pior(a, b) { return ORDEM_EST.indexOf(a[0]) >= ORDEM_EST.indexOf(b[0]) ? a : b; }
var LIVRE = { problema: 1, assunto: 1, alternativa_recomendada: 1, identificacao: 1 };
function cmp(k, a, b) {
  a = desembrulha(a); b = desembrulha(b);
  if (Array.isArray(a) && Array.isArray(b)) {
    if (CL[k]) { var sa1 = a.slice().sort().join('|'), sb1 = b.slice().sort().join('|'); if (sa1 === sb1) return ['igual']; var com = a.filter(function (x) { return b.indexOf(x) >= 0; }).length; return com ? ['parcial', com + ' de ' + unico(a.concat(b)).length + ' valores em comum'] : ['difere']; }
    var ta = a.map(itemTxt), tb = b.map(itemTxt), usados = {}, m = 0, exatos = 0;
    ta.forEach(function (x) { var melhor = -1, mv = 0; tb.forEach(function (y, j) { if (usados[j]) return; var s = sobrepoe(x, y); if (s > mv) { mv = s; melhor = j; } }); if (melhor >= 0 && mv >= 0.7) { usados[melhor] = 1; m++; if (sa(x).trim() === sa(tb[melhor]).trim()) exatos++; } });
    var mx = Math.max(ta.length, tb.length);
    if (m === ta.length && m === tb.length) return [exatos === m ? 'igual' : 'parecido', m + ' itens correspondentes'];
    if (m && m >= Math.ceil(mx / 2)) return ['parcial', m + ' de ' + mx + ' itens correspondentes'];
    return LIVRE[k] || !CL[k] ? (m ? ['parcial', m + ' de ' + mx + ' itens correspondentes'] : ['livre', 'nenhum item correspondente']) : ['difere'];
  }
  if (typeof a === 'string' && typeof b === 'string') {
    if (sa(a).replace(/[\s.]+$/, '') === sa(b).replace(/[\s.]+$/, '')) return ['igual'];
    var s = sobrepoe(a, b); if (s >= 0.7) return ['parecido', Math.round(100 * s) + '% das palavras em comum'];
    return LIVRE[k] ? ['livre', Math.round(100 * s) + '% das palavras em comum'] : ['difere'];
  }
  if (a && b && typeof a === 'object' && typeof b === 'object') { var r = ['igual']; unico(Object.keys(a).concat(Object.keys(b))).forEach(function (s) { var x = desembrulha(a[s]), y = desembrulha(b[s]); if (vazio(x) && vazio(y)) return; if (vazio(x) || vazio(y)) { r = pior(r, ['parcial', 'um subcampo só num leitor']); return; } r = pior(r, cmp(s, x, y)); }); return r; }
  return a === b ? ['igual'] : ['difere'];
}
var EROT = { igual: 'leitores concordam', parecido: 'concordam, com palavras diferentes', parcial: 'concordam em parte', difere: 'leitores divergem', livre: 'leituras diferentes: comparar', um: 'só parte dos leitores achou', vazio: 'nenhum leitor achou', falta: 'sem ficha' };
var SIMB = { igual: '✓', parecido: '≈', parcial: '◑', difere: '✕', livre: '↔', um: '◐', vazio: '–', falta: '?' };
function concord(k, vals) {
  var pres = vals.filter(function (v) { return v !== undefined; });
  if (!pres.length) return ['falta'];
  var vs = pres.map(function (v) { return v && v.valor; }), cheios = vs.filter(function (v) { return !vazio(desembrulha(v)); });
  if (!cheios.length) return ['vazio'];
  if (cheios.length < vs.length) return ['um'];
  var r = ['igual']; for (var i = 1; i < vs.length; i++) r = pior(r, cmp(k, vs[0], vs[i]));
  return r;
}
function trechosDe(v, out) { out = out || []; if (Array.isArray(v)) v.forEach(function (x) { trechosDe(x, out); }); else if (v && typeof v === 'object') { if (v.trecho) out.push({ t: v.trecho, p: v.pagina }); Object.keys(v).forEach(function (k) { if (k !== 'trecho' && v[k] && typeof v[k] === 'object') trechosDe(v[k], out); }); } return out; }
function cartaoCampo(d, k, achados) {
  var vals = LEITORES.map(function (l) { return (d.fichas[l.id] || undefined) && d.fichas[l.id][k]; }), c = concord(k, vals);
  return '<article class="campo" id="f-' + k + '"><header><h3>' + e(ROT[k] || k) + '</h3><span class="selo est-' + c[0] + '" title="' + e(c[1] || '') + '"><span aria-hidden="true">' + SIMB[c[0]] + '</span> ' + EROT[c[0]] + '</span></header>' + (c[1] ? '<p class="onde" style="margin:-4px 0 0">' + e(c[1]) + '</p>' : '') +
    LEITORES.map(function (l, i) {
      var v = vals[i], on = unico(achados[l.id + '|' + k] || []).sort(function (p, q) { return p - q; }), cab = '<span class="quem q-' + (i ? 'glm' : 'claude') + '">' + e(l.nome) + '</span>';
      if (!d.fichas[l.id]) return '<div class="leit">' + cab + '<span class="nada">sem ficha deste leitor</span></div>';
      var tr = trechosDe(v), pags = unico(tr.map(function (x) { return x.p; }).filter(Boolean)), onde = '';
      if (on.length) onde = 'trecho citado, encontrado no texto: ' + on.slice(0, 8).map(function (o) { return '<a href="#doc-' + d.id + '" data-acao="vai-par" data-p="' + o + '">p. ' + d.pars[o].i + '</a>'; }).join(' ');
      else if (tr.length) onde = 'trecho citado' + (pags.length ? ' (p. ' + pags.join(', ') + ' segundo o leitor)' : '') + ' não encontrado literalmente no texto';
      else if (!vazio(desembrulha(v && v.valor))) onde = 'o leitor não citou trecho';
      return '<div class="leit">' + cab + '<div class="val">' + valorHtml(v) + '</div>' + (onde ? '<div class="onde">' + onde + '</div>' : '') + '</div>';
    }).join('') + '</article>';
}
var DOCV = { aba: 'ler' };
function vDoc(id) {
  var r = A.filter(function (x) { return x.id === id; })[0];
  if (!r) return '<div class="larg g"><p class="vazio-st">Documento ' + e(id) + ' não encontrado. <a href="#acervo">Voltar ao acervo</a></p></div>';
  return '<div class="larg g"><div class="air-cab"><p class="olho" style="display:flex;gap:6px;align-items:center;flex-wrap:wrap"><a href="#acervo">Acervo</a> / <a href="#acervo" data-acao="agencia" data-ag="' + r.ag + '">' + r.ag.toUpperCase() + '</a> / ' + TIPO[r.tipo] + ' · documento ' + r.id + '</p><h1>' + e(assunto(r)) + '</h1><dl class="fichinha"><div><dt>Documento</dt><dd>' + e(r.ident || '–') + '</dd></div><div><dt>Tipo</dt><dd>' + TIPO[r.tipo] + '</dd></div><div><dt>Ano</dt><dd>' + (r.ano || '–') + '</dd></div><div><dt>Páginas</dt><dd>' + r.pg + '</dd></div>' + (r.url ? '<div><dt>Original</dt><dd><a href="' + e(r.url) + '" target="_blank" rel="noopener">PDF publicado pela agência ' + ic('externo') + '</a></dd></div>' : '') + '</dl></div><div id="doc-corpo"><p class="vazio-st">Carregando o texto…</p></div></div>';
}
function montaDoc(id) {
  var alvo = document.getElementById('doc-corpo'); if (!alvo) return;
  var r = A.filter(function (x) { return x.id === id; })[0];
  carregaDoc(id).then(function (d) {
    var achados = {}; Object.keys(d.marcas).forEach(function (o) { d.marcas[o].forEach(function (m) { (achados[m[2] + '|' + m[3]] = achados[m[2] + '|' + m[3]] || []).push(+o); }); });
    var aba = DOCV.aba, ABAS = [['ler', 'Ler', 'texto'], ['meta', 'Ler com metadados', 'camadas'], ['ficha', 'Ficha', 'ficha'], ['original', 'Ordem original', 'ordem'], ['sobre', 'Sobre esta página', 'info']];
    var h = cabecalho('doc', '', '') + abas('aba-doc', aba, ABAS);
    var secs = SECOES.map(function (s) { var pts = d.partes.filter(function (p) { return p.secao === s[0]; }); return { k: s[0], t: s[1], campos: s[2], pts: pts, n: pts.reduce(function (acc, p) { return acc + p.pars.filter(function (o) { return !d.pars[o].h; }).length; }, 0) }; }).filter(function (s) { return s.k !== 'outras' || s.pts.length; });
    function parH(o, ancora) { var p = d.pars[o]; if (p.h) return '<h3 class="h-orig">' + (p.n ? '<span class="h-num">' + e(p.n) + '</span> ' : '') + e(p.t) + '</h3>'; var pg = 'p. ' + p.i + (p.f !== p.i ? '–' + p.f : ''); return '<div class="par' + (p.s ? ' sum' : '') + '"' + (ancora ? ' id="p' + o + '"' : '') + ' data-num="' + e(p.n || '') + '" data-pg="' + pg + '"><div class="margem"><span class="n">' + e(p.n || '') + '</span><span>' + pg + '</span></div><p>' + marcado(p.t, d.marcas[o], p.s) + '</p>' + (p.s ? '' : '<button class="cita" type="button" data-acao="cita">copiar referência</button>') + '</div>'; }
    var corpo = '';
    if (aba === 'ler' || aba === 'meta') {
      corpo = secs.map(function (s) {
        var orig = s.pts.map(function (p) { var o = p.pars, a = d.pars[o[0]], b = d.pars[o[o.length - 1]]; return (p.original ? (p.num ? 'seção ' + p.num + ', ' : 'título ') + minus(p.titulo) : p.titulo.charAt(0).toLowerCase() + p.titulo.slice(1)) + ' (p. ' + a.i + (b.f !== a.i ? '–' + b.f : '') + ')'; }).join('; ');
        var txt = s.pts.map(function (p) { return p.pars.map(function (o) { return parH(o, true); }).join(''); }).join('');
        var meta = aba === 'meta' && s.campos.length ? '<details class="meta-sec" open><summary>Metadados desta seção · ' + s.campos.length + ' campo' + (s.campos.length > 1 ? 's' : '') + '</summary><p class="nota" style="margin:0 12px 10px">Para cada leitor: o valor extraído e onde está o trecho que ele citou. “Não encontrado literalmente” quer dizer que a frase citada não aparece igual no texto: pode ser paráfrase do leitor ou erro de leitura. A página que o leitor indica pode diferir da página do PDF em documentos com capa ou sumário.</p><div class="meta-grade">' + s.campos.map(function (k) { return cartaoCampo(d, k, achados); }).join('') + '</div></details>' : '';
        if (!txt && aba === 'ler') return '';
        return '<section class="sec" id="s-' + s.k + '"><header class="sec-cab"><h2>' + s.t + '</h2><p class="origem">No original: ' + (orig ? e(orig) : 'sem seção própria; os campos vêm de outras partes do texto') + '</p></header>' + meta + (txt ? '<div class="folha ' + (aba === 'meta' ? 'marcas-on' : '') + '">' + txt + '</div>' : '') + '</section>';
      }).join('');
      if (aba === 'meta') corpo = '<div class="camadas"><span>No texto:</span><span><mark class="m" style="text-decoration:underline 2px var(--claude);text-underline-offset:3px">sublinhado</mark> ' + e(LEITORES[0].nome) + '</span><span><mark class="m" style="background:var(--glm-tint)">fundo</mark> ' + e((LEITORES[1] || LEITORES[0]).nome) + '</span><span>Clique num trecho marcado para ver o campo.</span></div>' + corpo;
    } else if (aba === 'original') {
      corpo = '<div class="folha">' + d.pars.map(function (p, o) { return parH(o, false); }).join('') + '</div>';
    } else if (aba === 'ficha') {
      var todos = []; SECOES.forEach(function (s) { s[2].forEach(function (k) { todos.push(k); }); });
      var cont = {}; todos.forEach(function (k) { var c = concord(k, LEITORES.map(function (l) { return (d.fichas[l.id] || {})[k]; }))[0]; cont[c] = (cont[c] || 0) + 1; });
      corpo = '<p class="nota" style="margin:0 0 12px">' + todos.length + ' campos: ' + ORDEM_EST.concat(['um', 'vazio']).filter(function (c) { return cont[c]; }).map(function (c) { return '<span class="selo est-' + c + '">' + SIMB[c] + ' ' + cont[c] + ' ' + EROT[c] + '</span>'; }).join(' ') + '</p><p class="nota" style="margin:0 0 12px">Sim/não, números e listas fechadas são comparados exatamente. Textos e listas de itens são comparados por palavras de conteúdo: “concordam, com palavras diferentes” quando quase todas as palavras de um estão no outro. Ainda não há leitura do sentido.</p>' + SECOES.filter(function (s) { return s[2].length; }).map(function (s) { return '<h2 class="sec-tit">' + s[1] + '</h2><div class="meta-grade" style="padding:0">' + s[2].map(function (k) { return cartaoCampo(d, k, achados); }).join('') + '</div>'; }).join('');
    } else {
      var pl = Object.keys(d.placar).map(function (m) { return nomeLeitor(m) + ': ' + d.placar[m][0] + ' de ' + d.placar[m][1]; }).join(' · ');
      var outras = d.partes.filter(function (p) { return p.original && p.secao === 'outras'; }).length, nOrig = d.partes.filter(function (p) { return p.original; }).length;
      corpo = '<div class="prosa"><div class="aviso"><b>Esta página não é o documento oficial.</b> O texto é o do PDF publicado pela agência, extraído por máquina e reorganizado no modelo do repositório. Para citar, confira no ' + (r.url ? '<a href="' + e(r.url) + '" target="_blank" rel="noopener">PDF original</a>' : 'PDF original') + ': lá estão a paginação, as tabelas e as figuras como a agência publicou.</div>' +
        '<h2>De onde veio o texto</h2><p>Fonte: ' + e(d.fonte) + '. O documento tem ' + d.pags + ' páginas e foi dividido em ' + d.pars.filter(function (p) { return !p.h; }).length + ' parágrafos' + (d.pars.some(function (p) { return p.s; }) ? ', com cada linha de sumário como item próprio' : '') + '.</p>' +
        '<h2>O que foi retirado</h2><p>' + (d.nRetiradas ? d.nRetiradas + ' linhas que se repetem no alto ou no pé das páginas, como ' + d.retiradas.map(function (x) { return '“' + e(x[0].length > 70 ? x[0].slice(0, 70) + '…' : x[0]) + '” (' + x[1] + ' vezes)'; }).join(', ') + '. ' : 'Nenhuma linha repetida de cabeçalho ou rodapé. ') + 'Também foram juntadas as linhas que o PDF quebra no meio da frase.</p>' +
        '<h2>Nada mais mudou</h2><p>' + (d.integro ? 'A conferência automática comparou o texto do PDF, sem as linhas retiradas, com o texto desta página, caractere por caractere: são iguais. Nenhuma palavra da agência foi acrescentada, cortada ou reescrita; só a ordem das seções mudou.' : 'Atenção: a conferência automática encontrou diferença entre o texto do PDF e o desta página. Use o PDF.') + '</p>' +
        '<h2>Como as seções foram organizadas</h2><p>' + (nOrig ? 'Os ' + nOrig + ' títulos de seção do original foram postos nas seções do modelo pelas palavras do título; ' + outras + ' ficaram em “Outras partes do documento”.' : 'Nenhum título de seção foi reconhecido; o texto está todo em “Outras partes do documento”, na ordem original.') + ' A aba “Ordem original” mostra o texto na sequência da agência.</p>' +
        '<h2>Os metadados</h2><p>' + LEITORES.map(function (l) { return e(l.nome) + (d.quando[l.id] ? ' (' + e(d.quando[l.id]) + ')' : ' (sem ficha)'); }).join(' e ') + ' leram o documento inteiro. Trechos citados encontrados literalmente no texto: ' + e(pl) + '. Encontrar o trecho mostra que a citação existe, não que o valor esteja certo. Nenhum campo foi conferido por pessoa.</p>' +
        (r.anoF !== 'assinatura' ? '<h2>Atenção à data</h2><p>O ano mostrado (' + (r.ano || '–') + ') não vem de uma assinatura lida igualmente pelos leitores (' + e(r.anoF) + ').</p>' : '') + '<p><a href="#metodo">Método completo →</a></p></div>';
    }
    var lado = (aba === 'ler' || aba === 'meta') ? '<nav aria-label="Seções do modelo"><p class="grupo-t" style="margin-top:0">Seções do modelo</p><ol>' + secs.map(function (s) { return (s.n || aba === 'meta') ? '<li><a href="#doc-' + d.id + '" data-acao="vai-sec" data-s="' + s.k + '">' + s.t + '<span>' + (s.n || '–') + '</span></a></li>' : ''; }).join('') + '</ol></nav>' : '<nav><p class="grupo-t" style="margin-top:0">Nesta página</p><ol>' + ABAS.map(function (a) { return '<li><a href="#doc-' + d.id + '" data-acao="aba-doc" data-aba="' + a[0] + '">' + a[1] + '<span></span></a></li>'; }).join('') + '</ol></nav>';
    alvo.innerHTML = h + '<div class="duas"><aside class="lateral">' + lado + '</aside><div style="min-width:0">' + corpo + '</div></div>';
  }).catch(function () { alvo.innerHTML = '<p class="vazio-st">Não foi possível carregar o texto deste documento.' + (r && r.url ? ' <a href="' + e(r.url) + '" target="_blank" rel="noopener">Abrir o PDF original</a>.' : '') + '</p>'; });
}

// ---------- roteamento ----------
var app = document.getElementById('app'), ATUAL = ['inicio'];
function rota() {
  var h = (location.hash || '#inicio').slice(1), doc = /^(?:doc|air)-(\d+)$/.exec(h);
  var chave = doc ? 'acervo' : (MENU.some(function (m) { return m[0] === h; }) ? h : 'inicio');
  document.getElementById('menu').innerHTML = MENU.map(function (m) { return '<li><a href="#' + m[0] + '" ' + (m[0] === chave ? 'aria-current="page"' : '') + ' title="' + m[1] + '">' + ic(m[0]) + '<span>' + m[1] + '</span></a></li>'; }).join('');
  desenha(doc ? 'doc' : chave, doc && doc[1]);
}
function desenha(v, id) {
  ATUAL = [v, id];
  var f = { inicio: vInicio, acervo: vAcervo, busca: vBusca, comparar: vComparar, evolucao: vEvolucao, insights: vInsights, metodo: vMetodo }[v];
  app.innerHTML = v === 'doc' ? vDoc(id) : f();
  document.title = (v === 'doc' ? 'Documento ' + id : (MENU.filter(function (m) { return m[0] === v; })[0] || ['', ''])[1]) + ' · Repositório de AIRs';
  if (v === 'inicio') desafio();
  if (v === 'doc') montaDoc(id);
}
function redesenha() { var y = scrollY; desenha(ATUAL[0], ATUAL[1]); scrollTo(0, y); }
window.addEventListener('hashchange', function () { rota(); scrollTo(0, 0); });

// ---------- eventos ----------
function busca(q) { EST.q = q; EST.nBusca = 60; if (location.hash === '#busca') redesenha(); else location.hash = '#busca'; }
function vaiAcervo() { EST.abaAcervo = 'tabela'; EST.pag = 0; if (location.hash !== '#acervo') location.hash = '#acervo'; else redesenha(); }
document.addEventListener('submit', function (ev) {
  var f = ev.target; ev.preventDefault();
  if (f.id === 'f-topo') busca(document.getElementById('q-topo').value);
  if (f.id === 'f-heroi') busca(document.getElementById('q-heroi').value);
  if (f.id === 'f-busca') busca(document.getElementById('q-busca').value);
  if (f.id === 'f-cmp') { var v = document.getElementById('add-cmp').value.trim(), r = A.filter(function (x) { return x.id === v; })[0] || A.filter(function (x) { return sa(assunto(x)).indexOf(sa(v)) >= 0; })[0]; if (r && EST.sel.indexOf(r.id) < 0) { EST.sel.push(r.id); if (EST.sel.length > 3) EST.sel.shift(); } redesenha(); }
});
document.addEventListener('change', function (ev) {
  var t = ev.target, a = t.getAttribute('data-acao'); if (!a) return;
  if (a === 'modo') { EST.modo = t.value; guarda(); }
  if (a === 'tipo') { var tp = t.getAttribute('data-t'); if (t.checked) EST.tipos.push(tp); else EST.tipos = EST.tipos.filter(function (x) { return x !== tp; }); EST.pag = 0; }
  if (a === 'anoDe' || a === 'anoAte') { EST[a] = t.value; EST.pag = 0; }
  if (a === 'bool') { EST.bool[t.getAttribute('data-k')] = t.checked; EST.pag = 0; }
  if (a === 'lista') { var l = t.getAttribute('data-l'), v = t.getAttribute('data-v'), s = EST.lista[l] = EST.lista[l] || []; if (t.checked) s.push(v); else s.splice(s.indexOf(v), 1); EST.pag = 0; }
  if (a === 'col') { var c = t.getAttribute('data-c'); if (t.checked) EST.cols.push(c); else EST.cols = EST.cols.filter(function (x) { return x !== c; }); guarda(); redesenha(); var mc = document.getElementById('menu-cols'); if (mc) { mc.hidden = false; mc.previousElementSibling.setAttribute('aria-expanded', 'true'); } return; }
  if (a === 'sel') { var id = t.getAttribute('data-id'); if (t.checked) { EST.sel.push(id); if (EST.sel.length > 3) EST.sel.shift(); } else EST.sel = EST.sel.filter(function (x) { return x !== id; }); }
  if (a === 'campo-evo') EST.campoEvo = t.value;
  if (a === 'ag-evo') EST.agEvo = t.value;
  if (a === 'ag-pal') EST.agPal = t.value;
  if (a === 'ins-x') EST.insX = t.value;
  if (a === 'ins-y') EST.insY = t.value;
  if (a === 'ins-modo') EST.insModo = t.value;
  if (a.indexOf('b-') === 0) { EST.b[a.slice(2)] = t.value; EST.nBusca = 60; }
  redesenha();
});
function realca(el) { if (!el) return; el.classList.add('realce'); setTimeout(function () { el.classList.remove('realce'); }, 1800); }
function baixa(nome, txt, tipo) { try { var b = new Blob(['﻿' + txt], { type: tipo }), u = URL.createObjectURL(b), a = document.createElement('a'); a.href = u; a.download = nome; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(u); a.remove(); }, 800); return true; } catch (x) { return false; } }
document.addEventListener('click', function (ev) {
  var m = ev.target.closest('mark.m');
  if (m && document.getElementById('doc-corpo')) {
    if (DOCV.aba !== 'meta') { DOCV.aba = 'meta'; montaDoc(ATUAL[1]); return; }
    var alvo = null; (m.getAttribute('data-campos') || '').split(' ').forEach(function (c) { var f = document.getElementById('f-' + c); if (f) { realca(f); alvo = alvo || f; } });
    if (alvo) alvo.scrollIntoView({ block: 'center', behavior: 'smooth' });
    return;
  }
  var t = ev.target.closest('[data-acao]'); if (!t || t.tagName === 'INPUT' || t.tagName === 'SELECT') return;
  var a = t.getAttribute('data-acao');
  if (a === 'ajuda') { var k = t.getAttribute('data-chave'); EST.ajuda[k] = !EST.ajuda[k]; if (ATUAL[0] === 'doc') montaDoc(ATUAL[1]); else redesenha(); return; }
  if (a === 'agencia') { ev.preventDefault(); limpaFiltros(); EST.ag = t.getAttribute('data-ag'); vaiAcervo(); return; }
  if (a === 'tipos') { ev.preventDefault(); limpaFiltros(); var tt = t.getAttribute('data-t'); EST.tipos = tt ? [tt] : []; vaiAcervo(); return; }
  if (a === 'atalho') { ev.preventDefault(); limpaFiltros(); EST.tipos = ['air']; var ty = t.getAttribute('data-t'), kk = t.getAttribute('data-k'); if (ty === 'b') EST.bool[kk] = true; if (ty === 'l') { var p = kk.split(':'); EST.lista[p[0]] = [p[1]]; } vaiAcervo(); return; }
  if (a === 'aba-acervo') { ev.preventDefault(); EST.abaAcervo = t.getAttribute('data-aba'); if (location.hash !== '#acervo') location.hash = '#acervo'; else redesenha(); return; }
  if (a === 'aba-evo') { EST.abaEvo = t.getAttribute('data-aba'); redesenha(); return; }
  if (a === 'aba-cmp') { EST.abaCmp = t.getAttribute('data-aba'); redesenha(); return; }
  if (a === 'aba-ins') { EST.abaIns = t.getAttribute('data-aba'); redesenha(); return; }
  if (a === 'aba-doc') { ev.preventDefault(); DOCV.aba = t.getAttribute('data-aba'); montaDoc(ATUAL[1]); scrollTo(0, 0); return; }
  if (a === 'vai-sec') { ev.preventDefault(); var s = document.getElementById('s-' + t.getAttribute('data-s')); if (s) s.scrollIntoView({ behavior: 'smooth' }); return; }
  if (a === 'vai-par') { ev.preventDefault(); var o = t.getAttribute('data-p'), go = function () { var el = document.getElementById('p' + o); if (el) { el.scrollIntoView({ block: 'center', behavior: 'smooth' }); realca(el); } }; if (DOCV.aba !== 'meta' && DOCV.aba !== 'ler') { DOCV.aba = 'meta'; montaDoc(ATUAL[1]); setTimeout(go, 400); } else go(); return; }
  if (a === 'limpa') { limpaFiltros(); redesenha(); return; }
  if (a === 'ordena') { var c = t.getAttribute('data-c'); EST.ordem = EST.ordem[0] === c ? [c, -EST.ordem[1]] : [c, c === 'ano' ? -1 : 1]; redesenha(); return; }
  if (a === 'pag') { EST.pag = +t.getAttribute('data-p'); redesenha(); document.querySelector('.tabela').scrollIntoView(); return; }
  if (a === 'cols') { var mc = document.getElementById('menu-cols'); mc.hidden = !mc.hidden; t.setAttribute('aria-expanded', String(!mc.hidden)); return; }
  if (a === 'desseleciona') { EST.sel = []; redesenha(); return; }
  if (a === 'ir-comparar') { EST.abaCmp = 'airs'; return; }
  if (a === 'tira-cmp') { EST.sel = EST.sel.filter(function (x) { return x !== t.getAttribute('data-id'); }); redesenha(); return; }
  if (a === 'exemplo') { ev.preventDefault(); EST.b = { ag: '', tipo: '', top: '', campo: '', de: '', ate: '' }; busca(t.getAttribute('data-q')); return; }
  if (a === 'b-set') { EST.b[t.getAttribute('data-k')] = t.getAttribute('data-v'); redesenha(); return; }
  if (a === 'b-limpa') { EST.b = { ag: '', tipo: '', top: '', campo: '', de: '', ate: '' }; EST.q = ''; redesenha(); return; }
  if (a === 'mais-busca') { EST.nBusca += 60; redesenha(); return; }
  if (a === 'csv') { var cv = csvTexto(); try { navigator.clipboard.writeText(cv.txt).then(function () { t.innerHTML = ic('copiar') + ' Copiado (' + cv.n + ' linhas)'; }, function () { t.textContent = 'Não foi possível copiar; use Baixar CSV'; }); } catch (x) { t.textContent = 'Não foi possível copiar; use Baixar CSV'; } return; }
  if (a === 'csv-baixar') { var cb = csvTexto(); if (!baixa('acervo_airs_' + (R.geradoEm || '') + '.csv', cb.txt, 'text/csv;charset=utf-8')) t.textContent = 'O navegador bloqueou o download'; return; }
  if (a === 'cita') { var pr = t.closest('.par'), r = A.filter(function (x) { return x.id === ATUAL[1]; })[0]; var ref = r.ag.toUpperCase() + '. ' + (r.ident || TIPO[r.tipo] + ' ' + r.id) + (pr.getAttribute('data-num') ? ', item ' + pr.getAttribute('data-num') : '') + ', ' + pr.getAttribute('data-pg') + '. Texto reconstituído no Repositório de AIRs; conferir no PDF original.'; try { navigator.clipboard.writeText(ref).then(function () { t.textContent = 'referência copiada'; }, function () { t.textContent = ref; }); } catch (x) { t.textContent = ref; } return; }
});

// ---------- carga ----------
Promise.all([fetch('dados/acervo.json').then(function (r) { return r.json(); }), fetch('dados/resumo.json').then(function (r) { return r.json(); })]).then(function (x) {
  A = x[0]; R = x[1]; LEITORES = R.leitores || [{ id: 'claude', nome: 'Claude Opus 5.5' }, { id: 'glm', nome: 'GLM-5.2' }]; rota();
}).catch(function () { app.innerHTML = '<div class="larg g" style="padding-block:60px"><p class="vazio-st">Não foi possível carregar os dados do acervo.</p></div>'; });
})();
