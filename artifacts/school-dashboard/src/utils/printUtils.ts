export function printElement(elementId: string, title = "Maxibern SchoolOS"): void {
  const el = document.getElementById(elementId);
  if (!el) return;

  const win = window.open("", "_blank", "width=900,height=700");
  if (!win) return;

  const styles = Array.from(document.styleSheets)
    .map((sheet) => {
      try {
        return Array.from(sheet.cssRules)
          .map((rule) => rule.cssText)
          .join("\n");
      } catch {
        return "";
      }
    })
    .join("\n");

  win.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>${title}</title>
        <style>
          ${styles}
          * { box-sizing: border-box; }
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            margin: 20px;
            color: #111827;
          }
          @media print {
            body { margin: 0; }
          }
          .no-print { display: none !important; }
        </style>
      </head>
      <body>
        ${el.innerHTML}
      </body>
    </html>
  `);
  win.document.close();
  win.focus();
  setTimeout(() => {
    win.print();
    win.close();
  }, 350);
}

export function printHTML(html: string, title = "Maxibern SchoolOS"): void {
  const win = window.open("", "_blank", "width=900,height=700");
  if (!win) return;

  win.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>${title}</title>
        <style>
          * { box-sizing: border-box; }
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            margin: 24px 32px;
            color: #111827;
            font-size: 13px;
            line-height: 1.5;
          }
          table { width: 100%; border-collapse: collapse; }
          th, td { padding: 8px 10px; text-align: left; border-bottom: 1px solid #e5e7eb; }
          th { background: #f9fafb; font-size: 11px; text-transform: uppercase; letter-spacing: .05em; color: #6b7280; font-weight: 700; }
          h1 { font-size: 20px; margin: 0 0 4px; }
          h2 { font-size: 15px; margin: 18px 0 8px; }
          .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 2px solid #7c3aed; }
          .school { font-size: 11px; color: #6b7280; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>${html}</body>
    </html>
  `);
  win.document.close();
  win.focus();
  setTimeout(() => {
    win.print();
    win.close();
  }, 350);
}
