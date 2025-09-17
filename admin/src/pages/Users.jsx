import React, { useEffect, useState } from "react";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState(null); // ✅ track user being edited
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    password: "",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/users");
        const data = await res.json();
        setUsers(data.users || []);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // ✅ Delete User
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        alert("User deleted successfully!");
        setUsers(users.filter((u) => u.user_id !== id));
      } else {
        alert(data.message || "Failed to delete user.");
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Error deleting user.");
    }
  };

  // ✅ Open edit modal
  const handleEdit = (user) => {
    setEditUser(user);
    setFormData({
      fullname: user.full_name || "",
      email: user.email || "",
      phone: user.phone || "",
      password: "", // empty by default
    });
  };

  // ✅ Save user changes
  const handleSave = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${editUser.user_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success) {
        alert("User updated successfully!");
        setUsers(
          users.map((u) =>
            u.user_id === editUser.user_id ? { ...u, ...formData } : u
          )
        );
        setEditUser(null);
      } else {
        alert(data.message || "Failed to update user.");
      }
    } catch (err) {
      console.error("Error updating user:", err);
      alert("Error updating user.");
    }
  };

  if (loading) {
    return <p className="text-center text-gray-600">Loading users...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="font-bold text-3xl mb-6 text-gray-800">👥 Manage Users</h1>
      {users.length === 0 ? (
        <p className="text-gray-500">No users found.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {users.map((u) => (
            <div
              key={u.user_id}
              className="w-full bg-white rounded-xl p-5 shadow-md flex justify-between items-center hover:shadow-lg transition"
            >
              {/* User Info */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{u.full_name}</h2>
                <p className="text-gray-600">
                  <strong>Email:</strong> {u.email}
                </p>
                <p className="text-gray-600">
                  <strong>Phone:</strong> {u.phone}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow"
                  onClick={() => handleEdit(u)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow"
                  onClick={() => handleDelete(u.user_id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ✅ Edit Modal */}
      {editUser && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Edit User - {editUser.full_name}
            </h2>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Full Name"
                value={formData.fullname}
                onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <input
                type="password"
                placeholder="New Password (optional)"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
                onClick={() => setEditUser(null)}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
