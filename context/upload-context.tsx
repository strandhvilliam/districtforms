import { RowData } from "@/lib/types";
import { createContext, useContext, useState } from "react";
import * as XLSX from "xlsx";

type UploadContextType = {
  upload: (file: File) => void;
  isUploaded: boolean;
  data: RowData[];
};

const UploadContext = createContext<UploadContextType>({
  upload: () => {},
  isUploaded: false,
  data: [],
});

export function useUpload() {
  return useContext(UploadContext);
}

export function UploadProvider({ children }: { children: React.ReactNode }) {
  const [isUploaded, setIsUploaded] = useState(false);
  const [data, setData] = useState<RowData[]>([]);

  const upload = async (file: File) => {
    console.log(file);
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { cellDates: true });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet) as RowData[];
    console.log(data);
    setData(data);
    setIsUploaded((prev) => !prev);
  };

  return (
    <UploadContext.Provider value={{ upload, isUploaded, data }}>
      {children}
    </UploadContext.Provider>
  );
}
