import { Specialty, Course, PatientCase } from './types';

export const COURSES: Course[] = [
  {
    id: 'c1',
    title: '高血压的规范化管理',
    specialty: Specialty.CARDIOVASCULAR,
    description: '基层高血压指南解读与社区管理。',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail: '/src/assets/images/regenerated_image_1778179301580.png',
    notes: []
  },
  {
    id: 'c2',
    title: '2型糖尿病长期随访',
    specialty: Specialty.ENDOCRINE,
    description: '个体化血糖控制目标设定与并发症筛查储备。',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=800',
    notes: []
  },
  {
    id: 'c3',
    title: '肺癌早期识别与初筛',
    specialty: Specialty.ONCOLOGY,
    description: '肺结核与肺癌的鉴别诊断及影像学分析。',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: '/src/assets/images/regenerated_image_1778179302560.png',
    notes: []
  }
];

const PATIENT_AVATARS = {
  male_old_1: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&q=80&w=200&h=200',
  male_old_2: 'https://images.unsplash.com/photo-1544168190-79c17527004f?auto=format&fit=crop&q=80&w=200&h=200',
  male_mid_1: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200',
  male_mid_2: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200',
  female_old_1: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&h=200',
  female_old_2: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=200&h=200',
  female_mid_1: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200&h=200',
  female_mid_2: 'https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&q=80&w=200&h=200'
};

export const PATIENT_CASES: PatientCase[] = [
  // Course 1 Related Patients (Cardiovascular)
  {
    id: 'p1_1', name: '张福禄', age: 72, gender: '男', specialty: Specialty.CARDIOVASCULAR,
    avatarUrl: '/src/assets/images/regenerated_image_1778182283709.jpg', associatedCourseId: 'c1',
    chiefComplaint: '头晕10年，加重3天伴心悸。', medicalHistory: '高血压10年，规律服药但血压波动大。', difficulty: '基础'
  },
  {
    id: 'p1_2', name: '李翠花', age: 65, gender: '女', specialty: Specialty.CARDIOVASCULAR,
    avatarUrl: '/src/assets/images/regenerated_image_1778182283078.jpg', associatedCourseId: 'c1',
    chiefComplaint: '活动后气短半个月。', medicalHistory: '高血压控制不佳，伴有心肌肥厚表现。', difficulty: '中级'
  },
  {
    id: 'p1_3', name: '王大壮', age: 58, gender: '男', specialty: Specialty.CARDIOVASCULAR,
    avatarUrl: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&q=80&w=200&h=200', associatedCourseId: 'c1',
    chiefComplaint: '间断胸痛2周，多于劳累后发生。', medicalHistory: '高血压5年，吸烟。', difficulty: '高级'
  },
  {
    id: 'p1_4', name: '刘桂英', age: 48, gender: '女', specialty: Specialty.CARDIOVASCULAR,
    avatarUrl: 'https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&q=80&w=200&h=200', associatedCourseId: 'c1',
    chiefComplaint: '体检发现血压升高1周。', medicalHistory: '平素体健，近期加班压力大。', difficulty: '基础'
  },
  {
    id: 'p1_5', name: '陈建国', age: 61, gender: '男', specialty: Specialty.CARDIOVASCULAR,
    avatarUrl: '/src/assets/images/regenerated_image_1778182285458.jpg', associatedCourseId: 'c1',
    chiefComplaint: '晨起头痛、颈项僵硬。', medicalHistory: '无高血压病史，此次首发。', difficulty: '中级'
  },

  // Course 2 Related Patients (Endocrine)
  {
    id: 'p2_1', name: '吴铁柱', age: 55, gender: '男', specialty: Specialty.ENDOCRINE,
    avatarUrl: '/src/assets/images/regenerated_image_1778182287704.jpg', associatedCourseId: 'c2',
    chiefComplaint: '口渴、多食、消瘦3个月。', medicalHistory: '直系亲属有糖尿病。', difficulty: '基础'
  },
  {
    id: 'p2_2', name: '赵素琴', age: 63, gender: '女', specialty: Specialty.ENDOCRINE,
    avatarUrl: '/src/assets/images/regenerated_image_1778182284991.jpg', associatedCourseId: 'c2',
    chiefComplaint: '视物模糊1个月。', medicalHistory: '2型糖尿病史8年。', difficulty: '中级'
  },
  {
    id: 'p2_3', name: '钱海林', age: 51, gender: '男', specialty: Specialty.ENDOCRINE,
    avatarUrl: '/src/assets/images/regenerated_image_1778182289135.png', associatedCourseId: 'c2',
    chiefComplaint: '足趾末端麻木感2周。', medicalHistory: '糖尿病且近期血糖控制较差。', difficulty: '高级'
  },
  {
    id: 'p2_4', name: '周秀兰', age: 44, gender: '女', specialty: Specialty.ENDOCRINE,
    avatarUrl: '/src/assets/images/regenerated_image_1778182287227.jpg', associatedCourseId: 'c2',
    chiefComplaint: '体检发现空腹血糖8.2mmol/L。', medicalHistory: '体型偏胖，BMI 28。', difficulty: '基础'
  },
  {
    id: 'p2_5', name: '孙连忠', age: 69, gender: '男', specialty: Specialty.ENDOCRINE,
    avatarUrl: '/src/assets/images/regenerated_image_1778182386171.jpg', associatedCourseId: 'c2',
    chiefComplaint: '反复下肢浮肿伴多尿。', medicalHistory: '长期糖尿病并发肾功能损伤风险。', difficulty: '高级'
  },

  // Course 3 Related Patients (Oncology)
  {
    id: 'p3_1', name: '龙德柱', age: 64, gender: '男', specialty: Specialty.ONCOLOGY,
    avatarUrl: '/src/assets/images/regenerated_image_1778182288625.jpg', associatedCourseId: 'c3',
    chiefComplaint: '刺激性干咳1个月。', medicalHistory: '吸烟40年，每天2包。', difficulty: '基础'
  },
  {
    id: 'p3_2', name: '何月芳', age: 60, gender: '女', specialty: Specialty.ONCOLOGY,
    avatarUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=200&h=200', associatedCourseId: 'c3',
    chiefComplaint: '痰中带血丝3天。', medicalHistory: '慢性支气管炎病史。', difficulty: '中级'
  },
  {
    id: 'p3_3', name: '高长发', age: 68, gender: '男', specialty: Specialty.ONCOLOGY,
    avatarUrl: '/src/assets/images/regenerated_image_1778182386625.jpg', associatedCourseId: 'c3',
    chiefComplaint: '消瘦、乏力伴长期低热。', medicalHistory: '近期发现右侧胸痛。', difficulty: '高级'
  },
  {
    id: 'p3_4', name: '梁淑芬', age: 53, gender: '女', specialty: Specialty.ONCOLOGY,
    avatarUrl: '/src/assets/images/regenerated_image_1778182286274.jpg', associatedCourseId: 'c3',
    chiefComplaint: '声音嘶哑伴咳嗽2周。', medicalHistory: '长期暴露于二手烟环境。', difficulty: '高级'
  },
  {
    id: 'p3_5', name: '冯志宏', age: 71, gender: '男', specialty: Specialty.ONCOLOGY,
    avatarUrl: 'https://images.unsplash.com/photo-1533636721434-0e2d61030955?auto=format&fit=crop&q=80&w=200&h=200', associatedCourseId: 'c3',
    chiefComplaint: '反复发作的阻塞性肺炎。', medicalHistory: '抗生素治疗效果不佳。', difficulty: '中级'
  }
];
