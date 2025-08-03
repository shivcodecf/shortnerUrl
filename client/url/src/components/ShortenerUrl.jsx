import React, { useState, useEffect } from "react";

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

  const handleShorten = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setShortUrl("");
    setClicks([]);
    setCreatedAt("");

    try {
      const res = await fetch("http://localhost:8000/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalUrl }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }

      const data = await res.json();
      setShortUrl(data.shortUrl);

      const parts = data.shortUrl.split("/");
      const shortId = parts[parts.length - 1];

      const statsRes = await fetch(`http://localhost:8000/stats/${shortId}`);
      if (!statsRes.ok) {
        throw new Error("Failed to fetch stats");
      }

      const statsData = await statsRes.json();
      setClicks(statsData.clicks);
      setCreatedAt(new Date(statsData.createdAt).toLocaleString());
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-12 p-6 bg-white rounded-2xl shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
        🔗 URL Shortener
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
          className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Shortening..." : "Shorten URL"}
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
            <p>Total Clicks: {clicks?.length || 0}</p>
            <p>Created At: {createdAt}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShortenerUrl;
