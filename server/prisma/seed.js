import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Create sample projects
  const projects = [
    {
      name: 'AI',
      description: 'Artificial Intelligence and Machine Learning initiatives',
      status: 'active',
    },
    {
      name: 'ML',
      description: 'Machine Learning research and development',
      status: 'active',
    },
    {
      name: 'TaskFlow',
      description: 'Task management and workflow automation platform',
      status: 'active',
    },
    {
      name: 'SyncBoard',
      description: 'Real-time collaboration and synchronization board',
      status: 'active',
    },
    {
      name: 'DataViz',
      description: 'Data visualization and analytics platform',
      status: 'active',
    },
    {
      name: 'CloudOps',
      description: 'Cloud operations and infrastructure management',
      status: 'active',
    },
  ];

  for (const project of projects) {
    const existingProject = await prisma.project.findUnique({
      where: { name: project.name },
    });

    if (!existingProject) {
      await prisma.project.create({
        data: project,
      });
      console.log(`✅ Created project: ${project.name}`);
    } else {
      console.log(`⏭️  Project already exists: ${project.name}`);
    }
  }

  // Create sample admin user
  const adminEmail = 'admin@taskflow.com';
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN',
      },
    });
    console.log('✅ Created admin user: admin@taskflow.com (password: Admin@123)');
  } else {
    console.log('⏭️  Admin user already exists');
  }

  // Create sample superadmin user
  const superAdminEmail = 'superadmin@taskflow.com';
  const existingSuperAdmin = await prisma.user.findUnique({
    where: { email: superAdminEmail },
  });

  if (!existingSuperAdmin) {
    const hashedPassword = await bcrypt.hash('SuperAdmin@123', 10);
    await prisma.user.create({
      data: {
        email: superAdminEmail,
        password: hashedPassword,
        firstName: 'Super',
        lastName: 'Admin',
        role: 'SUPERADMIN',
      },
    });
    console.log('✅ Created superadmin user: superadmin@taskflow.com (password: SuperAdmin@123)');
  } else {
    console.log('⏭️  SuperAdmin user already exists');
  }

  console.log('Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
