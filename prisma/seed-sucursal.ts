import prisma from "@/lib/prisma";

async function run() {
  await prisma.sucursal.upsert({
    where: { codigo: "001" },
    update: { nombre: "La Plata", activa: true },
    create: { codigo: "001", nombre: "La Plata", activa: true },
  });

  console.log("✅ Sucursal 001 La Plata lista");
}

run()
  .catch((e) => {
    console.error("❌ Seed sucursal error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });