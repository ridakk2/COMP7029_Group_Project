'use client';

import React, { useState, useMemo } from 'react';
import 'react-quill/dist/quill.snow.css';
import { useUser } from '../contexts/user';
import dynamic from 'next/dynamic';
import LabelDropdown from '../components/labelDropdown';
import { useRouter } from 'next/navigation';
import Button from '../components/button';

export default function MyComponent() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [labels, setLabels] = useState<{ id: number; name: string }[]>([]);
  const ReactQuill = useMemo(() => dynamic(() => import('react-quill'), { ssr: false }), []);
  const { user } = useUser();
  const router = useRouter();

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  async function handleSubmit(event: React.MouseEvent<HTMLElement>) {
    event.preventDefault();

    setLoading(true);

    await fetch(`/api/users/${user.id}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
      body: JSON.stringify({ title, body, labels }),
    });

    setLoading(false);

    router.push('/');
  }

  return (
    <>
      <div className="flex flex-auto flex-col justify-center px-6 lg:px-8">
        <div className="m-10 sm:mx-auto w-2/3">
          <div>
            <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
              Title
            </label>
            <div className="mt-2">
              <input
                id="title"
                name="title"
                type="text"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brookes-60 sm:text-sm sm:leading-6"
                value={title}
                onChange={handleTitleChange}
              />
            </div>
          </div>

          <div className="mt-1 h-5/6">
            <ReactQuill theme="snow" value={body} onChange={setBody} style={{ height: '20rem' }} />
          </div>

          <div className="mt-10 pt-2">
            {labels.map((label) => (
              <span
                key={label.id}
                className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 mr-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
              >
                {label.name}
              </span>
            ))}
          </div>

          <div className="flex justify-end">
            <LabelDropdown onChange={setLabels}></LabelDropdown>
          </div>

          <div className="flex justify-end pt-5">
            <Button disabled={false} loading={loading} text="Submit" onClick={handleSubmit} />
          </div>
        </div>
      </div>
    </>
  );
}
