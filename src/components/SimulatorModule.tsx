import React from 'react';
import { Send, User as UserIcon, ClipboardList, ImageIcon, Trophy, Loader2, ArrowLeft, MessageSquareText, User, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PatientCase, ChatMessage, SimulationRecord } from '../types';
import { getPatientResponse, evaluateDoctorPerformance } from '../services/aiService';
import { SpecialtyBadge } from './UI';

interface SimulatorProps {
  patientCase: PatientCase;
  onExit: () => void;
  onSave?: (record: SimulationRecord) => void;
}

export default function SimulatorModule({ patientCase, onExit, onSave }: SimulatorProps) {
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [input, setInput] = React.useState('');
  const [activeTab, setActiveTab] = React.useState<'chat' | 'records' | 'images'>('chat');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isEvaluating, setIsEvaluating] = React.useState(false);
  const [evaluation, setEvaluation] = React.useState<{ totalScore: number; feedback: string; scores: any } | null>(null);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const resetSimulation = () => {
    setMessages([]);
    setInput('');
    setEvaluation(null);
    setActiveTab('chat');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = [...messages, userMessage].map(m => ({ role: m.role, content: m.content }));
      const response = await getPatientResponse(history, JSON.stringify(patientCase));
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response || '病人似乎无法回应，请重试。',
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const finishSimulation = async () => {
    if (messages.length < 3) return;
    setIsEvaluating(true);
    try {
      const historyStr = messages.map(m => `${m.role === 'user' ? '医生' : '病人'}: ${m.content}`).join('\n');
      const result = await evaluateDoctorPerformance(historyStr, JSON.stringify(patientCase));
      setEvaluation(result);
      
      // Save result to records
      if (onSave) {
        onSave({
          id: Date.now().toString(),
          patientId: patientCase.id,
          patientName: patientCase.name,
          specialty: patientCase.specialty,
          timestamp: Date.now(),
          totalScore: result.totalScore,
          feedback: result.feedback,
          scores: result.scores,
        });
      }
    } catch (error) {
      console.error('Evaluation error:', error);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-white overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onExit} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-slate-100 rounded-2xl overflow-hidden border-2 border-white shadow-sm shrink-0">
              <img src={patientCase.avatarUrl} alt={patientCase.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-slate-800">{patientCase.name}</h2>
                <SpecialtyBadge specialty={patientCase.specialty} />
              </div>
              <p className="text-xs text-slate-500">{patientCase.age}岁 · {patientCase.gender} · 难度: {patientCase.difficulty}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={finishSimulation}
            disabled={messages.length < 3}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center gap-2 shadow-sm"
          >
            <Trophy className="w-4 h-4" />
            完成问诊并评分
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Interaction Area */}
        <div className="flex-1 flex flex-col bg-slate-50">
          {/* Tabs */}
          <div className="flex bg-white border-b border-slate-100 px-4">
            {[
              { id: 'chat', label: '模拟通话', icon: MessageSquareText },
              { id: 'records', label: '病人资料', icon: ClipboardList },
              { id: 'images', label: '辅助检查', icon: ImageIcon },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all relative ${
                  activeTab === tab.id ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div layoutId="sim-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                )}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence mode="wait">
              {activeTab === 'chat' && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="space-y-4"
                >
                  {messages.length === 0 && (
                    <div className="flex justify-center py-10">
                      <div className="text-center bg-white p-6 rounded-xl border border-slate-200 shadow-sm max-w-sm">
                        <User className="w-10 h-10 text-blue-200 mx-auto mb-3" />
                        <h4 className="font-bold text-slate-800 mb-2">开始模拟问诊</h4>
                        <p className="text-sm text-slate-500 mb-4">
                          病人已坐在对面。请尝试像临床问诊一样开始对话，询问其主诉或不适。
                        </p>
                        <button 
                          onClick={() => setMessages([{ id: 'start', role: 'assistant', content: '您好，大夫。', timestamp: Date.now() }])}
                          className="w-full py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                        >
                          医生，您帮我看看...
                        </button>
                      </div>
                    </div>
                  )}
                  {messages.map((m) => (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
                        m.role === 'user' 
                          ? 'bg-blue-600 text-white rounded-tr-none' 
                          : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
                      }`}>
                        <p className="text-sm leading-relaxed">{m.content}</p>
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                        <span className="text-sm text-slate-500">病人正在思考回答...</span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </motion.div>
              )}

              {activeTab === 'records' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 space-y-6">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-800 mb-4 border-b pb-2">初步病历</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">主诉</label>
                        <p className="text-slate-700 mt-1">{patientCase.chiefComplaint}</p>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">既往病史</label>
                        <p className="text-slate-700 mt-1">{patientCase.medicalHistory}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'images' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center p-12 text-center">
                  <div className="bg-slate-100 p-8 rounded-full mb-4">
                    <ImageIcon className="w-12 h-12 text-slate-300" />
                  </div>
                  <h4 className="font-bold text-slate-800 mb-2">暂无影像资料</h4>
                  <p className="text-sm text-slate-500 max-w-sm">
                    模拟训练早期版本目前仅支持文本。在问诊过程中，病人会通过对话向你描述影像结果。
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Input Area */}
          {activeTab === 'chat' && !evaluation && (
            <div className="p-4 bg-white border-t border-slate-100 flex gap-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="作为医生，你想向病人询问什么？"
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
              />
              <button
                onClick={handleSend}
                className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-100"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Evaluation Modal / Overlay */}
        <AnimatePresence>
          {isEvaluating && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="absolute inset-0 z-50 bg-white/90 backdrop-blur-sm flex items-center justify-center p-8"
            >
              <div className="text-center">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-800 mb-2">AI 导师正在审阅您的表现...</h3>
                <p className="text-slate-500">评估问诊逻辑、沟通技巧与临床决策</p>
              </div>
            </motion.div>
          )}

          {evaluation && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              className="absolute inset-0 z-50 bg-white overflow-y-auto"
            >
              <div className="max-w-3xl mx-auto p-8 lg:p-12">
                <div className="flex items-center justify-between mb-10">
                  <h2 className="text-3xl font-black text-slate-800 tracking-tighter">评估结果</h2>
                  <button onClick={() => setEvaluation(null)} className="p-2 hover:bg-slate-100 rounded-full">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  <div className="bg-blue-600 rounded-3xl p-8 text-white flex flex-col items-center justify-center shadow-xl">
                    <span className="text-sm font-bold uppercase tracking-wider opacity-80 mb-2">总分</span>
                    <div className="text-7xl font-sans font-black">{evaluation.totalScore}</div>
                    <div className="mt-4 h-1 w-20 bg-white/30 rounded-full" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(evaluation.scores).map(([key, val]) => (
                      <div key={key} className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-slate-400 capitalize">{key}</span>
                        </div>
                        <div className="text-xl font-bold text-slate-800">{val as any}</div>
                        <div className="mt-2 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500" style={{ width: `${val}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                  <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-lg">
                    <MessageSquareText className="w-5 h-5 text-blue-600" />
                    导师点评
                  </h4>
                  <p className="text-slate-700 leading-relaxed italic">"{evaluation.feedback}"</p>
                </div>

                <div className="mt-12 flex justify-center gap-4">
                  <button 
                    onClick={onExit}
                    className="px-8 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all"
                  >
                    返回列表
                  </button>
                  <button 
                    onClick={resetSimulation}
                    className="px-8 py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition-all shadow-lg"
                  >
                    再次练习
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
