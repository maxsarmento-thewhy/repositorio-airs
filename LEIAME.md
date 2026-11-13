# Portal do Repositório de AIRs — como gerar e publicar

## O que há nesta pasta

| Arquivo | O que é |
|---|---|
| `index.html` | Página do site (estilos e estrutura) |
| `app.js` | A aplicação: início, acervo, busca, comparação, evolução, insights, método e página de cada documento |
| `dados/acervo.json` | Um registro por documento (945), com os valores de cada leitor |
| `dados/resumo.json` | Medidas do gerador: contagens, integridade, diagnóstico de seção, leitores |
| `dados/doc/<id>.json` | Texto reconstituído, marcas dos trechos citados e fichas completas de cada documento |
| `gerar.py` | Gera a pasta `dados/` a partir da fila de produção, das fichas e do texto integral |

## Gerar os dados

```
cd C:\Kainoepisteme\projetos\repositorio_airs\portal\site
set PYTHONUTF8=1
C:\Python313\python.exe gerar.py
```

O gerador reconstitui cada documento e confere, caractere por caractere, que o texto reconstituído é o mesmo do PDF sem as linhas repetidas de cabeçalho e rodapé. A última linha do log diz quantos documentos passaram.

## Publicar

O site é estático: basta servir a pasta inteira (com `dados/`) por HTTPS. Qualquer hospedagem estática serve (GitHub Pages, Cloudflare Pages, Netlify). Não há servidor nem banco.

Para testar localmente, rode `python -m http.server 8000` dentro da pasta e abra `http://127.0.0.1:8000/`. Abrir o `index.html` direto do disco não funciona, porque o navegador bloqueia a leitura dos arquivos de dados.

## Ligação com o site do NDSR (2026-11-12)

O portal não fica mais incorporado no Google Sites. A subpágina do NDSR (`/repositorio-airs`) mostra o logotipo do NDSR com link para o endereço do portal, que abre em página inteira. O cabeçalho do portal leva o logotipo (`ndsr_logo.png`) e "NDSR - UnB / Repositório de AIRs". O texto abaixo fica como referência caso se volte a incorporar.

## Incorporar no Google Sites

No editor do Google Sites: **Inserir → Incorporar → Por URL**, cole o endereço HTTPS do site e escolha "Página inteira". O Google Sites só exibe páginas HTTPS que permitam ser mostradas dentro de outra página. O GitHub Pages permite: em 2026-11-12, uma página dele respondeu sem `X-Frame-Options` e sem `Content-Security-Policy`. As outras hospedagens não foram conferidas; para elas, verificar esses dois cabeçalhos.

Dentro do Google Sites, o site fica numa moldura. Por isso há duas recomendações:

- pôr também um link "Abrir em tela cheia" apontando para o endereço direto, porque downloads (Baixar CSV) e links externos funcionam melhor fora da moldura;
- não incorporar pelo código (Inserir → Incorporar → Código): o site depende dos arquivos de `dados/`, que só são lidos quando servidos junto da página.
