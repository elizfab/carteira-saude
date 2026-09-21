# SDD — Spec-Driven Development da Carteira de Saúde e Vacinação

Esta pasta guarda as especificações que orientam a implementação do app Angular, escritas **antes**
do código de cada seção. A fonte da verdade funcional é o protótipo
`org-elizfab/docs/backup/carteira-saude.html` (somente leitura) — cada spec aqui é a tradução das
regras desse protótipo para um contrato explícito, testável e independente de framework.

## Como usar

1. Antes de implementar uma seção, leia a spec correspondente (`NN-nome-da-secao.md`).
2. Os **Critérios de aceite** de cada spec devem virar `it(...)` nos `.spec.ts` do componente/serviço
   daquela seção — não existe seção "pronta" sem os critérios cobertos por teste.
3. A seção **Não-regressão** lista comportamentos do protótipo que não podem quebrar na migração
   (ex.: autosave debounced, isolamento entre perfis, formato de export). Qualquer mudança futura
   que altere um desses comportamentos precisa atualizar a spec e justificar a mudança aqui.
4. Ao alterar uma regra de negócio, edite a spec primeiro, depois o código e os testes. A spec é o
   changelog funcional do domínio.

## Índice

| Spec | Área | Código principal |
|---|---|---|
| [00-arquitetura.md](00-arquitetura.md) | Decisões de arquitetura | `core/`, `shared/`, `models/` |
| [01-perfis-e-armazenamento.md](01-perfis-e-armazenamento.md) | Perfis (multi-paciente) e persistência | `core/state/perfil`, `core/services/storage.service.ts` |
| [02-dados-pessoais.md](02-dados-pessoais.md) | Dados pessoais + foto 3x4 | `pages/carteira/dados-pessoais` |
| [03-condicoes.md](03-condicoes.md) | Condições e diagnósticos | `pages/carteira/condicoes` |
| [04-equipe-e-acompanhamento.md](04-equipe-e-acompanhamento.md) | Equipe de saúde + consultas/exames por especialista | `pages/carteira/equipe` |
| [05-vacinas.md](05-vacinas.md) | Histórico de vacinação | `pages/carteira/vacinas` |
| [06-medicamentos.md](06-medicamentos.md) | Histórico de medicamentos | `pages/carteira/medicamentos` |
| [07-exames.md](07-exames.md) | Histórico de exames | `pages/carteira/exames` |
| [08-consultas.md](08-consultas.md) | Histórico de consultas | `pages/carteira/consultas` |
| [09-alergias.md](09-alergias.md) | Alergias e restrições | `pages/carteira/alergias` |
| [10-cirurgias.md](10-cirurgias.md) | Cirurgias e internações | `pages/carteira/cirurgias` |
| [11-historico-familiar.md](11-historico-familiar.md) | Histórico familiar | `pages/carteira/familiar` |
| [12-controle.md](12-controle.md) | Pressão, peso e glicemia | `pages/carteira/controle` |
| [13-notas.md](13-notas.md) | Anotações gerais | `pages/carteira/notas` |
| [14-opcoes-e-impressao.md](14-opcoes-e-impressao.md) | Opções de impressão | `pages/carteira/opcoes` |
| [15-preview-e-pdf.md](15-preview-e-pdf.md) | Pré-visualização e impressão A4 | `pages/preview`, `core/services/print-layout.service.ts` |
| [16-import-export.md](16-import-export.md) | Backup/restauração JSON | `core/services/import-export.service.ts` |
