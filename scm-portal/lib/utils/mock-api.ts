export function isMockApiEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_MOCK_API === 'true';
}

export const MOCK_ZONES = [
  { id: 1, name: 'North Zone', code: 'NZ' },
  { id: 2, name: 'South Zone', code: 'SZ' },
];

export const MOCK_CIRCLES = [
  { id: 1, name: 'Delhi', zoneId: 1, code: 'DL' },
  { id: 2, name: 'Mumbai', zoneId: 1, code: 'MU' },
  { id: 3, name: 'Chennai', zoneId: 2, code: 'CH' },
];

export const MOCK_SSAS = [
  { id: 1, name: 'SSA North 1', circleId: 1, code: 'SSA1' },
  { id: 2, name: 'SSA North 2', circleId: 2, code: 'SSA2' },
  { id: 3, name: 'SSA South 1', circleId: 3, code: 'SSA3' },
];

export const MOCK_COMMISSIONS = [
  {
    commissionId: 'mock-commission-1',
    masterCategoryId: '1',
    circleId: '1',
    denomination: '199',
    sellerCommission: '10',
    fraCommission: '5',
    subCommission: '2',
    tds: '1',
    categoryId: '1',
    commissionType: '1',
    dtype: 'FRC',
  },
];
