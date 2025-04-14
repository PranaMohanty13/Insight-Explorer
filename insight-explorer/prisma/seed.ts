import { PrismaClient, TimeOfDay, Outcome } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.call.deleteMany();
  await prisma.campaign.deleteMany();

  for (let i = 1; i <= 5; i++) {
    const callsData = [];
    for (let j = 1; j <= 50; j++) {
      
      callsData.push({
        transcript: `Call transcript ${j} for Campaign ${i}`,
        sentiment: parseFloat((Math.random() * 2 - 1).toFixed(2)),
        outcome: [Outcome.SUCCESS, Outcome.DROP, Outcome.ESCALATION][Math.floor(Math.random() * 3)],
        callDuration: Math.floor(Math.random() * 600) + 60,
        callerAge: Math.floor(Math.random() * 50) + 20,
        callerLocation: ['New York', 'Los Angeles', 'Chicago', 'Houston'][Math.floor(Math.random() * 4)],
        timeOfDay: [TimeOfDay.MORNING, TimeOfDay.AFTERNOON, TimeOfDay.EVENING][Math.floor(Math.random() * 3)],
      });
    }


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