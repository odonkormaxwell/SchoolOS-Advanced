import { useState } from "react";
import { Plus, Search, ChevronRight, X, AlertTriangle } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useWindowSize } from "../hooks/useWindowSize";

type MealStatus = "Served" | "Pending" | "Absent";

type ClassMeal = {
  class: string; enrolled: number; served: number; absent: number;
  teacher: string; status: MealStatus;
};

type MenuItem = { name: string; calories: string; emoji: string; allergens?: string };

type InventoryStock = { item: string; qty: string; unit: string; status: "ok" | "low" | "out"; emoji: string };

const today = "Thursday, 30 May 2024";

const classMeals: ClassMeal[] = [
  { class: "Nursery 1", enrolled: 22, served: 20, absent: 2,  teacher: "Mrs. A. Asante",   status: "Served"  },
  { class: "Nursery 2", enrolled: 25, served: 25, absent: 0,  teacher: "Mrs. A. Boateng",  status: "Served"  },
  { class: "KG 1",      enrolled: 28, served: 26, absent: 2,  teacher: "Ms. G. Tetteh",    status: "Served"  },
  { class: "KG 2",      enrolled: 30, served: 29, absent: 1,  teacher: "Mrs. A. Aidoo",    status: "Served"  },
  { class: "P1",        enrolled: 35, served: 34, absent: 1,  teacher: "Mr. N. Lartey",    status: "Served"  },
  { class: "P2",        enrolled: 38, served: 37, absent: 1,  teacher: "Mrs. A. Asante",   status: "Served"  },
  { class: "P3",        enrolled: 40, served: 40, absent: 0,  teacher: "Mr. K. Mensah",    status: "Served"  },
  { class: "P4",        enrolled: 42, served: 0,  absent: 0,  teacher: "Mr. K. Opoku",     status: "Pending" },
  { class: "P5 - Ruby", enrolled: 44, served: 0,  absent: 0,  teacher: "Mme. A. Boakye",   status: "Pending" },
  { class: "P6 - Topaz",enrolled: 46, served: 0,  absent: 0,  teacher: "Mr. K. Mensah",    status: "Pending" },
];

const menu: { day: string; menu: MenuItem[]; active: boolean }[] = [
  { day: "Monday",    active: false, menu: [{ name: "Jollof Rice + Chicken", calories: "650 kcal", emoji: "🍚", allergens: "Gluten" }, { name: "Mixed Vegetables", calories: "80 kcal", emoji: "🥗" }, { name: "Fresh Orange Juice", calories: "90 kcal", emoji: "🍊" }] },
  { day: "Tuesday",   active: false, menu: [{ name: "Fried Rice + Sausage",  calories: "600 kcal", emoji: "🍳", allergens: "Gluten, Pork" }, { name: "Coleslaw",          calories: "60 kcal",  emoji: "🥗" }, { name: "Water",              calories: "0 kcal",   emoji: "💧" }] },
  { day: "Wednesday", active: false, menu: [{ name: "Waakye + Stew",         calories: "700 kcal", emoji: "🫘", allergens: "Gluten" }, { name: "Boiled Egg",        calories: "70 kcal",  emoji: "🥚" }, { name: "Sobolo (Hibiscus)", calories: "40 kcal",  emoji: "🥤" }] },
  { day: "Thursday",  active: true,  menu: [{ name: "Banku + Okro Stew",     calories: "550 kcal", emoji: "🌽", allergens: "Fish" }, { name: "Fried Tilapia",     calories: "220 kcal", emoji: "🐟", allergens: "Fish" }, { name: "Coconut Water",     calories: "45 kcal",  emoji: "🥥" }] },
  { day: "Friday",    active: false, menu: [{ name: "Kenkey + Fish",          calories: "500 kcal", emoji: "🌯", allergens: "Fish, Gluten" }, { name: "Pepper Sauce",    calories: "30 kcal",  emoji: "🌶️" }, { name: "Milo Drink",        calories: "130 kcal", emoji: "☕", allergens: "Milk" }] },
];

const stock: InventoryStock[] = [
  { item: "Rice (50kg bags)",    qty: "8",  unit: "bags",   status: "ok",  emoji: "🍚" },
  { item: "Cooking Oil",         qty: "12", unit: "litres", status: "ok",  emoji: "🫙" },
  { item: "Tomatoes",            qty: "20", unit: "kg",     status: "ok",  emoji: "🍅" },
  { item: "Onions",              qty: "15", unit: "kg",     status: "ok",  emoji: "🧅" },
  { item: "Fish (frozen)",       qty: "30", unit: "kg",     status: "ok",  emoji: "🐟" },
  { item: "Okro",                qty: "4",  unit: "kg",     status: "low", emoji: "🫛" },
  { item: "Cassava (Banku mix)", qty: "0",  unit: "bags",   status: "out", emoji: "🌽" },
  { item: "Salt",                qty: "6",  unit: "kg",     status: "ok",  emoji: "🧂" },
  { item: "Pepper",              qty: "3",  unit: "kg",     status: "low", emoji: "🌶️" },
  { item: "Coconut",             qty: "40", unit: "pieces", status: "ok",  emoji: "🥥" },
];

