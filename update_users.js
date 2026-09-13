const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function run() {
  const usersToUpdate = [
    { email: 'chartering@portflow.com', name: 'Sufyan', role: 'MGR-01', department: 'Commercial Chartering', clearance: 'LEVEL 3 (DELTA)' },
    { email: 'analyst@portflow.com', name: 'Krishna', role: 'ANL-04', department: 'Market Intelligence', clearance: 'LEVEL 3 (DELTA)' },
    { email: 'ops@portflow.com', name: 'Vaishnavi', role: 'OPS-09', department: 'Terminal Logistics', clearance: 'LEVEL 2 (SIGMA)' },
    { email: 'director@portflow.com', name: 'Dhruv', role: 'DIR-12', department: 'Executive Operations', clearance: 'LEVEL 5 (OMEGA)' }
  ];

  // We should also ensure the new users are created if they don't exist
  const newUsers = [
    { email: 'strategy@portflow.com', name: 'Shresth', role: 'STR-05', department: 'Strategic Planning', clearance: 'LEVEL 4 (GAMMA)' },
    { email: 'security@portflow.com', name: 'Saad', role: 'SEC-01', department: 'Cybersecurity & Risk', clearance: 'LEVEL 5 (OMEGA)' }
  ];

  for (const u of usersToUpdate) {
    await prisma.user.updateMany({
      where: { email: u.email },
      data: { name: u.name }
    });
  }

  const hashedPassword = await bcrypt.hash("admin123", 10);
  
  for (const u of newUsers) {
    const existing = await prisma.user.findUnique({ where: { email: u.email } });
    if (!existing) {
      await prisma.user.create({
        data: { ...u, password_hash: hashedPassword }
      });
    } else {
      await prisma.user.updateMany({
        where: { email: u.email },
        data: { name: u.name }
      });
    }
  }

  console.log('Users updated successfully!');
}

run()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
