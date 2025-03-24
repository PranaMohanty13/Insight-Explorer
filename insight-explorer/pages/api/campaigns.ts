// pages/api/campaigns.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const campaigns = await prisma.campaign.findMany({
        include: { calls: true },
      });
      res.status(200).json(campaigns);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching campaigns' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
