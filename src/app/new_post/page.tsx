'use client'  

import {FormEvent} from "react";

export default function newPost() {

  async function handleOnClick(event: FormEvent,<HTMLFormElement>){
    event.preventDefault();

    const formData = new FormData(event?.currentTarget);
    const title = formData.get("title");
    const content = formData.get("content");

    await fetch("/api/post", {
      method: "POST",
      body: JSON.stringify({title, content})
    });

  }

  return (
    <form onSubmit = {handleOnClick}>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-lg">
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base font-semibold leading-7 text-gray-900">New Post</h2>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-8">
                  <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
                    Title
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-lg">
                      <input
                        type="text"
                        name="title"
                        id="title"
                        autoComplete="title"
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-8">
                  <label htmlFor="content" className="block text-sm font-medium leading-6 text-gray-900">
                    content
                  </label>
                  <div className="mt-2">
                    <textarea
                      id="content"
                      name="content"
                      rows={15}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      defaultValue={''}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-x-6">
        <button type="button" className="rounded-md bg-gray-300 px-3 py-2 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-200">
          Cancel
        </button>
        <button
          onClick={handleOnClick}
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Save
        </button>
      </div>
    </form>
    )
  }


