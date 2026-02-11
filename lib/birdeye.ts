// Birdeye API configuration and helper functions for transaction tracking

const BIRDEYE_API_URL = "https://public-api.birdeye.so";

export interface BirdeyeTransaction {
  txHash: string;
  blockUnixTime: number;
  source: string;
  owner: string;
  from: {
    symbol: string;
    decimals: number;
    address: string;
    amount: number;
    uiAmount: number;
    price: number;
    nearestPrice: number;
  };
  to: {
    symbol: string;
    decimals: number;
    address: string;
    amount: number;
    uiAmount: number;
    price: number;
    nearestPrice: number;
  };
  side: "buy" | "sell";
  volumeUSD: number;
}

export interface BirdeyeTradeResponse {
  success: boolean;
  data: {
    items: BirdeyeTransaction[];
    hasNext: boolean;
  };
}

// Get recent trades for a token using seek_by_time endpoint
export async function getRecentTrades(
  tokenAddress: string,
  apiKey: string,
  afterTime?: number, // Unix timestamp in seconds
  limit: number = 50
): Promise<BirdeyeTransaction[]> {
  // Use current time minus 30 seconds if no afterTime provided
  const timeParam = afterTime || Math.floor(Date.now() / 1000) - 30;
  
  const url = `${BIRDEYE_API_URL}/defi/txs/token/seek_by_time?address=${tokenAddress}&tx_type=swap&after_time=${timeParam}&limit=${limit}`;
  
  const response = await fetch(url, {
    headers: {
      "X-API-KEY": apiKey,
      "x-chain": "solana",
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Birdeye API error: ${response.status} - ${error}`);
  }

  const data: BirdeyeTradeResponse = await response.json();
  
  if (!data.success) {
    throw new Error("Birdeye API returned unsuccessful response");
  }

  return data.data?.items || [];
}

// Get token info
export async function getTokenInfo(tokenAddress: string, apiKey: string) {
  const response = await fetch(
    `${BIRDEYE_API_URL}/defi/token_overview?address=${tokenAddress}`,
    {
      headers: {
        "X-API-KEY": apiKey,
        "x-chain": "solana",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch token info: ${response.status}`);
  }

  return response.json();
}

// SOL token address on Solana
const SOL_ADDRESS = "So11111111111111111111111111111111111111112";

// Calculate SOL amount from a transaction
export function getSolAmount(tx: BirdeyeTransaction): number {
  // Check if the "from" token is SOL (meaning they paid with SOL = buy)
  if (tx.from.address === SOL_ADDRESS) {
    return tx.from.uiAmount || 0;
  }
  // Check if the "to" token is SOL (meaning they received SOL = sell)
  if (tx.to.address === SOL_ADDRESS) {
    return tx.to.uiAmount || 0;
  }
  return 0;
}

// Filter transactions that meet the minimum SOL threshold (buys only)
export function filterQualifyingTransactions(
  transactions: BirdeyeTransaction[],
  minSolAmount: number = 4
): BirdeyeTransaction[] {
  return transactions.filter((tx) => {
    // Only count buys (when someone pays SOL to get the token)
    if (tx.from.address !== SOL_ADDRESS) return false;
    
    const solAmount = getSolAmount(tx);
    return solAmount >= minSolAmount;
  });
}
