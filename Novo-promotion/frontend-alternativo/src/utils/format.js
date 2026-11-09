export const money = (v) => Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

// "34,90" | "34.90" -> 34.9
export const parseMoney = (s) => {
  const str = String(s ?? '').trim();
  if (!str) return NaN;
  return parseFloat(str.includes(',') ? str.replace(/\./g, '').replace(',', '.') : str);
};

// 34.9 -> "34,90"
export const toMoneyInput = (n) => (Number.isFinite(n) ? n.toFixed(2).replace('.', ',') : '');

export const discountOf = (original, promo) =>
  original > 0 && promo >= 0 ? Math.max(0, Math.min(100, Math.round((1 - promo / original) * 100))) : 0;
