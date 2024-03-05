const util = require('util');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const jwtSignAsync = util.promisify(jwt.sign);
const jwtVerifyAsync = util.promisify(jwt.verify);

const JWT_ALGORITH = 'HS256';

export async function generateToken(user: { id: number }) {
  const options = {
    algorithm: JWT_ALGORITH,
    expiresIn: 60 * 60, // 1 hour
  };

  return jwtSignAsync(
    {
      ...user,
      iat: Math.floor(Date.now() / 1000) - 30,
      iss: process.env.JWT_ISSUER,
      jti: crypto.randomInt(1, 2147483647),
    },
    process.env.JWT_SECRET,
    options,
  );
}

export async function verifyToken(token: string, userId: number) {
  const user = await jwtVerifyAsync(token, process.env.JWT_SECRET, {
    algorithms: [JWT_ALGORITH],
    issuer: process.env.JWT_ISSUER,
  });

  if (user.id !== userId) {
    throw new Error('token does not match with user');
  }

  return user;
}
