"use client";

import { useEffect, useState, useRef } from "react";
import { getAddressLabel } from "@/lib/addressLabels";

interface ApprovalEvent {
  id: string;
  chainId: number;
  chainName: string;
  explorerUrl: string;
  tokenAddress: string;
  tokenSymbol: string;
  owner: string;
  spender: string;
  value: string;
  valueFormatted: string;
  isUnlimited: boolean;
  transactionHash: string;
  blockNumber: number;
  timestamp: number;
}

interface Filters {
  chain: string;
  token: string;
  spender: string;
  owner: string;
  includeUnlimited: boolean;
  onlyUnlimited: boolean;
}

export default function ApprovalList() {
  const [events, setEvents] = useState<ApprovalEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(true);
  const [newEventIds, setNewEventIds] = useState<Set<string>>(new Set());
  const prevEventIdsRef = useRef<Set<string>>(new Set());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [filters, setFilters] = useState<Filters>({
    chain: "all",
    token: "all",
    spender: "",
    owner: "",
    includeUnlimited: true,
    onlyUnlimited: false,
  });

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/events");
      const data = await response.json();

      // Detect new events for animation
      const currentEventIds = new Set(data.events.map((e: ApprovalEvent) => e.id));
      const newIds = new Set<string>();

      currentEventIds.forEach((id) => {
        if (!prevEventIdsRef.current.has(id)) {
          newIds.add(id);
        }
      });

      if (newIds.size > 0) {
        setNewEventIds(newIds);
        // Remove animation class after 2 seconds
        setTimeout(() => setNewEventIds(new Set()), 2000);
      }

      prevEventIdsRef.current = currentEventIds;
      setEvents(data.events);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching events:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSyncing) {
      // Fetch immediately when syncing starts
      fetchEvents();
      // Set up interval for continuous fetching
      intervalRef.current = setInterval(fetchEvents, 5000);
    } else {
      // Clear interval when syncing is paused
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isSyncing]);

  const toggleSync = () => {
    setIsSyncing(!isSyncing);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    let relative = "";
    if (days > 0) relative = `${days}d ago`;
    else if (hours > 0) relative = `${hours}h ago`;
    else if (minutes > 0) relative = `${minutes}m ago`;
    else relative = `${seconds}s ago`;

    const full = date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    return { relative, full };
  };

  const getTokenIconUrl = (symbol: string, address: string, chainId: number) => {
    // Use CoinGecko's public CDN for token icons
    const iconMap: { [key: string]: string } = {
      USDT: "https://assets.coingecko.com/coins/images/325/small/Tether.png",
      USDC: "https://assets.coingecko.com/coins/images/6319/small/usdc.png",
      ETH: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
      WETH: "https://assets.coingecko.com/coins/images/2518/small/weth.png",
      BNB: "https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png",
    };
    return iconMap[symbol] || "https://assets.coingecko.com/coins/images/1/small/bitcoin.png";
  };

  // Get unique chains and tokens for filter dropdowns
  const uniqueChains = Array.from(new Set(events.map((e) => e.chainName)));
  const uniqueTokens = Array.from(new Set(events.map((e) => e.tokenSymbol)));

  // Filter events
  const filteredEvents = events.filter((event) => {
    if (filters.chain !== "all" && event.chainName !== filters.chain) return false;
    if (filters.token !== "all" && event.tokenSymbol !== filters.token) return false;
    if (filters.spender && !event.spender.toLowerCase().includes(filters.spender.toLowerCase())) return false;
    if (filters.owner && !event.owner.toLowerCase().includes(filters.owner.toLowerCase())) return false;
    if (filters.onlyUnlimited && !event.isUnlimited) return false;
    if (!filters.includeUnlimited && event.isUnlimited) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-pulse text-gray-400">Loading events...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sync Control Button */}
      <div className="flex justify-between items-center">
        <button
          onClick={toggleSync}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg ${
            isSyncing
              ? "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
              : "bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-gray-200"
          }`}
        >
          {isSyncing ? (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Pause Sync
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Resume Sync
            </>
          )}
        </button>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isSyncing ? "bg-green-500 animate-pulse" : "bg-gray-500"}`}></div>
          <span className="text-sm text-gray-400">
            {isSyncing ? "Syncing..." : "Paused"}
          </span>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700 shadow-xl">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filters
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Chain</label>
            <select
              value={filters.chain}
              onChange={(e) => setFilters({ ...filters, chain: e.target.value })}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Chains</option>
              {uniqueChains.map((chain) => (
                <option key={chain} value={chain}>{chain}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Token</label>
            <select
              value={filters.token}
              onChange={(e) => setFilters({ ...filters, token: e.target.value })}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Tokens</option>
              {uniqueTokens.map((token) => (
                <option key={token} value={token}>{token}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Spender Address</label>
            <input
              type="text"
              placeholder="0x..."
              value={filters.spender}
              onChange={(e) => setFilters({ ...filters, spender: e.target.value })}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Owner Address</label>
            <input
              type="text"
              placeholder="0x..."
              value={filters.owner}
              onChange={(e) => setFilters({ ...filters, owner: e.target.value })}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-end gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.onlyUnlimited}
                onChange={(e) => setFilters({ ...filters, onlyUnlimited: e.target.checked })}
                className="w-4 h-4 rounded bg-gray-800 border-gray-600 text-orange-500 focus:ring-2 focus:ring-orange-500"
              />
              Only ∞
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.includeUnlimited}
                onChange={(e) => setFilters({ ...filters, includeUnlimited: e.target.checked })}
                className="w-4 h-4 rounded bg-gray-800 border-gray-600 text-orange-500 focus:ring-2 focus:ring-orange-500"
                disabled={filters.onlyUnlimited}
              />
              Include ∞
            </label>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-400">
        Showing {filteredEvents.length} of {events.length} events
      </div>

      {/* Events Feed */}
      {filteredEvents.length === 0 ? (
        <div className="flex flex-col justify-center items-center py-12 text-gray-500">
          <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p>No approval events match your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvents.map((event) => {
            const isNew = newEventIds.has(event.id);
            const timeInfo = formatTime(event.timestamp);
            const label = getAddressLabel(event.spender);

            return (
              <div
                key={event.id}
                className={`bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl p-5 border transition-all duration-500 shadow-lg hover:shadow-2xl ${
                  isNew
                    ? "border-orange-500 animate-pulse-border scale-[1.02]"
                    : "border-gray-700 hover:border-orange-600/50"
                }`}
                style={{
                  animation: isNew ? "slideIn 0.5s ease-out" : undefined,
                }}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Left: Chain & Token Info */}
                  <div className="flex items-center gap-3">
                    <img
                      src={getTokenIconUrl(event.tokenSymbol, event.tokenAddress, event.chainId)}
                      alt={event.tokenSymbol}
                      className="w-10 h-10 rounded-full bg-gray-700 p-1"
                      onError={(e) => {
                        e.currentTarget.src = "https://assets.coingecko.com/coins/images/1/small/bitcoin.png";
                      }}
                    />
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs font-semibold border border-orange-500/30">
                          {event.chainName}
                        </span>
                        <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs font-semibold border border-amber-500/30 flex items-center gap-1">
                          {event.tokenSymbol}
                        </span>
                        {isNew && (
                          <span className="px-2 py-1 bg-red-500/30 text-red-400 rounded-full text-xs font-bold border border-red-500/50 animate-pulse">
                            NEW
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400" title={timeInfo.full}>
                        {timeInfo.relative}
                      </div>
                    </div>
                  </div>

                  {/* Right: Amount */}
                  <div className="text-right">
                    <div className="text-3xl font-bold bg-gradient-to-r from-orange-400 via-amber-500 to-yellow-500 bg-clip-text text-transparent">
                      {event.isUnlimited ? "∞" : parseFloat(event.valueFormatted).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-400">{event.tokenSymbol}</div>
                  </div>
                </div>

              {/* Details Grid */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
                  <div className="text-gray-400 text-xs mb-1">Owner</div>
                  <a
                    href={`${event.explorerUrl}/address/${event.owner}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-1"
                  >
                    {formatAddress(event.owner)}
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
                  <div className="text-gray-400 text-xs mb-1">Spender</div>
                  <a
                    href={`${event.explorerUrl}/address/${event.spender}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-1"
                  >
                    {formatAddress(event.spender)}
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                  {label && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs border border-purple-500/30">
                        {label.type}
                      </span>
                      <span className="text-xs text-gray-400">{label.name}</span>
                    </div>
                  )}
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50 md:col-span-2">
                  <div className="text-gray-400 text-xs mb-1">Transaction</div>
                  <a
                    href={`${event.explorerUrl}/tx/${event.transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1"
                  >
                    {formatAddress(event.transactionHash)}
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
