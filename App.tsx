
import React, { useState, useEffect, useCallback } from 'react';
import { MarketSector, AnalysisResult } from './types';
import { GeminiService } from './services/geminiService';
import SentimentGauge from './components/SentimentGauge';
import { 
  TrendingUp, 
  TrendingDown, 
  Search, 
  RefreshCw, 
  ExternalLink, 
  Clock, 
  Globe,
  Activity,
  ChevronRight,
  Info
} from 'lucide-react';

const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const fetchData = useCallback(async (query?: string) => {
    setIsRefreshing(true);
    setError(null);
    try {
      const service = new GeminiService();
      const analysis = await service.analyzeMarketSentiment(query);
      setResult(analysis);
    } catch (err) {
      setError("Failed to fetch market analysis. Please try again later.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchData(searchQuery);
    }
  };

  if (loading && !result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 p-6">
        <div className="relative">
          <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-blue-500 animate-spin"></div>
          <Activity className="absolute inset-0 m-auto text-blue-500 w-10 h-10 animate-pulse" />
        </div>
        <h2 className="mt-8 text-2xl font-bold text-white tracking-tight">Gathering Intelligence...</h2>
        <p className="mt-2 text-slate-400 animate-pulse">Scanning global news & financial reports via Gemini AI</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg shadow-lg shadow-blue-500/20">
              <Activity className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white hidden sm:block">MarketPulse AI</h1>
          </div>

          <form onSubmit={handleSearch} className="flex-1 max-w-lg mx-8 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search specific assets or sectors (e.g. NVIDIA, S&P 500)..."
              className="w-full bg-slate-900 border border-slate-700 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          <button 
            onClick={() => fetchData(searchQuery)}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 rounded-lg text-sm font-medium transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 mt-8">
        {/* Global Alert / Outlook */}
        <section className="mb-8">
          <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/30 p-6 rounded-3xl shadow-2xl relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2 text-blue-400 font-bold uppercase tracking-widest text-xs">
                <Globe className="w-4 h-4" />
                Live Global Outlook
              </div>
              <p className="text-xl md:text-2xl font-semibold text-slate-100 leading-relaxed">
                "{result?.globalOutlook || 'Markets are reacting to today\'s news cycles. Please wait while we process details.'}"
              </p>
              <div className="mt-4 flex items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Updated at {result?.timestamp}</span>
                <span className="flex items-center gap-1"><Info className="w-3 h-3" /> Grounded Analysis</span>
              </div>
            </div>
            <Activity className="absolute -bottom-10 -right-10 w-64 h-64 text-blue-500/5 group-hover:text-blue-500/10 transition-colors" />
          </div>
        </section>

        {/* Gauges Grid */}
        <section className="mb-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {result?.sentiments.map((item, idx) => (
              <SentimentGauge key={idx} label={item.category} score={item.score} />
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Detailed Analysis Column */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <ChevronRight className="text-blue-500" />
              In-Depth Sector Analysis
            </h2>
            {result?.sentiments.map((item, idx) => (
              <div key={idx} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-100">{item.category}</h3>
                  <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    item.score > 60 ? 'bg-green-500/20 text-green-400' : 
                    item.score < 40 ? 'bg-red-500/20 text-red-400' : 
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {item.score > 60 ? <TrendingUp className="w-3 h-3" /> : item.score < 40 ? <TrendingDown className="w-3 h-3" /> : null}
                    {item.score}% Confidence
                  </div>
                </div>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                  {item.summary}
                </p>
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Key Market Drivers</p>
                  <div className="flex flex-wrap gap-2">
                    {item.keyDrivers.map((driver, dIdx) => (
                      <span key={dIdx} className="bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg text-xs border border-slate-700">
                        {driver}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* News Sources / Sidebar */}
          <aside className="space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <ChevronRight className="text-blue-500" />
              Verified Sources
            </h2>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <p className="text-xs text-slate-500 mb-4 font-medium uppercase tracking-widest">Grounded News References</p>
              <div className="space-y-4">
                {result?.sources && result.sources.length > 0 ? (
                  result.sources.slice(0, 10).map((source, idx) => (
                    <a 
                      key={idx} 
                      href={source.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group flex flex-col gap-1 p-3 rounded-xl hover:bg-slate-800 transition-all border border-transparent hover:border-slate-700"
                    >
                      <span className="text-sm font-semibold text-slate-200 group-hover:text-blue-400 line-clamp-2 transition-colors">
                        {source.title}
                      </span>
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <ExternalLink className="w-3 h-3" />
                        {new URL(source.uri).hostname}
                      </span>
                    </a>
                  ))
                ) : (
                  <p className="text-sm text-slate-500 italic p-4 text-center">No source links found for this query.</p>
                )}
              </div>
              
              <div className="mt-6 pt-6 border-t border-slate-800">
                <p className="text-xs text-slate-400 leading-relaxed">
                  MarketPulse AI uses Gemini's real-time search capabilities to parse thousands of global news articles and data points to generate these sentiment scores. Not financial advice.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {error && (
        <div className="fixed bottom-6 right-6 left-6 sm:left-auto sm:w-96 bg-red-950 border border-red-500/50 p-4 rounded-xl shadow-2xl flex items-center gap-4 animate-in fade-in slide-in-from-bottom-5">
          <div className="bg-red-500 p-2 rounded-lg">
            <Info className="text-white w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">Analysis Error</p>
            <p className="text-xs text-red-200 opacity-80">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="text-red-200 hover:text-white">&times;</button>
        </div>
      )}
    </div>
  );
};

export default App;
