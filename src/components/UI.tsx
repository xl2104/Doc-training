import React from 'react';
import { 
  HeartPulse, ShieldAlert, ThermometerSun, CheckCircle2, TrendingUp, Award, Clock, Trophy,
  Search, Bell, Wifi, Battery, MoreHorizontal, BookOpenCheck, Bookmark, Compass,
  ChevronRight, Star, Share2, ClipboardList, BookOpen, User, BookMarked
} from 'lucide-react';
import { motion } from 'motion/react';
import { Specialty, DoctorStats, SimulationRecord } from '../types';

// Specialty Badge styled like clean WeChat mini program tags
export function SpecialtyBadge({ specialty }: { specialty: Specialty }) {
  const configs = {
    [Specialty.CARDIOVASCULAR]: { color: 'bg-red-50 text-red-600 border-red-100', icon: HeartPulse, label: '心血管' },
    [Specialty.ENDOCRINE]: { color: 'bg-amber-50 text-amber-600 border-amber-100', icon: ThermometerSun, label: '内分泌' },
    [Specialty.ONCOLOGY]: { color: 'bg-purple-50 text-purple-600 border-purple-100', icon: ShieldAlert, label: '内外科/肿瘤' },
  };

  const config = configs[specialty] || { color: 'bg-blue-50 text-blue-600 border-blue-100', icon: HeartPulse, label: specialty };
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${config.color}`}>
      <Icon className="w-2.5 h-2.5" />
      {config.label}
    </span>
  );
}

// Simulated Cell Phone Top Status Bar
export function WeChatStatusBar() {
  const [time, setTime] = React.useState('16:22');

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      setTime(`${hh}:${mm}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex justify-between items-center px-6 pt-3 pb-2 bg-[#0052d9] text-white text-[11px] font-medium tracking-tight select-none">
      <span>{time}</span>
      <div className="flex items-center gap-1.5 opacity-90">
        <span className="text-[9px] font-bold">5G</span>
        <Wifi className="w-3 h-3" />
        <div className="relative w-5 h-2.5 border border-white/60 rounded-[3px] flex items-center px-[1px]">
          <div className="h-1.5 bg-white rounded-[1px] w-[80%]" />
          <div className="absolute -right-[3px] w-[2px] h-1.5 bg-white/60 rounded-r-[1px]" />
        </div>
      </div>
    </div>
  );
}

// WeChat Mini Program Header Bar with the '...' and '○' controls
interface HeaderProps {
  title: string;
  onBack?: () => void;
  showBack?: boolean;
}

export function WeChatHeader({ title, onBack, showBack }: HeaderProps) {
  return (
    <div className="bg-[#0052d9] text-white pt-2 pb-4 px-4 flex items-center justify-between sticky top-0 z-40 select-none shadow-[0_2px_10px_rgba(0,82,217,0.15)]">
      <div className="flex items-center gap-2 max-w-[65%]">
        {showBack && (
          <button 
            onClick={onBack}
            className="p-1 hover:bg-white/10 rounded-full transition-colors shrink-0"
            aria-label="返回"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <h1 className="font-bold text-[15px] truncate tracking-tight">{title}</h1>
      </div>

      {/* Mini Program capsule button mockup */}
      <div className="flex items-center gap-3.5 bg-black/15 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-lg">
        <button className="hover:opacity-80 transition-opacity">
          <MoreHorizontal className="w-4 h-4 text-white" />
        </button>
        <div className="w-[1px] h-3 bg-white/30" />
        <button className="hover:opacity-80 transition-opacity flex items-center justify-center">
          <div className="w-3 h-3 rounded-full border-2 border-white flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-white" />
          </div>
        </button>
      </div>
    </div>
  );
}

// Premium brand Logo Widget
export function BrandLogo() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-500 flex items-center justify-center shadow-md shadow-blue-100">
        <HeartPulse className="w-5 h-5 text-white animate-pulse" />
      </div>
      <div>
        <h3 className="text-sm font-black text-slate-800 tracking-tight">好医生在线助诊</h3>
        <p className="text-[9px] text-[#0052d9] font-bold tracking-widest uppercase">General Practice Tutor</p>
      </div>
    </div>
  );
}

// WeChat Mini Program Ribbon Add Helper Tip
export function MiniProgramTip() {
  const [show, setShow] = React.useState(true);
  if (!show) return null;
  return (
    <div className="bg-slate-900/95 text-white/95 text-[11px] px-4 py-2.5 flex items-center justify-between select-none font-medium">
      <div className="flex items-center gap-1.5">
        <span className="text-amber-400 font-extrabold text-[12px]">★</span>
        <span className="tracking-tight">点击右上角 “<span className="font-bold text-amber-300">···</span>” 添加到我的快捷小程序，使用更方便</span>
      </div>
      <button 
        onClick={() => setShow(false)} 
        className="text-white/40 hover:text-white/80 transition-colors text-[14px] font-light px-1"
      >
        ×
      </button>
    </div>
  );
}

