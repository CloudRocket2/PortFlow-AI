const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  // First update them to temporary emails to avoid unique constraint issues if we swapped directly,
  // though we are just swapping names. Wait, we can just update the names!
  
  // Make director@portflow.com point to Sufyan
  await prisma.user.updateMany({
    where: { email: 'director@portflow.com' },
    data: { name: 'Sufyan' }
  });

  // Make chartering@portflow.com point to Dhruv
  await prisma.user.updateMany({
    where: { email: 'chartering@portflow.com' },
    data: { name: 'Dhruv' }
  });

  console.log('Roles swapped successfully in the DB!');
}

run()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
