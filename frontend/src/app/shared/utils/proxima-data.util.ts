import { EquipeSaude } from '../../models';

/**
 * Menor data (ISO) maior ou igual a `hojeIso` entre os retornos de consulta e os próximos exames
 * de um especialista. Retorna string vazia se não houver nenhuma data futura.
 */
export function proximaData(equipe: EquipeSaude, hojeIso: string): string {
  const datas = [
    ...equipe.consultas.map((c) => c.retorno),
    ...equipe.exames.map((e) => e.proximo),
  ].filter((d): d is string => Boolean(d) && d >= hojeIso);

  return datas.sort()[0] || '';
}
