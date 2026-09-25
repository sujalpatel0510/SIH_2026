import { PrismaClient, Role, UserStatus, Difficulty, ResourceType, GapSeverity, NotificationType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding CampusPilot AI database...');

  // Clean existing data
  await prisma.recommendation.deleteMany();
  await prisma.competencyGap.deleteMany();
  await prisma.traineeCompetency.deleteMany();
  await prisma.trainerCompetency.deleteMany();
  await prisma.assessmentAnswer.deleteMany();
  await prisma.assessmentAttempt.deleteMany();
  await prisma.question.deleteMany();
  await prisma.assessment.deleteMany();
  await prisma.learningResource.deleteMany();
  await prisma.courseEnrollment.deleteMany();
  await prisma.feedback.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.course.deleteMany();
  await prisma.competency.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.traineeProfile.deleteMany();
  await prisma.trainerProfile.deleteMany();
  await prisma.user.deleteMany();

  const salt = await bcrypt.genSalt(10);
  const defaultPasswordHash = await bcrypt.hash('password123', salt);
  const adminPasswordHash = await bcrypt.hash('admin123', salt);

  // 1. Create Admin
  const admin = await prisma.user.create({
    data: {
      name: 'Dr. Alok Nath (Super Admin)',
      email: 'admin@campuspilot.ai',
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
      status: UserStatus.APPROVED,
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250',
    },
  });

  // 2. Create Trainers
  const trainer1 = await prisma.user.create({
    data: {
      name: 'Dr. Rajesh Verma',
      email: 'rajesh.verma@campuspilot.ai',
      passwordHash: defaultPasswordHash,
      role: Role.TRAINER,
      status: UserStatus.APPROVED,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      trainerProfile: {
        create: {
          qualifications: 'Ph.D. in Artificial Intelligence, IIT Bombay',
          experience: '8+ Years Research & Industry Consulting',
          expertise: 'Machine Learning, Deep Learning, Generative AI, PyTorch',
          subjects: 'Machine Learning, Deep Learning, MLOps, Data Science',
          certifications: 'TensorFlow Certified Professional, AWS ML Specialty',
          bio: 'Former ISRO Research Fellow and AI Systems Architect with 8+ years guiding corporate capacity building in AI/ML.',
          rating: 4.95,
          totalTrainees: 1420,
        },
      },
    },
    include: { trainerProfile: true },
  });

  const trainer2 = await prisma.user.create({
    data: {
      name: 'Prof. Sunita Nair',
      email: 'sunita.nair@campuspilot.ai',
      passwordHash: defaultPasswordHash,
      role: Role.TRAINER,
      status: UserStatus.APPROVED,
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
      trainerProfile: {
        create: {
          qualifications: 'M.Tech Computer Science & Distributed Systems',
          experience: '6 Years Cloud Solution Architect',
          expertise: 'Cloud Computing, Microservices, Kubernetes, High-Performance Web',
          subjects: 'Cloud Architecture, Full Stack Engineering, DevOps',
          certifications: 'AWS Solutions Architect Professional, Google Cloud Architect',
          bio: 'Specialized in production microservice architectures, enterprise cloud migrations, and distributed systems training.',
          rating: 4.88,
          totalTrainees: 980,
        },
      },
    },
    include: { trainerProfile: true },
  });

  // 3. Create Trainees
  const trainee1 = await prisma.user.create({
    data: {
      name: 'Priya Sharma',
      email: 'priya.sharma@campuspilot.ai',
      passwordHash: defaultPasswordHash,
      role: Role.TRAINEE,
      status: UserStatus.APPROVED,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
      traineeProfile: {
        create: {
          qualifications: 'B.Tech in Computer Engineering (2024)',
          experience: '1.5 Years as Associate Software Engineer',
          interests: 'Machine Learning, Autonomous Agents, Cloud Native Applications',
          skills: 'Python, JavaScript, SQL, React, Git',
          careerGoal: 'Become a Senior AI/ML Platform Engineer',
          department: 'Information Technology',
          phone: '+91 98765 43210',
        },
      },
    },
  });

  const trainee2 = await prisma.user.create({
    data: {
      name: 'Rohan Kulkarni',
      email: 'rohan.k@campuspilot.ai',
      passwordHash: defaultPasswordHash,
      role: Role.TRAINEE,
      status: UserStatus.APPROVED,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
      traineeProfile: {
        create: {
          qualifications: 'B.Sc Statistics & Data Analytics',
          experience: '1 Year Data Analyst',
          interests: 'Predictive Modeling, Time-Series Analysis, Big Data',
          skills: 'Python, R, PowerBI, SQL',
          careerGoal: 'Data Scientist specializing in ML Ops',
          department: 'Data Analytics Unit',
          phone: '+91 98123 45678',
        },
      },
    },
  });

  // Pending user for Admin demo approval flow!
  await prisma.user.create({
    data: {
      name: 'Aarav Mehta',
      email: 'aarav.mehta@campuspilot.ai',
      passwordHash: defaultPasswordHash,
      role: Role.TRAINEE,
      status: UserStatus.PENDING,
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
      traineeProfile: {
        create: {
          qualifications: 'B.Tech Electrical & Electronics',
          experience: 'Fresher Graduate (2025)',
          interests: 'Embedded Systems, IoT & AI Integration',
          skills: 'C++, Python basics, MATLAB',
          careerGoal: 'Edge AI Firmware Engineer',
          department: 'Electronics Research',
          phone: '+91 99988 77766',
        },
      },
    },
  });

  // 4. Competencies (1 to 5 scale: 1=Novice, 2=Beginner, 3=Intermediate, 4=Advanced, 5=Expert)
  const cML = await prisma.competency.create({
    data: {
      name: 'Machine Learning & Predictive Modeling',
      code: 'COMP-ML-01',
      category: 'Artificial Intelligence',
      description: 'Understanding supervised/unsupervised algorithms, evaluation metrics, cross-validation, and feature engineering.',
      targetLevel: 4,
    },
  });

  const cDL = await prisma.competency.create({
    data: {
      name: 'Deep Learning & Neural Architectures',
      code: 'COMP-DL-02',
      category: 'Artificial Intelligence',
      description: 'Convolutional neural networks, transformer models, backpropagation, and PyTorch optimization.',
      targetLevel: 4,
    },
  });

  const cPython = await prisma.competency.create({
    data: {
      name: 'Python Systems & High Performance Code',
      code: 'COMP-PY-03',
      category: 'Software Engineering',
      description: 'Object-oriented patterns, asynchronous programming, NumPy vectorization, and clean architectural design.',
      targetLevel: 4,
    },
  });

  const cCloud = await prisma.competency.create({
    data: {
      name: 'Cloud Native Microservices & Docker',
      code: 'COMP-CL-04',
      category: 'Cloud Infrastructure',
      description: 'Containerization, Kubernetes orchestration, RESTful API design, and CI/CD pipelines.',
      targetLevel: 3,
    },
  });

  const cSQL = await prisma.competency.create({
    data: {
      name: 'Relational Database Engineering & PostgreSQL',
      code: 'COMP-DB-05',
      category: 'Data Management',
      description: 'Advanced indexing, query optimization, transactional guarantees (ACID), and relational modeling.',
      targetLevel: 4,
    },
  });

  // 5. Trainee Competency Mapping (Priya Sharma)
  // Python is Level 4 (Goal 4 -> Gap 0)
  await prisma.traineeCompetency.create({
    data: {
      traineeId: trainee1.id,
      competencyId: cPython.id,
      currentLevel: 4,
      targetLevel: 4,
      assessmentScore: 88.5,
      gap: 0,
      verified: true,
    },
  });

  // SQL is Level 4 (Goal 4 -> Gap 0)
  await prisma.traineeCompetency.create({
    data: {
      traineeId: trainee1.id,
      competencyId: cSQL.id,
      currentLevel: 4,
      targetLevel: 4,
      assessmentScore: 92.0,
      gap: 0,
      verified: true,
    },
  });

  // Machine Learning is Level 2 (Goal 4 -> Gap 2 -> GAP DETECTED!)
  await prisma.traineeCompetency.create({
    data: {
      traineeId: trainee1.id,
      competencyId: cML.id,
      currentLevel: 2,
      targetLevel: 4,
      assessmentScore: 54.0,
      gap: 2,
      verified: false,
    },
  });

  // Deep Learning is Level 1 (Goal 4 -> Gap 3 -> HIGH GAP!)
  await prisma.traineeCompetency.create({
    data: {
      traineeId: trainee1.id,
      competencyId: cDL.id,
      currentLevel: 1,
      targetLevel: 4,
      assessmentScore: 38.0,
      gap: 3,
      verified: false,
    },
  });

  // Cloud is Level 2 (Goal 3 -> Gap 1)
  await prisma.traineeCompetency.create({
    data: {
      traineeId: trainee1.id,
      competencyId: cCloud.id,
      currentLevel: 2,
      targetLevel: 3,
      assessmentScore: 65.0,
      gap: 1,
      verified: true,
    },
  });

  // Create Competency Gaps for Priya
  await prisma.competencyGap.create({
    data: {
      traineeId: trainee1.id,
      competencyId: cML.id,
      currentLevel: 2,
      requiredLevel: 4,
      gapSeverity: GapSeverity.HIGH,
      recommendedAction: 'Enroll in "Machine Learning & Neural Systems Mastery" by Dr. Rajesh Verma and complete core module assessments.',
    },
  });

  await prisma.competencyGap.create({
    data: {
      traineeId: trainee1.id,
      competencyId: cDL.id,
      currentLevel: 1,
      requiredLevel: 4,
      gapSeverity: GapSeverity.CRITICAL,
      recommendedAction: 'Start foundation coursework in Deep Learning Neural Architectures after completing ML prerequisites.',
    },
  });

  // 6. Link Trainer Competencies
  if (trainer1.trainerProfile) {
    await prisma.trainerCompetency.create({
      data: {
        trainerProfileId: trainer1.trainerProfile.id,
        competencyId: cML.id,
        expertiseLevel: 5,
        yearsExperience: 8,
        verified: true,
      },
    });
    await prisma.trainerCompetency.create({
      data: {
        trainerProfileId: trainer1.trainerProfile.id,
        competencyId: cDL.id,
        expertiseLevel: 5,
        yearsExperience: 7,
        verified: true,
      },
    });
  }

  if (trainer2.trainerProfile) {
    await prisma.trainerCompetency.create({
      data: {
        trainerProfileId: trainer2.trainerProfile.id,
        competencyId: cCloud.id,
        expertiseLevel: 5,
        yearsExperience: 6,
        verified: true,
      },
    });
    await prisma.trainerCompetency.create({
      data: {
        trainerProfileId: trainer2.trainerProfile.id,
        competencyId: cPython.id,
        expertiseLevel: 4,
        yearsExperience: 6,
        verified: true,
      },
    });
  }

  // 7. Create Courses
  const courseML = await prisma.course.create({
    data: {
      trainerId: trainer1.id,
      title: 'Machine Learning & Neural Systems Mastery',
      description: 'Comprehensive capacity-building program covering supervised learning algorithms, gradient descent optimization, loss functions, ensemble models, and real-world predictive pipelines.',
      subject: 'Machine Learning',
      category: 'Artificial Intelligence',
      difficulty: Difficulty.INTERMEDIATE,
      durationHours: 32,
      thumbnailUrl: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=600',
      targetSkills: 'Machine Learning, Scikit-Learn, PyTorch, Predictive Modeling',
    },
  });

  const courseCloud = await prisma.course.create({
    data: {
      trainerId: trainer2.id,
      title: 'Cloud Architecture & Enterprise Microservices',
      description: 'Master container orchestration, automated deployment pipelines, API gateways, fault tolerance, and zero-downtime releases on modern cloud infrastructure.',
      subject: 'Cloud Computing',
      category: 'Cloud & Infrastructure',
      difficulty: Difficulty.INTERMEDIATE,
      durationHours: 24,
      thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600',
      targetSkills: 'Docker, Kubernetes, AWS, Microservices Architecture',
    },
  });

  const coursePython = await prisma.course.create({
    data: {
      trainerId: trainer1.id,
      title: 'Advanced Python for Production Engineering',
      description: 'Master async I/O, metaclasses, memory profiling, vectorization, and enterprise backend patterns with Python 3.11+.',
      subject: 'Software Engineering',
      category: 'Programming',
      difficulty: Difficulty.ADVANCED,
      durationHours: 20,
      thumbnailUrl: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&q=80&w=600',
      targetSkills: 'Python 3, Asynchronous Programming, High-Performance Computing',
    },
  });

  // 8. Enrollments
  await prisma.courseEnrollment.create({
    data: {
      courseId: courseML.id,
      traineeId: trainee1.id,
      progress: 45,
      status: 'ACTIVE',
    },
  });

  await prisma.courseEnrollment.create({
    data: {
      courseId: courseCloud.id,
      traineeId: trainee1.id,
      progress: 100,
      status: 'COMPLETED',
      completedAt: new Date(Date.now() - 7 * 24 * 3600 * 1000),
    },
  });

  // 9. Learning Resources for ML Course
  await prisma.learningResource.create({
    data: {
      courseId: courseML.id,
      trainerId: trainer1.id,
      title: 'Module 1: Mathematical Foundations of Machine Learning',
      description: 'Vector spaces, matrix decomposition, partial derivatives, and probability distributions explained for practitioners.',
      resourceType: ResourceType.PDF,
      fileUrl: '/materials/module1-math-foundations.pdf',
      duration: '45 Pages',
      visibility: true,
    },
  });

  await prisma.learningResource.create({
    data: {
      courseId: courseML.id,
      trainerId: trainer1.id,
      title: 'Module 2: Video Lecture — Gradient Descent & Backprop Demystified',
      description: 'Interactive step-through of loss surfaces, learning rates, momentum, and Adam optimizer convergence.',
      resourceType: ResourceType.VIDEO,
      fileUrl: 'https://www.youtube.com/watch?v=aircAruvnKk',
      duration: '52 Mins',
      visibility: true,
    },
  });

  await prisma.learningResource.create({
    data: {
      courseId: courseML.id,
      trainerId: trainer1.id,
      title: 'Module 3: Hands-on Lab Notebook & Model Evaluation Deck',
      description: 'Precision-recall trade-offs, ROC-AUC curves, confusion matrices, and cross-validation code snippets.',
      resourceType: ResourceType.PPT,
      fileUrl: '/materials/module3-model-evaluation.pptx',
      duration: '38 Slides',
      visibility: true,
    },
  });

  // 10. Assessments & Questions
  const assessmentML = await prisma.assessment.create({
    data: {
      courseId: courseML.id,
      trainerId: trainer1.id,
      title: 'Machine Learning Competency Verification — Assessment 1',
      subject: 'Machine Learning Fundamentals',
      description: 'Official capacity-building assessment measuring core understanding of regression, classification, bias-variance tradeoff, and regularizations.',
      durationMinutes: 20,
      totalMarks: 50,
      passingMarks: 30,
      deadline: new Date(Date.now() + 14 * 24 * 3600 * 1000),
      difficulty: Difficulty.INTERMEDIATE,
      status: 'PUBLISHED',
    },
  });

  await prisma.question.create({
    data: {
      assessmentId: assessmentML.id,
      questionText: 'Which regularisation technique forces non-essential feature weights strictly to zero, effectively performing automatic feature selection?',
      optionA: 'L2 Ridge Regularisation',
      optionB: 'L1 Lasso Regularisation',
      optionC: 'Dropout Layering',
      optionD: 'Batch Normalisation',
      correctOption: 'B',
      marks: 10,
      explanation: 'L1 Lasso introduces an absolute-value penalty that shrinks coefficients to exact zero, providing sparse solutions.',
      difficulty: Difficulty.INTERMEDIATE,
    },
  });

  await prisma.question.create({
    data: {
      assessmentId: assessmentML.id,
      questionText: 'When a model exhibits low training loss but significantly high validation loss, which phenomenon is primarily occurring?',
      optionA: 'High Bias (Underfitting)',
      optionB: 'Vanishing Gradient Problem',
      optionC: 'High Variance (Overfitting)',
      optionD: 'Data Leakage between splits',
      correctOption: 'C',
      marks: 10,
      explanation: 'Overfitting occurs when a model learns noise in training data and fails to generalize to unseen validation samples.',
      difficulty: Difficulty.BEGINNER,
    },
  });

  await prisma.question.create({
    data: {
      assessmentId: assessmentML.id,
      questionText: 'Which metric is best suited for evaluating a fraud detection model where fraudulent transactions constitute only 0.2% of the dataset?',
      optionA: 'Accuracy',
      optionB: 'F1-Score / PR-AUC',
      optionC: 'Mean Squared Error',
      optionD: 'Mean Absolute Percentage Error',
      correctOption: 'B',
      marks: 10,
      explanation: 'Accuracy is misleading on highly imbalanced classes; Precision-Recall AUC and F1-score evaluate true positive capture against false alarms.',
      difficulty: Difficulty.ADVANCED,
    },
  });

  await prisma.question.create({
    data: {
      assessmentId: assessmentML.id,
      questionText: 'What is the primary role of the activation function in a multilayer perceptron neural network?',
      optionA: 'Speed up stochastic matrix multiplication',
      optionB: 'Introduce non-linearity so the network can learn non-linear decision boundaries',
      optionC: 'Normalize inputs to zero mean and unit variance',
      optionD: 'Prevent memory overflow on GPU buffers',
      correctOption: 'B',
      marks: 10,
      explanation: 'Without non-linear activations, stacking multiple linear layers collapses into a single linear transformation regardless of depth.',
      difficulty: Difficulty.INTERMEDIATE,
    },
  });

  await prisma.question.create({
    data: {
      assessmentId: assessmentML.id,
      questionText: 'Which ensemble method builds decision trees sequentially, with each tree correcting the residual errors of the previous one?',
      optionA: 'Random Forest (Bagging)',
      optionB: 'Gradient Boosted Decision Trees (Boosting)',
      optionC: 'K-Means Clustering',
      optionD: 'Principal Component Analysis (PCA)',
      correctOption: 'B',
      marks: 10,
      explanation: 'Boosting algorithms like XGBoost and LightGBM train trees sequentially on the gradients of the previous loss.',
      difficulty: Difficulty.INTERMEDIATE,
    },
  });

  // 11. Certificates
  await prisma.certificate.create({
    data: {
      traineeId: trainee1.id,
      courseId: courseCloud.id,
      certificateNumber: 'CP-CERT-2026-CLOUD-8841',
      title: 'Cloud Architecture & Enterprise Microservices — Professional Certification',
      verificationCode: 'VERIFY-CP-8841-XYZ',
      pdfUrl: '/certificates/cert-cloud-8841.pdf',
    },
  });

  // 12. Feedback
  await prisma.feedback.create({
    data: {
      courseId: courseCloud.id,
      traineeId: trainee1.id,
      rating: 5,
      trainerRating: 5,
      contentRating: 5,
      comment: 'Exceptional course by Prof. Sunita Nair! The hands-on Kubernetes labs and microservice patterns helped me clear my cloud certification with confidence.',
    },
  });

  // 13. AI Recommendations
  await prisma.recommendation.create({
    data: {
      traineeId: trainee1.id,
      type: 'COURSE',
      courseId: courseML.id,
      reason: 'Directly addresses your Level-2 Machine Learning competency gap. Aligns with your career goal of becoming an AI Platform Engineer.',
      score: 96.5,
      status: 'ACTIVE',
    },
  });

  await prisma.recommendation.create({
    data: {
      traineeId: trainee1.id,
      type: 'TRAINER',
      trainerId: trainer1.id,
      reason: 'Dr. Rajesh Verma holds a 5/5 expertise in Machine Learning & Neural Networks with 8+ years of industry consulting, perfectly matching your target competency needs.',
      score: 98.2,
      status: 'ACTIVE',
    },
  });

  // 14. Announcements & Achievements
  await prisma.announcement.create({
    data: {
      title: 'National Digital Capacity Building Initiative Launched',
      content: 'CampusPilot AI has deployed the enterprise Capacity Connect infrastructure across regional training academies. Check your schedules for live mentorship sessions.',
      authorName: 'Central Training Directorate',
      priority: 'HIGH',
      targetRole: 'ALL',
    },
  });

  await prisma.announcement.create({
    data: {
      title: 'New AI Competency Assessment Benchmark Active',
      content: 'All trainees are encouraged to take the revised subject-wise assessments to update their personalized competency profiles and receive AI-tailored course pathways.',
      authorName: 'AI Learning Assessment Board',
      priority: 'NORMAL',
      targetRole: 'TRAINEE',
    },
  });

  await prisma.achievement.create({
    data: {
      title: 'Top Competency Growth Award',
      description: 'Awarded to Priya Sharma for advancing from Beginner to Advanced in Cloud Infrastructure within 6 weeks.',
      recipientName: 'Priya Sharma',
      recipientRole: 'Trainee',
      category: 'Skill Growth',
      icon: 'Trophy',
    },
  });

  await prisma.achievement.create({
    data: {
      title: 'Master Trainer Excellence Award',
      description: 'Recognizing Dr. Rajesh Verma for maintaining a 4.95 rating across 1,400+ trained candidates.',
      recipientName: 'Dr. Rajesh Verma',
      recipientRole: 'Trainer',
      category: 'Mentorship',
      icon: 'Award',
    },
  });

  // 15. Notifications
  await prisma.notification.create({
    data: {
      userId: trainee1.id,
      title: 'Competency Gap Identified',
      message: 'AI detected a gap in Machine Learning & Predictive Modeling. Recommended course: Machine Learning & Neural Systems Mastery.',
      type: NotificationType.ALERT,
      link: '/trainee/competencies',
    },
  });

  await prisma.notification.create({
    data: {
      userId: trainee1.id,
      title: 'Assessment Deadline Approaching',
      message: 'Your Machine Learning Assessment 1 is due in 14 days. Complete it to update your verified score.',
      type: NotificationType.WARNING,
      link: '/trainee/assessments',
    },
  });

  await prisma.notification.create({
    data: {
      userId: admin.id,
      title: 'Pending Trainee Approval Request',
      message: 'Aarav Mehta has submitted registration details and requires administrator verification.',
      type: NotificationType.INFO,
      link: '/admin/users',
    },
  });

  console.log('Database seeding successfully finished!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
