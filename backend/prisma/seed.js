const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clean existing data
  await prisma.rating.deleteMany();
  await prisma.store.deleteMany();
  await prisma.user.deleteMany();

  const commonPassword = 'Password123!';
  const hashedPassword = await bcrypt.hash(commonPassword, 10);

  // 1. Create Admin
  const admin = await prisma.user.create({
    data: {
      name: 'Administrator User Account',
      email: 'admin@storerating.com',
      password: hashedPassword,
      address: 'Main Tech Headquarters, Suite 101, New York, NY',
      role: 'Admin',
    },
  });
  console.log('Created Admin:', admin.email);

  // 2. Create 5 Store Owners
  const storeOwners = [];
  for (let i = 1; i <= 5; i++) {
    const owner = await prisma.user.create({
      data: {
        name: `Store Owner Name Number ${i} Executive`,
        email: `owner${i}@storerating.com`,
        password: hashedPassword,
        address: `${i}00 Commercial Parkway, San Francisco, CA`,
        role: 'Store Owner',
      },
    });
    storeOwners.push(owner);
  }
  console.log('Created 5 Store Owners');

  // 3. Create 10 Users
  const users = [];
  for (let i = 1; i <= 10; i++) {
    const user = await prisma.user.create({
      data: {
        name: `Normal Customer User Number ${i} Account`,
        email: `user${i}@storerating.com`,
        password: hashedPassword,
        address: `${i}23 Residential Street, Apartment ${i}B, Seattle, WA`,
        role: 'User',
      },
    });
    users.push(user);
  }
  console.log('Created 10 Users');

  // 4. Create 20 Stores (distributed across the 5 owners)
  const stores = [];
  const storeNames = [
    'Delicious Pizza Express Restaurant',
    'Elite Coffee Roasters Café Shop',
    'Tech Gadgets and Electronics Emporium',
    'Organic Fresh Groceries Supermarket',
    'Active Life Sports and Fitness Goods',
    'Urban Fashion and Apparel Boutique',
    'Sweet Treats Bakery and Dessert Shop',
    'Green Garden and Plant Nursery Centre',
    'Automotive Repair and Service Workshop',
    'Sparkle Jewelers Accessories Boutique',
    'Happy Paws Pet Supplies and Grooming',
    'Bookworms Haven Library and Bookshop',
    'Modern Home Furnishing and Decor Store',
    'Gamer Paradise Video Games Arcade',
    'Sunny Side Breakfast and Brunch Cafe',
    'Crafty Hands Arts and Hobbies Supplies',
    'Sound Waves Instruments and Audio Shop',
    'Vintage Thrift Clothing Collectibles',
    'Clean Cuts Hair Salon and Barber Shop',
    'Super Wash Laundry Dry Clean Services',
  ];

  for (let i = 0; i < 20; i++) {
    const ownerIndex = i % 5;
    const store = await prisma.store.create({
      data: {
        name: storeNames[i],
        email: `store${i + 1}@storerating.com`,
        address: `${100 + i * 10} Business Avenue, Suite ${i + 1}, Chicago, IL`,
        ownerId: storeOwners[ownerIndex].id,
      },
    });
    stores.push(store);
  }
  console.log('Created 20 Stores');

  // 5. Generate 100 unique ratings
  // To avoid unique constraint violations, keep track of user-store pairs.
  const ratedPairs = new Set();
  let ratingsCount = 0;

  while (ratingsCount < 100) {
    const userIndex = Math.floor(Math.random() * users.length);
    const storeIndex = Math.floor(Math.random() * stores.length);
    const pairKey = `${userIndex}-${storeIndex}`;

    if (!ratedPairs.has(pairKey)) {
      ratedPairs.add(pairKey);
      const ratingValue = Math.floor(Math.random() * 5) + 1; // 1 to 5

      await prisma.rating.create({
        data: {
          rating: ratingValue,
          userId: users[userIndex].id,
          storeId: stores[storeIndex].id,
        },
      });
      ratingsCount++;
    }
  }
  console.log(`Generated ${ratingsCount} Store Ratings`);

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
