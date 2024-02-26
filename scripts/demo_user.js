const { PrismaClient } = require('@prisma/client');

async function addDemoUser() {
  const prisma = new PrismaClient();

  try {
    // Connect to the database
    await prisma.$connect();

    // Add demo user to the database
    const demoUser = await prisma.user.create({
      data: {
        email: 'demo@example.com',
        firstName: 'Demo',
        lastName: 'User',
        password: 'password123'
      }
    });

    console.log('Demo user added:', demoUser);
  } catch (error) {
    console.error('Error in adding demo user:', error);
  } finally {
    // Disconnect from the database
    await prisma.$disconnect();
  }
}

// Call the seed function to execute the seeding logic
addDemoUser();
