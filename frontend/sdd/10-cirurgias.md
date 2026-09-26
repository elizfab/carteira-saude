# 10 — Cirurgias e internações

## Objetivo

Registrar cirurgias, procedimentos e internações.

## Modelo de dados

```ts
interface Cirurgia { id: string; data: string; procedimento: string; hospital: string; medico: string; obs: string; }
```

## Comportamento

Tabela dinâmica: Data (date), Procedimento, Hospital, Médico responsável, Observações.

## Ícone

`hospital` → `home` (ou ícone de hospital do set AntD, se disponível — confirmar na implementação).

## Critérios de aceite

- Paginação de impressão a cada 14 linhas (`per: 14`, seção mais "pesada" por linha que as demais).

## Não-regressão

- Mesmas 5 colunas e ordem do protótipo.
