"use client";

import { useEffect, useState } from "react";

interface Construction {
  _id?: string;
  construction: {
    churchLand: number;
    projectBegan: number;
    planDesign: number;
  };
  approvals: {
    publicHealth: number;
    physicalPlanning: number;
    urbanDevelopment: number;
    titleDeed: number;
  };
}

export default function ConstructionPage() {
  const [records, setRecords] = useState<Construction[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Construction>({
    construction: {
      churchLand: 0,
      projectBegan: 0,
      planDesign: 0,
    },
    approvals: {
      publicHealth: 0,
      physicalPlanning: 0,
      urbanDevelopment: 0,
      titleDeed: 0,
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Fetch records
  const fetchRecords = async () => {
    try {
      const res = await fetch("/api/construction", { cache: 'no-store' });
      const data = await res.json();
      if (res.ok) {
        setRecords(data);
      } else {
        setAlert({ type: 'error', message: data.error || 'Failed to load construction records' });
      }
    } catch {
      setAlert({ type: 'error', message: 'Network error while loading construction records' });
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // Save record
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setAlert(null);
    try {
      const res = await fetch("/api/construction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setAlert({ type: 'success', message: 'Construction record saved successfully' });
        setForm({
          construction: { churchLand: 0, projectBegan: 0, planDesign: 0 },
          approvals: { publicHealth: 0, physicalPlanning: 0, urbanDevelopment: 0, titleDeed: 0 },
        });
        setOpen(false);
        await fetchRecords();
      } else {
        setAlert({ type: 'error', message: (data as any).error || 'Failed to save construction record' });
        setOpen(false);
      }
    } catch {
      setAlert({ type: 'error', message: 'Network error while saving' });
      setOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Alerts */}
      {alert && (
        <div className={`mb-3 rounded border px-3 py-2 text-sm ${alert.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
          {alert.message}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold text-black">Church Construction Project</h2>
        <button
          onClick={() => setOpen(true)}
          className="bg-red-700 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
        >
          + Add Record
        </button>
      </div>

      {/* Records */}
      <div className="bg-white p-4 rounded-2xl shadow space-y-4">
        {records.length === 0 ? (
          <p className="text-gray-600">No records yet.</p>
        ) : (
          <div className="space-y-6">
            {records.map((r) => (
              <div key={r._id} className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2 text-black">Construction</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="bg-red-700 text-left">
                          <th className="p-2 text-white">Item</th>
                          <th className="p-2 text-white">Amount (KES)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t">
                          <td className="p-2 text-black">Church Land</td>
                          <td className="p-2 text-black">{r.construction.churchLand.toLocaleString()}</td>
                        </tr>
                        <tr className="border-t">
                          <td className="p-2 text-black">Year Project Began</td>
                          <td className="p-2 text-black">{r.construction.projectBegan.toLocaleString()}</td>
                        </tr>
                        <tr className="border-t">
                          <td className="p-2 text-black">Plan Design</td>
                          <td className="p-2 text-black">{r.construction.planDesign.toLocaleString()}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-black">Approvals</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="bg-red-700 text-left">
                          <th className="p-2 text-white">Approval</th>
                          <th className="p-2 text-white">Amount (KES)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t">
                          <td className="p-2 text-black">Public Health</td>
                          <td className="p-2 text-black">{r.approvals.publicHealth.toLocaleString()}</td>
                        </tr>
                        <tr className="border-t">
                          <td className="p-2 text-black">Physical Planning</td>
                          <td className="p-2 text-black">{r.approvals.physicalPlanning.toLocaleString()}</td>
                        </tr>
                        <tr className="border-t">
                          <td className="p-2 text-black">Urban Development</td>
                          <td className="p-2 text-black">{r.approvals.urbanDevelopment.toLocaleString()}</td>
                        </tr>
                        <tr className="border-t">
                          <td className="p-2 text-black">Title Deed</td>
                          <td className="p-2 text-black">{r.approvals.titleDeed.toLocaleString()}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <h1 className=" font-bold text-black">
                  Total Cost: KES {(
                    r.construction.churchLand +
                    r.construction.projectBegan +
                    r.construction.planDesign +
                    r.approvals.publicHealth +
                    r.approvals.physicalPlanning +
                    r.approvals.urbanDevelopment +
                    r.approvals.titleDeed
                  ).toLocaleString()}
                </h1>
                <hr className="border-gray-200" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl w-full max-w-lg">
            <h3 className="text-lg font-bold mb-4 text-black">Add Construction Record</h3>
            <div className="space-y-3 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Construction costs */}
              <div>
                <p className="font-semibold mb-2">Construction (KES)</p>
                {[
                  { key: "churchLand", label: "Church Land" },
                  { key: "projectBegan", label: "Year Project Began" },
                  { key: "planDesign", label: "Plan Design" },
                ].map((c) => (
                  <div key={c.key} className="mb-2">
                    <label className="block text-sm">{c.label}</label>
                    <input
                      type="number"
                      placeholder={c.key === 'projectBegan' ? 'Year (e.g., 2024)' : 'Amount e.g. 20000'}
                      className="w-full border px-3 py-2 rounded text-black"
                      value={(form.construction as any)[c.key]}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          construction: {
                            ...form.construction,
                            [c.key]: Number(e.target.value),
                          },
                        })
                      }
                    />
                  </div>
                ))}
              </div>

              {/* Approvals with costs */}
              <div>
                <p className="font-semibold mb-2">Approvals (KES)</p>
                {[
                  { key: "publicHealth", label: "Public Health" },
                  { key: "physicalPlanning", label: "Physical Planning" },
                  { key: "urbanDevelopment", label: "Urban Development" },
                  { key: "titleDeed", label: "Title Deed" },
                ].map((a) => (
                  <div key={a.key} className="mb-2">
                    <label className="block text-sm">{a.label}</label>
                    <input
                      type="number"
                      placeholder={'Amount e.g. 20000'}
                      className="w-full border px-3 py-2 rounded text-black"
                      value={(form.approvals as any)[a.key]}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          approvals: {
                            ...form.approvals,
                            [a.key]: Number(e.target.value),
                          },
                        })
                      }
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end mt-4 gap-2 lg:col-span-2">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className={`px-4 py-2 rounded text-white ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
