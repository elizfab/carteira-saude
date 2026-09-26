# 03 — Condições e diagnósticos

## Objetivo

Registrar diagnósticos/condições de saúde contínuas, com data de descoberta e quem acompanha.

## Modelo de dados

```ts
interface Condicao { id: string; condicao: string; descoberta: string /* ISO date */; acomp: string; obs: string; }
```

## Comportamento

- Tabela dinâmica via `EditableTableComponent`, colunas: Condição/diagnóstico, Data da descoberta
  (date picker), Acompanhamento, Observações (textarea).
- Botão "Adicionar condição" insere uma linha vazia (com `id` novo) ao final e foca a primeira célula.
- Botão de remover linha (ícone "x") apaga sem confirmação (dado ainda não persistido como "grave"
  o suficiente para exigir confirmação — mesmo comportamento do protótipo).
- Linhas totalmente vazias não entram na impressão (ver spec 15), mas continuam no formulário até
  serem removidas manualmente.

## Ícone

`heart` (protótipo) → `heart` (AntD).

## Critérios de aceite

- Adicionar uma linha aumenta `perfil.condicoes.length` em 1 com todos os campos em branco.
- Remover a linha `i` tira exatamente o item `i` do array (sem afetar os outros índices/valores).
- Editar qualquer célula atualiza só aquele campo daquela linha (sem re-render perder foco do input).

## Não-regressão

- Nenhum limite máximo de linhas (o protótipo não limita).
