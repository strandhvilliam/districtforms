import { DistrictData, SelectFormResponse, SelectSentEmail } from "@/lib/types";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./auth-context";

export type DataContextType = {
  sentEmailsData: SelectSentEmail[];
  answersData: SelectFormResponse[];
  refreshSentEmailsData: () => void;
  refreshAnswersData: () => void;
  isRefreshingEmails: boolean;
  isRefreshingAnswers: boolean;
};

export const DataContext = createContext<DataContextType>({
  sentEmailsData: [],
  answersData: [],
  refreshSentEmailsData: () => {},
  refreshAnswersData: () => {},
  isRefreshingEmails: false,
  isRefreshingAnswers: false,
});

export const useData = () => {
  return useContext(DataContext);
};

async function getSentEmails(token: string): Promise<SelectSentEmail[]> {
  try {
    const res = await fetch("/api/sent", {
      method: "GET",
      headers: {
        authorization: `${token}`,
      },
    });
    const data = (await res.json()) as SelectSentEmail[];
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function getAnswers(token: string): Promise<SelectFormResponse[]> {
  try {
    const res = await fetch("/api/answers", {
      method: "GET",
      headers: {
        authorization: `${token}`,
      },
    });
    const data = (await res.json()) as SelectFormResponse[];
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [isRefreshingEmails, setIsRefreshingEmails] = useState(false);
  const [isRefreshingAnswers, setIsRefreshingAnswers] = useState(false);
  const [sentEmailsData, setSentEmailsData] = useState<SelectSentEmail[]>([]);
  const [answersData, setAnswersData] = useState<SelectFormResponse[]>([]);
  const { token } = useAuth();

  const refreshSentEmailsData = async () => {
    setIsRefreshingEmails(true);
    if (!token) {
      return;
    }
    const data = await getSentEmails(token);
    try {
      setSentEmailsData(data);
    } catch (error) {
      console.log(error);
      setIsRefreshingEmails(false);
    }
    setIsRefreshingEmails(false);
  };

  const refreshAnswersData = async () => {
    setIsRefreshingAnswers(true);
    if (!token) {
      return;
    }
    const data = await getAnswers(token);
    try {
      setAnswersData(data);
    } catch (error) {
      console.log(error);
      setIsRefreshingAnswers(false);
    }
    setIsRefreshingAnswers(false);
  };

  useEffect(() => {
    setIsRefreshingEmails(true);
    setIsRefreshingAnswers(true);
    if (!token) {
      return;
    }
    getSentEmails(token).then((data) => {
      setSentEmailsData(data);
      setIsRefreshingEmails(false);
    });
    getAnswers(token).then((data) => {
      setAnswersData(data);
      setIsRefreshingAnswers(false);
    });
  }, [token]);

  return (
    <DataContext.Provider
      value={{
        sentEmailsData,
        answersData,
        refreshSentEmailsData,
        refreshAnswersData,
        isRefreshingEmails,
        isRefreshingAnswers,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
