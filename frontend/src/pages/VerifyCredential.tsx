import React, { useState } from 'react';
import { api, Credential, VerifyResponse } from '../api';

const VerifyCredential: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [response, setResponse] = useState<VerifyResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      let credentialData: Credential | { id: string };
      
      // Try to parse as JSON first
      try {
        const parsed = JSON.parse(input);
        credentialData = parsed;
      } catch {
        // If not JSON, treat as ID
        credentialData = { id: input };
      }

      const result = await api.verifyCredential(credentialData);
      setResponse(result);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to verify credential');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Verify Credential</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="credential" className="block text-sm font-medium text-gray-700 mb-2">
                  Credential ID or JSON
                </label>
                <textarea
                  id="credential"
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter credential ID or full JSON..."
                />
                <p className="mt-2 text-sm text-gray-500">
                  You can enter either a credential ID (string) or the full credential JSON.
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Verifying...
                    </>
                  ) : (
                    'Verify Credential'
                  )}
                </button>
              </div>
            </form>

            {error && (
              <div className="mt-6 bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <div className="mt-2 text-sm text-red-700">{error}</div>
                  </div>
                </div>
              </div>
            )}

            {response && (
              <div className={`mt-6 border rounded-md p-4 ${
                response.valid 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex">
                  <div className="flex-shrink-0">
                    {response.valid ? (
                      <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="ml-3">
                    <h3 className={`text-sm font-medium ${
                      response.valid ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {response.valid ? 'Credential Valid' : 'Credential Invalid'}
                    </h3>
                    <div className={`mt-2 text-sm ${
                      response.valid ? 'text-green-700' : 'text-red-700'
                    }`}>
                      <p><strong>Status:</strong> {response.valid ? 'Valid' : 'Invalid'}</p>
                      {response.worker && <p><strong>Worker:</strong> {response.worker}</p>}
                      {response.issuedAt && <p><strong>Issued At:</strong> {new Date(response.issuedAt).toLocaleString()}</p>}
                      {response.data && (
                        <div className="mt-2">
                          <p><strong>Credential Data:</strong></p>
                          <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                            {JSON.stringify(response.data, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyCredential;
