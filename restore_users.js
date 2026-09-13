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

  const hashedPassword = await bcrypt.hash("admin123", 10);
  
  for (const u of usersToUpdate) {
    const existing = await prisma.user.findUnique({ where: { email: u.email } });
    if (!existing) {
      await prisma.user.create({
        data: { ...u, password_hash: hashedPassword }
      });
      console.log(`Created ${u.name}`);
    } else {
      console.log(`${u.name} already exists`);
    }
  }

  console.log('Original users restored successfully!');
}

run()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
