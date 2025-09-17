import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

export default function Requests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/requests");
        const data = await res.json();
        setRequests(data.requests || []);
      } catch (err) {
        console.error("Error fetching requests:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // ✅ Delete request
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this request?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/admin/requests/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        alert("Request deleted successfully!");
        setRequests(requests.filter((r) => r.request_id !== id));
      } else {
        alert(data.message || "Failed to delete request.");
      }
    } catch (err) {
      console.error("Error deleting request:", err);
      alert("Error deleting request.");
    }
  };

  return (
    <div className="flex">
      {/* ✅ Sidebar always visible */}
      <Sidebar active="requests" onNavigate={navigate} />

      {/* ✅ Main Content */}
      <div className="flex-1 bg-gray-100 min-h-screen p-6 ml-64">
        <h1 className="text-2xl font-bold mb-6">Manage Requests</h1>

        {loading ? (
          <p className="text-gray-600">Loading requests...</p>
        ) : requests.length === 0 ? (
          <p className="text-gray-600">No requests found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {requests.map((req) => (
              <div
                key={req.request_id}
                className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-200 flex flex-col"
              >
                {/* Vehicle Section */}
                <div className="relative">
                  <img
                    src={req.vehicle_image}
                    alt={req.vehicle_title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute bottom-0 bg-black bg-opacity-50 w-full p-2 text-white">
                    <h2 className="text-lg font-semibold">{req.vehicle_title}</h2>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  {/* Vehicle Owner */}
                  <div>
                    <h3 className="font-bold text-gray-800">Vehicle Owner</h3>
                    <p><strong>Name:</strong> {req.owner_name}</p>
                    <p><strong>Email:</strong> {req.owner_email}</p>
                    <p><strong>Phone:</strong> {req.owner_phone}</p>
                  </div>

                  {/* Requester */}
                  <div className="mt-4">
                    <h3 className="font-bold text-gray-800">Requested By</h3>
                    <p><strong>Name:</strong> {req.requester_name}</p>
                    <p><strong>Email:</strong> {req.requester_email}</p>
                    <p><strong>Phone:</strong> {req.requester_phone}</p>
                  </div>

                  {/* Request Info */}
                  <div className="mt-4">
                    <h3 className="font-bold text-gray-800">Request Info</h3>
                    <p><strong>Message:</strong> {req.message}</p>
                    <p><strong>Contact:</strong> {req.contact}</p>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => handleDelete(req.request_id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
