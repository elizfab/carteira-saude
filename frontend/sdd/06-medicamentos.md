# 06 — Histórico de medicamentos

## Objetivo

Registrar tratamentos medicamentosos atuais e anteriores.

## Modelo de dados

```ts
interface Medicamento { id: string; nome: string; dosagem: string; inicio: string; termino: string; medico: string; obs: string; }
```

## Comportamento

Tabela dinâmica: Nome do medicamento, Dosagem, Início do tratamento (date), Término (texto livre —
aceita uma data OU o literal "Em uso" para tratamentos contínuos, por isso não é `date` picker nessa
coluna, é texto com placeholder "Data ou “Em uso”"), Médico responsável, Observações.

## Ícone

`pill` → `medicine-box`.

## Critérios de aceite

- Coluna "Término" aceita texto livre (não força formato de data), preservando o caso "Em uso".
- Paginação de impressão a cada 20 linhas (`per: 20`).

## Não-regressão

- Não introduzir validação de formato de data em "Término" — quebraria o caso "Em uso" do protótipo.
