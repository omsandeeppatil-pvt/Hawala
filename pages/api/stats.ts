import type { NextApiRequest, NextApiResponse } from 'next';

const stats = [
  { label: "Available Balance", amount: "Rs 2,450.90", trend: 12 },
  { label: "Monthly Spending", amount: "Rs 1,450.00", trend: -8 },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(stats);
}
