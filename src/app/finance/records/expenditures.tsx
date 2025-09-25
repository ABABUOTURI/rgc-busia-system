// app/finance/records/expenditures.tsx
"use client";

export default function ExpendituresPage() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Expenditures</h2>
      <div className="bg-white p-4 rounded-2xl shadow">
        <p className="text-gray-600 mb-3">Track tithe, apostolic, bricks, pastor’s use, transaction fees, etc.</p>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Category</th>
                <th className="p-2 text-left">Amount</th>
                <th className="p-2 text-left">Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2">2025-09-20</td>
                <td className="p-2">Bricks</td>
                <td className="p-2">KES 10,000</td>
                <td className="p-2">Project purchase</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
