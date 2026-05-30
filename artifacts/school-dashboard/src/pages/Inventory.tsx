import { useState } from "react";
import { Plus, Search, ChevronRight, X, Package, AlertTriangle } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useWindowSize } from "../hooks/useWindowSize";

type StockStatus = "In Stock" | "Low Stock" | "Out of Stock";
type ItemCategory = "Stationery" | "Furniture" | "Electronics" | "Sports" | "Science" | "Cleaning" | "Kitchen" | "Safety";

type InventoryItem = {
  id: number; name: string; category: ItemCategory; unit: string;
  quantity: number; minQuantity: number; unitCost: number;
  location: string; supplier: string; lastRestocked: string;
  status: StockStatus; emoji: string;
};

const inventory: InventoryItem[] = [
  { id: 1,  name: "A4 Printing Paper (Reams)",   category: "Stationery",  unit: "Reams",   quantity: 45,  minQuantity: 20,  unitCost: 45,   location: "Store Room A", supplier: "Office World GH",     lastRestocked: "10 May 2024", status: "In Stock",    emoji: "📄" },
  { id: 2,  name: "Blue Biro Pens",              category: "Stationery",  unit: "Boxes",   quantity: 12,  minQuantity: 10,  unitCost: 25,   location: "Store Room A", supplier: "Accra Stationery",    lastRestocked: "5 May 2024",  status: "Low Stock",   emoji: "🖊️" },
  { id: 3,  name: "Whiteboard Markers",          category: "Stationery",  unit: "Packs",   quantity: 3,   minQuantity: 5,   unitCost: 35,   location: "Store Room A", supplier: "Office World GH",     lastRestocked: "1 Apr 2024",  status: "Out of Stock",emoji: "🖊️" },
  { id: 4,  name: "Student Chairs",              category: "Furniture",   unit: "Units",   quantity: 248, minQuantity: 240, unitCost: 120,  location: "Various",      supplier: "Accra Furniture Co",  lastRestocked: "25 May 2024", status: "In Stock",    emoji: "🪑" },
  { id: 5,  name: "Teacher Desks",              category: "Furniture",   unit: "Units",   quantity: 14,  minQuantity: 12,  unitCost: 450,  location: "Various",      supplier: "Accra Furniture Co",  lastRestocked: "20 Mar 2024", status: "In Stock",    emoji: "🖥️" },
  { id: 6,  name: "Desktop Computers",          category: "Electronics", unit: "Units",   quantity: 32,  minQuantity: 30,  unitCost: 3200, location: "ICT Lab",      supplier: "TechGhana Ltd",       lastRestocked: "15 Jan 2024", status: "In Stock",    emoji: "💻" },
  { id: 7,  name: "Projectors",                 category: "Electronics", unit: "Units",   quantity: 2,   minQuantity: 3,   unitCost: 2800, location: "Store Room B", supplier: "TechGhana Ltd",       lastRestocked: "10 Sep 2023", status: "Low Stock",   emoji: "📽️" },
  { id: 8,  name: "Footballs",                  category: "Sports",      unit: "Units",   quantity: 8,   minQuantity: 5,   unitCost: 120,  location: "PE Store",     supplier: "Sports World GH",     lastRestocked: "3 Mar 2024",  status: "In Stock",    emoji: "⚽" },
  { id: 9,  name: "Volleyballs",                category: "Sports",      unit: "Units",   quantity: 4,   minQuantity: 4,   unitCost: 95,   location: "PE Store",     supplier: "Sports World GH",     lastRestocked: "3 Mar 2024",  status: "Low Stock",   emoji: "🏐" },
  { id: 10, name: "Microscopes",               category: "Science",     unit: "Units",   quantity: 12,  minQuantity: 10,  unitCost: 850,  location: "Science Lab",  supplier: "Lab Supplies GH",     lastRestocked: "10 Feb 2024", status: "In Stock",    emoji: "🔬" },
  { id: 11, name: "Bunsen Burners",            category: "Science",     unit: "Units",   quantity: 0,   minQuantity: 6,   unitCost: 320,  location: "Science Lab",  supplier: "Lab Supplies GH",     lastRestocked: "1 Sep 2023",  status: "Out of Stock",emoji: "🔥" },
  { id: 12, name: "Disinfectant (Litres)",     category: "Cleaning",    unit: "Litres",  quantity: 24,  minQuantity: 10,  unitCost: 18,   location: "Store Room B", supplier: "Clean Pro GH",        lastRestocked: "20 May 2024", status: "In Stock",    emoji: "🧹" },
  { id: 13, name: "Cooking Oil (Litres)",      category: "Kitchen",     unit: "Litres",  quantity: 40,  minQuantity: 20,  unitCost: 22,   location: "Kitchen",      supplier: "Kofi's Foodstuff",    lastRestocked: "28 May 2024", status: "In Stock",    emoji: "🫙" },
  { id: 14, name: "Fire Extinguishers",        category: "Safety",      unit: "Units",   quantity: 6,   minQuantity: 8,   unitCost: 450,  location: "Various",      supplier: "SafeGuard GH",        lastRestocked: "1 Jan 2024",  status: "Low Stock",   emoji: "🧯" },
];

