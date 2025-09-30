"use client";
import { useEffect, useState } from "react";

const roles = ["Snr Pastor", "Pastor's Wife", "Finance", "Deacons", "Admin"];

type User = {
  id: string;
  name: string;
  role: string;
  email?: string;
  phoneNumber?: string;
};

export default function UsersContent() {
  const [form, setForm] = useState({ id: "", name: "", role: "", email: "", phoneNumber: "", password: "" });
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [alert, setAlert] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; userId?: string; name?: string }>({
    open: false,
  });

  const fetchUsers = async () => {
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    if (res.ok) setUsers(data.users || []);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const canSubmit = form.name && form.role && (form.email || form.phoneNumber);

  // Auto-generate password
  const generatePassword = (name: string) => {
    const firstName = name.trim().split(" ")[0] || "User";
    const digits = Math.floor(100 + Math.random() * 900);
    return `${firstName}${digits}`;
  };

  const handleCreateOrUpdate = async () => {
    if (!canSubmit) {
      setAlert("⚠️ Name, role, and either email or phone are required");
      return;
    }
    setCreating(true);
    setAlert(null);

    let passwordToSend = form.password;
    if (!passwordToSend && !editing) {
      passwordToSend = generatePassword(form.name);
    }

    try {
      const res = await fetch(`/api/admin/users${editing ? `/${form.id}` : ""}`, {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          role: form.role,
          email: form.email || undefined,
          phoneNumber: form.phoneNumber || undefined,
          ...(editing ? {} : { password: passwordToSend }),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setForm({ id: "", name: "", role: "", email: "", phoneNumber: "", password: "" });
        setEditing(false);
        await fetchUsers();
        setAlert(editing ? "✅ User updated successfully" : `✅ User created. Default password: ${passwordToSend}`);
      } else {
        setAlert(data.error || "❌ Failed to save user");
      }
    } catch {
      setAlert("⚠️ Network error while saving user");
    } finally {
      setCreating(false);
    }
  };

  const handleEdit = (user: User) => {
    setForm({
      id: user.id,
      name: user.name,
      role: user.role,
      email: user.email || "",
      phoneNumber: user.phoneNumber || "",
      password: "",
    });
    setEditing(true);
    setAlert(null);
  };

  const handleDeleteClick = (user: User) => {
    setConfirmDelete({ open: true, userId: user.id, name: user.name });
  };

  const confirmDeleteUser = async () => {
    if (!confirmDelete.userId) return;
    try {
      const res = await fetch(`/api/admin/users/${confirmDelete.userId}`, { method: "DELETE" });
      if (res.ok) {
        await fetchUsers();
        setAlert(`🗑️ User "${confirmDelete.name}" deleted successfully`);
      } else {
        setAlert("❌ Failed to delete user");
      }
    } catch {
      setAlert("⚠️ Network error while deleting user");
    } finally {
      setConfirmDelete({ open: false });
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Alert Banner */}
      {alert && (
        <div
          className={`rounded-lg p-3 text-sm flex items-center gap-2 ${
            alert.startsWith("✅")
              ? "bg-green-50 text-green-700 border border-green-300"
              : alert.startsWith("🗑️")
              ? "bg-red-50 text-red-700 border border-red-300"
              : alert.startsWith("❌")
              ? "bg-red-50 text-red-700 border border-red-300"
              : "bg-yellow-50 text-yellow-700 border border-yellow-300"
          }`}
        >
          {alert}
        </div>
      )}

      {/* User Form */}
      <div className="rounded bg-white p-4 shadow">
        <h2 className="text-lg font-bold mb-4 text-black">{editing ? "Edit User" : "Create User"}</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="rounded border px-3 py-2"
          />
          <select name="role" value={form.role} onChange={handleChange} className="rounded border px-3 py-2">
            <option value="" disabled>
              Select Role
            </option>
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email (optional)"
            className="rounded border px-3 py-2"
          />
          <input
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
            placeholder="Phone Number (optional)"
            className="rounded border px-3 py-2"
          />
          {!editing && (
            <input
              name="password"
              type="text"
              value={form.password}
              onChange={handleChange}
              placeholder="Password (leave blank to auto-generate)"
              className="rounded border px-3 py-2 md:col-span-2"
            />
          )}
        </div>
        <div className="flex gap-2 mt-4">
          <button
            disabled={!canSubmit || creating}
            onClick={handleCreateOrUpdate}
            className={`rounded px-4 py-2 text-white ${
              canSubmit && !creating ? "bg-red-600 hover:bg-red-700" : "bg-red-300 cursor-not-allowed"
            }`}
          >
            {creating ? (editing ? "Updating..." : "Creating...") : editing ? "Update User" : "Create User"}
          </button>
          {editing && (
            <button
              onClick={() => {
                setForm({ id: "", name: "", role: "", email: "", phoneNumber: "", password: "" });
                setEditing(false);
              }}
              className="rounded px-4 py-2 bg-gray-300 hover:bg-gray-400"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded bg-white p-4 shadow">
        <h3 className="font-bold mb-3 text-black">Users</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-red-700 text-left text-sm text-white">
                <th className="p-2">Name</th>
                <th className="p-2">Role</th>
                <th className="p-2">Email</th>
                <th className="p-2">Phone</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-black">
              {users.map((u) => (
                <tr key={u.id || `${u.email}-${u.phoneNumber}-${u.name}`} className="border-t">
                  <td className="p-2">{u.name}</td>
                  <td className="p-2">{u.role}</td>
                  <td className="p-2">{u.email || "-"}</td>
                  <td className="p-2">{u.phoneNumber || "-"}</td>
                  <td className="p-2 flex gap-2">
                    <button
                      onClick={() => handleEdit(u)}
                      className="px-2 py-1 text-sm rounded bg-gray-500 text-white hover:bg-gray-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(u)}
                      className="px-2 py-1 text-sm rounded bg-red-500 text-white hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal (inline floating card) */}
      {confirmDelete.open && (
        <div className="fixed inset-0 flex items-start justify-center mt-24 z-50 pointer-events-none">
          <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-sm border pointer-events-auto">
            <h2 className="text-lg font-semibold mb-2">Delete User</h2>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete{" "}
              <span className="font-medium text-gray-800">{confirmDelete.name}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmDelete({ open: false })}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteUser}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