const stockStyle = (s: "ok" | "low" | "out") => {
  if (s === "ok")  return { bg: "#dcfce7", color: "#16a34a", label: "Good"      };
  if (s === "low") return { bg: "#fef3c7", color: "#d97706", label: "Low Stock" };
  return                  { bg: "#fee2e2", color: "#dc2626", label: "Out of Stock" };
};

type Tab = "today" | "menu" | "stock";

export default function Feeding() {
  const { showToast } = useApp();
  const { isMobile }  = useWindowSize();
  const [tab, setTab] = useState<Tab>("today");

  const totalEnrolled = classMeals.reduce((s, c) => s + c.enrolled, 0);
  const totalServed   = classMeals.reduce((s, c) => s + c.served,   0);
  const pending       = classMeals.filter(c => c.status === "Pending").length;
  const lowItems      = stock.filter(i => i.status !== "ok").length;

  const todayMenu = menu.find(m => m.active)!;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: isMobile ? "center" : "flex-start", marginBottom: 18, gap: 10 }}>
        <div>
          <h1 style={{ fontSize: isMobile ? 19 : 22, fontWeight: 700, color: "#111827", margin: 0 }}>Feeding Programme</h1>
          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 4 }}>
              {["Dashboard","Operations","Feeding"].map((c, i, a) => (
                <span key={c} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ fontSize: 12, color: i === a.length - 1 ? "#374151" : "#9ca3af", fontWeight: i === a.length - 1 ? 500 : 400 }}>{c}</span>
                  {i < a.length - 1 && <ChevronRight size={11} color="#d1d5db" />}
                </span>
              ))}
            </div>
          )}
        </div>
        <button onClick={() => showToast("Opening meal planning form...", "info")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", border: "none", borderRadius: 8, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", cursor: "pointer", fontSize: 12.5, fontWeight: 600, color: "white" }}>
          <Plus size={14} />{!isMobile && " Plan Meal"}
        </button>
      </div>

      {/* KPI */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: 12, marginBottom: 16 }}>
        {[
          { label: "Enrolled",      value: String(totalEnrolled), icon: "👨‍🍳", bg: "#ede9fe", color: "#7c3aed" },
          { label: "Served Today",  value: String(totalServed),   icon: "✅",  bg: "#dcfce7", color: "#16a34a" },
          { label: "Classes Pending",value: String(pending),      icon: "⏳",  bg: "#fef3c7", color: "#d97706" },
          { label: "Stock Alerts",  value: String(lowItems),      icon: "⚠️",  bg: "#fee2e2", color: "#dc2626" },
        ].map((k) => (
          <div key={k.label} style={{ background: "white", borderRadius: 12, padding: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: k.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{k.icon}</div>
            <div>
              <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 500 }}>{k.label}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#111827" }}>{k.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 14, background: "white", borderRadius: 10, padding: 4, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", width: "fit-content" }}>
        {(["today","menu","stock"] as Tab[]).map((t) => {
          const labels: Record<Tab, string> = { today: "🍽️ Today's Meals", menu: "📅 Weekly Menu", stock: "📦 Kitchen Stock" };
          return (
            <button key={t} onClick={() => setTab(t)} style={{ padding: "7px 14px", border: "none", borderRadius: 8, background: tab===t?"linear-gradient(135deg,#7c3aed,#6d28d9)":"transparent", color: tab===t?"white":"#6b7280", fontSize: 12.5, fontWeight: tab===t?600:400, cursor: "pointer", whiteSpace: "nowrap" }}>
              {labels[t]}
            </button>
          );
        })}
      </div>

      {/* Today tab */}
      {tab === "today" && (
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 }}>
          {/* Meal progress */}
          <div style={{ background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Class Meal Status — {today.split(",")[0]}</span>
              <span style={{ fontSize: 12, color: "#16a34a", fontWeight: 600 }}>{totalServed}/{totalEnrolled} served</span>
            </div>
            <div style={{ padding: "8px 0", maxHeight: 380, overflowY: "auto" }}>
              {classMeals.map((cls) => {
                const pct = cls.enrolled > 0 ? Math.round((cls.served / cls.enrolled) * 100) : 0;
                return (
                  <div key={cls.class} style={{ padding: "10px 16px", borderBottom: "1px solid #f9fafb" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                      <div>
                        <span style={{ fontSize: 12.5, fontWeight: 700, color: "#111827" }}>{cls.class}</span>
                        <span style={{ fontSize: 11, color: "#9ca3af", marginLeft: 8 }}>{cls.teacher}</span>
                      </div>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span style={{ fontSize: 11.5, color: "#374151" }}>{cls.served}/{cls.enrolled}</span>
                        <span style={{ fontSize: 10.5, fontWeight: 700, padding: "2px 8px", borderRadius: 10, background: cls.status==="Served"?"#dcfce7":cls.status==="Pending"?"#fef3c7":"#fee2e2", color: cls.status==="Served"?"#16a34a":cls.status==="Pending"?"#d97706":"#dc2626" }}>{cls.status}</span>
                      </div>
                    </div>
                    <div style={{ height: 5, background: "#f3f4f6", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: pct===100?"#16a34a":pct>0?"#7c3aed":"#e5e7eb", borderRadius: 3 }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ padding: "10px 16px", borderTop: "1px solid #f3f4f6" }}>
              <button onClick={() => showToast("Meal serving recorded for all pending classes", "success")} style={{ width: "100%", padding: "9px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "white", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>
                ✅ Mark All Pending as Served
              </button>
            </div>
          </div>

          {/* Today's menu */}
          <div style={{ background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid #f3f4f6", background: "linear-gradient(135deg,#7c3aed15,#7c3aed08)" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Today's Menu — {todayMenu.day}</div>
              <div style={{ fontSize: 11.5, color: "#7c3aed", fontWeight: 500, marginTop: 2 }}>{today}</div>
            </div>
            <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 12 }}>
              {todayMenu.menu.map((item) => (
                <div key={item.name} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "12px", background: "#f9fafb", borderRadius: 10 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>{item.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{item.name}</div>
                    <div style={{ fontSize: 11.5, color: "#9ca3af", marginTop: 2 }}>{item.calories}</div>
                    {item.allergens && <div style={{ fontSize: 11, color: "#d97706", fontWeight: 600, marginTop: 4 }}>⚠️ Contains: {item.allergens}</div>}
                  </div>
                </div>
              ))}
              <div style={{ background: "#dbeafe", borderRadius: 9, padding: "10px 12px" }}>
                <div style={{ fontSize: 12, color: "#1e3a8a", fontWeight: 600 }}>📊 Total Calories: ~815 kcal per student</div>
                <div style={{ fontSize: 11, color: "#2563eb", marginTop: 2 }}>Meets Ghana School Feeding Programme nutritional standards.</div>
              </div>
              <button onClick={() => showToast("Menu SMS sent to all parents", "success")} style={{ width: "100%", padding: "9px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#f9fafb", color: "#374151", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>
                📱 Share Menu with Parents
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Menu tab */}
      {tab === "menu" && (
        <div style={{ background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", overflow: "hidden" }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Weekly Meal Menu — Week of 27 May 2024</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(5,1fr)", gap: 0 }}>
            {menu.map((day, di) => (
              <div key={day.day} style={{ borderRight: di < menu.length-1 && !isMobile ? "1px solid #f3f4f6" : "none", borderBottom: isMobile && di < menu.length-1 ? "1px solid #f3f4f6" : "none" }}>
                <div style={{ padding: "10px 12px", background: day.active ? "linear-gradient(135deg,#7c3aed,#6d28d9)" : "#f9fafb", borderBottom: "1px solid #f3f4f6" }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: day.active ? "white" : "#374151" }}>{day.day}</div>
                  {day.active && <div style={{ fontSize: 10, color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>Today</div>}
                </div>
                <div style={{ padding: "10px 12px", display: "flex", flexDirection: "column", gap: 8 }}>
                  {day.menu.map((item) => (
                    <div key={item.name} style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
                      <span style={{ fontSize: 16, flexShrink: 0 }}>{item.emoji}</span>
                      <div>
                        <div style={{ fontSize: 11.5, fontWeight: 600, color: "#374151", lineHeight: 1.3 }}>{item.name}</div>
                        <div style={{ fontSize: 10, color: "#9ca3af" }}>{item.calories}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stock tab */}
      {tab === "stock" && (
        <div style={{ background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", overflow: "hidden" }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Kitchen Stock Levels</span>
            <button onClick={() => showToast("Restock request sent to supplier", "success")} style={{ padding: "6px 12px", border: "none", borderRadius: 8, background: "#7c3aed", color: "white", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>📦 Order Restock</button>
          </div>
          <div>
            {stock.map((item) => {
              const ss = stockStyle(item.status);
              return (
                <div key={item.item} style={{ display: "flex", gap: 12, padding: "12px 16px", borderBottom: "1px solid #f9fafb", alignItems: "center" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: ss.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{item.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: "#111827" }}>{item.item}</div>
                    <div style={{ fontSize: 11.5, color: "#9ca3af", marginTop: 2 }}>{item.qty} {item.unit} in stock</div>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    {(item.status === "low" || item.status === "out") && <AlertTriangle size={14} color="#d97706" />}
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: ss.bg, color: ss.color }}>{ss.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
