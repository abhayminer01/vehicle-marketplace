// components/Sidebar.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Users, Car, ClipboardList, LayoutDashboard } from "lucide-react";

export default function Sidebar({ onNavigate, active }) {
  const navigateHook = useNavigate();
  const location = useLocation();

  // ✅ Use either the passed `onNavigate` or the default hook
  const navigateFn = onNavigate || navigateHook;

  const menuItems = [
    { label: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { label: "Users", path: "/users", icon: <Users size={20} /> },
    { label: "Vehicles", path: "/vehicles", icon: <Car size={20} /> },
    { label: "Requests", path: "/requests", icon: <ClipboardList size={20} /> },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white h-screen fixed top-0 left-0 flex flex-col shadow-lg">
      <div className="p-6 text-center text-xl font-bold border-b border-gray-700">
        Wheelzy Admin Panel
      </div>
      <div className="flex-1">
        {menuItems.map((item) => {
          const isActive =
            active === item.label.toLowerCase() || location.pathname === item.path;

          return (
            <div
              key={item.path}
              onClick={() => navigateFn(item.path)}
              className={`flex items-center gap-3 px-6 py-3 cursor-pointer hover:bg-gray-700 transition ${
                isActive ? "bg-gray-700" : ""
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </div>
          );
        })}
      </div>
      <div className="p-4 border-t border-gray-700 text-center text-sm text-gray-400">
        © 2025 Admin
      </div>
    </div>
  );
}
