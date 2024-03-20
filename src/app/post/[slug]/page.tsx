import Image from 'next/image';
import prisma from '../../../../lib/prisma';

export default async function Post({ params }: { params: { slug: string } }) {
  const post = await prisma.post.findFirst({
    where: {
      slug: params.slug,
    },
    include: {
      labels: {
        include: {
          label: true,
        },
      },
      author: true,
    },
  });

  return (
    post && (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="max-w-3xl w-full px-4 py-8">
          <h1 className="text-3xl font-bold mb-4 text-center">{post?.title}</h1>

          <div className="flex items-center mb-10">
            <Image
              width={0}
              height={0}
              sizes="100"
              src="https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250"
              className="h-20 w-20 rounded-full mr-4"
              alt="User Icon"
            />

            <div>
              <p className="text-lg font-semibold">
                {post?.author.firstName} {post?.author.lastName}
              </p>
              <p className="text-lg font-semibold">{new Date(post?.createdAt).toISOString().slice(0, 10)}</p>
            </div>
          </div>

          <Image
            src={'https://picsum.photos/100/100'}
            width={0}
            height={0}
            sizes="100"
            style={{ width: '80%', height: 'auto' }}
            alt={'image alt text'}
            className="mx-auto rounded-lg mb-10"
          />

          {post.abstract && (
            <div className="text-lg leading-8 mb-5">
              <p className="text-lg font-semibold">Abstract</p>
              <div dangerouslySetInnerHTML={{ __html: post?.abstract || '' }} />
            </div>
          )}

          {post.methodology && (
            <div className="flex text-lg leading-8 mb-1 ">
              <p className="text-lg font-semibold mr-2">Methodology: </p>
              <p>{post?.methodology}</p>
            </div>
          )}
          {post.potentialAppl && (
            <div className="flex text-lg leading-8 mb-1">
              <p className="text-lg font-semibold mr-2">Potential Applications: </p>
              <p>{post?.potentialAppl}</p>
            </div>
          )}
          {post.projectGoals && (
            <div className="flex text-lg leading-8 mb-5">
              <p className="text-lg font-semibold mr-2">Project Goals: </p>
              <p>{post?.projectGoals}</p>
            </div>
          )}

          <div className="text-lg leading-8">
            <div dangerouslySetInnerHTML={{ __html: post?.content || '' }} />
          </div>

          {post.labels.map((postLabel) => (
            <span
              key={`${postLabel.postId}_${postLabel.labelId}`}
              className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
            >
              {postLabel.label.name}
            </span>
          ))}
        </div>
      </div>
    )
  );
}
