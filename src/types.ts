export enum Specialty {
  CARDIOVASCULAR = "心血管",
  ENDOCRINE = "内分泌",
  ONCOLOGY = "肿瘤",
}

export interface VideoNote {
  id: string;
  timestamp: number;
  content: string;
  createdAt: number;
}

export interface Course {
  id: string;
  title: string;
  specialty: Specialty;
  description: string;
  videoUrl: string;
  thumbnail: string;
  notes: VideoNote[];
}

export interface PatientCase {
  id: string;
  name: string;
  age: number;
  gender: '男' | '女';
  specialty: Specialty;
  avatarUrl: string;
  chiefComplaint: string;
  medicalHistory: string;
  associatedCourseId: string;
  difficulty: '基础' | '中级' | '高级';
}

export interface SimulationRecord {
  id: string;
  patientId: string;
  patientName: string;
  specialty: Specialty;
  timestamp: number;
  totalScore: number;
  feedback: string;
  scores: {
    communication: number;
    logic: number;
    clinical: number;
    plan: number;
  };
}

export interface DoctorStats {
  learningProgress: number; // 0-100
  simulationAvgScore: number;
  completedSimulations: number;
  totalNotes: number;
  recentRecords: SimulationRecord[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface SimulationSession {
  id: string;
  patientId: string;
  messages: ChatMessage[];
  score?: number;
  feedback?: string;
  status: 'active' | 'completed';
}
