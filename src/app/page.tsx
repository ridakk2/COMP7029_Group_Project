// Parent component
'use client';

import { useState, FormEvent, useEffect } from 'react';
import { I_post } from '../app/api/posts/route';
import { UserIcon } from '@heroicons/react/20/solid';

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

export default function Home() {
  const [searchInput, setSearchInput] = useState('');
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
          const [shortFormat, longFormat] = formatDate('2024-02-24T21:35:23.106Z');

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

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Parse URL parameters to extract labels
    const labels = searchInput.split(',').map((label) => label.trim());

    // Check if labels parameter exists
    if (!labels) {
      return alert('Labels parameter is required');
    }

    try {
      // Perform search in the database based on labels
      const response = await fetch(`/api/posts?labels=${labels}`);
      if (!response.ok) {
        throw new Error('Failed to search posts by labels');
      }
      const data = await response.json();

      setPosts(
        data.results.map((post: I_post) => {
          const [shortFormat, longFormat] = formatDate('2024-02-24T21:35:23.106Z');

          return {
            ...post,
            date: longFormat,
            datetime: shortFormat,
          };
        }),
      );
    } catch (error) {
      console.error('Error searching posts by labels:', error);
      // Handle error
    }
  }

  return (
    <main>
      <div className="bg-gray-200 py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
          <div className="bg-yellow-500 py-8 px-5 top-0 left-0 right-0 ml-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-6xl">TDE Research Blog</h2>
            <p className="mt-2 text-lg leading-8 text-gray-600">
              Research in the Faculty of TDE is based around powerful well led research groupings that benefit from the
              high level complementary skills and expertise of their members.
            </p>
          </div>

          <form onSubmit={handleSearch} className="mt-6">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Enter search terms separated by commas"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 block w-4/5 rounded-md sm:text-sm border p-2"
              />
              <button
                type="submit"
                className="bg-brookes flex justify-center rounded-md w-1/5 mx-1 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 text-bigwhite"
              >
                Search
              </button>
            </div>
          </form>
          <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {posts.map((post) => (
              <article key={post.id} className="flex max-w-xl flex-col items-start justify-between">
                <div className="flex items-center gap-x-4 text-xs">
                  <time dateTime={post.datetime} className="text-gray-500">
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
                  <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                    <a>
                      <span className="absolute inset-0" />
                      {post.title}
                    </a>
                  </h3>
                  <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">{post.content}</p>
                </div>
                <div className="relative mt-8 flex items-center gap-x-4">
                  <UserIcon className="h-10 w-10 rounded-full bg-gray-50" />
                  <div className="text-sm leading-6">
                    <p className="font-semibold text-gray-900">
                      <a>
                        <span className="absolute inset-0" />
                        {post.author.firstName} {post.author.lastName}
                      </a>
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
