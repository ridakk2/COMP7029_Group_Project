import prisma from '../../../lib/prisma';

export async function GET() {
  const posts = await prisma.post.findMany({
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
