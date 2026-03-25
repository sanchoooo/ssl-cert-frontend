"use client";

import { useState } from 'react';

interface ConfigurationProps {
  onMonitorAdded: () => void;
}

export default function Configuration({ onMonitorAdded }: ConfigurationProps) {
  const [target, setTarget] = useState('');
  const [type, setType] = useState('domain');
  const [ports, setPorts] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await fetch('/api/monitors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, target, ports }),
      });

      const result = await response.json();
      setSubmitMessage(result.message);

      if (response.ok) {
        setTarget('');
        setPorts('');
        onMonitorAdded(); // Refresh the list in the parent component
      }
    } catch (error) {
      setSubmitMessage('An error occurred while adding the monitor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Monitor Type
        </label>
        <select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-600"
        >
          <option value="domain">Domain</option>
          <option value="ip">IP Address</option>
          <option value="cidr">CIDR Range</option>
        </select>
      </div>

      <div>
        <label htmlFor="target" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {type === 'domain' ? 'Domain' : type === 'ip' ? 'IP Address' : 'CIDR Range'}
        </label>
        <input
          type="text"
          id="target"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-600"
        />
      </div>

      <div>
        <label htmlFor="ports" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Ports (comma-separated)
        </label>
        <input
          type="text"
          id="ports"
          value={ports}
          onChange={(e) => setPorts(e.target.value)}
          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-600"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {isSubmitting ? 'Adding...' : 'Add Monitor'}
      </button>

      {submitMessage && <p>{submitMessage}</p>}
    </form>
  );
}
