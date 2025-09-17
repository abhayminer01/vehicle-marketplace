import React, { useEffect, useState } from "react";

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <p>Loading vehicles...</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1 className="font-bold text-2xl">Manage Vehicles</h1>
      {vehicles.length === 0 ? (
        <p>No vehicles found.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          {vehicles.map((v) => (
            <div
              key={v.vehicle_id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "10px",
                padding: "15px",
                backgroundColor: "#fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <img
                src={v.image || "https://via.placeholder.com/250x150"}
                alt={v.title}
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
              <h2 style={{ fontSize: "18px", margin: "10px 0 5px" }}>
                {v.title}
              </h2>
              <p style={{ margin: "5px 0", fontWeight: "bold", color: "green" }}>
                ₹{v.price?.toLocaleString()}
              </p>
              <p style={{ margin: "5px 0" }}>
                <strong>Year:</strong> {v.year}
              </p>
              <p style={{ margin: "5px 0" }}>
                <strong>Location:</strong> {v.location}
              </p>
              <p style={{ margin: "5px 0" }}>
                <strong>Status:</strong>{" "}
                <span
                  style={{
                    color: v.status === "available" ? "green" : "red",
                    fontWeight: "bold",
                  }}
                >
                  {v.status}
                </span>
              </p>

              {/* ✅ Delete Button */}
              <button
                onClick={() => handleDelete(v.vehicle_id)}
                style={{
                  marginTop: "10px",
                  backgroundColor: "#e74c3c",
                  color: "white",
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
