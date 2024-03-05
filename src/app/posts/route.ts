import type { NextApiRequest } from 'next';
import prisma from '../../../lib/prisma';

export async function GET(req: NextApiRequest) {
  const search = new URL(req.url || '').search;
  const urlParams = new URLSearchParams(search);
  const labelParam = urlParams.get('labels');
  let whereClause = {};

  if (labelParam) {
    const labels = labelParam
      .split(',')
      .map((str) => `${str}`.trim())
      .filter((str) => str !== '');

    console.log(labels);

    whereClause = {
      where: {
        labels: {
          some: {
            label: {
              name: {
                in: labels,
              },
            },
          },
        },
      },
    };
  }

  const posts = await prisma.post.findMany({
    ...whereClause,
    include: {
      labels: {
        include: {
          label: true,
        },
      },
      author: true,
    },
  });

  return Response.json({
    results: posts.map((post) => {
      // exclude user password from returned data
      // eslint-disable-next-line no-unused-vars
      const { password, ...author } = post.author;

      return {
        ...post,
        author,
      };
    }),
  });
}
