const { PrismaClient, GapSeverity } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const sujal = await prisma.user.findUnique({ where: { email: 'sujal@example.com' } });
  if (!sujal) {
    console.error('Sujal user not found!');
    return;
  }
  console.log('Found Sujal ID:', sujal.id);

  // Get competencies
  const comps = await prisma.competency.findMany();
  const cML = comps.find(c => c.code === 'COMP-ML-01');
  const cDL = comps.find(c => c.code === 'COMP-DL-02');
  const cPY = comps.find(c => c.code === 'COMP-PY-03');
  const cCL = comps.find(c => c.code === 'COMP-CL-04');
  const cDB = comps.find(c => c.code === 'COMP-DB-05');

  // Clean existing
  await prisma.competencyGap.deleteMany({ where: { traineeId: sujal.id } });
  await prisma.traineeCompetency.deleteMany({ where: { traineeId: sujal.id } });
  await prisma.recommendation.deleteMany({ where: { traineeId: sujal.id } });

  // 1. Python (Level 4, Target 4, Gap 0)
  await prisma.traineeCompetency.create({
    data: {
      traineeId: sujal.id,
      competencyId: cPY.id,
      currentLevel: 4,
      targetLevel: 4,
      assessmentScore: 91.5,
      gap: 0,
      verified: true
    }
  });

  // 2. Database & PostgreSQL (Level 3, Target 4, Gap 1)
  await prisma.traineeCompetency.create({
    data: {
      traineeId: sujal.id,
      competencyId: cDB.id,
      currentLevel: 3,
      targetLevel: 4,
      assessmentScore: 78.0,
      gap: 1,
      verified: true
    }
  });

  // 3. Cloud & Docker (Level 2, Target 3, Gap 1)
  await prisma.traineeCompetency.create({
    data: {
      traineeId: sujal.id,
      competencyId: cCL.id,
      currentLevel: 2,
      targetLevel: 3,
      assessmentScore: 64.0,
      gap: 1,
      verified: true
    }
  });

  // 4. Machine Learning (Level 2, Target 4, Gap 2 -> High Gap)
  await prisma.traineeCompetency.create({
    data: {
      traineeId: sujal.id,
      competencyId: cML.id,
      currentLevel: 2,
      targetLevel: 4,
      assessmentScore: 56.0,
      gap: 2,
      verified: false
    }
  });

  // 5. Deep Learning (Level 1, Target 4, Gap 3 -> Critical Gap)
  await prisma.traineeCompetency.create({
    data: {
      traineeId: sujal.id,
      competencyId: cDL.id,
      currentLevel: 1,
      targetLevel: 4,
      assessmentScore: 40.0,
      gap: 3,
      verified: false
    }
  });

  // Gaps
  await prisma.competencyGap.create({
    data: {
      traineeId: sujal.id,
      competencyId: cDL.id,
      currentLevel: 1,
      requiredLevel: 4,
      gapSeverity: GapSeverity.CRITICAL,
      recommendedAction: 'Critical gap in Deep Learning Neural Architectures. Immediate foundational course and PyTorch mentoring recommended.'
    }
  });

  await prisma.competencyGap.create({
    data: {
      traineeId: sujal.id,
      competencyId: cML.id,
      currentLevel: 2,
      requiredLevel: 4,
      gapSeverity: GapSeverity.HIGH,
      recommendedAction: 'High competency gap detected. Complete Machine Learning & Neural Systems Mastery by Dr. Rajesh Verma.'
    }
  });

  await prisma.competencyGap.create({
    data: {
      traineeId: sujal.id,
      competencyId: cCL.id,
      currentLevel: 2,
      requiredLevel: 3,
      gapSeverity: GapSeverity.MEDIUM,
      recommendedAction: 'Moderate gap in Cloud Native Microservices. Practice containerized deployments with Prof. Sunit Nair.'
    }
  });

  await prisma.competencyGap.create({
    data: {
      traineeId: sujal.id,
      competencyId: cDB.id,
      currentLevel: 3,
      requiredLevel: 4,
      gapSeverity: GapSeverity.MEDIUM,
      recommendedAction: 'Refine relational indexing and transactional performance optimization.'
    }
  });

  // Recommendations
  const courses = await prisma.course.findMany();
  const cMLCourse = courses.find(c => c.title.includes('Machine Learning'));
  const cCloudCourse = courses.find(c => c.title.includes('Cloud'));
  const trainers = await prisma.user.findMany({ where: { role: 'TRAINER' } });
  const tRajesh = trainers.find(t => t.name.includes('Rajesh'));
  const tSunita = trainers.find(t => t.name.includes('Sunita') || t.name.includes('Sunit'));

  if (cMLCourse) {
    await prisma.recommendation.create({
      data: {
        traineeId: sujal.id,
        type: 'COURSE',
        courseId: cMLCourse.id,
        reason: 'Directly addresses your Level-2 Machine Learning competency gap. Tailored for your AI/ML Engineer path.',
        score: 98.4,
        status: 'ACTIVE'
      }
    });
  }

  if (cCloudCourse) {
    await prisma.recommendation.create({
      data: {
        traineeId: sujal.id,
        type: 'COURSE',
        courseId: cCloudCourse.id,
        reason: 'Recommended to bridge your Cloud Native Microservices deficit with practical Docker/K8s labs.',
        score: 94.6,
        status: 'ACTIVE'
      }
    });
  }

  if (tRajesh) {
    await prisma.recommendation.create({
      data: {
        traineeId: sujal.id,
        type: 'TRAINER',
        trainerId: tRajesh.id,
        reason: 'Dr. Rajesh Verma holds 5/5 expertise in Machine Learning & PyTorch, matching your primary skill gaps.',
        score: 99.1,
        status: 'ACTIVE'
      }
    });
  }

  if (tSunita) {
    await prisma.recommendation.create({
      data: {
        traineeId: sujal.id,
        type: 'TRAINER',
        trainerId: tSunita.id,
        reason: 'Prof. Sunit Nair provides certified training in enterprise microservices and distributed cloud systems.',
        score: 95.8,
        status: 'ACTIVE'
      }
    });
  }

  // Course enrollments
  await prisma.courseEnrollment.deleteMany({ where: { traineeId: sujal.id } });
  if (cMLCourse) {
    await prisma.courseEnrollment.create({
      data: {
        traineeId: sujal.id,
        courseId: cMLCourse.id,
        progress: 35,
        status: 'ACTIVE'
      }
    });
  }
  const cPyCourse = courses.find(c => c.title.includes('Python'));
  if (cPyCourse) {
    await prisma.courseEnrollment.create({
      data: {
        traineeId: sujal.id,
        courseId: cPyCourse.id,
        progress: 100,
        status: 'COMPLETED',
        completedAt: new Date()
      }
    });

    // Certificate
    await prisma.certificate.deleteMany({ where: { traineeId: sujal.id } });
    await prisma.certificate.create({
      data: {
        traineeId: sujal.id,
        courseId: cPyCourse.id,
        certificateNumber: 'CP-CERT-2026-PY-9921',
        title: 'Advanced Python for Production Engineering — Certified Specialist',
        verificationCode: 'VERIFY-SUJAL-9921',
        pdfUrl: '/certificates/cert-python.pdf'
      }
    });
  }

  console.log('Seeding completed successfully for Sujal Patel!');
}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
