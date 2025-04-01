// pages/api/campaign/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Extract the campaign id from the URL query
  const { id } = req.query;

  if (req.method === 'GET') {
    try {

      // Find the campaign by id and include its associated calls, this part is what one needs to change to get different data
      const campaign = await prisma.campaign.findUnique({
        where: { id: Number(id) },
        include: { 
          calls: true,
          },
      });

      if (!campaign) {
        return res.status(404).json({ message: 'Campaign not found' });
      }
      
      res.status(200).json(campaign);

    } 
    catch (error) {
      console.error('Error fetching campaign:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }

  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
