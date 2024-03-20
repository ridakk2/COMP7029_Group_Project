import prisma from '../../../../lib/prisma';

export interface I_post {
  id: number;
  createdAt: string;
  title: string;
  content: string;
  authorId: number;
  slug: string;
  author: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
  };
  labels: {
    postId: number;
    labelId: number;
    label: {
      id: number;
      name: string;
    };
  }[];
}

export async function GET(req: Request) {
  const search = new URL(req.url).search;
  const urlParams = new URLSearchParams(search);
  const labelParam = urlParams.get('labels');
  let whereClause = {};

  if (labelParam) {
    const labels = labelParam
      .split(',')
      .map((str) => `${str}`.trim())
      .filter((str) => str !== '');

    whereClause = {
      where: {
        OR: [
          {
            labels: {
              some: {
                label: {
                  name: {
                    in: labels,
                    mode: 'insensitive',
                  },
                },
              },
            },
          },
          ...labels.map((label) => ({ title: { contains: label, mode: 'insensitive' } })),
          ...labels.map((label) => ({ content: { contains: label, mode: 'insensitive' } })),
        ],
      },
    };
  }

  const posts = await prisma.post.findMany({
    ...whereClause,
    orderBy: [
      {
        createdAt: 'desc',
      },
    ],
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
