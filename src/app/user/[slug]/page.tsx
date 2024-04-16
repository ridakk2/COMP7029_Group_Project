import Image from 'next/image';
import prisma from '../../../../lib/prisma';
import Link from 'next/link';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);

  // Format as yyyy-mm-dd
  const formattedDate = date.toISOString().split('T')[0];

  // Format as Month dd, yyyy
  const formattedDateLong = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).format(date);

  return [formattedDate, formattedDateLong];
};

export default async function Post({ params }: { params: { slug: string } }) {
  const [userId] = params.slug.split('-');

  const user = await prisma.user.findFirst({
    where: {
      id: parseInt(userId, 10),
    },
    include: {
      Profile: true,
    },
  });
  const posts = await prisma.post.findMany({
    where: {
      authorId: parseInt(userId, 10),
    },
    include: {
      labels: {
        include: {
          label: true,
        },
      },
    },
  });

  const [userProfile] = user?.Profile || [];

  return (
    <div className="min-h-screen flex justify-center bg-white">
      <div className="max-w-3xl w-full px-4 py-8">
        <div className="grid grid-cols-6 gap-4">
          <div className="col-start-1 col-span-4 ...">
            <div className="flex justify-left font-bold text-2xl">
              <p>
                {userProfile?.title} {user?.firstName} {user?.lastName}
              </p>
            </div>
            <div className="mx-auto mt-8 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-8 border-t border-gray-200 pt-10 sm:mt-8 sm:pt-8 lg:mx-0 lg:max-w-none">
              {posts.map((post) => {
                // @ts-ignore
                const [shortFormat, longFormat] = formatDate(post.createdAt);

                return (
                  <Link key={post.id} href={`/post/${post.slug}`}>
                    <article key={post.id} className="flex max-w-xl flex-col items-start justify-between">
                      <div className="flex items-center gap-x-4 text-xs">
                        <time dateTime={shortFormat} className="text-gray-500">
                          {longFormat}
                        </time>
                        {post.labels.map((postLabel) => (
                          <span
                            key={`${postLabel.postId}_${postLabel.labelId}`}
                            className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
                          >
                            {postLabel.label.name}
                          </span>
                        ))}
                      </div>
                      <div className="group relative">
                        <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                          <a>
                            <span className="absolute inset-0" />
                            {post.title}
                          </a>
                        </h3>
                        <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
                          <div dangerouslySetInnerHTML={{ __html: post.content || '' }} />
                        </p>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="col-start-5 col-span-2">
            <div className="flex justify-center">
              <Image
                width={0}
                height={0}
                sizes="100"
                src="https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250"
                className="h-20 w-20 rounded-full"
                alt="User Icon"
              />
            </div>

            <div className="flex justify-center mt-5 font-semibold">
              <p>
                {userProfile?.title} {user?.firstName} {user?.lastName}
              </p>
            </div>

            {userProfile.description && (
              <div className="text-justify mt-5">
                <p>{userProfile.description}</p>
              </div>
            )}

            {userProfile.organizations && (
              <div className="mt-5">
                <p>{userProfile.organizations}</p>
              </div>
            )}

            {userProfile.publications && (
              <div className="mt-5">
                <p>{userProfile.publications}</p>
              </div>
            )}

            <div className="flex flex-row mt-5">
              {userProfile.twitterUrl && (
                <a href={userProfile.twitterUrl} className="ml-6 text-gray-400 hover:text-gray-500">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              )}
              {userProfile.linkedinUrl && (
                <a href={userProfile.linkedinUrl} className="ml-6 text-gray-400 hover:text-gray-500">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              )}
              {userProfile.githubUrl && (
                <a href={userProfile.githubUrl} className="ml-6 text-gray-400 hover:text-gray-500">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      fill-rule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </a>
              )}
              {userProfile.mediumUrl && (
                <a href={userProfile.mediumUrl} className="ml-6 text-gray-400 hover:text-gray-500">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M6 2C3.79086 2 2 3.79086 2 6V18C2 20.2091 3.79086 22 6 22H18C20.2091 22 22 20.2091 22 18V6C22 3.79086 20.2091 2 18 2H6ZM4 6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6ZM7 7C6.44772 7 6 7.44772 6 8C6 8.55228 6.44772 9 7 9V15C6.44772 15 6 15.4477 6 16C6 16.5523 6.44772 17 7 17H8H9C9.55228 17 10 16.5523 10 16C10 15.4477 9.55228 15 9 15V11.3028L11.1679 14.5547C11.3534 14.8329 11.6656 15 12 15C12.3344 15 12.6466 14.8329 12.8321 14.5547L15 11.3028V15C14.4477 15 14 15.4477 14 16C14 16.5523 14.4477 17 15 17H16H17C17.5523 17 18 16.5523 18 16C18 15.4477 17.5523 15 17 15V9C17.5523 9 18 8.55228 18 8C18 7.44772 17.5523 7 17 7H16C15.6656 7 15.3534 7.1671 15.1679 7.4453L12 12.1972L8.83205 7.4453C8.64658 7.1671 8.33435 7 8 7H7Z"
                    />
                  </svg>
                </a>
              )}
              {user?.email && (
                <a href={user.email} className="ml-6 text-gray-400 hover:text-gray-500">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M3.75 5.25L3 6V18L3.75 18.75H20.25L21 18V6L20.25 5.25H3.75ZM4.5 7.6955V17.25H19.5V7.69525L11.9999 14.5136L4.5 7.6955ZM18.3099 6.75H5.68986L11.9999 12.4864L18.3099 6.75Z"
                    />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
