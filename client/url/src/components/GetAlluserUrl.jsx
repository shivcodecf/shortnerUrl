import axios from 'axios';
import React, { useState, useEffect } from 'react';

const GetAllUserUrl = () => {
  const [urls, setUrls] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10); // how many records per page

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/getAll?page=${currentPage}&limit=${5}`, {
          withCredentials: true,
        });

        setUrls(response.data.urls); // assuming backend sends: { urls: [], totalPages: X }
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error('Error fetching URLs:', error.response?.data || error.message);
      }
    };

    fetchUrls();
  }, [currentPage, limit]);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="w-full p-4 ">
      <div className="overflow-x-auto">
        <table className="table-auto w-full text-left border border-gray-300 rounded-lg">
          <thead className="bg-gray-100 text-gray-700 text-sm uppercase tracking-wide">
            <tr>
              <th className="px-4 py-3 border">Created</th>
              <th className="px-4 py-3 border">Original URL</th>
              <th className="px-4 py-3 border">Short URL</th>
              <th className="px-4 py-3 border">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {urls.map((url) => (
              <tr key={url._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 border">{new Date(url.createdAt).toLocaleString()}</td>
                <td className="px-4 py-3 border break-all text-blue-400">{url.originalUrl}</td>
                <td className="px-4 py-3 border break-all text-blue-600 underline">
                  <a href={url.shortUrl} target="_blank" rel="noopener noreferrer">
                    {url?.shortId}
                  </a>
                </td>
                <td className="px-4 py-3 border text-center cursor-pointer">
                  <button
                    onClick={() => navigator.clipboard.writeText(url?.shortId)}
                    className="text-sm text-white bg-black hover:bg-gray-800 px-3 py-1 rounded"
                  >
                    Copy
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
    {/* Pagination Controls */}
<div className="flex justify-center items-center gap-4 mb-20">
  <button
    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
    disabled={currentPage === 1}
    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
  >
    Previous
  </button>

  <span className="text-gray-600">
    Page {currentPage} of {totalPages}
  </span>

  <button
    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
    disabled={currentPage === totalPages}
    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
  >
    Next
  </button>
</div>

    </div>
  );
};

export default GetAllUserUrl;