const catStyle: Record<ItemCategory, { color: string; bg: string }> = {
  Stationery:  { color: "#7c3aed", bg: "#ede9fe" },
  Furniture:   { color: "#2563eb", bg: "#dbeafe" },
  Electronics: { color: "#0891b2", bg: "#cffafe" },
  Sports:      { color: "#16a34a", bg: "#dcfce7" },
  Science:     { color: "#9333ea", bg: "#fdf4ff" },
  Cleaning:    { color: "#0369a1", bg: "#dbeafe" },
  Kitchen:     { color: "#b45309", bg: "#fef3c7" },
  Safety:      { color: "#dc2626", bg: "#fee2e2" },
};

const statusStyle = (s: StockStatus) => {
  if (s === "In Stock")    return { bg: "#dcfce7", color: "#16a34a" };
  if (s === "Low Stock")   return { bg: "#fef3c7", color: "#d97706" };
  return                          { bg: "#fee2e2", color: "#dc2626" };
};

const categories: ItemCategory[] = ["Stationery","Furniture","Electronics","Sports","Science","Cleaning","Kitchen","Safety"];
const fmt = (n: number) => `GH₵ ${n.toLocaleString()}`;

export default function Inventory() {
  const { showToast } = useApp();
  const { isMobile }  = useWindowSize();

  const [selected,    setSelected]    = useState<InventoryItem>(inventory[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [catFilter,   setCatFilter]   = useState("All");
  const [statusFilter,setStatusFilter]= useState("All");
  const [showPanel,   setShowPanel]   = useState(false);
  const [showForm,    setShowForm]    = useState(false);

  const filtered = inventory.filter((item) => {
    const mSearch = !searchQuery || item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const mCat    = catFilter === "All" || item.category === catFilter;
    const mStatus = statusFilter === "All" || item.status === statusFilter;
    return mSearch && mCat && mStatus;
  });

  const totalItems  = inventory.length;
  const inStock     = inventory.filter(i => i.status === "In Stock").length;
  const lowStock    = inventory.filter(i => i.status === "Low Stock").length;
  const outOfStock  = inventory.filter(i => i.status === "Out of Stock").length;
  const totalValue  = inventory.reduce((s, i) => s + i.quantity * i.unitCost, 0);

  const ItemPanel = () => {
    const cs = catStyle[selected.category];
    const st = statusStyle(selected.status);
    const pct = Math.min(100, Math.round((selected.quantity / (selected.minQuantity * 2)) * 100));
    return (
      <div style={{ flex: 1, minWidth: 0, background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "12px 14px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Item Details</span>
          <div style={{ display: "flex", gap: 7 }}>
            {isMobile && <button onClick={() => setShowPanel(false)} style={{ background: "#f3f4f6", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 12, color: "#374151" }}>← Back</button>}
            <button onClick={() => showToast("Opening edit form...", "info")} style={{ padding: "6px 12px", border: "1px solid #e5e7eb", borderRadius: 8, background: "white", cursor: "pointer", fontSize: 12, fontWeight: 500, color: "#374151" }}>Edit</button>
          </div>
        </div>
        <div style={{ overflowY: "auto", flex: 1, padding: "16px", display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Header */}
          <div style={{ display: "flex", gap: 14, alignItems: "center", background: cs.bg, borderRadius: 12, padding: "16px", border: `1px solid ${cs.color}20` }}>
            <div style={{ width: 56, height: 56, borderRadius: 12, background: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>{selected.emoji}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#111827" }}>{selected.name}</div>
              <div style={{ fontSize: 12, color: cs.color, fontWeight: 600, marginTop: 3 }}>{selected.category}</div>
              <span style={{ display: "inline-block", marginTop: 4, fontSize: 11, fontWeight: 700, padding: "2px 9px", borderRadius: 20, background: st.bg, color: st.color }}>{selected.status}</span>
            </div>
          </div>

          {/* Stock level */}
          <div style={{ background: "#f9fafb", borderRadius: 10, padding: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>Stock Level</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: selected.quantity <= selected.minQuantity ? "#dc2626" : "#16a34a" }}>
                {selected.quantity} {selected.unit} {selected.quantity <= selected.minQuantity && <AlertTriangle size={12} style={{ display: "inline" }} />}
              </span>
            </div>
            <div style={{ height: 8, background: "#e5e7eb", borderRadius: 4, overflow: "hidden", marginBottom: 6 }}>
              <div style={{ width: `${pct}%`, height: "100%", background: pct > 60 ? "#16a34a" : pct > 25 ? "#d97706" : "#dc2626", borderRadius: 4 }} />
            </div>
            <div style={{ fontSize: 11, color: "#9ca3af" }}>Minimum required: {selected.minQuantity} {selected.unit}</div>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[
              { label: "Unit Cost",   value: fmt(selected.unitCost),                    bg: "#ede9fe", color: "#7c3aed" },
              { label: "Total Value", value: fmt(selected.quantity * selected.unitCost), bg: "#dbeafe", color: "#2563eb" },
            ].map((s) => (
              <div key={s.label} style={{ background: s.bg, borderRadius: 10, padding: "10px", textAlign: "center" }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 10, color: s.color, fontWeight: 600 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Details */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.06em", marginBottom: 8 }}>DETAILS</div>
            {[
              ["Location",       selected.location],
              ["Supplier",       selected.supplier],
              ["Last Restocked", selected.lastRestocked],
              ["Unit",           selected.unit],
            ].map(([k, v]) => (
              <div key={k as string} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #f9fafb" }}>
                <span style={{ fontSize: 11.5, color: "#9ca3af" }}>{k}</span>
                <span style={{ fontSize: 11.5, color: "#374151", fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <button onClick={() => { showToast(`Restock request sent for "${selected.name}"`, "success"); if (isMobile) setShowPanel(false); }} style={{ width: "100%", padding: "10px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "white", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>
              📦 Request Restock
            </button>
            <button onClick={() => { showToast(`Issue recorded for "${selected.name}"`, "info"); if (isMobile) setShowPanel(false); }} style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1px solid #e5e7eb", background: "white", color: "#374151", fontSize: 12.5, fontWeight: 500, cursor: "pointer" }}>
              📤 Record Issue / Usage
            </button>
            {(selected.status === "Low Stock" || selected.status === "Out of Stock") && (
              <div style={{ background: "#fef3c7", borderRadius: 9, padding: "10px 12px", display: "flex", gap: 8, alignItems: "flex-start", border: "1px solid #fde68a" }}>
                <AlertTriangle size={14} color="#d97706" style={{ flexShrink: 0, marginTop: 1 }} />
                <span style={{ fontSize: 12, color: "#92400e" }}>Stock is {selected.status === "Out of Stock" ? "depleted" : "running low"}. Consider placing a restock order with {selected.supplier}.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: isMobile ? "center" : "flex-start", marginBottom: 18, gap: 10 }}>
        <div>
          <h1 style={{ fontSize: isMobile ? 19 : 22, fontWeight: 700, color: "#111827", margin: 0 }}>Inventory</h1>
          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 4 }}>
              {["Dashboard","Operations","Inventory"].map((c, i, a) => (
                <span key={c} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ fontSize: 12, color: i === a.length - 1 ? "#374151" : "#9ca3af", fontWeight: i === a.length - 1 ? 500 : 400 }}>{c}</span>
                  {i < a.length - 1 && <ChevronRight size={11} color="#d1d5db" />}
                </span>
              ))}
            </div>
          )}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {!isMobile && <button onClick={() => showToast("Generating inventory report...", "info")} style={{ padding: "8px 12px", border: "1px solid #e5e7eb", borderRadius: 8, background: "white", cursor: "pointer", fontSize: 12.5, fontWeight: 500, color: "#374151" }}>📊 Export</button>}
          <button onClick={() => setShowForm(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", border: "none", borderRadius: 8, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", cursor: "pointer", fontSize: 12.5, fontWeight: 600, color: "white" }}>
            <Plus size={14} />{!isMobile && " Add Item"}
          </button>
        </div>
      </div>

      {/* KPI */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: 12, marginBottom: 16 }}>
        {[
          { label: "Total Items",  value: String(totalItems), icon: "📦", bg: "#ede9fe", color: "#7c3aed" },
          { label: "In Stock",     value: String(inStock),    icon: "✅", bg: "#dcfce7", color: "#16a34a" },
          { label: "Low / Out",    value: `${lowStock + outOfStock}`, icon: "⚠️", bg: "#fef3c7", color: "#d97706" },
          { label: "Total Value",  value: fmt(totalValue),    icon: "💰", bg: "#dbeafe", color: "#2563eb" },
        ].map((k) => (
          <div key={k.label} style={{ background: "white", borderRadius: 12, padding: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: k.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{k.icon}</div>
            <div>
              <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 500 }}>{k.label}</div>
              <div style={{ fontSize: isMobile ? 14 : 18, fontWeight: 800, color: "#111827" }}>{k.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ background: "white", borderRadius: 12, padding: "10px 14px", marginBottom: 14, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 180 }}>
          <Search size={12} style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
          <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search item name..."
            style={{ width: "100%", padding: "8px 10px 8px 28px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12.5, color: "#374151", outline: "none", background: "#fafafa", boxSizing: "border-box" }} />
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {["All","In Stock","Low Stock","Out of Stock"].map((f) => (
            <button key={f} onClick={() => setStatusFilter(f)} style={{ padding: "5px 9px", border: `1px solid ${statusFilter===f?"#7c3aed":"#e5e7eb"}`, borderRadius: 8, background: statusFilter===f?"#7c3aed":"white", color: statusFilter===f?"white":"#374151", fontSize: 11, fontWeight: statusFilter===f?600:400, cursor: "pointer", whiteSpace: "nowrap" }}>{f}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {["All", ...categories.slice(0, isMobile ? 3 : 6)].map((c) => (
            <button key={c} onClick={() => setCatFilter(c)} style={{ padding: "5px 9px", border: `1px solid ${catFilter===c?"#374151":"#e5e7eb"}`, borderRadius: 8, background: catFilter===c?"#111827":"white", color: catFilter===c?"white":"#374151", fontSize: 11, fontWeight: catFilter===c?600:400, cursor: "pointer" }}>{c}</button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 14, flexDirection: isMobile ? "column" : "row", height: isMobile ? "auto" : "calc(100vh - 310px)" }}>
        {(!isMobile || !showPanel) && (
          <div style={{ width: isMobile ? "100%" : 340, flexShrink: 0, background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "10px 14px", borderBottom: "1px solid #f3f4f6" }}>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: "#111827" }}>{filtered.length} item{filtered.length!==1?"s":""}</span>
            </div>
            <div style={{ overflowY: "auto", flex: 1 }}>
              {filtered.map((item) => {
                const cs = catStyle[item.category];
                const st = statusStyle(item.status);
                const isActive = selected.id === item.id;
                return (
                  <div key={item.id} onClick={() => { setSelected(item); if (isMobile) setShowPanel(true); }}
                    style={{ display: "flex", gap: 12, padding: "11px 14px", borderBottom: "1px solid #f9fafb", cursor: "pointer", background: isActive ? "#faf5ff" : item.status !== "In Stock" ? "#fffef5" : "white", borderLeft: `3px solid ${item.status === "Out of Stock" ? "#dc2626" : item.status === "Low Stock" ? "#d97706" : "transparent"}`, transition: "background 0.1s" }}
                    onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "#fafafa"; }}
                    onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = item.status !== "In Stock" ? "#fffef5" : "white"; }}
                  >
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: cs.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{item.emoji}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</div>
                      <div style={{ fontSize: 11.5, color: "#9ca3af", marginTop: 2 }}>{item.category} · {item.location}</div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                        <span style={{ fontSize: 11.5, fontWeight: 600, color: item.quantity <= item.minQuantity ? "#dc2626" : "#374151" }}>{item.quantity} {item.unit}</span>
                        <span style={{ fontSize: 10.5, fontWeight: 700, padding: "2px 7px", borderRadius: 10, background: st.bg, color: st.color }}>{item.status}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {(!isMobile || showPanel) && <ItemPanel />}
      </div>

      {isMobile && showPanel && (
        <div onClick={() => setShowPanel(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 50 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ position: "absolute", bottom: 60, left: 0, right: 0, background: "white", borderRadius: "20px 20px 0 0", maxHeight: "80vh", overflowY: "auto", animation: "slideUp 0.2s ease" }}>
            <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 0" }}><div style={{ width: 36, height: 4, borderRadius: 2, background: "#e5e7eb" }} /></div>
            <ItemPanel />
          </div>
        </div>
      )}

      {showForm && (
        <div onClick={() => setShowForm(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "white", borderRadius: 16, padding: "24px", maxWidth: 460, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)", animation: "slideIn 0.2s ease" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: 0 }}>Add Inventory Item</h2>
              <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}><X size={18} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[["Item Name","text","e.g. A4 Paper Reams"],["Supplier","text","e.g. Office World GH"],["Location","text","e.g. Store Room A"]].map(([l,t,p]) => (
                <div key={l as string}><label style={{ fontSize: 11.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>{l}</label><input type={t as string} placeholder={p as string} style={{ width: "100%", padding: "9px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12.5, color: "#374151", outline: "none", boxSizing: "border-box" }} /></div>
              ))}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                {[["Quantity","number","0"],["Min Level","number","0"],["Unit Cost","number","0"]].map(([l,t,p]) => (
                  <div key={l as string}><label style={{ fontSize: 11, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>{l}</label><input type={t as string} placeholder={p as string} style={{ width: "100%", padding: "8px 10px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12, color: "#374151", outline: "none", boxSizing: "border-box" }} /></div>
                ))}
              </div>
              <div><label style={{ fontSize: 11.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>Category</label>
                <select style={{ width: "100%", padding: "9px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 12.5, color: "#374151", outline: "none", fontFamily: "inherit", background: "white" }}>
                  {categories.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <button onClick={() => { showToast("Item added to inventory!", "success"); setShowForm(false); }} style={{ width: "100%", padding: "11px", border: "none", borderRadius: 9, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Add Item</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
