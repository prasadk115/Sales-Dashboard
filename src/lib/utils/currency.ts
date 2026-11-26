export const APP_CURRENCY = "INR" as const;
export const formatCurrency = (value: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: APP_CURRENCY, maximumFractionDigits: 0 }).format(value);
export const formatCompactCurrency = (value: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: APP_CURRENCY, notation: "compact", maximumFractionDigits: 1 }).format(value);
