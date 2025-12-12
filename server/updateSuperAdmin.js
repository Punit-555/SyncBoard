import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateSuperAdmin() {
  console.log('Updating superadmin@syncBoard.com to SUPERADMIN role...\n');

  try {
    const email = 'superadmin@syncBoard.com';

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // Update to SUPERADMIN role
      const updatedUser = await prisma.user.update({
        where: { email },
        data: {
          role: 'SUPERADMIN',
        },
      });

      console.log(`✅ Updated user to SUPERADMIN: ${updatedUser.email}`);
      console.log(`   Email: ${updatedUser.email}`);
      console.log(`   Password: SuperAdmin@123`);
      console.log(`   Role: ${updatedUser.role}`);
      console.log(`   Name: ${updatedUser.firstName} ${updatedUser.lastName}\n`);
    } else {
      console.log(`❌ User not found: ${email}`);
      console.log('This user should have been created during seeding.\n');
    }

    console.log('✅ Update completed!');

  } catch (error) {
    console.error('❌ Error updating user:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

updateSuperAdmin();
