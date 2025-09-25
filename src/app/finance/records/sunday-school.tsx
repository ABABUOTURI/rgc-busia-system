// app/finance/records/sunday-school.tsx
"use client";

export default function SundaySchoolPage() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Sunday School Accounts</h2>
      <div className="bg-white p-4 rounded-2xl shadow">
        <p className="text-gray-600 mb-4">Record year, date, and amount collected. You can add custom fields as needed.</p>

        {/* Example responsive table placeholder */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-2 text-left">Year</th>
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Amount</th>
                <th className="p-2 text-left">Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2">2025</td>
                <td className="p-2">2025-09-21</td>
                <td className="p-2">KES 25,000</td>
                <td className="p-2">Sunday collection</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
