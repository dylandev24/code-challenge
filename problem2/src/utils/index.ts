export const balances: Record<string, number> = {
  BLUR: 82.17,
  bNEO: 12.44,
  BUSD: 2483.55,
  USD: 7321.88,
  ETH: 1.73,
  GMX: 6.92,
  STEVMOS: 312.4,
  LUNA: 89.63,
  RATOM: 41.27,
  STRD: 154.32,
  EVMOS: 227.89,
  IBCX: 23.51,
  IRIS: 142.67,
};

export const getLocalIconPath = (symbol: string): string => {
  return `/assets/${symbol}.svg`;
};

export const SelectTokenType = {
  FROM: "from",
  TO: "to",
} as const;
