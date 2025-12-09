import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createUsers() {
  console.log('Creating users...\n');

  try {
    // 1. Create regular USER
    const user1Email = 'codesharma452@gmail.com';
    const existingUser1 = await prisma.user.findUnique({ where: { email: user1Email } });

    if (!existingUser1) {
      const hashedPassword1 = await bcrypt.hash('Code@123', 10);
      const user1 = await prisma.user.create({
        data: {
          email: user1Email,
          password: hashedPassword1,
          firstName: 'Code',
          lastName: 'Sharma',
          role: 'USER',
        },
      });
      console.log(`✅ Created USER: ${user1.email}`);
      console.log(`   Password: Code@123`);
      console.log(`   Role: ${user1.role}\n`);
    } else {
      console.log(`⏭️  User already exists: ${user1Email}\n`);
    }

    // 2. Create ADMIN user
    const user2Email = 'Puneet.sharma@qsstechnosoft.com';
    const existingUser2 = await prisma.user.findUnique({ where: { email: user2Email } });

    if (!existingUser2) {
      const hashedPassword2 = await bcrypt.hash('Puneet@123', 10);
      const user2 = await prisma.user.create({
        data: {
          email: user2Email,
          password: hashedPassword2,
          firstName: 'Puneet',
          lastName: 'Sharma',
          role: 'ADMIN',
        },
      });
      console.log(`✅ Created ADMIN: ${user2.email}`);
      console.log(`   Password: Puneet@123`);
      console.log(`   Role: ${user2.role}\n`);
    } else {
      console.log(`⏭️  Admin already exists: ${user2Email}\n`);
    }

    // 3. Create SUPERADMIN user
    const user3Email = 'developerpunit9628@gmail.com';
    const existingUser3 = await prisma.user.findUnique({ where: { email: user3Email } });

    if (!existingUser3) {
      const hashedPassword3 = await bcrypt.hash('Developer@123', 10);
      const user3 = await prisma.user.create({
        data: {
          email: user3Email,
          password: hashedPassword3,
          firstName: 'Developer',
          lastName: 'Punit',
          role: 'SUPERADMIN',
        },
      });
      console.log(`✅ Created SUPERADMIN: ${user3.email}`);
      console.log(`   Password: Developer@123`);
      console.log(`   Role: ${user3.role}\n`);
    } else {
      console.log(`⏭️  SuperAdmin already exists: ${user3Email}\n`);
    }

    console.log('✅ All users created successfully!');
    console.log('\n📝 Summary:');
    console.log('1. codesharma452@gmail.com (USER) - Password: Code@123');
    console.log('2. Puneet.sharma@qsstechnosoft.com (ADMIN) - Password: Puneet@123');
    console.log('3. developerpunit9628@gmail.com (SUPERADMIN) - Password: Developer@123');

  } catch (error) {
    console.error('❌ Error creating users:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

createUsers();
