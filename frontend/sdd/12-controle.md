# 12 — Controle de pressão, peso e glicemia

## Objetivo

Acompanhar medições ao longo do tempo (pressão arterial, peso, glicemia).

## Modelo de dados

```ts
interface ControleMedicao { id: string; data: string; peso: string; pressao: string; glicemia: string; obs: string; }
```

## Comportamento

Tabela dinâmica: Data (date), Peso em kg, Pressão arterial em mmHg (placeholder "120/80", coluna
centralizada), Glicemia em mg/dL (centralizada), Observações. Nenhum campo é obrigatório — o usuário
pode registrar só o que mediu naquele dia.

## Ícone

`ecg` → `heart` (ou `line-chart` como alternativa mais próxima do sentido "medição ao longo do
tempo" — decidir na implementação).

## Critérios de aceite

- Paginação de impressão a cada 26 linhas (`per: 26`), mínimo de 2 páginas por padrão
  (`opcoes.min.controle = 2`, igual ao protótipo).

## Não-regressão

- Nenhuma validação numérica bloqueia o preenchimento (o protótipo aceita texto livre nessas
  colunas, ex.: "120/80" não é um número).
