"use client";

import React from "react";
import { useCurrency } from "@/components/app/CurrencyContext";

interface ProductPriceProps {
  eurAmount: number;
  className?: string;
}

export default function ProductPrice({ eurAmount, className }: ProductPriceProps) {
  const { formatPrice } = useCurrency();
  return <span className={className}>{formatPrice(eurAmount)}</span>;
}
