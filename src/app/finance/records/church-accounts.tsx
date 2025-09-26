// app/finance/records/church-accounts.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
  const [open, setOpen] = useState(false);
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

  // Fetch records
  const fetchRecords = async () => {
    const res = await fetch("/api/church-accounts");
    const data = await res.json();
    setRecords(data);
  };

  useEffect(() => {
    fetchRecords();
  }, []);

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
        alert("✅ Record saved successfully");
        setOpen(false);
        setStep(1);
        fetchRecords();
        router.refresh();
      } else {
        alert("❌ Failed to save record");
      }
    } catch (err) {
      console.error("Error saving record:", err);
      alert("❌ Error saving record");
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

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold text-black">Church Accounts</h2>
        <button
          onClick={() => setOpen(true)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700"
        >
          + Add Record
        </button>
      </div>

      {/* Placeholder Tables */}
      <div className="bg-white p-4 rounded-2xl shadow space-y-6">
        {/* Offerings */}
        <div>
          <h3 className="font-semibold mb-2 text-black">Offerings</h3>
          <table className="min-w-full text-sm text-black">
            <thead>
              <tr className="bg-red-700 text-white">
                <th className="p-2 text-left">Field</th>
                <th className="p-2 text-left">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="p-2">Main Service</td><td className="p-2">KES -</td></tr>
              <tr><td className="p-2">HBC - Jerusalem</td><td className="p-2">KES -</td></tr>
              <tr><td className="p-2">HBC - Emmanuel</td><td className="p-2">KES -</td></tr>
              <tr><td className="p-2">HBC - Ebenezer</td><td className="p-2">KES -</td></tr>
              <tr><td className="p-2">HBC - Agape</td><td className="p-2">KES -</td></tr>
              <tr><td className="p-2">Sunday School</td><td className="p-2">KES -</td></tr>
              <hr />
              <tr><td className="p-2 font-bold">Total</td><td className="p-2 font-bold">KES -</td></tr>
            </tbody>
          </table>
        </div>

        {/* Expenditure */}
        <div>
          <h3 className="font-semibold mb-2 text-black">Expenditure</h3>
          <table className="min-w-full text-sm text-black">
            <thead>
              <tr className="bg-red-700 text-white">
                <th className="p-2 text-left">Field</th>
                <th className="p-2 text-left">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="p-2">Tithe 10%</td><td className="p-2">KES -</td></tr>
              <tr><td className="p-2">Apostolic 2%</td><td className="p-2">KES -</td></tr>
              <tr><td className="p-2">Bricks/Blocks</td><td className="p-2">KES -</td></tr>
              <tr><td className="p-2">Banking</td><td className="p-2">KES -</td></tr>
              <tr><td className="p-2">Pastor's Use</td><td className="p-2">KES -</td></tr>
              <tr><td className="p-2">Sunday School</td><td className="p-2">KES -</td></tr>
              <hr />
              <tr><td className="p-2 font-bold">Total</td><td className="p-2 font-bold">KES -</td></tr>
            </tbody>
          </table>
        </div>

        {/* Closing the Month */}
        {isLastSunday() && (
          <div>
            <h3 className="font-semibold mb-2 text-black">Closing the Month</h3>
            <table className="min-w-full text-sm text-black">
              <thead>
                <tr className="bg-red-700 text-white">
                  <th className="p-2 text-left">Field</th>
                  <th className="p-2 text-left">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="p-2">Tithe 10%</td><td className="p-2">KES -</td></tr>
                <tr><td className="p-2">Apostolic</td><td className="p-2">KES -</td></tr>
                <tr><td className="p-2">Transaction Fee</td><td className="p-2">KES -</td></tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Form */}
      {open && (
        <div className="fixed inset-0 bg-gray-100 bg-opacity-70 flex items-center justify-center overflow-auto p-4">
          <div className="bg-white p-6 rounded-2xl w-full max-w-4xl">
            <h3 className="text-lg font-bold mb-4 text-black">Add Church Account Record</h3>
            {/* Stepper */}
            <div className="flex items-center justify-between mb-3 text-sm">
              <div>Step {step} of 4</div>
              <div className="space-x-2">
                {step > 1 && (
                  <button className="px-3 py-1 rounded border" onClick={() => setStep(step - 1)}>Back</button>
                )}
                {step < 4 && (
                  <button className="px-3 py-1 rounded bg-red-600 text-white" onClick={() => setStep(step + 1)}>Next</button>
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
                {step > 1 && (
                  <button className="px-4 py-2 rounded border" onClick={() => setStep(step - 1)}>Back</button>
                )}
                {step < 4 && (
                  <button className="ml-2 px-4 py-2 rounded bg-red-600 text-white" onClick={() => setStep(step + 1)}>Next</button>
                )}
              </div>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
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
