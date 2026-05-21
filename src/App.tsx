import React from 'react';
import { 
  WeChatStatusBar, WeChatHeader, WeChatBottomBar, CompactStats, CompactSimulationHistory, SpecialtyBadge, BrandLogo, MiniProgramTip
} from './components/UI';
import { Course, PatientCase, DoctorStats, SimulationRecord, VideoNote } from './types';
import { COURSES, PATIENT_CASES } from './constants';
import VideoPlayer from './components/VideoModule';
import SimulatorModule from './components/SimulatorModule';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Tv, ClipboardList, BookMarked, User, ShieldAlert, Award, ArrowRight, Sparkles, 
  Search, Bell, AlertCircle, RefreshCw, Send, Plus, CheckCircle, HeartPulse, Bookmark, ChevronRight
} from 'lucide-react';

export default function App() {
  // Mobile UI App Tab state
  const [activeTab, setActiveTab] = React.useState<'workspace' | 'courses' | 'simulator' | 'knowledge' | 'profile'>('workspace');
  // Dynamic selected course and patient
  const [selectedCourse, setSelectedCourse] = React.useState<Course | null>(null);
  const [selectedPatient, setSelectedPatient] = React.useState<PatientCase | null>(null);
  
  // Scoring records state - seeded with some initial realistic data to make the app look mature
  const [records, setRecords] = React.useState<SimulationRecord[]>([
    {
      id: 'init_1',
      patientId: 'p1_1',
      patientName: '张福禄',
      specialty: '心血管' as any,
      timestamp: Date.now() - 3600000 * 4,
      totalScore: 88,
      feedback: '主诉询问详实，对于高血压伴心悸的风险节点判断准确。降压方案调整合理。',
      scores: { communication: 90, logic: 85, clinical: 90, plan: 87 }
    },
    {
      id: 'init_2',
      patientId: 'p2_1',
      patientName: '吴铁柱',
      specialty: '内分泌' as any,
      timestamp: Date.now() - 3600000 * 24,
      totalScore: 79,
      feedback: '患者有多饮多食消瘦，首诊方向明确；但是在排查酮症酸中毒深度上稍显欠缺。',
      scores: { communication: 82, logic: 75, clinical: 80, plan: 79 }
    }
  ]);

  // Shared user notes state
  const [globalNotes, setGlobalNotes] = React.useState<Array<{id: string, courseTitle: string, timestamp: number, content: string}>>([
    {
      id: 'note_1',
      courseTitle: '高血压的规范化管理',
      timestamp: 165,
      content: '高血压伴充血性心力衰竭及骨质疏松患者，首选噻嗪类利尿剂。需规律监测电解质与血压波动幅度。'
    },
    {
      id: 'note_2',
      courseTitle: '2型糖尿病长期随访',
      timestamp: 240,
      content: '对老年糖尿病合并心血管疾病者，放宽空腹血糖限制，优先选用不易发生低血糖风险的药物组合。'
    }
  ]);

  // Manual new memo notes state
  const [memos, setMemos] = React.useState<string[]>([]);
  const [newMemoInput, setNewMemoInput] = React.useState('');

  const calculateAvgScore = () => {
    if (records.length === 0) return 0;
    return records.reduce((acc, r) => acc + r.totalScore, 0) / records.length;
  };

  const stats: DoctorStats = {
    learningProgress: 75,
    simulationAvgScore: calculateAvgScore(),
    completedSimulations: records.length,
    totalNotes: globalNotes.length + memos.length,
    recentRecords: [...records].sort((a, b) => b.timestamp - a.timestamp)
  };

  const handleSaveSimulation = (record: SimulationRecord) => {
    setRecords(prev => [record, ...prev]);
  };

  const handleAddNoteFromVideo = (courseTitle: string, timestamp: number, content: string) => {
    setGlobalNotes(prev => [
      {
        id: Math.random().toString(),
        courseTitle,
        timestamp,
        content
      },
      ...prev
    ]);
  };

  const handleRemoveNoteFromVideo = (id: string) => {
    setGlobalNotes(prev => prev.filter(n => n.id !== id));
  };

  const addManualMemo = () => {
    if (!newMemoInput.trim()) return;
    setMemos(prev => [newMemoInput.trim(), ...prev]);
    setNewMemoInput('');
  };

  // Reset scores and learning data helper if the user requests
  const resetAllProgress = () => {
    if (window.confirm('您确定要重置当前所有的打卡率、AI模拟病例接诊分数与学习笔记吗？')) {
      setRecords([]);
      setGlobalNotes([]);
      setMemos([]);
      setSelectedCourse(null);
      setSelectedPatient(null);
      setActiveTab('workspace');
    }
  };

  // Switch tab and clear subroutes
  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    if (tab !== 'courses') setSelectedCourse(null);
    if (tab !== 'simulator') setSelectedPatient(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50/30 flex flex-col items-center justify-center font-sans">
      
      {/* Desktop Dashboard Wrapper for gorgeous context presentation */}
      <div className="w-full max-w-7xl mx-auto px-4 py-6 md:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start h-full">
        
        {/* Left column: Desktop informational presentation panel (hidden on pure screens) */}
        <div className="lg:col-span-4 hidden lg:flex flex-col gap-6 text-slate-800 self-stretch justify-between py-4">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-3xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
                <HeartPulse className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  全科助手数字化舱
                  <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">Mini v2.2</span>
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">WeChat Mobile Training Workbench Simulator</p>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur p-6 rounded-3xl border border-slate-200/40 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">微信小程序版·智能优化</span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-800 leading-snug">
                高信息密度、多组件同一列卡片流布局
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed">
                依据典型移动端医学继续教育体验，我们将零散视口重构为单列面板。底部拥有5大菜单切换。配合高还原度的微信胶囊控件、通知和权威医疗机构标志，完美还原真实的掌上特训终端。
              </p>
              <div className="h-[1px] bg-slate-100 w-full" />
              <div className="text-xs text-slate-400 font-bold flex flex-col gap-1">
                <span>✓ 支持 AI Gemini 引擎实时交互诊断</span>
                <span>✓ 3门核心视频课程点播，音视频协同</span>
                <span>✓ 模拟 15 位包含心血管、内分泌、肿瘤典型患者</span>
                <span>✓ 实时学情评分档案与专业技能判定</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-850 shadow-sm relative overflow-hidden">
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
              <Award className="w-32 h-32 text-indigo-400" />
            </div>
            <div className="relative z-10 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-indigo-300 tracking-widest block mb-1">医生学情通报</span>
                <h4 className="font-bold text-base text-slate-100">王铁心 主任医师</h4>
                <p className="text-[11px] text-slate-400">北京市第一社区卫生服务中心</p>
              </div>
              <div className="mt-8 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400">平均结业评分</div>
                  <div className="text-2xl font-black text-white mt-1">
                    {stats.simulationAvgScore > 0 ? `${stats.simulationAvgScore.toFixed(1)}分` : '暂未结业'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">徽章认证</div>
                  <div className={`text-xs font-bold mt-1 px-2.5 py-1 rounded-full ${
                    stats.simulationAvgScore >= 85 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {stats.simulationAvgScore >= 85 ? '★ 领航全科医' : '学员等级'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Center column: Gorgeous, high-fidelity Smartphone Device Mockup (fully responsive) */}
        <div className="lg:col-span-5 md:col-span-8 w-full max-w-full md:max-w-[430px] md:h-[840px] md:rounded-[48px] md:border-[10px] md:border-slate-950 md:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] md:relative md:overflow-hidden md:mx-auto flex flex-col bg-slate-50 min-h-[100vh] md:min-h-0">
          
          {/* Simulated Mobile Status Line - only shows in smartphone shells */}
          <div className="hidden md:block shrink-0">
            <WeChatStatusBar />
          </div>

          {/* Actual Mini Program Content Container with internal vertical scroll */}
          <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar relative md:max-h-full pb-[calc(env(safe-area-inset-bottom)+50px)]">
            
            {/* Display header dynamically based on state */}
            {activeTab === 'workspace' && (
              <WeChatHeader title="全科医生数字化培训助手" showBack={false} />
            )}
            {activeTab === 'courses' && (
              <WeChatHeader 
                title={selectedCourse ? selectedCourse.title : "医学专家微课"} 
                showBack={!!selectedCourse} 
                onBack={() => setSelectedCourse(null)} 
              />
            )}
            {activeTab === 'simulator' && (
              <WeChatHeader 
                title={selectedPatient ? `正在诊断: ${selectedPatient.name}` : "AI 全科评估诊断舱"} 
                showBack={!!selectedPatient} 
                onBack={() => setSelectedPatient(null)} 
              />
            )}
            {activeTab === 'knowledge' && (
              <WeChatHeader title="临床知识库与错题" showBack={false} />
            )}
            {activeTab === 'profile' && (
              <WeChatHeader title="学情数字化档案" showBack={false} />
            )}

            {/* Quick mini-program alert widget */}
            {activeTab === 'workspace' && <MiniProgramTip />}

            {/* Core Scroll View wrapper */}
            <div className="flex-1 overflow-y-auto w-full">
              <AnimatePresence mode="wait">
                
                {/* 1. WORKSPACE / 医务室 tab view */}
                {activeTab === 'workspace' && (
                  <motion.div
                    key="tab-workspace"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-3 space-y-4"
                  >
                    
                    {/* Brand Banner Block */}
                    <div className="bg-[#0052d9] text-white p-4 rounded-2xl flex items-center justify-between shadow-md relative overflow-hidden -mt-1">
                      <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-15 pointer-events-none">
                        <HeartPulse className="w-24 h-24 text-white" />
                      </div>
                      <div className="relative z-10 space-y-1.5 max-w-[80%]">
                        <span className="text-[9px] bg-white/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">
                          卫健委认证继续医教平台
                        </span>
                        <h2 className="text-sm font-black tracking-tight leading-snug">全科医生基层规范特训系统</h2>
                        <p className="text-[10px] text-blue-100 font-medium">专注医疗全科教培24年 · AI 答疑评估</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-white/10 shrink-0 flex items-center justify-center border border-white/20">
                        <Award className="w-5 h-5 text-amber-300" />
                      </div>
                    </div>

                    {/* Search Mockup */}
                    <div className="flex gap-2">
                      <div className="flex-1 bg-white border border-slate-200/60 rounded-xl px-3 py-2 flex items-center gap-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.015)]">
                        <Search className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-slate-400 text-xs truncate">Q 查找病例、疾病、视频等...</span>
                      </div>
                      <button className="bg-white border border-slate-200/60 flex items-center justify-center w-8 h-8 rounded-xl shrink-0 text-slate-500 hover:bg-slate-50 relative">
                        <Bell className="w-4 h-4" />
                        <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
                      </button>
                    </div>

                    {/* High-density Circular button panels (exactly like the blue icons in uploaded image!) */}
                    <div className="bg-white p-3.5 rounded-2xl border border-slate-50/80 shadow-[0_2px_10px_rgba(0,0,0,0.01)]">
                      <div className="grid grid-cols-3 gap-1">
                        <button 
                          onClick={() => handleTabChange('courses')}
                          className="flex flex-col items-center text-center cursor-pointer hover:opacity-85"
                        >
                          <div className="w-11 h-11 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mb-1.5">
                            <Tv className="w-5 h-5 text-[#0052d9]" />
                          </div>
                          <span className="text-xs font-black text-slate-800 leading-normal">特学门诊/微课</span>
                          <span className="text-[8.5px] text-slate-400 whitespace-nowrap scale-[0.95]">10~22点打卡</span>
                        </button>

                        <button 
                          onClick={() => handleTabChange('simulator')}
                          className="flex flex-col items-center text-[#0052d9] text-center cursor-pointer hover:opacity-85"
                        >
                          <div className="w-11 h-11 rounded-full bg-[#e8f0fe] border border-blue-200/50 flex items-center justify-center mb-1.5">
                            <Sparkles className="w-5 h-5" />
                          </div>
                          <span className="text-xs font-bold leading-normal">AI 会诊/接诊</span>
                          <span className="text-[8.5px] text-[#0052d9] font-bold tracking-tight whitespace-nowrap scale-[0.95]">在线导师评分</span>
                        </button>

                        <button 
                          onClick={() => handleTabChange('knowledge')}
                          className="flex flex-col items-center text-center cursor-pointer hover:opacity-85"
                        >
                          <div className="w-11 h-11 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center mb-1.5">
                            <BookMarked className="w-5 h-5 text-amber-600" />
                          </div>
                          <span className="text-xs font-black text-slate-800 leading-normal">提分考卷/笔记</span>
                          <span className="text-[8.5px] text-slate-400 whitespace-nowrap scale-[0.95]">社区高错排查</span>
                        </button>
                      </div>
                    </div>

                    {/* Quick Badges Layout Grid (resembling "快速问医生 3分钟内接诊" panels from user screenshot) */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-amber-50/50 border border-amber-200/30 p-2.5 rounded-xl flex flex-col justify-between">
                        <div className="text-[11px] font-black text-amber-800 leading-tight">快速模拟诊疗</div>
                        <div className="text-[8.5px] text-amber-500 font-bold tracking-tight mt-1">3分钟快速反馈打分</div>
                      </div>
                      <div className="bg-emerald-50/40 border border-emerald-200/30 p-2.5 rounded-xl flex flex-col justify-between">
                        <div className="text-[11px] font-black text-emerald-800 leading-tight">免费医学名师课</div>
                        <div className="text-[8.5px] text-emerald-500 font-bold tracking-tight mt-1">社区慢性病全面解读</div>
                      </div>
                      <div className="bg-blue-50/40 border border-blue-200/30 p-2.5 rounded-xl flex flex-col justify-between">
                        <div className="text-[11px] font-black text-blue-800 leading-tight">指南金牌速记</div>
                        <div className="text-[8.5px] text-blue-500 font-bold tracking-tight mt-1">排查诊治误区指南</div>
                      </div>
                      <div className="bg-purple-50/40 border border-purple-200/30 p-2.5 rounded-xl flex flex-col justify-between">
                        <div className="text-[11px] font-black text-purple-800 leading-tight">自动阅卷档案</div>
                        <div className="text-[8.5px] text-purple-500 font-bold tracking-tight mt-1">错题难点一键回放</div>
                      </div>
                    </div>

                    {/* Real-time stats snapshot */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center px-1">
                        <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">打卡与学情统计</h4>
                        <span className="text-[9px] text-[#0052d9] font-bold">查看详情 &gt;</span>
                      </div>
                      <CompactStats stats={stats} />
                    </div>

                    {/* Horizontal Patient Swipe Section (mimicking "找医生" / "本地医生" block from image!) */}
                    <div className="bg-[#e8f0fe]/60 border border-blue-100 rounded-2xl p-3.5 space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1">
                          <span className="text-[#0052d9] font-black text-xs">诊疗挑战舱 </span>
                          <span className="text-xs text-slate-800">· 推荐患者列表</span>
                        </div>
                        <span className="text-[9px] text-[#0052d9] font-bold">全选15人</span>
                      </div>

                      {/* Horizontal scrollable row */}
                      <div className="flex gap-2.5 overflow-x-auto pb-1.5 no-scrollbar scroll-smooth">
                        {PATIENT_CASES.slice(0, 4).map((patient) => (
                          <div 
                            key={patient.id}
                            onClick={() => {
                              setSelectedPatient(patient);
                              setActiveTab('simulator');
                            }}
                            className="bg-white p-3 rounded-xl border border-blue-100/30 w-[115px] shrink-0 text-center shadow-sm hover:border-[#0052d9] transition-all cursor-pointer flex flex-col justify-between"
                          >
                            <div>
                              <div className="w-10 h-10 rounded-full mx-auto overflow-hidden border border-slate-100 mb-1.5">
                                <img src={patient.avatarUrl} className="w-full h-full object-cover" />
                              </div>
                              <div className="text-xs font-bold text-slate-800">{patient.name}</div>
                              <div className="text-[8px] text-indigo-500 font-bold scale-90 mt-0.5">{patient.difficulty}难度</div>
                              <textarea 
                                readOnly
                                className="w-full text-center text-[7.5px] text-slate-400 mt-1 focus:outline-none resize-none pointer-events-none line-clamp-2 h-[22px] leading-tight"
                                value={patient.chiefComplaint}
                              />
                            </div>
                            <button className="w-full py-1 text-[8px] bg-slate-900 border-none hover:bg-[#0052d9] text-white rounded-md font-bold mt-2">
                              立即接诊 &gt;
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Scoring records list */}
                    <CompactSimulationHistory 
                      records={stats.recentRecords} 
                      onLaunchPatient={(id) => {
                        const p = PATIENT_CASES.find(item => item.id === id);
                        if (p) {
                          setSelectedPatient(p);
                          setActiveTab('simulator');
                        }
                      }}
                    />

                    {/* Evaluative week graphs */}
                    <div className="bg-white p-3 rounded-2xl border border-slate-50/80 shadow-[0_2px_10px_rgba(0,0,0,0.01)]">
                      <h4 className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5 mb-2.5">
                        <ClipboardList className="w-4 h-4 text-slate-400" />
                        继续教育·得分周报轨迹
                      </h4>
                      <div className="flex items-end gap-1 px-1 h-20 mb-1 pt-6">
                        {[65, 82, 75, 90, 88, 95, 85].map((score, i) => (
                          <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                            <div 
                              className="w-full bg-blue-100 hover:bg-[#0052d9] transition-all rounded-t-sm" 
                              style={{ height: `${score / 1.5}%` }} 
                            />
                            <span className="text-[7.5px] scale-[0.9] text-slate-400 font-bold shrink-0 mt-1">周{['一', '二', '三', '四', '五', '六', '日'][i]}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="text-center text-[9px] text-slate-400 pb-4 leading-relaxed font-bold">
                      国家级村医·全科医生规范教培基地推广产品<br />
                      客服专线: 400-009-8899 · ©好大夫数字教研
                    </div>
                  </motion.div>
                )}

                {/* 2. COURSES TAB VIEW */}
                {activeTab === 'courses' && (
                  <motion.div
                    key="tab-courses"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-3 space-y-4"
                  >
                    {!selectedCourse ? (
                      <>
                        <div className="p-1">
                          <h2 className="text-sm font-black text-slate-800">全网专家名课</h2>
                          <p className="text-[10px] text-slate-400 mt-0.5">点击下方课程卡片，即可观看名师教学指导</p>
                        </div>

                        <div className="space-y-3">
                          {COURSES.map((course) => (
                            <div
                              key={course.id}
                              onClick={() => setSelectedCourse(course)}
                              className="bg-white rounded-xl overflow-hidden border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.015)] cursor-pointer hover:border-blue-300 transition-all"
                            >
                              <div className="aspect-video relative overflow-hidden bg-slate-900">
                                <img src={course.thumbnail} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                <div className="absolute inset-0 bg-black/20" />
                                <div className="absolute top-2 left-2 bg-[#0052d9] text-white text-[8px] font-black px-2 py-0.5 rounded-full select-none">
                                  {course.specialty}课程
                                </div>
                                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[8px] px-1.5 py-0.5 rounded-md font-bold">
                                  28:15
                                </div>
                              </div>
                              <div className="p-3">
                                <h4 className="text-xs font-black text-slate-800 truncate">{course.title}</h4>
                                <p className="text-[10px] text-slate-500 line-clamp-2 mt-1 leading-normal">{course.description}</p>
                                <div className="flex justify-between items-center mt-3 border-t border-slate-50 pt-2 text-[#0052d9] text-[10px] font-bold">
                                  <span>学习即可获取 10 积分</span>
                                  <span className="flex items-center gap-0.5">立即播放 <ArrowRight className="w-2.5 h-2.5" /></span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="space-y-4 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
                        
                        {/* Video Player wrapper adjusted for WeChat internal frame */}
                        <VideoPlayer 
                          course={selectedCourse} 
                          onAddNote={(timestamp, content) => handleAddNoteFromVideo(selectedCourse.title, timestamp, content)} 
                          onRemoveNote={handleRemoveNoteFromVideo} 
                        />

                        {/* Associated Cases in the course view */}
                        <div className="bg-slate-50 p-3 rounded-xl space-y-2.5 mt-2">
                          <div>
                            <h4 className="text-[10px] font-bold uppercase text-slate-400">本微课关联接诊实操挑战</h4>
                            <p className="text-[11px] font-extrabold text-[#0052d9] mt-0.5">考查技能: 【{selectedCourse.specialty}综合判定】</p>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2">
                            {PATIENT_CASES.filter(p => p.associatedCourseId === selectedCourse.id).slice(0, 4).map((patient) => (
                              <div
                                key={patient.id}
                                onClick={() => {
                                  setSelectedPatient(patient);
                                  setActiveTab('simulator');
                                }}
                                className="bg-white p-2.5 rounded-xl border border-slate-200/60 cursor-pointer hover:border-blue-500 transition-all flex items-center gap-2"
                              >
                                <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
                                  <img src={patient.avatarUrl} className="w-full h-full object-cover" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="text-[10px] font-bold text-slate-800 truncate">{patient.name}</div>
                                  <div className="text-[8px] text-slate-400">{patient.difficulty}难度</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <button 
                          onClick={() => setSelectedCourse(null)}
                          className="w-full py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl font-bold text-xs"
                        >
                          返回视频列表
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* 3. SIMULATOR / AI接诊 tab view */}
                {activeTab === 'simulator' && (
                  <motion.div
                    key="tab-simulator"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-3 space-y-4"
                  >
                    {!selectedPatient ? (
                      <>
                        <div className="p-1">
                          <h2 className="text-sm font-black text-slate-800">15位核心模拟患者舱</h2>
                          <p className="text-[10px] text-slate-400 mt-0.5">选择一位患者进行接诊沟通，AI将从问诊逻辑和处理方案等维度予以反馈打分。</p>
                        </div>

                        {/* Search Patient */}
                        <div className="bg-white border border-slate-200/50 rounded-xl px-3 py-2 flex items-center gap-2">
                          <Search className="w-4 h-4 text-slate-400 animate-pulse" />
                          <input 
                            readOnly
                            placeholder="搜索姓名、性别、主诉典型词对..."
                            className="text-xs bg-transparent border-none outline-none w-full text-slate-500 cursor-not-allowed"
                          />
                        </div>

                        {/* Disease Categories pills */}
                        <div className="flex gap-1.5 pb-1 select-none">
                          <span className="text-[9px] bg-[#0052d9] text-white font-extrabold px-2.5 py-1 rounded-full">心血管 (5阶)</span>
                          <span className="text-[9px] bg-amber-50 text-amber-600 font-extrabold px-2.5 py-1 rounded-full">糖尿病 (5阶)</span>
                          <span className="text-[9px] bg-purple-50 text-purple-600 font-extrabold px-2.5 py-1 rounded-full">胸外科 (5阶)</span>
                        </div>

                        {/* Dense list of patients */}
                        <div className="space-y-2.5">
                          {PATIENT_CASES.map((patient) => (
                            <div
                              key={patient.id}
                              onClick={() => setSelectedPatient(patient)}
                              className="bg-white rounded-xl p-3 border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:border-blue-400 transition-all cursor-pointer flex items-start gap-3"
                            >
                              <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-slate-50 bg-slate-100">
                                <img src={patient.avatarUrl} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-extrabold text-slate-800 text-xs">{patient.name}</span>
                                    <span className="text-[9px] text-slate-400">({patient.age}岁 · {patient.gender})</span>
                                  </div>
                                  <span className={`text-[8.5px] px-1.5 py-0.5 rounded-md font-bold ${
                                    patient.difficulty === '基础' ? 'bg-emerald-50 text-emerald-600' :
                                    patient.difficulty === '中级' ? 'bg-blue-50 text-[#0052d9]' :
                                    'bg-red-50 text-red-600'
                                  }`}>
                                    {patient.difficulty}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5 mt-1">
                                  <SpecialtyBadge specialty={patient.specialty} />
                                </div>
                                <p className="text-[10px] text-slate-500 truncate mt-1.5 italic font-bold">
                                  主诉: "{patient.chiefComplaint}"
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden -mx-3 -my-3 h-[720px] flex flex-col relative">
                        {/* Interactive simulation terminal tailored inside the phone */}
                        <SimulatorModule 
                          patientCase={selectedPatient} 
                          onExit={() => setSelectedPatient(null)} 
                          onSave={handleSaveSimulation}
                        />
                      </div>
                    )}
                  </motion.div>
                )}

                {/* 4. KNOWLEDGE & WRONG LOGS TAB VIEW */}
                {activeTab === 'knowledge' && (
                  <motion.div
                    key="tab-knowledge"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-3 space-y-4"
                  >
                    <div className="p-1">
                      <h2 className="text-sm font-black text-slate-800">全科医生必备诊疗速记本</h2>
                      <p className="text-[10px] text-slate-400 mt-0.5">包含国家基层诊疗指南要点以及您在听课、接诊时做下的所有笔记学案。</p>
                    </div>

                    {/* Standard Clinical Guidelines Banner List */}
                    <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.01)] space-y-3">
                      <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 pb-2 border-b border-slate-50">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        首诊指南核心备忘
                      </h3>
                      
                      <div className="space-y-2">
                        <div className="p-2 bg-rose-50/50 rounded-lg">
                          <h4 className="text-[10px] font-black text-rose-800">◆ 高血压社区随访 (2025指南)</h4>
                          <p className="text-[9px] text-slate-600 mt-0.5 leading-normal">凡初诊高压≥140或低压≥90，均应建立个人档案。随访频率为每季至少1次。若伴靶器官损害首诊须上转上一级医院专家复核。</p>
                        </div>
                        <div className="p-2 bg-amber-50/50 rounded-lg">
                          <h4 className="text-[10px] font-black text-amber-850">◆ 2型糖尿病随访筛查</h4>
                          <p className="text-[9px] text-slate-600 mt-0.5 leading-normal">足部神经检查是随访的关键点，极易发生不典型肢端麻木。应定期进行视网膜照相以及尿微量白蛋白测定防治不可逆损害。</p>
                        </div>
                        <div className="p-2 bg-indigo-50/50 rounded-lg">
                          <h4 className="text-[10px] font-black text-[#0052d9]">◆ 肺癌早期初筛排除</h4>
                          <p className="text-[9px] text-slate-600 mt-0.5 leading-normal">中老年重度吸烟者（20包/年以上）如出现慢性咳嗽、性质由干咳或无粘液痰突变，或咯血胸闷，首选低剂量薄层CT（LDCT）。</p>
                        </div>
                      </div>
                    </div>

                    {/* Manual Memo Addition Box */}
                    <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.01)] space-y-2">
                      <h3 className="text-xs font-bold text-slate-800">手动录入我的诊治备忘</h3>
                      <div className="flex gap-2">
                        <input 
                          type="text"
                          value={newMemoInput}
                          onChange={(e) => setNewMemoInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && addManualMemo()}
                          placeholder="例如: 询问患者有无痛风家族史..."
                          className="flex-1 bg-slate-50 border border-slate-250 text-[10px] outline-none px-2.5 py-1.5 rounded-lg focus:ring-1 focus:ring-[#0052d9]"
                        />
                        <button 
                          onClick={addManualMemo}
                          className="bg-[#0052d9] text-white p-1.5 rounded-lg hover:bg-blue-700 shrink-0"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Display manual memos */}
                      {memos.length > 0 && (
                        <div className="pt-2 divide-y divide-slate-50">
                          {memos.map((memo, idx) => (
                            <div key={idx} className="py-2 flex items-center justify-between text-[10px] text-slate-600">
                              <span>• {memo}</span>
                              <button 
                                onClick={() => setMemos(prev => prev.filter((_, i) => i !== idx))}
                                className="text-red-500 scale-90"
                              >
                                删除
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Integrated User Notes during watching lessons */}
                    <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.01)] space-y-3">
                      <h3 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                        <Bookmark className="w-4 h-4 text-[#0052d9]" />
                        听课与会诊笔记 ({globalNotes.length})
                      </h3>

                      {globalNotes.length === 0 ? (
                        <p className="text-slate-400 text-[10px] text-center py-4 bg-slate-50 rounded-lg">您在观看视频微课时暂未记下笔记，视频播放器右侧可点击实时保存。</p>
                      ) : (
                        <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                          {globalNotes.map((note) => (
                            <div key={note.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-150/50">
                              <div className="flex justify-between items-center text-[8.5px] text-slate-400">
                                <span className="font-bold text-[#0052d9]">{note.courseTitle}</span>
                                <span>{note.timestamp ? `进度 ${Math.floor(note.timestamp / 60)}分${note.timestamp % 60}秒` : '备忘录'}</span>
                              </div>
                              <p className="text-[10px] text-slate-700 font-medium leading-relaxed mt-1">{note.content}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                  </motion.div>
                )}

                {/* 5. PROFILE TAB VIEW */}
                {activeTab === 'profile' && (
                  <motion.div
                    key="tab-profile"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-3 space-y-4"
                  >
                    
                    {/* Doctor ID Card Profile */}
                    <div className="bg-gradient-to-tr from-slate-900 to-slate-800 text-white p-4 rounded-2xl relative overflow-hidden shadow-md select-none">
                      <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-10 pointer-events-none">
                        <Award className="w-28 h-28" />
                      </div>

                      <div className="relative z-10 flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full border-2 border-slate-700 overflow-hidden bg-slate-800 shrink-0">
                          <img src="/src/assets/images/regenerated_image_1779223079761.png" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-extrabold text-sm text-slate-100">王铁心 主任医师</h3>
                            <span className="text-[8px] bg-indigo-500/30 text-indigo-300 font-bold px-1.5 py-0.5 rounded border border-indigo-500/20">
                              特聘授课讲师
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400">北京市第一社区卫生服务中心</p>
                          <p className="text-[8.5px] text-slate-500 mt-1">执业编码: 240101967200501</p>
                        </div>
                      </div>

                      {/* Qualified digital badge */}
                      {stats.simulationAvgScore >= 85 && (
                        <div className="bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-xl p-2.5 mt-4 flex items-center justify-between text-[10px]">
                          <div className="flex items-center gap-1.5">
                            <span className="text-amber-400 font-black text-xs">★</span>
                            <div>
                              <span className="font-bold">卫健委认证继续医教优秀合格勋章</span>
                              <p className="text-[8px] text-slate-300 scale-95 origin-left leading-none mt-0.5">达成平均 AI 指标 85+ 优异表现</p>
                            </div>
                          </div>
                          <Award className="w-5 h-5 text-amber-400" />
                        </div>
                      )}
                    </div>

                    {/* Numerical Grades Breakdown lists */}
                    <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.01)] space-y-3">
                      <h4 className="text-xs font-bold text-slate-800">医生专业问诊度量</h4>
                      
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold mb-1">
                            <span>医学逻辑性与鉴别思维</span>
                            <span className="text-[#0052d9]">{stats.simulationAvgScore > 0 ? `${(stats.simulationAvgScore).toFixed(0)}分` : '暂未测试'}</span>
                          </div>
                          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 rounded-full" style={{ width: stats.simulationAvgScore > 0 ? `${stats.simulationAvgScore}%` : '0%' }} />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold mb-1">
                            <span>人文医患沟通技巧</span>
                            <span className="text-emerald-500">{stats.simulationAvgScore > 0 ? `${(stats.simulationAvgScore * 1.05 > 100 ? 100 : stats.simulationAvgScore * 1.05).toFixed(0)}分` : '暂未测试'}</span>
                          </div>
                          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: stats.simulationAvgScore > 0 ? `${stats.simulationAvgScore * 1.05 > 100 ? 100 : stats.simulationAvgScore * 1.05}%` : '0%' }} />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold mb-1">
                            <span>初诊慢性管理安全意识</span>
                            <span className="text-amber-500">{stats.simulationAvgScore > 0 ? `${(stats.simulationAvgScore * 0.95).toFixed(0)}分` : '暂未测试'}</span>
                          </div>
                          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500 rounded-full" style={{ width: stats.simulationAvgScore > 0 ? `${stats.simulationAvgScore * 0.95}%` : '0%' }} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Developer administrative widgets */}
                    <div className="bg-white rounded-xl overflow-hidden border border-slate-100 divide-y divide-slate-50">
                      <div className="p-3.5 flex items-center justify-between text-xs text-slate-700 font-black">
                        <span>常见基础病诊治考核说明</span>
                        <ChevronRight className="w-4 h-4 text-slate-300" />
                      </div>
                      <div className="p-3.5 flex items-center justify-between text-xs text-slate-700 font-black">
                        <span>关于我们及隐私协议 (数字证书)</span>
                        <ChevronRight className="w-4 h-4 text-slate-300" />
                      </div>
                      <div 
                        onClick={resetAllProgress}
                        className="p-3.5 flex items-center justify-between text-xs text-red-600 font-bold bg-red-50/20 cursor-pointer hover:bg-red-50 transition-colors"
                      >
                        <span className="flex items-center gap-1.5">
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          重置当前所有教学和测分记录
                        </span>
                        <span className="text-[10px] text-red-400">操作不可逆</span>
                      </div>
                    </div>

                    <div className="text-center text-[9px] text-slate-400 py-2 leading-tight">
                      技术提供: 腾讯微信小程序开放平台合作终端<br />
                      版本 2.2.0 · 保证所有患者会话完全保密
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

            {/* Simulated Mobile Bottom Tab bar */}
            <div className="absolute bottom-0 left-0 right-0 z-50 shrink-0">
              <WeChatBottomBar activeTab={activeTab} onTabChange={handleTabChange} />
            </div>

          </div>

          {/* iOS mockup home indicator notch inside container */}
          <div className="hidden md:block w-32 h-1 bg-slate-900 rounded-full absolute bottom-1.5 left-1/2 -translate-x-1/2 pointer-events-none z-50" />
        </div>

        {/* Right column: Desktop additional information block (hidden on pure client preview screens) */}
        <div className="lg:col-span-3 hidden lg:flex flex-col gap-6 text-slate-800 self-stretch py-4">
          <div className="bg-white/80 backdrop-blur p-5 rounded-3xl border border-slate-200/40 shadow-sm space-y-4">
            <h4 className="text-xs font-bold text-[#0052d9] uppercase tracking-wider flex items-center gap-1.5">
              <ClipboardList className="w-4 h-4" />
              中国全科医生·培训大纲
            </h4>
            <p className="text-xs text-slate-500 leading-normal">
              本平台紧贴中国社区与乡村全科医生的慢性病筛查和控制指南：
            </p>
            <div className="space-y-2.5">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-800">Ⅰ 一级预防与主诉甄别</span>
                <p className="text-[9.5px] text-slate-400 leading-normal mt-0.5">如何对长期干咳伴随嘶哑的龙德柱判断肺癌前兆并及时安排CT。</p>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-800">Ⅱ 个体化血糖安全调控</span>
                <p className="text-[9.5px] text-slate-400 leading-normal mt-0.5">对8型糖尿病赵素琴、出现下肢浮肿的孙连忠合理评估靶器官损害。</p>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-800">Ⅲ 高血压并发心血管疾病</span>
                <p className="text-[9.5px] text-slate-400 leading-normal mt-0.5">张福禄及陈建国等典型突发颈部僵硬高危反应的用药与转诊。</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-600 text-white p-5 rounded-3xl shadow-lg shadow-blue-100 shrink-0 select-none">
            <h4 className="text-xs font-black uppercase tracking-wider mb-2">学分判定提示</h4>
            <p className="text-[11px] text-blue-50 leading-relaxed">
              医生需要在 <b>AI会诊舱</b> 里与任意一位模拟病人进行至少 3 轮以上的深层次问候和发问，才可以申请 <b>AI导师自动评分</b>，考核成绩均会自动记入医生专业度量度。
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
