import { IRecordCreate } from '../interfaces/record.interfaces';

export const getDummyRecordData = (userId: string): IRecordCreate => ({
  userId: userId,
  queixa_principal: "Paciente refere dor de cabeça há 3 dias (DADO MOCKADO).",
  hda: "Paciente masculino, 45 anos, previamente hígido, iniciou quadro de cefaleia holocraniana, pulsátil, de intensidade 8/10, há cerca de 3 dias, sem melhora com uso de analgésicos comuns (DADO MOCKADO).",
  medicamentos_uso: ["Paracetamol 750mg, se dor"],
  alergias: ["Dipirona"],
  exame_fisico_citado: "Bom estado geral, corado, hidratado. Sinais vitais estáveis (DADO MOCKADO).",
  hipotese_diagnostica: "Cefaleia tensional vs. Enxaqueca (DADO MOCKADO).",
  conduta_sugerida: "Solicito Tomografia de Crânio para afastar causas secundárias. Prescrevo Sumatriptano (DADO MOCKADO)."
});
