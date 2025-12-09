import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createAllUsers() {
  console.log('🚀 Starting database setup...\n');

  try {
    // Create projects first
    console.log('📁 Creating projects...');
    const projects = [
      { name: 'AI', description: 'Artificial Intelligence and Machine Learning initiatives', status: 'active' },
      { name: 'ML', description: 'Machine Learning research and development', status: 'active' },
      { name: 'TaskFlow', description: 'Task management and workflow automation platform', status: 'active' },
      { name: 'SyncBoard', description: 'Real-time collaboration and synchronization board', status: 'active' },
      { name: 'DataViz', description: 'Data visualization and analytics platform', status: 'active' },
      { name: 'CloudOps', description: 'Cloud operations and infrastructure management', status: 'active' },
    ];

    for (const project of projects) {
      const existing = await prisma.project.findUnique({ where: { name: project.name } });
      if (!existing) {
        await prisma.project.create({ data: project });
        console.log(`  ✅ Created project: ${project.name}`);
      } else {
        console.log(`  ⏭️  Project exists: ${project.name}`);
      }
    }

    // Create all users
    console.log('\n👥 Creating users...');

    const users = [
      {
        email: 'codesharma452@gmail.com',
        password: await bcrypt.hash('Code@123', 10),
        firstName: 'Code',
        lastName: 'Sharma',
        role: 'USER',
      },
      {
        email: 'Puneet.sharma@qsstechnosoft.com',
        password: await bcrypt.hash('Puneet@123', 10),
        firstName: 'Puneet',
        lastName: 'Sharma',
        role: 'ADMIN',
      },
      {
        email: 'developerpunit9628@gmail.com',
        password: await bcrypt.hash('Developer@123', 10),
        firstName: 'Developer',
        lastName: 'Punit',
        role: 'SUPERADMIN',
      },
      {
        email: 'admin@taskflow.com',
        password: await bcrypt.hash('Admin@123', 10),
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN',
      },
      {
        email: 'superadmin@taskflow.com',
        password: await bcrypt.hash('SuperAdmin@123', 10),
        firstName: 'Super',
        lastName: 'Admin',
        role: 'SUPERADMIN',
      },
    ];

    for (const userData of users) {
      const existing = await prisma.user.findUnique({ where: { email: userData.email } });
      if (!existing) {
        await prisma.user.create({ data: userData });
        console.log(`  ✅ Created ${userData.role}: ${userData.email}`);
      } else {
        // Update role if exists
        await prisma.user.update({
          where: { email: userData.email },
          data: { role: userData.role },
        });
        console.log(`  ⏭️  Updated ${userData.role}: ${userData.email}`);
      }
    }

    console.log('\n✅ Database setup completed successfully!');
    console.log('\n📝 User Accounts Summary:');
    console.log('┌─────────────────────────────────────────┬──────────────┬───────────────┐');
    console.log('│ Email                                   │ Password     │ Role          │');
    console.log('├─────────────────────────────────────────┼──────────────┼───────────────┤');
    console.log('│ codesharma452@gmail.com                 │ Code@123     │ USER          │');
    console.log('│ Puneet.sharma@qsstechnosoft.com         │ Puneet@123   │ ADMIN         │');
    console.log('│ developerpunit9628@gmail.com            │ Developer@123│ SUPERADMIN    │');
    console.log('│ admin@taskflow.com                      │ Admin@123    │ ADMIN         │');
    console.log('│ superadmin@taskflow.com                 │ SuperAdmin@123│ SUPERADMIN   │');
    console.log('└─────────────────────────────────────────┴──────────────┴───────────────┘\n');

  } catch (error) {
    console.error('❌ Error during setup:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Only run if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  createAllUsers();
}

export default createAllUsers;
