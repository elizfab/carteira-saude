import { Alergias } from './alergias.model';
import { Cirurgia } from './cirurgia.model';
import { Condicao } from './condicao.model';
import { ConsultaEquipe, EquipeSaude, ExameEquipe } from './equipe.model';
import { Consulta } from './consulta.model';
import { ControleMedicao } from './controle.model';
import { DadosPessoais } from './dados-pessoais.model';
import { Exame } from './exame.model';
import { HistoricoFamiliar } from './historico-familiar.model';
import { Medicamento } from './medicamento.model';
import { OpcoesImpressao } from './opcoes-impressao.model';
import { Perfil } from './perfil.model';
import { Vacina } from './vacina.model';

export function criarDadosPessoaisVazio(nome = ''): DadosPessoais {
  return {
    nome,
    nascimento: '',
    cpf: '',
    abo: '',
    rh: '',
    telefone: '',
    email: '',
    endereco: '',
    emerg_nome: '',
    emerg_parentesco: '',
    emerg_telefone: '',
    convenio: '',
    carteirinha: '',
    obs: '',
    foto: '',
  };
}

export function criarAlergiasVazias(): Alergias {
  return { medicamentos: '', alimentos: '', materiais: '', outras: '' };
}

export function criarHistoricoFamiliarVazio(): HistoricoFamiliar {
  return {
    diabetes: { r: '', t: '' },
    hipertensao: { r: '', t: '' },
    cardiacas: { r: '', t: '' },
    cancer: { r: '', t: '' },
    outras: { r: '', t: '' },
  };
}

export function criarOpcoesImpressaoPadrao(): OpcoesImpressao {
  return {
    incluir: {},
    min: { vacinas: 1, medicamentos: 1, exames: 1, consultas: 1, cirurgias: 1, controle: 2, notas: 1 },
  };
}

export function criarEquipeVazia(id: string, especialidade = ''): EquipeSaude {
  return { id, especialidade, profissional: '', telefone: '', local: '', email: '', consultas: [], exames: [] };
}

export function criarPerfilVazio(id: string, nome = ''): Perfil {
  return {
    id,
    dados: criarDadosPessoaisVazio(nome),
    condicoes: [],
    equipe: [],
    vacinas: [],
    medicamentos: [],
    exames: [],
    consultas: [],
    cirurgias: [],
    controle: [],
    alergias: criarAlergiasVazias(),
    familiar: criarHistoricoFamiliarVazio(),
    notas: '',
    opcoes: criarOpcoesImpressaoPadrao(),
  };
}

/**
 * Mescla profunda usando `modelo` como fonte de verdade da forma: toda chave presente no modelo
 * existe no resultado; arrays vêm de `origem` se existir (senão o array-padrão do modelo); chaves
 * extras de `origem` são preservadas. Mesma regra do `merge()` do protótipo legado.
 */
export function mesclarProfundo<T>(modelo: T, origem: unknown): T {
  if (Array.isArray(modelo)) {
    return (Array.isArray(origem) ? origem : modelo) as unknown as T;
  }
  if (modelo !== null && typeof modelo === 'object') {
    const src = origem !== null && typeof origem === 'object' ? (origem as Record<string, unknown>) : {};
    const resultado = {} as Record<string, unknown>;
    for (const chave of Object.keys(modelo as Record<string, unknown>)) {
      resultado[chave] = mesclarProfundo((modelo as Record<string, unknown>)[chave], src[chave]);
    }
    for (const chave of Object.keys(src)) {
      if (!(chave in resultado)) resultado[chave] = src[chave];
    }
    return resultado as T;
  }
  return origem === undefined || origem === null ? modelo : (origem as T);
}

/**
 * Normaliza um objeto vindo de import/localStorage para o shape completo de `Perfil`, preenchendo
 * campos ausentes com os defaults e normalizando cada item de `equipe`. `gerarId` só é chamado
 * quando falta um id (perfil novo ou item de equipe sem id).
 */
export function normalizarPerfil(bruto: unknown, gerarId: () => string): Perfil {
  const mesclado = mesclarProfundo(criarPerfilVazio(gerarId()), bruto) as Perfil;
  mesclado.equipe = (mesclado.equipe ?? []).map((item) =>
    mesclarProfundo(criarEquipeVazia(gerarId()), item)
  );
  return mesclado;
}

export function criarCondicaoVazia(id: string): Condicao {
  return { id, condicao: '', descoberta: '', acomp: '', obs: '' };
}

export function criarVacinaVazia(id: string): Vacina {
  return { id, nome: '', dose: '', data: '', lote: '', local: '', reforco: '', obs: '' };
}

export function criarMedicamentoVazio(id: string): Medicamento {
  return { id, nome: '', dosagem: '', inicio: '', termino: '', medico: '', obs: '' };
}

export function criarExameVazio(id: string): Exame {
  return { id, data: '', tipo: '', resultado: '', medico: '', proximo: '' };
}

export function criarConsultaVazia(id: string): Consulta {
  return { id, data: '', especialidade: '', medico: '', diagnostico: '', recomendacoes: '', retorno: '' };
}

export function criarCirurgiaVazia(id: string): Cirurgia {
  return { id, data: '', procedimento: '', hospital: '', medico: '', obs: '' };
}

export function criarControleVazio(id: string): ControleMedicao {
  return { id, data: '', peso: '', pressao: '', glicemia: '', obs: '' };
}

export function criarConsultaEquipeVazia(id: string): ConsultaEquipe {
  return { id, data: '', retorno: '', obs: '' };
}

export function criarExameEquipeVazio(id: string): ExameEquipe {
  return { id, tipo: '', data: '', resultado: '', proximo: '' };
}
