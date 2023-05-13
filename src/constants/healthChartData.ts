export interface HealthFactor {
  value: number;
  name: string;
  description: string;
}

export const healthChartData: HealthFactor[] = [
  {
    value: 50,
    name: 'NFT',
    description: 'Non Fungible Token',
  },
  {
    value: 20,
    name: 'Electronics',
    description: 'medical-dashboard.health.ecology.description',
  },
  {
    value: 20,
    name: 'Groccery',
    description: 'medical-dashboard.health.genetics.description',
  },
  {
    value: 10,
    name: 'Art & Lifestyle',
    description: 'medical-dashboard.health.medicine.description',
  },
];
