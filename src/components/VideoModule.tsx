import React from 'react';
import { Play, FileText, ChevronRight, Bookmark, X } from 'lucide-react';
import { motion } from 'motion/react';
import { Course, VideoNote } from '../types';
import { SpecialtyBadge } from './UI';

interface VideoPlayerProps {
  course: Course;
  onAddNote: (timestamp: number, content: string) => void;
  onRemoveNote: (id: string) => void;
}

export default function VideoPlayer({ course, onAddNote, onRemoveNote }: VideoPlayerProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [noteContent, setNoteContent] = React.useState('');
  const [notes, setNotes] = React.useState<VideoNote[]>(course.notes);

  const handleAddNote = () => {
    if (!videoRef.current || !noteContent.trim()) return;
    const timestamp = Math.floor(videoRef.current.currentTime);
    const newNote: VideoNote = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp,
      content: noteContent,
      createdAt: Date.now(),
    };
    const updatedNotes = [...notes, newNote].sort((a, b) => a.timestamp - b.timestamp);
    setNotes(updatedNotes);
    onAddNote(timestamp, noteContent);
    setNoteContent('');
  };

  const seekTo = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      videoRef.current.play();
    }
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="aspect-video bg-slate-900 rounded-2xl overflow-hidden shadow-2xl relative border border-slate-800">
          <video
            ref={videoRef}
            src={course.videoUrl}
            className="w-full h-full"
            controls
          />
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <SpecialtyBadge specialty={course.specialty} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">{course.title}</h1>
          <p className="text-slate-600 leading-relaxed">{course.description}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-blue-600" />
            在当前时间点插入笔记
          </h3>
          <div className="flex gap-4">
            <textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="记录关键知识点..."
              className="flex-1 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all resize-none"
              rows={3}
            />
            <button
              onClick={handleAddNote}
              disabled={!noteContent.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all self-end h-12"
            >
              保存笔记
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full max-h-[800px] flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-50 pb-4">
            <FileText className="w-5 h-5 text-slate-400" />
            课程笔记 ({notes.length})
          </h3>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {notes.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-slate-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                  <Bookmark className="w-6 h-6" />
                </div>
                <p className="text-slate-400 text-sm">暂无笔记，在播放时点击保存笔记。</p>
              </div>
            ) : (
              notes.map((note) => (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={note.id}
                  className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 border border-slate-200 group relative transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <button
                      onClick={() => seekTo(note.timestamp)}
                      className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md flex items-center gap-1 hover:bg-blue-100"
                    >
                      <Play className="w-3 h-3" />
                      {formatTime(note.timestamp)}
                    </button>
                    <button 
                      onClick={() => {
                        const newNotes = notes.filter(n => n.id !== note.id);
                        setNotes(newNotes);
                        onRemoveNote(note.id);
                      }}
                      className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">{note.content}</p>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
