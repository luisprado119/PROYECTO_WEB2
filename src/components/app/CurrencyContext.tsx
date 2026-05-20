"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Currency = "EUR" | "USD";

interface CurrencyContextType {
  currency: Currency;
  toggleCurrency: () => void;
  setCurrency: (c: Currency) => void;
  formatPrice: (eurAmount: number) => string;
  convertPrice: (eurAmount: number) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// 1 EUR = 1.08 USD
const EUR_TO_USD_RATE = 1.08;

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("EUR");

  useEffect(() => {
    const saved = localStorage.getItem("kimishop_currency") as Currency;
    if (saved === "EUR" || saved === "USD") {
      setCurrencyState(saved);
    }
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem("kimishop_currency", c);
    // Dispatch custom event to let other windows or elements know
    window.dispatchEvent(new Event("currencyChange"));
  };

  const toggleCurrency = () => {
    const next: Currency = currency === "EUR" ? "USD" : "EUR";
    setCurrency(next);
  };

  const convertPrice = (eurAmount: number) => {
    const amount = Number(eurAmount);
    if (Number.isNaN(amount)) return 0;
    return currency === "EUR" ? amount : amount * EUR_TO_USD_RATE;
  };

  const formatPrice = (eurAmount: number) => {
    const converted = convertPrice(eurAmount);
    if (currency === "EUR") {
      return `${converted.toLocaleString("es-ES", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })} €`;
    } else {
      return `$${converted.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    }
  };

  return (
    <CurrencyContext.Provider value={{ currency, toggleCurrency, setCurrency, formatPrice, convertPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
