import { PrismaClient, Outcome, TimeOfDay } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // (Optional) Clear existing data to avoid duplicates.
  await prisma.call.deleteMany();
  await prisma.campaign.deleteMany();

  for (let i = 1; i <= 5; i++) {
    // Generate an array of 50 call data objects for each campaign
    const callsData = [];
    for (let j = 1; j <= 50; j++) {
      callsData.push({
        transcript: `Call transcript ${j} for Campaign ${i}`,
        sentiment: parseFloat((Math.random() * 2 - 1).toFixed(2)), // random sentiment between -1 and 1
        outcome: [Outcome.SUCCESS, Outcome.DROP, Outcome.ESCALATION][Math.floor(Math.random() * 3)],
        callDuration: Math.floor(Math.random() * 600) + 60, // random duration between 60 and 660 seconds
        callerAge: Math.floor(Math.random() * 50) + 20, // random age between 20 and 70
        callerLocation: ['New York', 'Los Angeles', 'Chicago', 'Houston'][Math.floor(Math.random() * 4)],
        timeOfDay: [TimeOfDay.MORNING, TimeOfDay.AFTERNOON, TimeOfDay.EVENING][Math.floor(Math.random() * 3)],
      });
    }

    // Create a campaign with the generated calls data
    const campaign = await prisma.campaign.create({
      data: {
        name: `Campaign ${i}`,
        description: `Campaign number ${i} for testing data seeding.`,
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-12-31'),
        calls: {
          create: callsData,
        },
      },
    });
    console.log(`Created Campaign ${i} with 50 calls`);
  }
  console.log('Seeding successful!');
  console.log("Seeding complete: Created 5 campaigns with 50 calls each");
}




main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
// This script seeds the database with initial data for campaigns and calls.
// It first clears any existing data to avoid duplicates, then creates two campaigns