// Bottom Menu Navigator
export interface BottomNavProps {
  activeTab: 'workspace' | 'courses' | 'simulator' | 'knowledge' | 'profile';
  onTabChange: (tab: 'workspace' | 'courses' | 'simulator' | 'knowledge' | 'profile') => void;
}

export function WeChatBottomBar({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: 'workspace', label: '工作台', icon: Compass },
    { id: 'courses', label: '视频课', icon: BookOpen },
    { id: 'simulator', label: 'AI接诊', icon: Share2, isCenterBadge: true },
    { id: 'knowledge', label: '知识库', icon: BookMarked },
    { id: 'profile', label: '我的', icon: User }
  ];

  return (
    <div className="bg-white border-t border-slate-100 px-2 py-1.5 flex justify-around items-center select-none sticky bottom-0 z-50 shadow-[0_-5px_15px_rgba(0,0,0,0.03)]">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        if (tab.isCenterBadge) {
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id as any)}
              className="flex flex-col items-center justify-center -mt-5 relative shrink-0 focus:outline-none"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-md ${
                isActive 
                  ? 'bg-gradient-to-tr from-[#0052d9] to-blue-500 scale-110 text-white shadow-blue-200' 
                  : 'bg-white text-slate-500 hover:text-slate-700 border border-slate-100 hover:scale-105'
              }`}>
                <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-slate-600'}`} />
              </div>
              <span className={`text-[9px] mt-1 font-semibold ${isActive ? 'text-[#0052d9]' : 'text-slate-400'}`}>
                {tab.label}
              </span>
            </button>
          );
        }

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id as any)}
            className="flex flex-col items-center justify-center py-1 flex-1 relative cursor-pointer focus:outline-none"
          >
            <div className="relative">
              <Icon className={`w-5 h-5 transition-transform duration-300 ${
                isActive ? 'text-[#0052d9] scale-110' : 'text-slate-450 hover:text-slate-750'
              }`} />
              {isActive && (
                <motion.div 
                  layoutId="active-dot" 
                  className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-red-500 rounded-full"
                />
              )}
            </div>
            <span className={`text-[9.5px] mt-1 font-semibold transition-colors duration-200 ${
              isActive ? 'text-[#0052d9]' : 'text-slate-500'
            }`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// Workspace high-density stats indicators
export function CompactStats({ stats }: { stats: DoctorStats }) {
  const cards = [
    { label: '视频打卡率', value: `${stats.learningProgress}%`, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-[#e6f4ea]' },
    { label: 'AI模拟得分', value: stats.simulationAvgScore > 0 ? stats.simulationAvgScore.toFixed(0) : '未测试', icon: TrendingUp, color: 'text-[#0052d9]', bg: 'bg-[#e8f0fe]' },
    { label: '接诊数人次', value: `${stats.completedSimulations}人`, icon: Award, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { label: '笔记字数', value: stats.totalNotes > 0 ? `${stats.totalNotes}篇` : '18篇', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 px-1">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white p-2.5 rounded-xl border border-slate-50/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col items-center text-center"
        >
          <div className={`${card.bg} w-7 h-7 rounded-lg flex items-center justify-center mb-1.5`}>
            <card.icon className={`w-4 h-4 ${card.color}`} />
          </div>
          <div className="text-[11px] font-black text-slate-800 leading-tight">{card.value}</div>
          <div className="text-[8px] text-slate-400 font-bold scale-[0.95] mt-0.5 leading-none">{card.label}</div>
        </div>
      ))}
    </div>
  );
}

// Simulated WeChat History Scoring Panel
export function CompactSimulationHistory({ records, onLaunchPatient }: { records: SimulationRecord[], onLaunchPatient?: (patientId: string) => void }) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <Trophy className="w-4 h-4 text-amber-500" />
          最新 AI 模拟评分明细
        </h3>
        <span className="text-[9px] text-[#0052d9] font-bold">查看全部</span>
      </div>
      
      {records.length === 0 ? (
        <div className="text-center py-6 bg-slate-50/80 rounded-xl border border-dashed border-slate-100">
          <p className="text-slate-400 text-[10px] leading-relaxed">暂无接诊分数归档<br />点击“AI接诊”立即挑战一位模拟病人</p>
        </div>
      ) : (
        <div className="space-y-2">
          {records.slice(0, 3).map((record) => (
            <div 
              key={record.id} 
              className="bg-slate-50/50 p-2.5 rounded-xl border border-slate-100/50 flex items-center justify-between gap-2.5 transition-colors hover:bg-slate-50"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="font-bold text-[11px] text-slate-700">{record.patientName}</span>
                  <SpecialtyBadge specialty={record.specialty} />
                </div>
                <p className="text-[9px] text-slate-400 truncate italic">
                  "{record.feedback}"
                </p>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs font-black text-[#0052d9] bg-blue-50 px-2 py-0.5 rounded-md inline-block">
                  {record.totalScore}分
                </div>
                <div className="text-[8px] text-slate-450 mt-1 leading-none font-bold">
                  {new Date(record.timestamp).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
