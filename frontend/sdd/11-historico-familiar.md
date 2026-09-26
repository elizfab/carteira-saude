# 11 — Histórico familiar

## Objetivo

Registrar predisposições/condições hereditárias por categoria fixa.

## Modelo de dados

```ts
interface HistoricoFamiliar {
  diabetes: FamiliarItem; hipertensao: FamiliarItem; cardiacas: FamiliarItem; cancer: FamiliarItem; outras: FamiliarItem;
}
interface FamiliarItem { r: '' | 'sim' | 'nao' | 'nsei'; t: string; }
```

## Comportamento

Para cada uma das 5 categorias (Diabetes, Hipertensão, Doenças cardíacas, Câncer, Outras condições
hereditárias): um grupo de radio (Sim/Não/Não sei) + botão "limpar" + textarea "Quem e observações".
Categorias e hints fixos, iguais ao protótipo (`FAMILIAR`).

## Ícone

`people` → `team`.

## Critérios de aceite

- Cada categoria guarda `r` e `t` de forma independente das outras 4.
- Clicar "limpar" numa categoria zera só o `r` dela (não mexe no `t` nem nas outras categorias).

## Não-regressão

- As 5 categorias continuam fixas, na mesma ordem do protótipo.
