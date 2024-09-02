"use client";

import { saveAs } from "file-saver";
import { useState } from "react";
import Papa from "papaparse";

export function TabularEditor() {
  const [rows, setRows] = useState<object[]>([]);

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {};

  const handleExport = () => {
    const csv = Papa.unparse(rows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "invoices.csv");
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleImport} />
      <button onClick={handleExport}>Export CSV</button>
    </div>
  );
}
