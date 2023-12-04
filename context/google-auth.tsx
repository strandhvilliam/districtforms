import { createContext, useContext, useEffect, useState } from "react";
import { google } from "googleapis";

type GoogleAuthContextType = {
  isSignedIn: boolean;
  signIn: () => void;
  signOut: () => void;
};

const GoogleAuthContext = createContext<GoogleAuthContextType>({
  isSignedIn: false,
  signIn: () => {},
  signOut: () => {},
});

export function useGoogleAuth() {
  return useContext(GoogleAuthContext);
}

export function GoogleAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSignedIn, setIsSignedIn] = useState(false);

  const signIn = () => {
    console.log("sign in");
  };
  const signOut = () => {
    console.log("sign out");
  };

  return (
    <GoogleAuthContext.Provider
      value={{
        isSignedIn,
        signIn,
        signOut,
      }}
    >
      {children}
    </GoogleAuthContext.Provider>
  );
}
