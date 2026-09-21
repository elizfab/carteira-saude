# 05 — Histórico de vacinação

## Objetivo

Registrar cada dose de vacina aplicada e a data do próximo reforço.

## Modelo de dados

```ts
interface Vacina { id: string; nome: string; dose: string; data: string; lote: string; local: string; reforco: string; obs: string; }
```

## Comportamento

Tabela dinâmica (`EditableTableComponent`): Nome da vacina, Dose, Data de aplicação (date), Lote,
Local de aplicação, Próximo reforço (date), Observações (textarea). Mesmo padrão de
adicionar/remover linha da spec 03.

## Ícone

`syringe` → `medicine-box`/ícone de seringa mais próximo disponível no set AntD (`experiment` como
alternativa caso não exista ícone de seringa).

## Critérios de aceite

- Uma dose por linha; nenhuma validação bloqueia datas fora de ordem (o usuário pode registrar
  histórico retroativo em qualquer ordem).
- Impressão (spec 15) pagina a cada 26 linhas por folha (`per: 26`, igual ao protótipo).

## Não-regressão

- Mesmo conjunto de colunas e mesma ordem do protótipo (compatibilidade visual com quem já usa o
  PDF antigo como referência).
