# 04 — Equipe de saúde e acompanhamento

## Objetivo

Cadastrar cada especialista/profissional que acompanha o paciente, com contato e, para cada um,
suas próprias consultas/retornos e exames/prevenção.

## Modelo de dados

```ts
interface EquipeSaude {
  id: string; especialidade: string; profissional: string; telefone: string; local: string; email: string;
  consultas: ConsultaEquipe[]; exames: ExameEquipe[];
}
interface ConsultaEquipe { id: string; data: string; retorno: string; obs: string; }
interface ExameEquipe { id: string; tipo: string; data: string; resultado: string; proximo: string; }
```

## Comportamento

- Cada especialista é um `nz-collapse-panel` (substitui `<details class="spec">`), cabeçalho mostra
  especialidade + profissional + badge com a próxima data (menor data futura entre
  `consultas[].retorno` e `exames[].proximo`, calculada por `proximaData()`).
- Dentro do painel: campos do especialista + duas `EditableTableComponent` (consultas/retornos,
  exames/prevenção).
- "+ Adicionar especialista": campo de texto com autocomplete (`ESPECIALIDADES`, mesma lista do
  protótipo) via `nz-auto-complete`; cria o card já aberto.
- "Remover este especialista": confirmação via `NzModalService.confirm` citando que apaga também as
  consultas/exames dele (mesmo texto de risco do protótipo).
- Editar `especialidade`/`profissional` atualiza o cabeçalho do card em tempo real.

## Ícone

`stetho` → `medicine-box` (ou `heart-outline` alternativo, decidir na implementação).

## Critérios de aceite

- `proximaData()` retorna a menor data >= hoje entre todos os `retorno`/`proximo` do especialista, ou
  vazio se não houver nenhuma futura (função pura, testável isoladamente).
- Remover um especialista remove também suas sub-tabelas (não deixa órfão no estado).
- Nenhum especialista cadastrado mostra estado vazio com call-to-action para adicionar o primeiro.

## Não-regressão

- Consultas/exames de cada especialista continuam aninhados dentro dele (não viram uma lista global).
