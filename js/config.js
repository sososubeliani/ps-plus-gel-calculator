export const DEFAULT_CONFIG = {
  currency: {
    liraToLari: 305,
    hryvniaToLari: 305,
  },
  profitRanges: {
    lira: [
      { min: 1,    max: 100,  value: 100 },
      { min: 101,  max: 300,  value: 50 },
      { min: 301,  max: 500,  value: 40 },
      { min: 501,  max: 1000, value: 30 },
      { min: 1001, max: 1500, value: 25 },
      { min: 1501, max: 9999, value: 20 },
    ],
    hryvnia: [
      { min: 1,    max: 130,  value: 100 },
      { min: 131,  max: 390,  value: 50 },
      { min: 391,  max: 650,  value: 40 },
      { min: 651,  max: 1300, value: 30 },
      { min: 1301, max: 1900, value: 25 },
      { min: 1901, max: 9999, value: 20 },
    ],
  },
};
