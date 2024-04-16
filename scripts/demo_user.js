const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

async function addDemoUser() {
  const prisma = new PrismaClient();

  try {
    // Connect to the database
    await prisma.$connect();

    // user existing demo user if exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: 'demo1@example.com',
      },
    });

    let demoUser = existingUser;

    if (!existingUser) {
      // Add demo user to the database
      demoUser = await prisma.user.create({
        data: {
          email: 'demo1@example.com',
          firstName: 'Joann',
          lastName: 'Osinski',
          password: await bcrypt.hash('password123', 12),
        },
      });

      console.log('Demo user added:', demoUser);
    }

    // just to be sure, delete previously created profiles for demo user
    await prisma.profile.deleteMany({
      where: {
        userId: demoUser.id,
      },
    });

    //Create a profile entry for the demo user
    const demoUserProfile = await prisma.profile.create({
      data: {
        title: 'Dr',
        organizations: 'Oxford Brookes University',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        publications:
          '2024 dolor sit amet: https://doi.org/bla/publications, incididunt ut labore: https://doi.org/dolore/publications,',
        twitterUrl: '@twitter',
        linkedinUrl: '@linkedin',
        githubUrl: '@github',
        mediumUrl: '@medium',
        image: 'Brookeslogo.png',
        user: {
          connect: { id: demoUser.id },
        },
      },
    });

    console.log('Demo user profile created:', demoUserProfile);
  } catch (error) {
    console.error('Error in adding demo user:', error);
  } finally {
    // Disconnect from the database
    await prisma.$disconnect();
  }
}

// Call the seed function to execute the seeding logic
addDemoUser();
