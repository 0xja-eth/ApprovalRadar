import ApprovalList from "@/components/ApprovalList";
import Logo from "@/components/Logo";

export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <Logo className="w-12 h-12" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 via-amber-500 to-yellow-500 bg-clip-text text-transparent">
              ApprovalRadar
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Real-time monitoring of large approval events ({">"} 1000 USDT/USDC) across ETH, BSC, Arbitrum, Optimism, and Base
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            Syncs every 5 seconds • Detects unlimited approvals ({">"} 10B)
          </p>
        </div>
        <ApprovalList />
      </div>
    </main>
  );
}
