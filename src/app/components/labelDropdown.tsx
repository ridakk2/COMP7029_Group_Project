import { Fragment, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

const people = [
  { id: 1, name: 'Ai' },
  { id: 2, name: 'Machine Learning' },
  { id: 3, name: 'Data Science' },
  { id: 4, name: 'Productivity' },
  { id: 5, name: 'Health' },
];

type label = {
  id: number;
  name: string;
};

interface Props {
  // eslint-disable-next-line no-unused-vars
  onChange: (e: label[]) => void;
}

export default function LabelDropdown({ onChange }: Props) {
  const [selectedLabels, setSelectedLabels] = useState<label[]>([]);

  function handleLabelSelect(labels: label[]) {
    setSelectedLabels(labels);
    onChange(labels);
  }

  return (
    <div>
      <Listbox value={selectedLabels} onChange={handleLabelSelect} multiple>
        <div className="relative mt-1 w-fit">
          <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
            <span className="block truncate">Labels</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </span>
          </Listbox.Button>
          <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
            <Listbox.Options className=" mt-1 w-fit max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
              {people.map((label, labelIdx) => (
                <Listbox.Option
                  key={labelIdx}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                    }`
                  }
                  value={label}
                >
                  {({ selected }) => (
                    <>
                      <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{label.name}</span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
