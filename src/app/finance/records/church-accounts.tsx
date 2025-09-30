// app/finance/records/church-accounts.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer } from "@/components/ui/toast";

interface ChurchAccount {
  _id?: string;
  date: string;
  offerings: {
    mainService: number;
    hbc: {
      jerusalem: number;
      emmanuel: number;
      ebenezer: number;
      agape: number;
    };
    sundaySchool: number;
    total: number;
  };
  expenditure: {
    tithe: number;
    apostolic: number;
    bricks: number;
    banking: number;
    pastorsUse: number;
    sundaySchool: number;
  };
  closing?: {
    tithe: number;
    apostolic: number;
    transactionFee: number;
  };
}

export default function ChurchAccountsPage() {
  const [records, setRecords] = useState<ChurchAccount[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<ChurchAccount[]>([]);
  const [open, setOpen] = useState(false);
  const [toasts, setToasts] = useState<Array<{
    id: string;
    type: "success" | "error";
    message: string;
  }>>([]);
  const [filters, setFilters] = useState({
    from: "",
    to: "",
    year: "",
    month: ""
  });
  // keep inputs as strings so placeholders show; convert on submit
  const [form, setForm] = useState<any>({
    date: "",
    offerings: {
      mainService: "",
      hbc: { jerusalem: "", emmanuel: "", ebenezer: "", agape: "" },
      sundaySchool: "",
      total: "",
    },
    expenditure: {
      tithe: "",
      apostolic: "",
      bricks: "",
      banking: "",
      pastorsUse: "",
      sundaySchool: "",
    },
    closing: {
      tithe: "",
      apostolic: "",
      transactionFee: "",
    },
  });
  const [step, setStep] = useState(1);
  const router = useRouter();

  const addToast = (type: "success" | "error", message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Fetch records
  const fetchRecords = async () => {
    try {
      const res = await fetch("/api/church-accounts");
      const data = await res.json();
      setRecords(data);
      setFilteredRecords(data);
    } catch (error) {
      console.error("Error fetching records:", error);
      addToast("error", "❌ Failed to load records");
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...records];

    if (filters.from) {
      filtered = filtered.filter(record => new Date(record.date) >= new Date(filters.from));
    }
    if (filters.to) {
      filtered = filtered.filter(record => new Date(record.date) <= new Date(filters.to));
    }
    if (filters.year) {
      filtered = filtered.filter(record => new Date(record.date).getFullYear().toString() === filters.year);
    }
    if (filters.month) {
      filtered = filtered.filter(record => (new Date(record.date).getMonth() + 1).toString() === filters.month);
    }

    setFilteredRecords(filtered);
  }, [records, filters]);

  // Save record
  const handleSubmit = async () => {
    try {
      const payload: ChurchAccount = {
        date: form.date,
        offerings: {
          mainService: Number(form.offerings.mainService || 0),
          hbc: {
            jerusalem: Number(form.offerings.hbc.jerusalem || 0),
            emmanuel: Number(form.offerings.hbc.emmanuel || 0),
            ebenezer: Number(form.offerings.hbc.ebenezer || 0),
            agape: Number(form.offerings.hbc.agape || 0),
          },
          sundaySchool: Number(form.offerings.sundaySchool || 0),
          total: Number(form.offerings.total || 0),
        },
        expenditure: {
          tithe: Number(form.expenditure.tithe || 0),
          apostolic: Number(form.expenditure.apostolic || 0),
          bricks: Number(form.expenditure.bricks || 0),
          banking: Number(form.expenditure.banking || 0),
          pastorsUse: Number(form.expenditure.pastorsUse || 0),
          sundaySchool: Number(form.expenditure.sundaySchool || 0),
        },
        closing: isLastSunday()
          ? {
              tithe: Number(form.closing?.tithe || 0),
              apostolic: Number(form.closing?.apostolic || 0),
              transactionFee: Number(form.closing?.transactionFee || 0),
            }
          : undefined,
      };

      const res = await fetch("/api/church-accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        addToast("success", "✅ Church account record saved successfully!");
        setOpen(false);
        setStep(1);
        setForm({
          date: "",
          offerings: {
            mainService: "",
            hbc: { jerusalem: "", emmanuel: "", ebenezer: "", agape: "" },
            sundaySchool: "",
            total: "",
          },
          expenditure: {
            tithe: "",
            apostolic: "",
            bricks: "",
            banking: "",
            pastorsUse: "",
            sundaySchool: "",
          },
          closing: {
            tithe: "",
            apostolic: "",
            transactionFee: "",
          },
        });
        fetchRecords();
        router.refresh();
      } else {
        addToast("error", "❌ Failed to save record. Please try again.");
      }
    } catch (err) {
      console.error("Error saving record:", err);
      addToast("error", "❌ Error saving record. Please check your connection.");
    }
  };

  // Check if today is last Sunday of the month
  const isLastSunday = () => {
    const today = new Date();
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const lastSunday = new Date(lastDay);
    lastSunday.setDate(lastDay.getDate() - ((lastDay.getDay() + 7 - 0) % 7)); // last Sunday
    return (
      today.toDateString() === lastSunday.toDateString() ||
      new Date(form.date).toDateString() === lastSunday.toDateString()
    );
  };

  // Calculate totals for display using filtered records
  const calculateOfferingsTotal = () => {
    return filteredRecords.reduce((total, record) => {
      // Calculate total from all individual offerings
      const mainService = record.offerings.mainService;
      const hbcTotal = record.offerings.hbc.jerusalem + record.offerings.hbc.emmanuel + 
                      record.offerings.hbc.ebenezer + record.offerings.hbc.agape;
      const sundaySchool = record.offerings.sundaySchool;
      
      return total + mainService + hbcTotal + sundaySchool;
    }, 0);
  };

  const calculateExpenditureTotal = () => {
    return filteredRecords.reduce((total, record) => {
      const expenditureTotal = Object.values(record.expenditure).reduce((sum, val) => sum + val, 0);
      return total + expenditureTotal;
    }, 0);
  };

  const calculateClosingTotal = () => {
    return filteredRecords.reduce((total, record) => {
      if (record.closing) {
        return total + Object.values(record.closing).reduce((sum, val) => sum + val, 0);
      }
      return total;
    }, 0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div>
      {/* Header - Responsive */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-black">Church Accounts</h2>
        <button
          onClick={() => setOpen(true)}
          className="bg-red-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-lg hover:bg-red-700 font-semibold text-sm sm:text-base w-full sm:w-auto"
        >
          + Add Record
        </button>
      </div>

      {/* Filters - Responsive */}
      <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-2xl shadow-lg mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800">Filter Collections</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
            <input
              type="date"
              value={filters.from}
              onChange={(e) => setFilters({ ...filters, from: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
            <input
              type="date"
              value={filters.to}
              onChange={(e) => setFilters({ ...filters, to: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
            <select
              value={filters.year}
              onChange={(e) => setFilters({ ...filters, year: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700"
            >
              <option value="">All Years</option>
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
            <select
              value={filters.month}
              onChange={(e) => setFilters({ ...filters, month: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700"
            >
              <option value="">All Months</option>
              {[
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
              ].map((month, index) => (
                <option key={month} value={index + 1}>{month}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row gap-2 sm:items-center">
          <button
            onClick={() => setFilters({ from: "", to: "", year: "", month: "" })}
            className="px-3 sm:px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm sm:text-base w-full sm:w-auto"
          >
            Clear Filters
          </button>
          <div className="text-xs sm:text-sm text-gray-600 flex items-center">
            Showing {filteredRecords.length} of {records.length} records
          </div>
        </div>
      </div>

      {/* Professional Tables - Responsive */}
      <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-2xl shadow-lg space-y-6 sm:space-y-8">
        {/* Offerings Section */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-red-600 to-red-700 px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
            <h5 className="text-lg font-bold text-white flex items-center">
              Offerings Summary
            </h5>
          </div>
          <div className="p-3 sm:p-4 lg:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
              <div className="bg-gray-50 p-2 sm:p-3 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2 text-sm sm:text-base">Main Service</h4>
                <p className="text-lg sm:text-xl lg:text-xl font-bold text-black break-words">
                  {formatCurrency(filteredRecords.reduce((sum, r) => sum + r.offerings.mainService, 0))}
                </p>
              </div>
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2 text-sm sm:text-base">HBC Jerusalem</h4>
                <p className="text-lg sm:text-xl lg:text-xl font-bold text-black break-words">
                  {formatCurrency(filteredRecords.reduce((sum, r) => sum + r.offerings.hbc.jerusalem, 0))}
                </p>
              </div>
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2 text-sm sm:text-base">HBC Emmanuel</h4>
                <p className="text-lg sm:text-xl lg:text-xl font-bold text-black break-words">
                  {formatCurrency(filteredRecords.reduce((sum, r) => sum + r.offerings.hbc.emmanuel, 0))}
                </p>
              </div>
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2 text-sm sm:text-base">HBC Ebenezer</h4>
                <p className="text-lg sm:text-xl lg:text-xl font-bold text-black break-words">
                  {formatCurrency(filteredRecords.reduce((sum, r) => sum + r.offerings.hbc.ebenezer, 0))}
                </p>
              </div>
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2 text-sm sm:text-base">HBC Agape</h4>
                <p className="text-lg sm:text-xl lg:text-xl font-bold text-black break-words">
                  {formatCurrency(filteredRecords.reduce((sum, r) => sum + r.offerings.hbc.agape, 0))}
                </p>
              </div>
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2 text-sm sm:text-base">Sunday School</h4>
                <p className="text-lg sm:text-xl lg:text-xl font-bold text-black break-words">
                  {formatCurrency(filteredRecords.reduce((sum, r) => sum + r.offerings.sundaySchool, 0))}
                </p>
              </div>
            </div>
            <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t-4 border-red-600">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <div>
                  <span className="text-lg sm:text-xl font-bold text-gray-800">Total Offerings</span>
                  {/* <div className="text-sm text-gray-600 mt-1">
                    (Main Service + All HBC + Sunday School)
                  </div> */}
                </div>
                <span className="text-1xl sm:text-1xl font-bold text-gray-900 break-words">
                  {formatCurrency(calculateOfferingsTotal())}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Expenditure Section */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-red-600 to-red-700 px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
            <h3 className="text-lg font-bold text-white flex items-center">
              Expenditure Summary
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">Tithe (10%)</h4>
                <p className="text-xl font-bold text-black">
                  {formatCurrency(filteredRecords.reduce((sum, r) => sum + r.expenditure.tithe, 0))}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">Apostolic (2%)</h4>
                <p className="text-xl font-bold text-black">
                  {formatCurrency(filteredRecords.reduce((sum, r) => sum + r.expenditure.apostolic, 0))}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">Bricks/Blocks</h4>
                <p className="text-xl font-bold text-black">
                  {formatCurrency(filteredRecords.reduce((sum, r) => sum + r.expenditure.bricks, 0))}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">Banking</h4>
                <p className="text-xl font-bold text-black">
                  {formatCurrency(filteredRecords.reduce((sum, r) => sum + r.expenditure.banking, 0))}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">Pastor's Use</h4>
                <p className="text-xl font-bold text-black">
                  {formatCurrency(filteredRecords.reduce((sum, r) => sum + r.expenditure.pastorsUse, 0))}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">Sunday School</h4>
                <p className="text-xl font-bold text-black">
                  {formatCurrency(filteredRecords.reduce((sum, r) => sum + r.expenditure.sundaySchool, 0))}
                </p>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t-4 border-orange-600">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-gray-800">Total Expenditure</span>
                <span className="text-1xl font-bold text-gray-900">
                  {formatCurrency(calculateExpenditureTotal())}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Closing the Month */}
        {isLastSunday() && (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
              <h3 className="text-lg font-bold text-white flex items-center">
                Month Closing Summary
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-2">Tithe (10%)</h4>
                  <p className="text-xl font-bold text-black">
                    {formatCurrency(filteredRecords.reduce((sum, r) => sum + (r.closing?.tithe || 0), 0))}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-2">Apostolic</h4>
                  <p className="text-xl font-bold text-black">
                    {formatCurrency(filteredRecords.reduce((sum, r) => sum + (r.closing?.apostolic || 0), 0))}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-2">Transaction Fee</h4>
                  <p className="text-xl font-bold text-black">
                    {formatCurrency(filteredRecords.reduce((sum, r) => sum + (r.closing?.transactionFee || 0), 0))}
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t-4 border-gray-600">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-800">Total Closing</span>
                  <span className="text-1xl font-bold text-gray-900">
                    {formatCurrency(calculateClosingTotal())}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Records List */}
        {filteredRecords.length > 0 && (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-gray-600 to-gray-700 px-6 py-4">
              <h3 className="text-lg font-bold text-white flex items-center">
                Recent Records
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Date</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Main Service</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Total Offerings</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Total Expenditure</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Net</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredRecords.slice(0, 5).map((record, index) => {
                    const expenditureTotal = Object.values(record.expenditure).reduce((sum, val) => sum + val, 0);
                    const net = record.offerings.total - expenditureTotal;
                    return (
                      <tr key={record._id || index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-900">{new Date(record.date).toLocaleDateString()}</td>
                        <td className="px-4 py-3 text-black font-semibold">{formatCurrency(record.offerings.mainService)}</td>
                        <td className="px-4 py-3 text-black font-semibold">{formatCurrency(record.offerings.total)}</td>
                        <td className="px-4 py-3 text-black font-semibold">{formatCurrency(expenditureTotal)}</td>
                        <td className={`px-4 py-3 font-bold ${net >= 0 ? 'text-black' : 'text-black'}`}>
                          {formatCurrency(net)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal Form */}
      {open && (
        <div className="fixed inset-0 bg-gray-100 bg-opacity-70 flex items-center justify-center overflow-auto p-4">
          <div className="bg-white p-6 rounded-2xl w-full max-w-4xl">
            <h3 className="text-lg font-bold mb-4 text-black">Add Church Account Record</h3>
            {/* Stepper */}
            <div className="flex items-center justify-between mb-3 text-sm text-black">
              <div>Step {step} of 4</div>
              <div className="space-x-2 text-black">
                {step > 1 && (
                  <button className="px-3 py-1 rounded border bg-gray-700 text-white" onClick={() => setStep(step - 1)}>Back</button>
                )}
                {step < 4 && (
                  <button className="px-3 py-1 rounded bg-gray-700 text-white" onClick={() => setStep(step + 1)}>Next</button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Step 1: Date + Offerings (part 1) */}
              {step === 1 && (
                <>
                  <input
                    type="date"
                    className="border px-3 py-2 rounded text-black"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                  />
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="Offerings - Main Service"
                    className="border px-3 py-2 rounded text-black"
                    value={form.offerings.mainService}
                    onChange={(e) =>
                      setForm({ ...form, offerings: { ...form.offerings, mainService: e.target.value.replace(/\D/g, '') } })
                    }
                  />
                  {Object.keys(form.offerings.hbc).map((key) => (
                    <input
                      key={key}
                      type="text"
                      inputMode="numeric"
                      placeholder={`Offerings - HBC ${key}`}
                      className="border px-3 py-2 rounded text-black capitalize"
                      value={(form.offerings.hbc as any)[key]}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          offerings: {
                            ...form.offerings,
                            hbc: { ...form.offerings.hbc, [key]: e.target.value.replace(/\D/g, '') },
                          },
                        })
                      }
                    />
                  ))}
                </>
              )}

              {/* Step 2: Offerings (part 2) */}
              {step === 2 && (
                <>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="Offerings - Sunday School"
                    className="border px-3 py-2 rounded text-black"
                    value={form.offerings.sundaySchool}
                    onChange={(e) => setForm({ ...form, offerings: { ...form.offerings, sundaySchool: e.target.value.replace(/\D/g, '') } })}
                  />
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="Offerings - Total"
                    className="border px-3 py-2 rounded text-black"
                    value={form.offerings.total}
                    onChange={(e) => setForm({ ...form, offerings: { ...form.offerings, total: e.target.value.replace(/\D/g, '') } })}
                  />
                </>
              )}

              {/* Step 3: Expenditure (part 1) */}
              {step === 3 && (
                <>
                  {Object.keys(form.expenditure).slice(0, 3).map((key) => (
                    <input
                      key={key}
                      type="text"
                      inputMode="numeric"
                      placeholder={`Expenditure - ${key}`}
                      className="border px-3 py-2 rounded text-black capitalize"
                      value={(form.expenditure as any)[key]}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          expenditure: { ...form.expenditure, [key]: e.target.value.replace(/\D/g, '') },
                        })
                      }
                    />
                  ))}
                </>
              )}

              {/* Step 4: Expenditure (part 2) + Closing if needed */}
              {step === 4 && (
                <>
                  {Object.keys(form.expenditure).slice(3).map((key) => (
                    <input
                      key={key}
                      type="text"
                      inputMode="numeric"
                      placeholder={`Expenditure - ${key}`}
                      className="border px-3 py-2 rounded text-black capitalize"
                      value={(form.expenditure as any)[key]}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          expenditure: { ...form.expenditure, [key]: e.target.value.replace(/\D/g, '') },
                        })
                      }
                    />
                  ))}
                  {isLastSunday() && (
                    <>
                      {Object.entries(form.closing || {}).map(([key, val]) => (
                        <input
                          key={key}
                          type="text"
                          inputMode="numeric"
                          placeholder={`Closing - ${key}`}
                          className="border px-3 py-2 rounded text-black capitalize"
                          value={val as any}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              closing: { ...form.closing!, [key]: e.target.value.replace(/\D/g, '') },
                            })
                          }
                        />
                      ))}
                    </>
                  )}
                </>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-between mt-4 gap-2">
              <div>
                {step === 1 && (
                  <button 
                    className="px-4 py-2 rounded border hover:bg-gray-50 text-black" 
                    onClick={() => setOpen(false)}
                  >
                    Back to View
                  </button>
                )}
                {step > 1 && (
                  <button className="px-4 py-2 rounded border text-black" onClick={() => setStep(step - 1)}>Back</button>
                )}
                {step < 4 && (
                  <button className="ml-2 px-4 py-2 rounded bg-gray-800 text-white" onClick={() => setStep(step + 1)}>Next</button>
                )}
              </div>
              {step === 4 && (
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 rounded bg-red-700 text-white hover:bg-red-800 font-semibold"
                >
                  Save Record
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
