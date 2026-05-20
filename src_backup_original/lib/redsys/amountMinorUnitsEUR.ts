/** Importe EUR en unidades monetarias habituales (double) → céntimos tal como espera DS_MERCHANT_AMOUNT en Redsys. */
export function toRedsysEURMinorUnits(amount: number): string {
  return Math.round(Number(amount) * 100).toString();
}
