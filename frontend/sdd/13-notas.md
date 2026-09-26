# 13 — Anotações gerais

## Objetivo

Espaço livre para observações médicas, recomendações e acompanhamento que não cabem nas seções
estruturadas.

## Modelo de dados

`notas: string` (campo direto no `Perfil`, não é uma sub-entidade).

## Comportamento

Uma única textarea grande (14 linhas visíveis no formulário). Na impressão, o texto sai numa página
pautada (spec 15), com páginas extras em branco conforme `opcoes.min.notas`.

## Ícone

`pencil` → `edit`.

## Critérios de aceite

- Texto longo não é truncado no armazenamento (sem limite de caracteres artificial).

## Não-regressão

- Continua sendo um único campo de texto livre (não vira lista estruturada).
