'use client';

import { useState } from 'react';

export default function MakeAdminPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const makeAdmin = async () => {
    if (!email.trim()) {
      alert('Please enter an email address');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/admin/make-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await response.json();
      setResult(data);
    } catch {
      setResult({ error: 'Failed to make user admin' });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Make User Admin</h1>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">User Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            onClick={makeAdmin}
            disabled={loading}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Making Admin...' : 'Make Admin'}
          </button>
        </div>

        {result && (
          <div className="mt-6 p-4 rounded-md bg-gray-50">
            <pre className="text-sm text-gray-800 whitespace-pre-wrap">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-6 text-center">
          <a
            href="/admin/user"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Or manage users in Admin Panel →
          </a>
        </div>
      </div>
    </div>
  );
}