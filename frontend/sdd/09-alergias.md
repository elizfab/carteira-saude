# 09 — Alergias e restrições

## Objetivo

Registrar reações alérgicas por categoria, com a gravidade/observações de cada uma.

## Modelo de dados

```ts
interface Alergias { medicamentos: string; alimentos: string; materiais: string; outras: string; }
```

## Comportamento

Quatro textareas fixas (não é lista dinâmica): Medicamentos, Alimentos, Materiais, Outras alergias
— cada uma com um hint explicando o que anotar (nome do medicamento e reação; alergias/intolerâncias
alimentares; látex/esparadrapo/contraste/metais; poeira/pólen/picadas/animais).

## Ícone

`warning` → `warning`.

## Critérios de aceite

- As 4 categorias são independentes; editar uma não afeta as outras.
- Nenhuma das 4 é obrigatória.

## Não-regressão

- Continuam sendo 4 categorias fixas (o protótipo não permite categorias customizadas).
