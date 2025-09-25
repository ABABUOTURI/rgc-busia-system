// app/finance/records/church-accounts.tsx
"use client";

export default function ChurchAccountsPage() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Church Accounts</h2>
      <div className="bg-white p-4 rounded-2xl shadow">
        <p className="text-gray-600 mb-3">Offering, Main Service, HBC groups, Sunday School, and Total.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="p-3 bg-white/50 rounded border">Offering: KES 45,000</div>
          <div className="p-3 bg-white/50 rounded border">HBC - Jerusalem: KES 5,000</div>
          <div className="p-3 bg-white/50 rounded border">Sunday School: KES 3,000</div>
        </div>
      </div>
    </div>
  );
}
