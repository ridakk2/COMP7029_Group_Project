// Parent component
'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { I_post } from '../app/api/posts/route';
import { UserIcon, EnvelopeIcon } from '@heroicons/react/20/solid';
import Button from './components/button';
import Image from 'next/image';

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

const getUserLink = (user: { id: number; firstName: string; lastName: string }) => {
  return `${user.id}-${user.firstName}-${user.lastName}`.toLowerCase();
};

export default function Home() {
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<(I_post & { date: string; datetime: string })[]>([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`/api/posts`);
      if (!response.ok) {
        throw new Error('Failed to search posts by labels');
      }
      const data = await response.json();

      setPosts(
        data.results.map((post: I_post) => {
          const [shortFormat, longFormat] = formatDate(post.createdAt);

          return {
            ...post,
            date: longFormat,
            datetime: shortFormat,
          };
        }),
      );
    }

    fetchData();
  }, []);

  async function handleSearch(event: React.MouseEvent<HTMLElement>) {
    event.preventDefault();

    // Parse URL parameters to extract labels
    const labels = searchInput.split(',').map((label) => label.trim());

    // Check if labels parameter exists
    if (!labels) {
      return alert('Labels parameter is required');
    }

    setLoading(true);

    try {
      // Perform search in the database based on labels
      const response = await fetch(`/api/posts?labels=${labels}`);
      if (!response.ok) {
        throw new Error('Failed to search posts by labels');
      }
      const data = await response.json();

      setLoading(false);

      setPosts(
        data.results.map((post: I_post) => {
          const [shortFormat, longFormat] = formatDate(post.createdAt);

          return {
            ...post,
            date: longFormat,
            datetime: shortFormat,
          };
        }),
      );
    } catch (error) {
      setLoading(false);

      console.error('Error searching posts by labels:', error);
      // Handle error
    }
  }

  return (
    <div className="bg-white py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
        <div className="bg-white py-8 px-5 top-0 left-0 right-0 ml-0">
          <div className="flex items-center justify-center mb-10">
            <Image width={640} height={480} src="/keyboard.jpg" alt="keybord picture" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-6xl">Oxford Brookes Tech Seeds</h2>

          <p className="mt-2 text-lg leading-8 text-gray-600">
            Research in the Faculty of TDE is based around powerful well led research groupings that benefit from the
            high level complementary skills and expertise of their members. Find the tech seeds for innovation here.
          </p>
        </div>

        <div className="flex justify-center mt-6">
          <div className="flex items-center w-4/5">
            <input
              type="text"
              placeholder="Enter search terms separated by commas"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="border-gray-300 focus:ring-brookes-60 focus:border-brookes-60 block w-4/5 rounded-md sm:text-sm border p-2"
            />
            <div className="ml-1">
              <Button disabled={false} loading={loading} text="Search" onClick={handleSearch} />
            </div>
          </div>
        </div>
        <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.id} href={`/post/${post.slug}`}>
              <article key={post.id} className="flex max-w-xl flex-col items-start justify-between">
                <div className="flex items-center gap-x-4 text-xs mb-2">
                  <time dateTime={post.datetime} className="text-gray-500 py-2">
                    {post.date}
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
                  {/* <i  alt="IMG"></i> */}
                  <Image
                    width={300}
                    height={400}
                    src={`https://picsum.photos/300/400?random=${post.id}`}
                    alt="Brookeslogo"
                    className="max-h-32 inline-block mt-1"
                  />
                  <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                    <a>
                      <span className="absolute inset-0" />
                      {post.title}
                    </a>
                  </h3>
                  <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
                    <div dangerouslySetInnerHTML={{ __html: post.content }} />
                  </p>
                </div>
                <div className="relative mt-8 flex items-center gap-x-4">
                  <Link href={`/user/${getUserLink(post.author)}`}>
                    <UserIcon className="h-10 w-10 drop-shadow-lg" color="gray" />
                  </Link>
                  <div className="text-sm leading-6">
                    <p className="font-semibold text-gray-900">
                      <Link href={`/user/${getUserLink(post.author)}`}>
                        <span className="absolute inset-0" />
                        {post.author.firstName} {post.author.lastName}
                      </Link>
                    </p>
                  </div>
                  <a href={`mailto:${post.author.email}`}>
                    <EnvelopeIcon className="w-4 h-4 drop-shadow-lg" />
                  </a>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
