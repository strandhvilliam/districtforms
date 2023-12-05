import { DistrictData, SelectFormResponse, SelectSentEmail } from "@/lib/types";
import { createContext, useContext, useState } from "react";

export type DataContextType = {
  sentEmailsData: SelectSentEmail[];
  setSentEmailsData: (data: SelectSentEmail[]) => void;
  answersData: SelectFormResponse[];
  setAnswersData: (data: SelectFormResponse[]) => void;
};

export const DataContext = createContext<DataContextType>({
  sentEmailsData: [],
  setSentEmailsData: () => {},
  answersData: [],
  setAnswersData: () => {},
});

export const useData = () => {
  return useContext(DataContext);
};

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [sentEmailsData, setSentEmailsData] = useState<SelectSentEmail[]>([]);
  const [answersData, setAnswersData] = useState<[]>([]);
  return (
    <DataContext.Provider
      value={{
        sentEmailsData,
        setSentEmailsData: (d: SelectSentEmail[]) => setSentEmailsData(d),
        answersData,
        setAnswersData: (d: SelectFormResponse[]) => setAnswersData(d),
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
