---
name: SchoolOS Finance module structure
description: Finance & Payments module pages, routes, and key design decisions
---

## Pages built
- `src/pages/FinanceDashboard.tsx` — 7 KPI cards, 4 ApexCharts, pending approvals table, recent transactions, "Record Payment" button
- `src/pages/PaymentHistory.tsx` — full payment history table with filters, reversal modal, CSV export, print
- `src/pages/Reconciliation.tsx` — 5-tab reconciliation: Paystack, Offline, Pending, Failed/Reversed, Outstanding
- `src/components/RecordPaymentModal.tsx` — multi-step modal: form → confirm → done; 6 payment methods with dynamic fields

## Routes
- `finance-dashboard` → FinanceDashboard
- `payment-history` → PaymentHistory
- `reconciliation` → Reconciliation
- `record-payment` → redirects to `finance-dashboard` (modal-based, not a page)
- `payments` → redirects to `payment-history` (legacy compat)

## Sidebar
- Group renamed from "Fees" to "Finance" (icon: TrendingUp)
- Children: Finance Dashboard, Fee Structure, Invoices, Record Payment, Payment History, Balances, Reconciliation

## Settings
- Added "Payment Settings" as 5th tab in Settings.tsx
- Sections: Paystack Online Payments (with Test Connection), Offline Methods toggles (Cash/MoMo/BankDeposit/BankTransfer/Cheque), Approval Workflow, Coming Soon providers

## Payment Methods (RecordPaymentModal)
All 6 methods with unique dynamic fields:
1. Cash → Receipt No, Received By
2. Direct Mobile Money → Network (MTN/Telecel/AirtelTigo), Sender, Transaction ID
3. Bank Deposit → Bank, Slip No, Depositor, Date
4. Bank Transfer → Bank, Account Name, Txn Ref, Date
5. Cheque → Bank, Cheque No, Date, Clearance Status
6. Paystack Online → payment link generation (SMS/WhatsApp/Copy)

**Why:** Three-step flow (form → confirm → done) prevents accidental submissions. Dynamic fields per method match how Ghanaian schools actually collect money.
