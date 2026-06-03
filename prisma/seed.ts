import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ── USERS ─────────────────────────────────────────────────────
  const adminPass = await bcrypt.hash('admin123', 10);
  const kasirPass = await bcrypt.hash('kasir123', 10);
  const pelangganPass = await bcrypt.hash('pelanggan123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@coffeeshop.com' },
    update: {},
    create: { name: 'Admin', email: 'admin@coffeeshop.com', password: adminPass, role: 'ADMIN' },
  });

  const kasir = await prisma.user.upsert({
    where: { email: 'kasir@coffeeshop.com' },
    update: {},
    create: { name: 'Kasir 1', email: 'kasir@coffeeshop.com', password: kasirPass, role: 'KASIR' },
  });

  const pelanggan = await prisma.user.upsert({
    where: { email: 'customer@coffeeshop.com' },
    update: {},
    create: { name: 'Customer', email: 'customer@coffeeshop.com', password: pelangganPass, role: 'PELANGGAN' },
  });

  console.log('✅ Users created:', admin.email, kasir.email, pelanggan.email);

  // ── KATEGORI ──────────────────────────────────────────────────
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: 'Makanan' },
      update: {},
      create: { name: 'Makanan' },
    }),
    prisma.category.upsert({
      where: { name: 'Minuman' },
      update: {},
      create: { name: 'Minuman' },
    }),
  ]);

  console.log('✅ Categories created:', categories.map((c) => c.name).join(', '));

  const [makanan, minuman] = categories;

  // ── MENU ──────────────────────────────────────────────────────
  const menus = [
    // Makanan
    {
      name: 'Nasi Goreng',
      description: 'Nasi goreng spesial dengan telur dan ayam',
      price: 25000,
      categoryId: makanan.id,
      imageUrl: 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=400&q=80',
    },
    {
      name: 'Ayam Goreng',
      description: 'Ayam goreng crispy bumbu rempah',
      price: 30000,
      categoryId: makanan.id,
      imageUrl: 'https://images.unsplash.com/photo-1606728035253-49e8a23146de?w=400&q=80',
    },
    {
      name: 'Bakmi',
      description: 'Bakmi goreng/kuah dengan topping ayam dan bakso',
      price: 28000,
      categoryId: makanan.id,
      imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=80',
    },
    {
      name: 'Ikan Bakar',
      description: 'Ikan bakar bumbu kecap dengan lalapan',
      price: 45000,
      categoryId: makanan.id,
      imageUrl: 'https://images.unsplash.com/photo-1532636875304-0c89119d9b4d?w=400&q=80',
    },
    {
      name: 'Bebek Goreng',
      description: 'Bebek goreng empuk bumbu kuning dengan sambal',
      price: 50000,
      categoryId: makanan.id,
      imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80',
    },
    {
      name: 'Sop Buntut',
      description: 'Sop buntut sapi bening dengan sayuran segar',
      price: 65000,
      categoryId: makanan.id,
      imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=80',
    },
    // Minuman
    {
      name: 'Es Teh Manis',
      description: 'Teh manis dingin segar',
      price: 8000,
      categoryId: minuman.id,
      imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80',
    },
    {
      name: 'Jus Jeruk',
      description: 'Jus jeruk peras segar tanpa pengawet',
      price: 15000,
      categoryId: minuman.id,
      imageUrl: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&q=80',
    },
    {
      name: 'Es Kelapa Muda',
      description: 'Kelapa muda segar dengan es batu',
      price: 18000,
      categoryId: minuman.id,
      imageUrl: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400&q=80',
    },
  ];
  for (const menu of menus) {
    const existing = await prisma.menu.findFirst({ where: { name: menu.name } });
    if (!existing) {
      await prisma.menu.create({ data: { ...menu, isAvailable: true } });
    } else {
      await prisma.menu.update({ where: { id: existing.id }, data: { imageUrl: menu.imageUrl } });
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
  console.log('   Admin     → admin@coffeeshop.com     / admin123');
  console.log('   Kasir     → kasir@coffeeshop.com     / kasir123');
  console.log('   Pelanggan → customer@coffeeshop.com  / pelanggan123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding gagal:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });