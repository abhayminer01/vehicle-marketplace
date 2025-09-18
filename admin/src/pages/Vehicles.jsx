import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar"; 
import { useNavigate } from "react-router-dom";

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getAllVehicles = async () => {
      try {
        const req = await fetch("http://localhost:5000/api/admin/vehicles", {
          method: "GET",
        });
        const res = await req.json();
        setVehicles(res.vehicles || []);
      } catch (err) {
        console.error("Error fetching vehicles:", err);
      } finally {
        setLoading(false);
      }
    };

    getAllVehicles();
  }, []);

  // ✅ Delete Vehicle
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vehicle?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/admin/vehicles/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        alert("Vehicle deleted successfully!");
        setVehicles(vehicles.filter((v) => v.vehicle_id !== id));
      } else {
        alert(data.message || "Failed to delete vehicle.");
      }
    } catch (err) {
      console.error("Error deleting vehicle:", err);
      alert("Error deleting vehicle.");
    }
  };

  // ✅ Approve / Decline Vehicle
  const handleApproval = async (id, status) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/vehicles/${id}/approve`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ approved: status }),
        }
      );
      const data = await res.json();

      if (data.success) {
        alert(`Vehicle ${status ? "approved" : "declined"} successfully!`);
        setVehicles(
          vehicles.map((v) =>
            v.vehicle_id === id ? { ...v, approved: status } : v
          )
        );
      } else {
        alert(data.message || "Failed to update vehicle approval.");
      }
    } catch (err) {
      console.error("Error updating approval:", err);
      alert("Error updating approval.");
    }
  };

  return (
    <div className="flex ml-65">
      {/* ✅ Sidebar */}
      <Sidebar onNavigate={navigate} active="vehicles" />

      {/* ✅ Main Content */}
      <div className="flex-1 bg-gray-100 min-h-screen p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Vehicles</h1>

        {loading ? (
          <p>Loading vehicles...</p>
        ) : vehicles.length === 0 ? (
          <p>No vehicles found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((v) => (
              <div
                key={v.vehicle_id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <img
                  src={v.image || "placeholder.webp"}
                  alt={v.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold">{v.title}</h2>
                  <p className="text-green-600 font-bold">
                    ₹{v.price?.toLocaleString()}
                  </p>
                  <p>
                    <strong>Year:</strong> {v.year}
                  </p>
                  <p>
                    <strong>Location:</strong> {v.location}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      className={
                        v.status === "available" ? "text-green-600" : "text-red-600"
                      }
                    >
                      {v.status}
                    </span>
                  </p>
                  <p>
                    <strong>Approved:</strong>{" "}
                    <span
                      className={
                        v.approved === "true" ? "text-green-600 font-semibold" : "text-red-600 font-semibold"
                      }
                    >
                      {v.approved === "true" ? "Yes" : "No"}
                    </span>
                  </p>

                  {/* ✅ Action Buttons */}
                  <div className="mt-4 flex flex-col gap-2">
                    {!v.approved === "true" ? (
                      <button
                        onClick={() => handleApproval(v.vehicle_id, false)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                      >
                        Decline
                      </button>
                    ) : (
                    <button
                        onClick={() => handleApproval(v.vehicle_id, true)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                      >
                        Approve
                      </button>
                      
                    )}

                    <button
                      onClick={() => handleDelete(v.vehicle_id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
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
