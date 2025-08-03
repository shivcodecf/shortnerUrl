import React, { useState, useEffect } from "react";
import GetAlluserUrl from "./GetAlluserUrl";



const ShortenerUrl = () => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [clicks, setClicks] = useState([]);
  const [createdAt, setCreatedAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (originalUrl.trim() === "") {
      setShortUrl("");
      setClicks([]);
      setCreatedAt("");
      setError("");
    }
  }, [originalUrl]);

 



  // Function to shorten the URL


  const shortenUrl = async (originalUrl) => {
    const res = await fetch("http://localhost:8000/shorten", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ originalUrl }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText);
    }

     

    const data = await res.json();
    return data.shortUrl;
  };

  const fetchUrlStats = async (shortUrl) => {
    const parts = shortUrl.split("/");
    const shortId = parts[parts.length - 1];

    const res = await fetch(`http://localhost:8000/stats/${shortId}`, {
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch stats");
    }

    

    return await res.json();
  };

  const handleShorten = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setShortUrl("");
    setClicks([]);
    setCreatedAt("");

    try {
      const shortened = await shortenUrl(originalUrl);
      setShortUrl(shortened);

      const stats = await fetchUrlStats(shortened);
      setClicks(stats.clicks);
      setCreatedAt(new Date(stats.createdAt).toLocaleString());
      
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="max-w-xl mx-auto mt-12 p-6 bg-white rounded-2xl shadow-md">
      <h1 className="text-4xl font-extrabold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 drop-shadow-md animate-pulse">
  🔗 Smart URL Shortener
</h1>


        <form onSubmit={handleShorten} className="flex flex-col space-y-4">
          <input
            type="url"
            placeholder="Enter a long URL..."
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className={`relative inline-flex items-center justify-center px-6 py-2 overflow-hidden font-semibold text-white transition duration-300 ease-out rounded-md shadow-md disabled:opacity-50 disabled:cursor-not-allowed
    ${
      loading
        ? "bg-gray-700"
        : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-purple-600 hover:to-indigo-500"
    }`}
          >
            {loading ? (
              <>
                <svg
                  className="w-4 h-4 mr-2 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Shortening...
              </>
            ) : (
              "Shorten URL"
            )}
          </button>
        </form>

        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

        {shortUrl && originalUrl && (
          <div className="mt-6 text-center">
            <p className="text-green-600 font-medium">Shortened URL:</p>
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline break-all"
            >
              {shortUrl}
            </a>

            <div className="mt-4 text-sm text-gray-700">
              <p className="font-medium">Total Clicks: {clicks?.length || 0}</p>
              <p className="text-gray-700">Created At: {createdAt}</p>
            </div>
          </div>
        )}
      </div>
      <div className="w-1/2 text-center mx-auto mt-8">
        <GetAlluserUrl />
      </div>
    </div>
  );
};

export default ShortenerUrl;
