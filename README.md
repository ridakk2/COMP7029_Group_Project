# COMP7029 Group Project

COMP7029 Group Project Group 1

## Prerequisites

1. [Install Docker](https://www.docker.com/products/docker-desktop/)
2. [Install NodeJs](https://nodejs.org/en/download)
3. [Install Git](https://git-scm.com/downloads)

## Members

| Full Name | Email |
| --- | --- |
| Kadir Goktas | <19281222@brookes.ac.uk> |
| Aditya Parmar | <19276544@brookes.ac.uk> |
| Genesis Lamilla Vega | <19141230@brookes.ac.uk> |
| Derya Ozdemir Kurin | <19143127@brookes.ac.uk> |
| Hiromi Kanetsuka | <19278431@brookes.ac.uk> |
| Rajpreet Kaur | <19277619@brookes.ac.uk> |
| John Bokka | <19277388@brookes.ac.uk> |
| Anmol Singh | <19277618@brookes.ac.uk> |

## Create .env file for local development environment

Create .env file in your root project directory as below;

```text
DATABASE_URL="postgresql://admin:admin@localhost:55432/brookes-portal?schema=public"
JWT_SECRET="0123456789"
JWT_ISSUER="brookes.blog.local"
```

## How to run

```bash
docker-compose up -d
npm i
npm run db:migrate
node scripts/demo_user.js
npm run dev

```

## Creating a demo user

To add a demo user manually to User table in DB
Run following command from the root of the project folder

```bash

node scripts/demo_user.js
```

Expected output:
Demo user added: {
  id: 1,
  email: '<demo@example.com>',
  firstName: 'Demo',
  lastName: 'User',
  password: 'password123'
}

Ensure that the entry has been added to User table by visiting prisma studio by running the following command:

```bash

npm run db:view 
```

## Useful Links

[NextJs](https://nextjs.org/)
[Prisma](https://www.prisma.io/)
[Tailwind Css](https://tailwindcss.com/)
[Tailwind Components](https://tailwindui.com/components/#product-application-ui)
[Sample project with nextjs + prisma](https://vercel.com/guides/nextjs-prisma-postgres)

## How to push your code

First, add all your changes or add one by one via;

```sh
git add .
```

or

```sh
git add <path/changed-file>
```

Second, commit your changes via following cli prompts

```sh
npm run cm
```

and Finally, push your chages to remote repository;

```sh
git push
```

> For the first push, you may need to set upstream repository `git push --set-upstream origin <branch>`
