import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ── USERS ─────────────────────────────────────────────────────
  const adminPass = await bcrypt.hash('admin123', 10);
  const kasirPass = await bcrypt.hash('kasir123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@coffeeshop.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@coffeeshop.com',
      password: adminPass,
      role: 'ADMIN',
    },
  });

  const kasir = await prisma.user.upsert({
    where: { email: 'kasir@coffeeshop.com' },
    update: {},
    create: {
      name: 'Kasir 1',
      email: 'kasir@coffeeshop.com',
      password: kasirPass,
      role: 'KASIR',
    },
  });

  console.log('✅ Users created:', admin.email, kasir.email);

  // ── KATEGORI ──────────────────────────────────────────────────
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: 'Mie' },
      update: {},
      create: { name: 'Mie' },
    }),
    prisma.category.upsert({
      where: { name: 'Dimsum' },
      update: {},
      create: { name: 'Dimsum' },
    }),
    prisma.category.upsert({
      where: { name: 'Minuman' },
      update: {},
      create: { name: 'Minuman' },
    }),
  ]);

  console.log('✅ Categories created:', categories.map((c) => c.name).join(', '));

  const [mie, dimsum, minuman] = categories;

  // ── MENU ──────────────────────────────────────────────────────
  const menus = [
    // Mie — ala Gacoan
    { name: 'Mie Goreng', description: 'Mie goreng original', price: 14000, categoryId: mie.id },
    { name: 'Mie Goreng Pedas', description: 'Mie goreng level pedas', price: 14000, categoryId: mie.id },
    { name: 'Mie Kuah', description: 'Mie kuah kaldu ayam', price: 14000, categoryId: mie.id },
    { name: 'Mie Kuah Pedas', description: 'Mie kuah pedas nampol', price: 14000, categoryId: mie.id },
    { name: 'Mie Setan', description: 'Mie extra pedas level dewa', price: 17000, categoryId: mie.id },
    // Dimsum
    { name: 'Siomay', description: '5 pcs siomay udang', price: 12000, categoryId: dimsum.id },
    { name: 'Hakau', description: '4 pcs hakau udang', price: 14000, categoryId: dimsum.id },
    { name: 'Ceker Dimsum', description: '4 pcs ceker saus tiram', price: 12000, categoryId: dimsum.id },
    { name: 'Lumpia Goreng', description: '4 pcs lumpia goreng crispy', price: 11000, categoryId: dimsum.id },
    // Minuman
    { name: 'Es Teh Manis', description: 'Teh manis dingin segar', price: 5000, categoryId: minuman.id },
    { name: 'Es Jeruk', description: 'Jeruk peras segar', price: 8000, categoryId: minuman.id },
    { name: 'Kopi Hitam', description: 'Kopi hitam panas/dingin', price: 8000, categoryId: minuman.id },
    { name: 'Air Mineral', description: 'Air mineral botol', price: 4000, categoryId: minuman.id },
  ];

  for (const menu of menus) {
    const existing = await prisma.menu.findFirst({ where: { name: menu.name } });
    if (!existing) {
      await prisma.menu.create({ data: { ...menu, isAvailable: true } });
    }
  }

  console.log('✅ Menus created:', menus.length, 'items');

  // ── MEJA ──────────────────────────────────────────────────────

  const tables = [
    { number: 1, capacity: 2 },
    { number: 2, capacity: 2 },
    { number: 3, capacity: 4 },
    { number: 4, capacity: 4 },
    { number: 5, capacity: 4 },
    { number: 6, capacity: 4 },
    { number: 7, capacity: 6 },
    { number: 8, capacity: 6 },
    { number: 9, capacity: 6 },
    { number: 10, capacity: 8 },
  ];

  for (const table of tables) {
    await prisma.table.upsert({
      where: { number: table.number },
      update: {},
      create: { ...table, qrCode: randomUUID(), status: 'TERSEDIA' },
    });
  }

  console.log('✅ Tables created:', tables.length, 'tables');
  console.log('');
  console.log('🎉 Seeding selesai!');
  console.log('');
  console.log('📋 Akun yang tersedia:');
  console.log('   Admin  → admin@coffeeshop.com  / admin123');
  console.log('   Kasir  → kasir@coffeeshop.com  / kasir123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding gagal:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
