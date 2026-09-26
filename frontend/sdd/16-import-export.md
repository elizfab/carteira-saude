# 16 — Backup e restauração (import/export)

## Objetivo

Permitir salvar uma cópia de segurança dos dados fora do navegador e restaurá-la depois (neste ou
em outro dispositivo), incluindo compatibilidade com arquivos exportados pelo protótipo HTML.

## Modelo de dados

```ts
interface Backup { formato: 'carteira-saude'; versao: 1; perfis: Perfil[]; }
```

## Comportamento

- **Exportar perfil ativo**: baixa `carteira-saude-<slug-do-nome>.json` com `{ formato, versao: 1,
  perfis: [perfilAtivo] }`.
- **Backup de todos os perfis** (botão em Opções): baixa `carteira-saude-backup-<data>.json` com
  todos os perfis.
- **Importar**: aceita tanto o formato `{ perfis: [...] }` quanto formatos legados de perfil único
  do protótipo (`{ perfil: {...} }` ou o próprio objeto de perfil na raiz, detectando pela presença
  de `dados`) — mesma tolerância do protótipo (`Array.isArray(json.perfis) ? ... : (json.perfil ?
  [json.perfil] : (json.dados ? [json] : null))`).
- Cada perfil importado passa pela mesma normalização da spec 01 (`normalizar()`), preenchendo
  campos ausentes com os defaults.
- Se já existir um perfil com o mesmo `id`, pergunta (via `NzModalService.confirm`) se deve
  substituir; se não, gera um novo `id` para o perfil importado (nunca sobrescreve sem confirmação).
- Arquivo que não é JSON válido ou não tem o formato esperado: mensagem de erro clara via
  `NzMessageService`, sem quebrar o app.
- Após importar, o último perfil da lista importada vira o ativo e a navegação vai para "Dados
  pessoais".

## Critérios de aceite

- Exportar e reimportar o mesmo perfil produz um perfil equivalente (mesmos dados, id preservado se
  não houver conflito).
- Importar um JSON no formato antigo de perfil único (sem o wrapper `perfis`) funciona.
- Importar um arquivo `.txt` ou JSON malformado mostra erro e não altera o estado atual.
- Importar um perfil cujo `id` já existe pede confirmação antes de sobrescrever.

## Não-regressão

- `versao: 1` e chave `formato: 'carteira-saude'` continuam sendo os identificadores do arquivo —
  qualquer mudança de schema no futuro deve incrementar `versao` e manter leitura de `versao: 1`.
