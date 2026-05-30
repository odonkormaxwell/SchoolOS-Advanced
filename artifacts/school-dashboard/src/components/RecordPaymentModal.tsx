import { useState } from "react";
import { X, CheckCircle, CreditCard, ChevronDown } from "lucide-react";
import { useApp } from "../context/AppContext";
import { printHTML } from "../utils/printUtils";

type PaymentMethod = "Cash" | "Direct Mobile Money" | "Bank Deposit" | "Bank Transfer" | "Cheque" | "Paystack Online";

interface RecordPaymentModalProps {
  onClose: () => void;
  prefillStudent?: string;
  prefillInvoice?: string;
  prefillAmount?: number;
}

const students = [
  "Amos Kofi Asante (Basic 6)", "Akosua Adwoa Mensah (Basic 4)", "Abena Owusuaa Nkrumah (Basic 1)",
  "Yaw Antwi Boakye (Basic 5)", "Efua Korkor Lamptey (Basic 3)", "Daniel Ni Lartey (Basic 3)",
  "Nana Kweku Asiedu (Basic 1)", "Kwabena Frimpong Osei (Basic 4)", "Osei Bonsu Mintah (JHS 2)",
  "Akua Pomaa Acheampong (JHS 2)", "Yaw Adjei Mensah (JHS 2)", "Abena Birago Asante (JHS 3)",
  "Gifty Abena Asare (JHS 1)", "Emmanuel Aidoo Darko (JHS 1)", "Nana Ama Quayson (JHS 1)",
  "Francisca Nyarko Quaye (JHS 3)", "Kwabena Owusu Adjei (JHS 3)", "Micheal Kojo Addo (JHS 3)",
];

const invoices = [
  "INV-2026-0301 — Term 2 School Fees (GH₵ 1,800)",
  "INV-2026-0302 — Term 2 School Fees (GH₵ 1,200)",
  "INV-2026-0303 — Activity Fee (GH₵ 150)",
  "INV-2026-0304 — Computer Lab Fee (GH₵ 80)",
  "INV-2026-0305 — Library Fee (GH₵ 50)",
];

const feeCategories = ["School Fees", "Development Levy", "Activity Fee", "Computer Lab Fee", "Library Fee", "Science Lab Fee", "PTA Levy", "BECE Prep Fee", "Feeding Levy", "Transport Fee", "Uniform", "Books & Materials", "Other"];
const ghBanks = ["Absa Bank Ghana", "Access Bank Ghana", "Agricultural Development Bank", "CalBank", "Ecobank Ghana", "Fidelity Bank Ghana", "First Atlantic Bank", "Ghana Commercial Bank (GCB)", "Prudential Bank", "Republic Bank", "Stanbic Bank Ghana", "Standard Chartered Ghana", "United Bank for Africa (UBA)", "Zenith Bank Ghana"];

const inputS: React.CSSProperties = { width: "100%", padding: "9px 11px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 13, color: "#374151", outline: "none", fontFamily: "inherit", background: "white", boxSizing: "border-box" };
const selectS: React.CSSProperties = { ...inputS, cursor: "pointer", appearance: "none" };
const labelS: React.CSSProperties = { display: "block", fontSize: 12.5, fontWeight: 600, color: "#374151", marginBottom: 4 };

function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={labelS}>{label}{required && <span style={{ color: "#dc2626", marginLeft: 2 }}>*</span>}</label>
      {children}
      {hint && <div style={{ fontSize: 11.5, color: "#9ca3af", marginTop: 3 }}>{hint}</div>}
    </div>
  );
}

function SelectField({ label, required, value, onChange, options, hint }: {
  label: string; required?: boolean; value: string; hint?: string;
  onChange: (v: string) => void; options: string[];
}) {
  return (
    <Field label={label} required={required} hint={hint}>
      <div style={{ position: "relative" }}>
        <select style={selectS} value={value} onChange={(e) => onChange(e.target.value)}>
          <option value="">— Select —</option>
          {options.map(o => <option key={o}>{o}</option>)}
        </select>
        <ChevronDown size={11} color="#9ca3af" style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
      </div>
    </Field>
  );
}

