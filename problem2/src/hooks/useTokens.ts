import { useEffect, useState } from "react";
import { fetchTokens } from "../services/token.service";
import { balances, getLocalIconPath } from "../utils";
import type { Token } from "../types";

type RawPriceData = Array<{ currency: string; price: number; date: string }>;

export function useTokens() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const priceData: RawPriceData = await fetchTokens();

        const tokenMap = new Map<
          string,
          { price: number; date: string; currency: string }
        >();

        priceData.forEach((item) => {
          const symbol = item.currency;

          if (
            !tokenMap.has(symbol) ||
            new Date(item.date) > new Date(tokenMap.get(symbol)!.date)
          ) {
            tokenMap.set(symbol, {
              price: item.price,
              date: item.date,
              currency: item.currency,
            });
          }
        });

        const processedTokens: Token[] = [];
        tokenMap.forEach((data) => {
          if (data.price && data.price > 0) {
            processedTokens.push({
              currency: data.currency,
              name: data.currency,
              logoURI: getLocalIconPath(data.currency),
              price: data.price,
            });
          }
        });

        setTokens(processedTokens);
      } catch (error) {
        console.error("Error loading tokens:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const getBalance = (symbol: string) =>
    balances[symbol as keyof typeof balances] ?? 0;

  return { tokens, loading, getBalance };
}
