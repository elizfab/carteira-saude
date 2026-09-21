# 07 — Histórico de exames

## Objetivo

Registrar exames gerais (fora do acompanhamento por especialista, que fica na spec 04).

## Modelo de dados

```ts
interface Exame { id: string; data: string; tipo: string; resultado: string; medico: string; proximo: string; }
```

## Comportamento

Tabela dinâmica: Data (date), Tipo de exame, Resultado principal (textarea), Médico solicitante,
Próximo exame (date).

## Ícone

`flask` → `experiment`.

## Critérios de aceite

- Paginação de impressão a cada 20 linhas (`per: 20`).
- Texto do hint deixa claro que exames por especialidade ficam em "Equipe e acompanhamento" (evita
  duplicidade de onde o usuário registra o dado).

## Não-regressão

- Esta lista permanece separada da lista de exames por especialista (não faz merge das duas).