function InputField({ label, required, value, onChange, type = "text", placeholder, hint }: {
  label: string; required?: boolean; value: string; hint?: string;
  onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
  return (
    <Field label={label} required={required} hint={hint}>
      <input style={inputS} type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </Field>
  );
}

const methodMeta: Record<PaymentMethod, { color: string; bg: string; emoji: string }> = {
  "Cash":               { color: "#16a34a", bg: "#dcfce7", emoji: "💵" },
  "Direct Mobile Money":{ color: "#2563eb", bg: "#dbeafe", emoji: "📱" },
  "Bank Deposit":       { color: "#d97706", bg: "#fef3c7", emoji: "🏦" },
  "Bank Transfer":      { color: "#7c3aed", bg: "#ede9fe", emoji: "💸" },
  "Cheque":             { color: "#0891b2", bg: "#ecfeff", emoji: "📝" },
  "Paystack Online":    { color: "#006AFF", bg: "#e0f2fe", emoji: "💳" },
};

export default function RecordPaymentModal({ onClose, prefillStudent = "", prefillInvoice = "", prefillAmount }: RecordPaymentModalProps) {
  const { showToast } = useApp();
  const [step, setStep]   = useState<"form" | "confirm" | "done">("form");

  // Common fields
  const [student,     setStudent]     = useState(prefillStudent);
  const [invoice,     setInvoice]     = useState(prefillInvoice);
  const [category,    setCategory]    = useState("");
  const [amount,      setAmount]      = useState(prefillAmount ? String(prefillAmount) : "");
  const [method,      setMethod]      = useState<PaymentMethod | "">("");
  const [date,        setDate]        = useState(new Date().toISOString().split("T")[0]);
  const [reference,   setReference]   = useState("");
  const [notes,       setNotes]       = useState("");

  // Cash-specific
  const [receiptNo,   setReceiptNo]   = useState("");
  const [receivedBy,  setReceivedBy]  = useState("");

  // MoMo-specific
  const [network,     setNetwork]     = useState("");
  const [senderName,  setSenderName]  = useState("");
  const [senderPhone, setSenderPhone] = useState("");
  const [txnId,       setTxnId]       = useState("");

  // Bank-specific (Deposit & Transfer)
  const [bankName,    setBankName]    = useState("");
  const [slipNo,      setSlipNo]      = useState("");
  const [depositorName,setDepositorName] = useState("");
  const [depositDate, setDepositDate] = useState("");
  const [accountName, setAccountName] = useState("");
  const [txnRef,      setTxnRef]      = useState("");
  const [transferDate,setTransferDate]= useState("");

  // Cheque-specific
  const [chequeNo,    setChequeNo]    = useState("");
  const [chequeDate,  setChequeDate]  = useState("");
  const [clearStatus, setClearStatus] = useState("Pending Clearance");

  const isValid = student && category && amount && method && date;

  const handleSubmit = () => {
    if (!isValid) { showToast("Please fill in all required fields", "error"); return; }
    setStep("confirm");
  };

  const handleConfirm = () => {
    setStep("done");
    showToast(`Payment of GH₵ ${Number(amount).toLocaleString()} recorded for ${student.split(" (")[0]}`, "success");
  };

  const handlePrintReceipt = () => {
    const stName = student.split(" (")[0];
    printHTML(`
      <div class="header">
        <div>
          <h1>Payment Receipt</h1>
          <div class="school">Happy Kids Basic School · Accra, Ghana</div>
        </div>
        <div class="school">Receipt No: RCP-2026-${Math.floor(Math.random()*9000+1000)}</div>
      </div>
      <table>
        <tbody>
          <tr><td style="font-weight:600;color:#6b7280;width:45%">Student</td><td>${stName}</td></tr>
          <tr><td style="font-weight:600;color:#6b7280">Invoice</td><td>${invoice || "—"}</td></tr>
          <tr><td style="font-weight:600;color:#6b7280">Fee Category</td><td>${category}</td></tr>
          <tr><td style="font-weight:600;color:#6b7280">Amount Paid</td><td style="font-weight:700;color:#7c3aed;font-size:15px">GH₵ ${Number(amount).toLocaleString()}</td></tr>
          <tr><td style="font-weight:600;color:#6b7280">Payment Method</td><td>${method}</td></tr>
          <tr><td style="font-weight:600;color:#6b7280">Reference</td><td>${reference || "—"}</td></tr>
          <tr><td style="font-weight:600;color:#6b7280">Payment Date</td><td>${date}</td></tr>
          <tr><td style="font-weight:600;color:#6b7280">Printed</td><td>${new Date().toLocaleDateString("en-GB")}</td></tr>
          ${notes ? `<tr><td style="font-weight:600;color:#6b7280">Notes</td><td>${notes}</td></tr>` : ""}
        </tbody>
      </table>
      <p style="margin-top:24px;font-size:11px;color:#9ca3af;text-align:center">Thank you for your payment. Please keep this receipt for your records.</p>
    `, "Payment Receipt");
  };

  const meta = method ? methodMeta[method] : null;

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 70, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: "white", borderRadius: 16, width: "100%", maxWidth: 540, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.18)", animation: "slideUp 0.2s ease" }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid #f3f4f6", position: "sticky", top: 0, background: "white", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: "#f5f3ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CreditCard size={16} color="#7c3aed" />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>
                {step === "done" ? "Payment Recorded" : step === "confirm" ? "Confirm Payment" : "Record Payment"}
              </div>
              <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 1 }}>
                {step === "done" ? "Receipt ready" : step === "confirm" ? "Review before saving" : "Offline payment recording"}
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "#f3f4f6", border: "none", borderRadius: "50%", width: 30, height: 30, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={14} color="#6b7280" />
          </button>
        </div>

        {/* Done state */}
        {step === "done" && (
          <div style={{ padding: 24, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, textAlign: "center" }}>
            <CheckCircle size={52} color="#16a34a" />
            <div>
              <div style={{ fontSize: 17, fontWeight: 700, color: "#111827" }}>Payment Recorded!</div>
              <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>
                GH₵ {Number(amount).toLocaleString()} · {student.split(" (")[0]} · {method}
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, width: "100%" }}>
              <button onClick={handlePrintReceipt} style={{ flex: 1, padding: "10px", border: "1px solid #e5e7eb", borderRadius: 8, background: "white", cursor: "pointer", fontSize: 13, fontWeight: 500, color: "#374151" }}>
                🖨️ Print Receipt
              </button>
              <button onClick={() => showToast("SMS receipt sent to parent", "success")} style={{ flex: 1, padding: "10px", border: "none", borderRadius: 8, background: "#f0fdf4", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#16a34a" }}>
                📱 Send SMS
              </button>
              <button onClick={() => showToast("WhatsApp receipt sent", "success")} style={{ flex: 1, padding: "10px", border: "none", borderRadius: 8, background: "#eff6ff", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#2563eb" }}>
                💬 WhatsApp
              </button>
            </div>
            <button onClick={onClose} style={{ padding: "10px 24px", border: "none", borderRadius: 8, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "white" }}>Done</button>
          </div>
        )}

        {/* Confirm state */}
        {step === "confirm" && (
          <div style={{ padding: 20 }}>
            <div style={{ background: meta?.bg ?? "#f3f4f6", borderRadius: 12, padding: "16px", marginBottom: 16, textAlign: "center" }}>
              <div style={{ fontSize: 11, color: meta?.color ?? "#374151", fontWeight: 600, letterSpacing: "0.06em" }}>PAYMENT AMOUNT</div>
              <div style={{ fontSize: 30, fontWeight: 900, color: meta?.color ?? "#111827" }}>GH₵ {Number(amount).toLocaleString()}</div>
              <div style={{ fontSize: 13, color: meta?.color ?? "#374151", marginTop: 4 }}>{meta?.emoji} {method}</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
              {[
                ["Student",       student.split(" (")[0]],
                ["Category",      category],
                ["Payment Date",  date],
                ["Reference",     reference || "—"],
                ...(method === "Cash" ? [["Receipt No.", receiptNo || "—"], ["Received By", receivedBy || "—"]] : []),
                ...(method === "Direct Mobile Money" ? [["Network", network], ["Sender", senderName], ["Transaction ID", txnId]] : []),
                ...(method === "Bank Deposit" ? [["Bank", bankName], ["Slip No.", slipNo], ["Depositor", depositorName]] : []),
                ...(method === "Bank Transfer" ? [["Bank", bankName], ["Account Name", accountName], ["Txn Reference", txnRef]] : []),
                ...(method === "Cheque" ? [["Bank", bankName], ["Cheque No.", chequeNo], ["Status", clearStatus]] : []),
              ].map(([k, v]) => (
                <div key={String(k)} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f9fafb" }}>
                  <span style={{ fontSize: 12, color: "#9ca3af" }}>{k}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setStep("form")} style={{ flex: 1, padding: "10px", border: "1px solid #e5e7eb", borderRadius: 8, background: "white", cursor: "pointer", fontSize: 13, fontWeight: 500, color: "#374151" }}>Edit</button>
              <button onClick={handleConfirm} style={{ flex: 2, padding: "10px", border: "none", borderRadius: 8, background: "linear-gradient(135deg,#16a34a,#15803d)", cursor: "pointer", fontSize: 13, fontWeight: 700, color: "white" }}>Confirm & Record</button>
            </div>
          </div>
        )}

        {/* Form state */}
        {step === "form" && (
          <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Core fields */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ gridColumn: "1 / -1" }}>
                <SelectField label="Student" required value={student} onChange={setStudent} options={students} />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <SelectField label="Invoice" value={invoice} onChange={setInvoice} options={invoices} />
              </div>
              <SelectField label="Fee Category" required value={category} onChange={setCategory} options={feeCategories} />
              <InputField label="Amount (GH₵)" required type="number" value={amount} onChange={setAmount} placeholder="e.g. 1200" />
            </div>

            {/* Payment method selector */}
            <div>
              <label style={labelS}>Payment Method<span style={{ color: "#dc2626", marginLeft: 2 }}>*</span></label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
                {(["Cash", "Direct Mobile Money", "Bank Deposit", "Bank Transfer", "Cheque", "Paystack Online"] as PaymentMethod[]).map((m) => {
                  const mt = methodMeta[m];
                  const active = method === m;
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMethod(m)}
                      style={{
                        padding: "8px 6px", border: `2px solid ${active ? mt.color : "#e5e7eb"}`,
                        borderRadius: 9, background: active ? mt.bg : "white", cursor: "pointer",
                        display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                        transition: "all 0.1s",
                      }}
                    >
                      <span style={{ fontSize: 18 }}>{mt.emoji}</span>
                      <span style={{ fontSize: 10.5, fontWeight: active ? 700 : 500, color: active ? mt.color : "#6b7280", textAlign: "center", lineHeight: 1.2 }}>{m}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dynamic fields per method */}
            {method === "Cash" && (
              <div style={{ background: "#f0fdf4", borderRadius: 10, padding: "12px 14px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#16a34a", gridColumn: "1/-1", marginBottom: -2 }}>💵 CASH PAYMENT DETAILS</div>
                <InputField label="Receipt Number" value={receiptNo} onChange={setReceiptNo} placeholder="RCP-2026-0001" />
                <InputField label="Received By" value={receivedBy} onChange={setReceivedBy} placeholder="Name of collector" />
              </div>
            )}

            {method === "Direct Mobile Money" && (
              <div style={{ background: "#eff6ff", borderRadius: 10, padding: "12px 14px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#2563eb", gridColumn: "1/-1", marginBottom: -2 }}>📱 MOBILE MONEY DETAILS</div>
                <SelectField label="Network" required value={network} onChange={setNetwork} options={["MTN Mobile Money", "Telecel Cash", "AirtelTigo Money"]} />
                <InputField label="Transaction ID" required value={txnId} onChange={setTxnId} placeholder="e.g. MTN20260530-0021" />
                <InputField label="Sender Name" value={senderName} onChange={setSenderName} placeholder="Full name of sender" />
                <InputField label="Sender Mobile" value={senderPhone} onChange={setSenderPhone} placeholder="024 000 0000" />
              </div>
            )}

            {method === "Bank Deposit" && (
              <div style={{ background: "#fffbeb", borderRadius: 10, padding: "12px 14px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#d97706", gridColumn: "1/-1", marginBottom: -2 }}>🏦 BANK DEPOSIT DETAILS</div>
                <div style={{ gridColumn: "1/-1" }}>
                  <SelectField label="Bank Name" required value={bankName} onChange={setBankName} options={ghBanks} />
                </div>
                <InputField label="Deposit Slip Number" required value={slipNo} onChange={setSlipNo} placeholder="e.g. GCB-DEP-0041" />
                <InputField label="Depositor Name" value={depositorName} onChange={setDepositorName} placeholder="Name on slip" />
                <div style={{ gridColumn: "1/-1" }}>
                  <InputField label="Deposit Date" type="date" value={depositDate} onChange={setDepositDate} />
                </div>
              </div>
            )}

            {method === "Bank Transfer" && (
              <div style={{ background: "#f5f3ff", borderRadius: 10, padding: "12px 14px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#7c3aed", gridColumn: "1/-1", marginBottom: -2 }}>💸 BANK TRANSFER DETAILS</div>
                <div style={{ gridColumn: "1/-1" }}>
                  <SelectField label="Bank Name" required value={bankName} onChange={setBankName} options={ghBanks} />
                </div>
                <InputField label="Account Name" value={accountName} onChange={setAccountName} placeholder="Account holder name" />
                <InputField label="Transaction Reference" required value={txnRef} onChange={setTxnRef} placeholder="e.g. ECO-TXN-8821" />
                <div style={{ gridColumn: "1/-1" }}>
                  <InputField label="Transfer Date" type="date" value={transferDate} onChange={setTransferDate} />
                </div>
              </div>
            )}

            {method === "Cheque" && (
              <div style={{ background: "#ecfeff", borderRadius: 10, padding: "12px 14px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#0891b2", gridColumn: "1/-1", marginBottom: -2 }}>📝 CHEQUE DETAILS</div>
                <div style={{ gridColumn: "1/-1" }}>
                  <SelectField label="Bank Name" required value={bankName} onChange={setBankName} options={ghBanks} />
                </div>
                <InputField label="Cheque Number" required value={chequeNo} onChange={setChequeNo} placeholder="e.g. 004521" />
                <InputField label="Cheque Date" type="date" value={chequeDate} onChange={setChequeDate} />
                <div style={{ gridColumn: "1/-1" }}>
                  <SelectField label="Clearance Status" value={clearStatus} onChange={setClearStatus} options={["Pending Clearance", "Cleared", "Rejected"]} />
                </div>
              </div>
            )}

            {method === "Paystack Online" && (
              <div style={{ background: "#e0f2fe", borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#006AFF", marginBottom: 8 }}>💳 PAYSTACK ONLINE PAYMENT</div>
                <div style={{ fontSize: 12.5, color: "#0369a1", lineHeight: 1.6 }}>
                  A payment link will be generated and can be shared with the parent via SMS, WhatsApp, or Email. The invoice will be updated automatically when payment is confirmed by Paystack.
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  {["Send via SMS", "Send via WhatsApp", "Copy Link"].map(a => (
                    <button key={a} onClick={() => showToast(`${a} — payment link ready`, "success")} style={{ flex: 1, padding: "7px", border: "1px solid #bae6fd", borderRadius: 7, background: "white", cursor: "pointer", fontSize: 11.5, fontWeight: 600, color: "#0284c7" }}>{a}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Date and reference */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <InputField label="Payment Date" required type="date" value={date} onChange={setDate} />
              <InputField label="Reference Number" value={reference} onChange={setReference} placeholder="Optional reference" />
            </div>
            <Field label="Notes">
              <textarea
                style={{ ...inputS, minHeight: 64, resize: "vertical" }}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes or comments…"
              />
            </Field>

            {/* Actions */}
            <div style={{ display: "flex", gap: 8, paddingTop: 4 }}>
              <button onClick={onClose} style={{ flex: 1, padding: "10px", border: "1px solid #e5e7eb", borderRadius: 8, background: "white", cursor: "pointer", fontSize: 13, fontWeight: 500, color: "#374151" }}>Cancel</button>
              <button
                onClick={handleSubmit}
                disabled={!isValid}
                style={{
                  flex: 2, padding: "10px", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: isValid ? "pointer" : "not-allowed",
                  background: isValid ? "linear-gradient(135deg,#7c3aed,#6d28d9)" : "#e5e7eb",
                  color: isValid ? "white" : "#9ca3af", transition: "all 0.12s",
                }}
              >
                Review Payment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
