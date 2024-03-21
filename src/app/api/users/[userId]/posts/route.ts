import prisma from '../../../../../../lib/prisma';
import { verifyToken } from '../../../../../../lib/jwt';
import { headers } from 'next/headers';
import { nanoid } from 'nanoid';

const kebabCase = (string: string) =>
  string
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();

export async function POST(req: Request, { params }: { params: { userId: string } }) {
  const headersList = headers();
  const referer = headersList.get('authorization');
  const userId = parseInt(params.userId, 10);

  if (!referer) {
    return Response.json({ error: 'you are not authorized to access the api' }, { status: 403 });
  }

  const token = referer.split('Bearer ')[1];

  try {
    await verifyToken(token, userId);
  } catch (error) {
    return Response.json({ error: 'you are not authorized to access the api' }, { status: 403 });
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return Response.json({ error: 'you are not authorized to access the api' }, { status: 403 });
  }

  // TODO: Code block above can be moved to a different module for re-using it if we have additional protected apis

  const body = await req.json();

  const createdPost = await prisma.post.create({
    data: {
      title: body.title,
      projectGoals: body.projectgoals,
      methodology: body.methodologies,
      potentialAppl: body.potentialApplications,
      abstract: body.abstract,
      content: body.body,
      authorId: userId,
      slug: `${kebabCase(body.title)}-${nanoid(12)}`,
    },
  });

  const labelsReceived = body.labels as { id?: number; name: string }[];

  if (labelsReceived && labelsReceived.length > 0) {
    const labelNames = labelsReceived.map((label) => label.name);

    const labelsInDb = await prisma.label.findMany({
      where: {
        name: {
          in: labelNames,
        },
      },
    });

    const newLabels = labelNames.filter((labelName) => !labelsInDb.some((label) => labelName === label.name));

    if (newLabels.length > 0) {
      const createdLabels = await Promise.all(
        newLabels.map((newLabel) =>
          prisma.label.create({
            data: {
              name: newLabel,
            },
          }),
        ),
      );

      createdLabels.forEach((createdLabel) => labelsInDb.push(createdLabel));
    }

    await prisma.labelsOnPosts.createMany({
      data: labelsInDb.map((label) => ({ labelId: label.id, postId: createdPost.id, assignedBy: `${createdPost.id}` })),
    });
  }

  return Response.json({ ok: true }, { status: 200 });
}
