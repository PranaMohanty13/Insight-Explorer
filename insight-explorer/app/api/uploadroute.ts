import { Outcome, PrismaClient, TimeOfDay } from "@prisma/client";
import { NextRequest } from "next/server";
import { parse } from "papaparse";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const { file } = await request.json();
  const { data, errors } = parse(file, {
    header: true,
    skipEmptyLines: true,
    transform: (value) => value.trim(),
  }) as {
    data: {
      id: number;
      campaignId: number;
      transcript: string;
      sentiment: number;
      timeOfDay: string;
      outcome: string;
      callDuration: number;
      callerAge: number;
      callerLocation: string;
      createdAt: string;
    }[];
    errors: any[];
  };

  for (const row of data) {
    await prisma.call.create({
      data: {
        id: row.id,
        campaignId: row.campaignId,
        transcript: row.transcript,
        sentiment: row.sentiment,
        timeOfDay: row.timeOfDay as TimeOfDay,
        outcome: row.outcome as Outcome,
        callDuration: row.callDuration,
        callerAge: row.callerAge,
        callerLocation: row.callerLocation,
        createdAt: new Date(row.createdAt),
      },
    });
  }

  return new Response(JSON.stringify({ success: true }));
}
