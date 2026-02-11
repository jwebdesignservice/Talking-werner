"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface WernerContextType {
    isBusy: boolean;
    setIsBusy: (busy: boolean) => void;
}

const WernerContext = createContext<WernerContextType>({
    isBusy: false,
    setIsBusy: () => {},
});

export function WernerProvider({ children }: { children: ReactNode }) {
    const [isBusy, setIsBusy] = useState(false);

    return (
        <WernerContext.Provider value={{ isBusy, setIsBusy }}>
            {children}
        </WernerContext.Provider>
    );
}

export function useWernerBusy() {
    return useContext(WernerContext);
}
