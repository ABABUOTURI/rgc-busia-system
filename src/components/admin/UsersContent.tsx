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
  const [form, setForm] = useState({ name: "", role: "", email: "", phoneNumber: "", password: "" });
  const [creating, setCreating] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [alert, setAlert] = useState<string | null>(null);

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

  // 👉 Generate default password: first word of name + 3 random digits
  const generatePassword = (name: string) => {
    const firstName = name.trim().split(" ")[0] || "User";
    const digits = Math.floor(100 + Math.random() * 900); // ensures 3 digits
    return `${firstName}${digits}`;
  };

  const handleCreate = async () => {
    if (!canSubmit) {
      setAlert("Name, role, and either email or phone are required");
      return;
    }
    setCreating(true);
    setAlert(null);

    let passwordToSend = form.password;
    if (!passwordToSend) {
      passwordToSend = generatePassword(form.name);
    }

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          role: form.role,
          email: form.email || undefined,
          phoneNumber: form.phoneNumber || undefined,
          password: passwordToSend,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setForm({ name: "", role: "", email: "", phoneNumber: "", password: "" });
        await fetchUsers();
        setAlert(`✅ User created. Default password: ${passwordToSend}`);
      } else {
        setAlert(data.error || "Failed to create user");
      }
    } catch {
      setAlert("Network error");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded bg-white p-4 shadow">
        <h2 className="text-lg font-bold mb-4">Create User</h2>
        {alert && <p className="mb-3 text-sm text-red-600">{alert}</p>}
        <div className="grid md:grid-cols-2 gap-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="rounded border px-3 py-2"
          />
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="rounded border px-3 py-2"
          >
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
          <input
            name="password"
            type="text"
            value={form.password}
            onChange={handleChange}
            placeholder="Password (leave blank to auto-generate)"
            className="rounded border px-3 py-2 md:col-span-2"
          />
        </div>
        <button
          disabled={!canSubmit || creating}
          onClick={handleCreate}
          className={`mt-4 rounded px-4 py-2 text-white ${
            canSubmit && !creating ? "bg-red-600 hover:bg-red-700" : "bg-red-300 cursor-not-allowed"
          }`}
        >
          {creating ? "Creating..." : "Create User"}
        </button>
      </div>

      <div className="rounded bg-white p-4 shadow">
        <h3 className="font-bold mb-3">Users</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100 text-left text-sm text-gray-600">
                <th className="p-2">Name</th>
                <th className="p-2">Role</th>
                <th className="p-2">Email</th>
                <th className="p-2">Phone</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {users.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="p-2">{u.name}</td>
                  <td className="p-2">{u.role}</td>
                  <td className="p-2">{u.email || "-"}</td>
                  <td className="p-2">{u.phoneNumber || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
