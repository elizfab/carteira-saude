# Pendências e diferenças conscientes em relação ao protótipo

Este documento lista onde a implementação Angular diverge, de propósito ou por limitação
conhecida, do protótipo de referência
(`org-elizfab/docs/backup-carteira-saude/carteira-saude.html`). Ver também `sdd/00-arquitetura.md`.

## Resolvido nesta rodada

- **Fonte Carlito**: o protótipo usa `"Carlito","Calibri",...` mas não há garantia de que o SO do
  usuário tenha essa fonte instalada. Resolvido fazendo self-host via `@fontsource/carlito`
  (pacote npm, licença OFL-1.1), registrado em `angular.json` (`architect.build.options.styles`).
  Nenhuma pendência aqui.
- **Paleta de cores**: `src/shared/styles/abstracts/_variables.scss` e `src/styles.scss`
  (`body.light`) agora usam os valores hexadecimais exatos do protótipo (`--blue:#4f7f9e`,
  `--dblue:#2c5876` → `--color-primary`, `--green:#6a9c80`, `--dgreen:#3f6f55`, `--txt:#1f2a33` →
  `--text`, `--gray:#5f6b75`, `--lgray:#a3acb3`, `--line:#c9d0d5`, `--border:#8c98a1`,
  `--hdr:#e7edf1`, `--titlebg:#eef3f6`, `--icobg:#e3edf3`, `--danger:#9b2c2c` → `--color-danger`).
  `theme.less` (`@primary-color`) também foi alinhado para os componentes ng-zorro (checkbox,
  radio, menu, etc.) usarem a mesma cor primária.
- **Logo**: o ícone de coração do topbar (`.brand svg`) foi substituído pelo logo fornecido
  (`public/logo.png`, já usado como favicon).

## Diferenças conscientes (não são bugs)

- **Tema escuro**: o protótipo **não tem** tema escuro — é uma tela só, sempre clara
  (`body{background:#f2f5f7}`). O app Angular manteve o toggle claro/escuro que já existia no
  scaffold inicial deste projeto (fora do escopo da conversão), mas o tema **padrão agora é
  claro** (`initialThemeState.isDarkMode = false`), fiel ao protótipo. O tema escuro é uma paleta
  própria (mesma relação tonal, cores diferentes), não uma tradução de nada que exista no
  protótipo.
- **Paginação de "Equipe e acompanhamento" na impressão**: o protótipo estima a altura de cada
  card de especialista em milímetros e faz bin-packing dinâmico para decidir quantos cards cabem
  por página A4 (`paginasCards`/`alt()` em `carteira-saude.html`). A implementação Angular
  (`PrintLayoutService.paginasAcompanhamento`) usa uma regra fixa e mais simples (2 cards por
  página) em vez de medir alturas reais. Funcionalmente correto (nenhum dado se perde, a ordem é
  preservada), mas a densidade por página pode variar em relação ao protótipo em perfis com muitos
  especialistas/consultas.
- **Aviso de texto cortado na pré-visualização**: o protótipo mede o DOM depois de renderizar
  (`marcarCortes()`) e destaca em laranja campos cujo texto não coube na área impressa, com um
  aviso "N campos com texto cortado". Essa checagem de overflow não foi portada — não afeta os
  dados armazenados, só é uma dica visual a mais no protótipo. Se for necessária, dá para portar
  usando `ResizeObserver`/comparação de `scrollHeight` x `clientHeight` no `PreviewComponent`.

## Nada pendente quanto a dados/comportamento

Todas as regras de negócio (armazenamento, perfis, máscaras, paginação por contagem de linhas,
import/export, não-regressão de dados ao imprimir) foram portadas e têm teste unitário cobrindo o
critério de aceite da spec correspondente em `sdd/`.
