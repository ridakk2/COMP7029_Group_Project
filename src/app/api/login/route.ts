import prisma from '../../../../lib/prisma';
import { generateToken } from '../../../../lib/jwt';
const bcrypt = require('bcrypt');

export async function POST(req: Request) {
  const body = await req.json();
  const result = await prisma.user.findUnique({
    where: {
      email: body.email,
    },
  });

  if (!result) {
    return Response.json({ error: 'Either email or password is wrong' }, { status: 401 });
  }

  // do not return hash password, we just need to use it to compare hash vs plaintext password
  const { password, ...user } = result;

  let isPasswordCorect = false;
  try {
    isPasswordCorect = await bcrypt.compare(body.password, password);
  } catch (error) {
    return Response.json({ error: 'Either email or password is wrong' }, { status: 401 });
  }

  if (!isPasswordCorect) {
    return Response.json({ error: 'Either email or password is wrong' }, { status: 401 });
  }

  return Response.json({ ...user, token: await generateToken({ id: user.id }) }, { status: 200 });
}
