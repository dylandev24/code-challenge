import { useState, useCallback, useMemo } from "react";
import type { Token } from "../types";

interface UseSwapResult {
  fromToken?: Token;
  toToken?: Token;
  amount: string;
  expectedOut: number;
  setFromToken: (t?: Token) => void;
  setToToken: (t?: Token) => void;
  setAmount: (v: string) => void;
  switchTokens: () => void;
  canSwap: boolean;
  swap: () => Promise<void>;
  loading: boolean;
  error: string | null;
  lastSwap: any;
  setLastSwap: any;
}

export function useSwap(getBalance: (symbol: string) => number): UseSwapResult {
  const [fromToken, setFromToken] = useState<Token | undefined>();
  const [toToken, setToToken] = useState<Token | undefined>();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSwap, setLastSwap] = useState<{
    from: string;
    to: string;
    amountIn: string;
    amountOut: number;
    toTokenURI: string;
    fromTokenURI: string;
  } | null>(null);

  const balance = fromToken ? getBalance(fromToken.currency) : 0;

  const expectedOut = useMemo(() => {
    if (!fromToken || !toToken || !amount) return 0;
    const amt = Number(amount);
    if (isNaN(amt) || amt <= 0) return 0;
    return (amt * fromToken.price) / toToken.price;
  }, [amount, fromToken, toToken]);

  const canSwap = useMemo(() => {
    return (
      !!fromToken &&
      !!toToken &&
      !!amount &&
      Number(amount) > 0 &&
      Number(amount) <= balance
    );
  }, [fromToken, toToken, amount, balance]);

  const switchTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
  };

  const swap = useCallback(async () => {
    if (!canSwap || !fromToken || !toToken) return;

    setLoading(true);
    setError(null);

    try {
      await new Promise((res) => setTimeout(res, 1200));

      setLastSwap({
        from: fromToken.currency,
        to: toToken.currency,
        toTokenURI: toToken.logoURI,
        fromTokenURI: fromToken.logoURI,
        amountIn: amount,
        amountOut: expectedOut,
      });

      setAmount("");
    } catch (err) {
      setError("Swap failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [canSwap, fromToken, toToken, amount, expectedOut]);

  return {
    fromToken,
    toToken,
    amount,
    expectedOut,
    setFromToken,
    setToToken,
    setAmount,
    switchTokens,
    canSwap,
    swap,
    loading,
    error,
    lastSwap,
    setLastSwap,
  };
}
