# 08 — Histórico de consultas

## Objetivo

Registrar consultas médicas gerais com diagnóstico e recomendações.

## Modelo de dados

```ts
interface Consulta { id: string; data: string; especialidade: string; medico: string; diagnostico: string; recomendacoes: string; retorno: string; }
```

## Comportamento

Tabela dinâmica: Data (date), Especialidade, Médico, Diagnóstico (textarea), Recomendações
(textarea), Retorno (date).

## Ícone

`clipboard` → `file-text`.

## Critérios de aceite

- Paginação de impressão a cada 20 linhas (`per: 20`).

## Não-regressão

- Mesmas 6 colunas e ordem do protótipo.
