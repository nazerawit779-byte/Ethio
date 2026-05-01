import React, { useState, useEffect, useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Settings as SettingsIcon, 
  Play, 
  Square, 
  Wallet, 
  BarChart3, 
  History, 
  Bot,
  Globe,
  ChevronRight,
  Activity,
  DollarSign,
  Link,
  Link2Off,
  Cpu
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { translations, Language } from './translations';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Mock Data
const generateMockData = () => {
  return Array.from({ length: 24 }, (_, i) => ({
    name: `${i}:00`,
    price: 45000 + Math.random() * 5000 + (i * 200),
  }));
};

const MOCK_ASSETS = [
  { id: 'btc', name: 'Bitcoin', symbol: 'BTC', price: 64230.50, change: 2.45, tendancy: 'up' },
  { id: 'eth', name: 'Ethereum', symbol: 'ETH', price: 3450.20, change: -1.20, tendancy: 'down' },
  { id: 'sol', name: 'Solana', symbol: 'SOL', price: 145.80, change: 5.67, tendancy: 'up' },
  { id: 'ada', name: 'Cardano', symbol: 'ADA', price: 0.45, change: 0.12, tendancy: 'up' },
];

export default function App() {
  const [lang, setLang] = useState<Language>('am');
  const [isBotRunning, setIsBotRunning] = useState(false);
  const [isMT5Connected, setIsMT5Connected] = useState(false);
  const [balance, setBalance] = useState(12450.75);
  const [profit, setProfit] = useState(842.15);
  const [chartData, setChartData] = useState(generateMockData());
  const [risk, setRisk] = useState<'low' | 'medium' | 'high'>('medium');

  const t = translations[lang];

  // Simulated real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (isBotRunning) {
        const delta = (Math.random() - 0.4) * 10;
        setProfit(prev => prev + delta);
        setBalance(prev => prev + delta);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [isBotRunning]);

  const toggleLanguage = () => {
    setLang(prev => prev === 'en' ? 'am' : 'en');
  };

  return (
    <div className={cn(
      "min-h-screen bg-[#0A0A0A] text-white p-4 md:p-8 selection:bg-blue-500/30",
      lang === 'am' ? "font-['Noto_Sans_Ethiopic']" : "font-['Inter']"
    )}>
      {/* Header */}
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Bot size={28} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">{t.title}</h1>
          </div>
          <p className="text-zinc-500 text-sm md:text-base">{t.tagline}</p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-full hover:bg-zinc-800 transition-colors"
          >
            <Globe size={18} className="text-zinc-400" />
            <span>{lang === 'en' ? 'Amharic' : 'English'}</span>
          </button>
          
          <button className="p-2 text-zinc-400 hover:text-white transition-colors">
            <SettingsIcon size={24} />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Stats Grid */}
        <section className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4 mb-2">
          <StatCard 
            title={t.totalBalance} 
            value={`$${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} 
            icon={<Wallet className="text-blue-500" />}
            trend="+12%"
          />
          <StatCard 
            title={t.dailyProfit} 
            value={`$${profit.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} 
            icon={<TrendingUp className="text-emerald-500" />}
            trend="+5.4%"
            isPositive
          />
          <StatCard 
            title={t.activeBots} 
            value={isBotRunning ? "03" : "00"} 
            icon={<Activity className="text-orange-500" />}
            trend={isBotRunning ? t.running : t.paused}
            statusOnly
          />
        </section>

        {/* Chart Section */}
        <section className="lg:col-span-8 glass rounded-3xl p-6 overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <BarChart3 size={20} className="text-zinc-400" />
              {t.portfolio}
            </h3>
            <div className="flex gap-2">
              {['1H', '1D', '1W', 'MTD'].map(period => (
                <button 
                  key={period} 
                  className={cn(
                    "px-3 py-1 text-xs rounded-md font-medium transition-all",
                    period === '1D' ? "bg-white text-black" : "text-zinc-500 hover:text-zinc-300"
                  )}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f1f1f" />
                <XAxis 
                  dataKey="name" 
                  stroke="#52525b" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#52525b" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(val) => `$${val/1000}k`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#2563eb" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorPrice)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Side Panel */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Bot Control */}
          <div className="glass rounded-3xl p-6">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Bot size={20} className="text-blue-500" />
              {t.botConfiguration}
            </h3>
            
            <div className="space-y-4">
              {/* MetaTrader 5 Section */}
              <div className={cn(
                "p-4 rounded-2xl border transition-all duration-300",
                isMT5Connected ? "bg-emerald-500/5 border-emerald-500/20" : "bg-zinc-900/50 border-zinc-800"
              )}>
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <Cpu size={18} className={isMT5Connected ? "text-emerald-500" : "text-zinc-500"} />
                    <span className="text-sm font-semibold">{t.mt5Status}</span>
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase",
                    isMT5Connected ? "bg-emerald-500/20 text-emerald-500" : "bg-zinc-800 text-zinc-500"
                  )}>
                    {isMT5Connected ? t.mt5Connected : t.mt5Disconnected}
                  </span>
                </div>
                
                {isMT5Connected ? (
                  <div className="space-y-1 mb-3">
                    <p className="text-xs text-zinc-400 flex justify-between">
                      <span>Server:</span>
                      <span className="font-mono text-white">MetaQuotes-Demo</span>
                    </p>
                    <p className="text-xs text-zinc-400 flex justify-between">
                      <span>Login:</span>
                      <span className="font-mono text-white">88129402</span>
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-zinc-500 mb-4">Connect your Meta 5 account to start automated trading.</p>
                )}

                <button 
                  onClick={() => setIsMT5Connected(!isMT5Connected)}
                  className={cn(
                    "w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all",
                    isMT5Connected 
                      ? "bg-zinc-800 text-zinc-400 hover:text-white" 
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  )}
                >
                  {isMT5Connected ? (
                    <><Link2Off size={14} /> Disconnect MT5</>
                  ) : (
                    <><Link size={14} /> {t.connectAccount}</>
                  )}
                </button>
              </div>

              <div className="p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-zinc-400 text-sm">{t.riskLevel}</span>
                  <span className={cn(
                    "text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wider",
                    risk === 'low' && "bg-emerald-500/10 text-emerald-500",
                    risk === 'medium' && "bg-orange-500/10 text-orange-500",
                    risk === 'high' && "bg-rose-500/10 text-rose-500",
                  )}>
                    {t[risk]}
                  </span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="2" 
                  step="1"
                  value={risk === 'low' ? 0 : risk === 'medium' ? 1 : 2}
                  onChange={(e) => {
                    const levels: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];
                    setRisk(levels[parseInt(e.target.value)]);
                  }}
                  className="w-full accent-blue-500"
                />
              </div>

              <button 
                onClick={() => {
                  if (!isMT5Connected && !isBotRunning) {
                    alert(lang === 'am' ? "እባክዎ መጀመሪያ የMT5 መለያዎን ያገናኙ!" : "Please connect your MT5 account first!");
                    return;
                  }
                  setIsBotRunning(!isBotRunning);
                }}
                className={cn(
                  "w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all",
                  isBotRunning 
                    ? "bg-rose-600/10 border border-rose-600/20 text-rose-500 hover:bg-rose-600/20" 
                    : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-600/20",
                  !isMT5Connected && !isBotRunning && "opacity-50 cursor-not-allowed grayscale"
                )}
              >
                {isBotRunning ? (
                  <>
                    <Square size={20} fill="currentColor" />
                    {t.stopBot}
                  </>
                ) : (
                  <>
                    <Play size={20} fill="currentColor" />
                    {t.startBot}
                  </>
                )}
              </button>
            </div>
            
            <div className="mt-6 pt-6 border-t border-zinc-800">
              <div className="flex justify-between items-center text-xs text-zinc-500 uppercase tracking-widest font-bold">
                <span>{t.botStatus}</span>
                <span className={cn(
                  "flex items-center gap-1.5",
                  isBotRunning ? "text-emerald-500" : "text-zinc-600"
                )}>
                  <span className={cn("w-2 h-2 rounded-full", isBotRunning ? "bg-emerald-500 animate-pulse" : "bg-zinc-600")}></span>
                  {isBotRunning ? t.running : t.paused}
                </span>
              </div>
            </div>
          </div>

          {/* Markets */}
          <div className="glass rounded-3xl p-6">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Activity size={20} className="text-zinc-400" />
              {t.markets}
            </h3>
            <div className="space-y-4">
              {MOCK_ASSETS.map(asset => (
                <div key={asset.id} className="group flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-zinc-300">
                      {asset.symbol[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{asset.name}</p>
                      <p className="text-xs text-zinc-500">{asset.symbol}</p>
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <p className="font-mono font-medium">${asset.price.toLocaleString()}</p>
                    <p className={cn(
                      "flex items-center justify-end gap-1 font-semibold",
                      asset.tendancy === 'up' ? "text-emerald-500" : "text-rose-500"
                    )}>
                      {asset.tendancy === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {asset.change}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-3 text-zinc-500 hover:text-white text-sm font-medium flex items-center justify-center gap-2 transition-colors">
              View All Markets
              <ChevronRight size={16} />
            </button>
          </div>
        </aside>

        {/* History Table */}
        <section className="lg:col-span-12 glass rounded-3xl p-8 mt-4 overflow-x-auto">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold flex items-center gap-3">
              <History size={24} className="text-zinc-400" />
              {t.tradeHistory}
            </h3>
            <button className="px-4 py-2 bg-zinc-900 text-zinc-400 rounded-xl text-sm hover:text-white transition-colors">
              Download CSV
            </button>
          </div>
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="text-zinc-500 text-sm uppercase tracking-widest font-bold">
                <th className="pb-4 font-black">{t.asset}</th>
                <th className="pb-4 font-black">Type</th>
                <th className="pb-4 font-black">{t.price}</th>
                <th className="pb-4 font-black">Amount</th>
                <th className="pb-4 font-black">Status</th>
                <th className="pb-4 font-black text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {[
                { id: 1, asset: 'Bitcoin', symbol: 'BTC', type: 'Buy', price: 64120.50, amount: '0.045 BTC', status: 'Completed', time: '14:24:05' },
                { id: 2, asset: 'Ethereum', symbol: 'ETH', type: 'Sell', price: 3452.80, amount: '1.20 ETH', status: 'Completed', time: '13:12:44' },
                { id: 3, asset: 'Solana', symbol: 'SOL', type: 'Buy', price: 144.20, amount: '12.5 SOL', status: 'Processing', time: '12:55:10' },
              ].map(trade => (
                <tr key={trade.id} className="group hover:bg-white/[0.02]">
                  <td className="py-5 font-semibold flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[10px] font-black">{trade.symbol}</div>
                    {trade.asset}
                  </td>
                  <td className="py-5">
                    <span className={cn(
                      "px-3 py-1 rounded-lg text-xs font-bold",
                      trade.type === 'Buy' ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                    )}>
                      {trade.type === 'Buy' ? t.buy : t.sell}
                    </span>
                  </td>
                  <td className="py-5 font-mono text-zinc-300">${trade.price.toLocaleString()}</td>
                  <td className="py-5 font-mono text-zinc-300">{trade.amount}</td>
                  <td className="py-5">
                    <span className={cn(
                      "flex items-center gap-2 text-sm",
                      trade.status === 'Completed' ? "text-zinc-400" : "text-orange-500 font-medium"
                    )}>
                      {trade.status === 'Processing' && <Activity size={14} className="animate-spin" />}
                      {trade.status}
                    </span>
                  </td>
                  <td className="py-5 text-right font-mono text-zinc-500">{trade.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
      
      <footer className="max-w-7xl mx-auto mt-20 pb-10 flex flex-col md:flex-row justify-between items-center text-zinc-500 text-xs border-t border-zinc-900 pt-8 gap-4">
        <p>© 2024 EthioTrade Robo. All systems operational.</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">API Keys</a>
        </div>
      </footer>
    </div>
  );
}

function StatCard({ title, value, icon, trend, isPositive, statusOnly }: { 
  title: string, value: string, icon: React.ReactNode, trend: string, isPositive?: boolean, statusOnly?: boolean 
}) {
  return (
    <div className="glass rounded-3xl p-6 group hover:translate-y-[-4px] transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2.5 bg-zinc-900/50 rounded-2xl group-hover:bg-zinc-800 transition-colors">
          {icon}
        </div>
        <div className={cn(
          "text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg",
          statusOnly 
            ? (trend.includes('Running') || trend.includes('ንቁ') || trend.includes('በንግድ') ? "text-emerald-500 bg-emerald-500/10" : "text-zinc-500 bg-zinc-500/10")
            : (isPositive ? "text-emerald-500 bg-emerald-500/10" : "text-zinc-500 bg-zinc-500/10")
        )}>
          {trend}
        </div>
      </div>
      <div>
        <h4 className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">{title}</h4>
        <p className="text-2xl font-black font-mono tracking-tighter">{value}</p>
      </div>
    </div>
  );
}
