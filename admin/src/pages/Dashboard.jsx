import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAdminToken = async () => {
      const token = localStorage.getItem("admin_token");

      const req = await fetch("http://localhost:5000/api/admin/verifytoken", {
        method: "POST",
        body: JSON.stringify({ token }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const res = await req.json();
      if (!res.success) {
        alert(`Authentication Error : ${res.message}`);
        navigate("/");
      }
    };

    verifyAdminToken();
  }, [navigate]);

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="ml-64 flex-1 bg-gray-100 min-h-screen p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Wheelzy Dashboard Overview</h1>

        {/* Quick Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            onClick={() => navigate("/vehicles")}
            className="bg-blue-500 hover:bg-blue-400 cursor-pointer rounded-xl shadow-lg p-6 text-white flex flex-col items-center justify-center"
          >
            <h2 className="text-xl font-bold">Manage Vehicles</h2>
            <p className="text-sm opacity-90">View & Delete Vehicles</p>
          </div>

          <div
            onClick={() => navigate("/users")}
            className="bg-green-500 hover:bg-green-400 cursor-pointer rounded-xl shadow-lg p-6 text-white flex flex-col items-center justify-center"
          >
            <h2 className="text-xl font-bold">Manage Users</h2>
            <p className="text-sm opacity-90">View, Edit & Delete Users</p>
          </div>

          <div
            onClick={() => navigate("/requests")}
            className="bg-purple-500 hover:bg-purple-400 cursor-pointer rounded-xl shadow-lg p-6 text-white flex flex-col items-center justify-center"
          >
            <h2 className="text-xl font-bold">Manage Requests</h2>
            <p className="text-sm opacity-90">View & Delete Requests</p>
          </div>
        </div>
      </div>
    </div>
  );
}
