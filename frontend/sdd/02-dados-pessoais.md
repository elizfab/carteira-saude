# 02 — Dados pessoais

## Objetivo

Capturar as informações que aparecem na primeira página impressa da carteirinha: identificação,
tipo sanguíneo, contato de emergência, convênio e observações.

## Modelo de dados

```ts
interface DadosPessoais {
  nome: string; nascimento: string /* ISO yyyy-mm-dd */; cpf: string;
  abo: '' | 'A' | 'B' | 'AB' | 'O'; rh: '' | '+' | '-';
  telefone: string; email: string; endereco: string;
  emerg_nome: string; emerg_parentesco: string; emerg_telefone: string;
  convenio: string; carteirinha: string; obs: string;
  foto: string; // data URL base64 ou ''
}
```

## Comportamento

- Campo `cpf` e os dois campos de telefone (`telefone`, `emerg_telefone`) recebem máscara ao digitar
  via `CpfMaskDirective`/`PhoneMaskDirective` (portadas de `MASKS.cpf`/`MASKS.tel` do protótipo).
- Tipo sanguíneo (`abo`) e fator Rh (`rh`) são dois grupos de radio independentes (`nz-radio-group`),
  com botão "limpar" que zera os dois.
- Foto: `PhotoUploadComponent` abre seletor de arquivo, redimensiona/corta para 300x400px (proporção
  3x4) via canvas, converte para JPEG base64 (qualidade 0.85) e salva em `dados.foto`. Botão
  "Remover" limpa o campo. Nenhuma foto é obrigatória.
- Alterar `dados.nome` atualiza em tempo real o rótulo do perfil no seletor do topbar.

## Critérios de aceite

- Digitar `12345678901` no campo CPF resulta em `123.456.789-01` exibido.
- Digitar `11987654321` no campo telefone resulta em `(11) 98765-4321`.
- Escolher uma imagem qualquer resulta em `dados.foto` como data URL `image/jpeg` com as dimensões
  300x400 (testável mockando `HTMLCanvasElement`/`Image`).
- Marcar "A" e depois clicar "limpar" desmarca `abo` e `rh`.
- Editar o nome reflete no texto do seletor de perfil do topbar sem precisar trocar de aba.

## Não-regressão

- Formato de `foto` continua sendo uma data URL embutida no JSON do perfil (sem upload externo).
