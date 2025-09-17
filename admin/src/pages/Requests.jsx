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
        <h1 className="text-3xl font-extrabold mb-8 text-gray-800">
          📩 Manage Requests
        </h1>

        {loading ? (
          <p className="text-gray-600">Loading requests...</p>
        ) : requests.length === 0 ? (
          <p className="text-gray-600">No requests found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {requests.map((req) => (
              <div
                key={req.request_id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition transform hover:-translate-y-1"
              >
                {/* Vehicle Image */}
                <div className="relative">
                  <img
                    src={req.vehicle_image}
                    alt={req.vehicle_title}
                    className="w-full h-52 object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <h2 className="text-xl font-bold text-white drop-shadow">
                      {req.vehicle_title}
                    </h2>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  {/* Two columns: Owner & Requester */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-indigo-600">
                        Vehicle Owner
                      </h3>
                      <p className="text-gray-700">
                        <strong>Name:</strong> {req.owner_name}
                      </p>
                      <p className="text-gray-700">
                        <strong>Email:</strong> {req.owner_email}
                      </p>
                      <p className="text-gray-700">
                        <strong>Phone:</strong> {req.owner_phone}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-green-600">
                        Requested By
                      </h3>
                      <p className="text-gray-700">
                        <strong>Name:</strong> {req.requester_name}
                      </p>
                      <p className="text-gray-700">
                        <strong>Email:</strong> {req.requester_email}
                      </p>
                      <p className="text-gray-700">
                        <strong>Phone:</strong> {req.requester_phone}
                      </p>
                    </div>
                  </div>

                  {/* Request Info */}
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <h3 className="font-semibold text-gray-800 mb-2">
                      Request Info
                    </h3>
                    <p className="text-gray-700">
                      <strong>Message:</strong> {req.message}
                    </p>
                    <p className="text-gray-700">
                      <strong>Contact:</strong> {req.contact}
                    </p>
                  </div>

                  {/* Delete Button */}
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleDelete(req.request_id)}
                      className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition shadow-md"
                    >
                      🗑️ Delete
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
