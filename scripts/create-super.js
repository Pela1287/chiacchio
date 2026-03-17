const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.update({
    where: { email: 'super@chiacchio.com' },
    data: {
      emailVerified: new Date(),
    },
  });

  console.log('Usuario verificado:', {
    email: user.email,
    emailVerified: user.emailVerified,
  });
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });