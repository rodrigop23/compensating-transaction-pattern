import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const newData = await prisma.inventario.createMany({
    data: [
      {
        name: 'Product A',
        quantity: 100,
        price: 29.99,
      },
      {
        name: 'Product B',
        quantity: 50,
        price: 49.99,
      },
      {
        name: 'Product C',
        quantity: 200,
        price: 19.99,
      },
      {
        name: 'Product D',
        quantity: 150,
        price: 39.99,
      },
    ],
  });

  console.log(newData);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
