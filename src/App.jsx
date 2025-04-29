import { useState } from 'react';

function App() {
  const [emailContent, setemailContent] = useState('');
  const [tone, setTone] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:8080/api/email/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailContent, tone }),
      });
      const data = await response.text();
      setGeneratedReply(data);
    } catch (err) {
      setError('Failed to generate the email reply!');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedReply);
    setCopied(true);
    setTimeout(() => {
      setCopied(false); 
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-3xl p-10 border border-gray-200">
        <h1 className="text-3xl font-extrabold text-center text-red-500 mb-8">
          ✉️ MailMorph
        </h1>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Original Email Content
          </label>
          <textarea
            className="w-full h-40 p-4 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 placeholder-gray-400"
            placeholder="Paste your email content here..."
            value={emailContent}
            onChange={(e) => setemailContent(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Choose Tone (Optional)
          </label>
          <select
            className="w-full p-3 rounded-xl border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
          >
            <option value="">Select a tone</option>
            <option value="professional">Professional</option>
            <option value="friendly">Friendly</option>
            <option value="casual">Casual</option>
          </select>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!emailContent || loading}
          className={`w-full py-3 rounded-xl text-white font-semibold shadow-sm transition-all duration-200 ${
            loading || !emailContent
              ? 'bg-blue-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Generating Reply...' : 'Generate Reply'}
        </button>

        {error && (
          <p className="mt-4 text-center text-sm text-red-600 font-medium">
            {error}
          </p>
        )}

        {generatedReply && (
          <div className="mt-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              ✅ Generated Reply
            </h2>
            <textarea
              className="w-full h-40 p-4 rounded-xl border border-gray-300 bg-gray-100 text-gray-700 resize-none"
              value={generatedReply}
              readOnly
            />
            <button
              onClick={(handleCopy)}
              className="mt-4 w-full py-2 rounded-xl border border-blue-600 text-blue-600 font-medium hover:bg-blue-50 transition-all duration-200"
            >
              📋 Copy to Clipboard
            </button>

            {copied && (
              <div className="fixed bottom-16 right-10 bg-green-400 text-white py-2 px-4 rounded-lg shadow-lg text-sm">
                Reply copied to clipboard!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;


// Alternate UI

/*
import { useState } from 'react';

function App() {
  const [content, setContent] = useState('');
  const [tone, setTone] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:8080/api/email/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, tone }),
      });
      const data = await response.text();
      setGeneratedReply(data);
    } catch (err) {
      setError('Failed to generate the email reply!');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
          ✉️ Email Reply Generator
        </h1>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Original Email Content
          </label>
          <textarea
            className="w-full border border-gray-300 rounded-lg p-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            rows="6"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste your email here..."
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Tone (Optional)
          </label>
          <select
            className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
          >
            <option value="">None</option>
            <option value="professional">Professional</option>
            <option value="friendly">Friendly</option>
            <option value="casual">Casual</option>
          </select>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!content || loading}
          className={`w-full py-3 rounded-lg font-medium text-white transition ${
            loading || !content
              ? 'bg-blue-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Generating...' : 'Generate Reply'}
        </button>

        {error && (
          <p className="text-red-600 text-sm mt-4 text-center">{error}</p>
        )}

        {generatedReply && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              ✅ Generated Reply
            </h2>
            <textarea
              className="w-full border border-gray-300 rounded-lg p-4 text-gray-800 resize-none bg-gray-50"
              rows="6"
              value={generatedReply}
              readOnly
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(generatedReply);
                alert('Reply copied to clipboard!');
              }}
              className="mt-4 px-6 py-2 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 transition"
            >
              📋 Copy to Clipboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
*/