import { useState, useRef } from "react";
import { X, Upload, Download, FileText, CheckCircle } from "lucide-react";
import { downloadSampleTemplate } from "../utils/csvExport";

interface ImportModalProps {
  title: string;
  templateHeaders: string[];
  templateFilename: string;
  instructions?: string[];
  onClose: () => void;
  onImport?: (file: File) => void;
}

export default function ImportModal({
  title,
  templateHeaders,
  templateFilename,
  instructions,
  onClose,
  onImport,
}: ImportModalProps) {
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [done, setDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const defaultInstructions = instructions ?? [
    `Download the sample template and fill in your data.`,
    `Accepted formats: CSV or Excel (.xlsx).`,
    `Do not change the column headers in the template.`,
    `Save the file and upload it below.`,
    `Click Import to process your data.`,
  ];

  const handleFile = (f: File) => {
    if (f.name.endsWith(".csv") || f.name.endsWith(".xlsx") || f.name.endsWith(".xls")) {
      setFile(f);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleImport = () => {
    if (!file) return;
    setImporting(true);
    setTimeout(() => {
      setImporting(false);
      setDone(true);
      onImport?.(file);
      setTimeout(onClose, 1400);
    }, 1500);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)",
        zIndex: 70, display: "flex", alignItems: "center", justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "white", borderRadius: 16, width: "100%", maxWidth: 520,
          boxShadow: "0 20px 60px rgba(0,0,0,0.18)", animation: "slideUp 0.2s ease",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 20px", borderBottom: "1px solid #f3f4f6" }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>Import {title}</div>
            <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 1 }}>Upload a CSV or Excel file to import data</div>
          </div>
          <button onClick={onClose} style={{ background: "#f3f4f6", border: "none", borderRadius: "50%", width: 30, height: 30, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={14} color="#6b7280" />
          </button>
        </div>

        <div style={{ padding: "18px 20px" }}>
          {/* Template download */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f9fafb", borderRadius: 10, padding: "12px 14px", marginBottom: 14, border: "1px solid #e5e7eb" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <FileText size={16} color="#7c3aed" />
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: "#111827" }}>Sample Template</div>
                <div style={{ fontSize: 11.5, color: "#9ca3af" }}>{templateFilename}_template.csv</div>
              </div>
            </div>
            <button
              onClick={() => downloadSampleTemplate(templateFilename, templateHeaders)}
              style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 12px", border: "1px solid #7c3aed", borderRadius: 8, background: "white", color: "#7c3aed", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
            >
              <Download size={12} /> Download
            </button>
          </div>

          {/* Instructions */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: "#374151", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Instructions</div>
            <ol style={{ margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 4 }}>
              {defaultInstructions.map((ins, i) => (
                <li key={i} style={{ fontSize: 12.5, color: "#6b7280", lineHeight: 1.5 }}>{ins}</li>
              ))}
            </ol>
          </div>

          {/* Upload area */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            style={{
              border: `2px dashed ${dragOver ? "#7c3aed" : file ? "#16a34a" : "#d1d5db"}`,
              borderRadius: 12,
              padding: "24px 16px",
              textAlign: "center",
              cursor: "pointer",
              background: dragOver ? "#f5f3ff" : file ? "#f0fdf4" : "#fafafa",
              transition: "all 0.15s",
              marginBottom: 16,
            }}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              style={{ display: "none" }}
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
            />
            {done ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <CheckCircle size={28} color="#16a34a" />
                <div style={{ fontSize: 13, fontWeight: 600, color: "#16a34a" }}>Import successful!</div>
              </div>
            ) : file ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <FileText size={24} color="#16a34a" />
                <div style={{ fontSize: 13, fontWeight: 600, color: "#16a34a" }}>{file.name}</div>
                <div style={{ fontSize: 11.5, color: "#9ca3af" }}>{(file.size / 1024).toFixed(1)} KB — Click to change file</div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <Upload size={24} color="#9ca3af" />
                <div style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Drop your file here or click to browse</div>
                <div style={{ fontSize: 12, color: "#9ca3af" }}>CSV or Excel (.xlsx) — max 5 MB</div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button onClick={onClose} style={{ padding: "9px 18px", border: "1px solid #e5e7eb", borderRadius: 8, background: "white", color: "#6b7280", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
              Cancel
            </button>
            <button
              onClick={handleImport}
              disabled={!file || importing || done}
              style={{
                padding: "9px 22px", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: file && !importing && !done ? "pointer" : "not-allowed",
                background: file && !importing && !done ? "linear-gradient(135deg,#7c3aed,#6d28d9)" : "#e5e7eb",
                color: file && !importing && !done ? "white" : "#9ca3af",
                transition: "all 0.12s",
              }}
            >
              {importing ? "Importing…" : done ? "Done" : "Import"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
