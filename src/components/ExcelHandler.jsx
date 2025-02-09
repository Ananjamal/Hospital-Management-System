import React from "react";
import { Button, Upload } from "antd";
import { FileExcelOutlined, ImportOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function ExcelHandler({ onImport, data, exportFileName = "data.xlsx" }) {
  // Handle file import
  const handleImport = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const workbook = XLSX.read(e.target.result, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      onImport(jsonData); // Send imported data to the parent
    };
    reader.readAsArrayBuffer(file);
    return false; // Prevent default upload behavior
  };

  // Handle file export
  const handleExport = () => {
    if (!data || data.length === 0) {
      alert("No data available to export.");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, exportFileName);
  };

  return (
    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
      {/* Import Button */}
      <Upload beforeUpload={handleImport} showUploadList={false} accept=".xlsx,.xls">
        <Button type="default" icon={<ImportOutlined />}>
          Import Excel
        </Button>
      </Upload>

      {/* Export Button */}
      <Button type="primary" icon={<FileExcelOutlined />} onClick={handleExport}>
        Export Excel
      </Button>
    </div>
  );
}
