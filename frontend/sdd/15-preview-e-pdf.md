# 15 — Pré-visualização e impressão (PDF)

## Objetivo

Montar as páginas A4 finais da carteirinha e permitir imprimir/salvar como PDF usando o diálogo
nativo do navegador (`window.print()`) — sem biblioteca de geração de PDF.

## Modelo de dados

```ts
interface PaginaImpressao { classeConteudo: string; html: string /* ou TemplateRef, decidir na implementação */; }
```

`PrintLayoutService.construirPaginas(perfil: Perfil): PaginaImpressao[]` — porta pura de
`construirPaginas`/`paginaDados`/`paginasTabela`/`paginasCards`/`BUILD` do protótipo.

## Comportamento

- Página 1 é sempre "Dados pessoais" (`paginaDados`), com o cabeçalho de marca, foto 3x4 e os campos
  principais.
- Para cada seção em `ORDEM` com `opcoes.incluir[k] !== false`, gera 1+ páginas:
  - Seções tabulares: `n = max(min, ceil(linhasNãoVazias / porPágina))` páginas (mesma fórmula do
    protótipo `paginasTabela`), com cabeçalho "(continuação)" a partir da 2ª página da seção.
  - "Equipe e acompanhamento": agrupa cards de especialista em páginas por altura estimada
    (`paginasCards`/`alt()`/`AVAIL=236mm` de área útil), preservando a lógica de quebra por card.
  - Alergias/Familiar: página única com caixas de texto (`boxTexto`), mostrando check Sim/Não/Não sei
    quando aplicável (familiar).
  - Notas: `max(1, opcoes.min.notas)` páginas, texto só na primeira.
- Rodapé de cada página: linha de assinatura + data + "Página N de TOTAL".
- Campos de texto que estouram a área alocada (`scrollHeight > clientHeight`) recebem destaque visual
  (`.ovf`) na pré-visualização e disparam um aviso ("N campos com texto cortado") — só na tela, não
  na impressão real.
- Botão imprimir: mostra a pré-visualização e chama `window.print()` logo em seguida (delay curto
  para o layout assentar, igual ao protótipo `imprimir()`).
- **Crítico**: nenhuma etapa desse fluxo (pré-visualizar, imprimir, `afterprint`) apaga, reseta ou
  faz `dispatch` de limpeza sobre o estado do perfil. Isso é regra de não-regressão explícita (era a
  dúvida original do usuário sobre o protótipo).

## Critérios de aceite

- Perfil com 30 vacinas e `min.vacinas = 1` gera `ceil(30/26) = 2` páginas de vacinas.
- Perfil com 0 vacinas e `min.vacinas = 1` gera 1 página (em branco, para preencher à mão).
- Desmarcar "Vacinação" em Opções remove a seção da pré-visualização sem alterar `perfil.vacinas`.
- **Teste de regressão explícito**: preencher um perfil, capturar um snapshot do estado (Store +
  localStorage), abrir a pré-visualização e "imprimir" (mock de `window.print`), e então comparar o
  estado antes/depois — devem ser idênticos.
- `@media print` esconde topbar/sidenav/formulário e mostra só as páginas A4.

## Não-regressão

- Layout A4 (210mm x 296.6mm, margem 12.7mm) e quebras de página (`page-break-after: always`)
  preservados para a impressão sair idêntica em papel/PDF ao protótipo.
