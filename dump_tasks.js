const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function main() {
  const tasks = await prisma.task.findMany({
    orderBy: { dueDate: 'asc' }
  });
  fs.writeFileSync('tasks_dump_all.json', JSON.stringify(tasks, null, 2), 'utf8');
}

main().catch(console.error).finally(() => prisma.$disconnect());
