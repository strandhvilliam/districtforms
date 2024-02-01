import { RowData } from "@/lib/types";
import { createContext, useContext, useState } from "react";
import * as XLSX from "xlsx";

type UploadContextType = {
  upload: (file: File) => Promise<boolean>;
  isUploaded: boolean;
  setIsUploaded: (bool: boolean) => void;
  resetData: () => void;
  data: RowData[];
};

const UploadContext = createContext<UploadContextType>({
  upload: () => Promise.resolve(false),
  isUploaded: false,
  setIsUploaded: () => {},
  resetData: () => {},
  data: [],
});

export function useUpload() {
  return useContext(UploadContext);
}

export function UploadProvider({ children }: { children: React.ReactNode }) {
  const [isUploaded, setIsUploaded] = useState(false);
  const [data, setData] = useState<RowData[]>([]);

  const resetData = () => {
    setData([]);
    setIsUploaded(false);
  };

  const upload = async (file: File) => {
    if (!file) {
      return false;
    }

    if (file.name.slice(-4) !== "xlsx") {
      return false;
    }
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { cellDates: true });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const unknownData = XLSX.utils.sheet_to_json(sheet);

    const data = unknownData.map(
      (row: any) => ({ ...row, Id: crypto.randomUUID() }) as RowData,
    );

    setData(data);
    return true;
  };

  return (
    <UploadContext.Provider
      value={{
        setIsUploaded: (b: boolean) => setIsUploaded(b),
        upload,
        resetData,
        isUploaded,
        data,
      }}
    >
      {children}
    </UploadContext.Provider>
  );
}
