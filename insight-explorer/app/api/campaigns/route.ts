// app/api/campaigns/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const campaigns = await prisma.campaign.findMany({
      include: { calls: true },
    });
    return NextResponse.json(campaigns);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
