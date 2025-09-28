const fs = require('fs');
const path = require('path');

// Данные из ваших файлов
const coursesData = require('../src/app/core/mocks/json-data/json-rsapp-answer-server/courses.json');
const scheduleData = require('../src/app/core/mocks/json-data/json-rsapp-answer-server/schedule.json');
const autoTestsData = require('../src/app/core/mocks/json-data/json-rsapp-answer-server/auto-test-detailed.json');
const scoresData = require('../src/app/core/mocks/json-data/json-rsapp-answer-server/score.json').content;
const detailedProfileData = require('../src/app/core/mocks/json-data/json-rsapp-answer-server/about.json').data;

// Функция для создания "пустого" полного профиля
function createEmptyProfile() {
  return {
    generalInfo: {
      githubId: '',
      location: { countryName: '', cityName: '' },
      aboutMyself: '',
      englishLevel: '',
      name: '',
      languages: [],
    },
    contacts: {
      phone: '',
      email: '',
      epamEmail: null,
      skype: '',
      telegram: '',
      notes: null,
    },
    discord: {
      username: '',
      id: '',
    },
    publicFeedback: [],
  };
}

function generateData() {
  console.log('Starting data generation process...');
  const db = {
    courses: {},
    users: {},
  };
  const courseAlias = 'angular-2025Q3';

  // 1. Загрузка курсов
  for (const course of coursesData) {
    db.courses[course.alias] = course;
  }
  console.log('Step 1/4: Courses processed!');

  // 2. Загрузка расписания и деталей тестов
  const tasksById = scheduleData.reduce((acc, task) => {
    if (!acc[task.id]) {
      acc[task.id] = [];
    }
    acc[task.id].push(task);
    return acc;
  }, {});

  const mergedTasks = Object.values(tasksById).map(tasks => {
    if (tasks.length === 1) {
      return tasks[0];
    }

    const baseTask = { ...tasks[0] };
    delete baseTask.startDate;
    delete baseTask.endDate;
    delete baseTask.status;
    delete baseTask.tag;

    baseTask.phases = tasks.map(task => ({
      phase: task.tag.replace('cross-check-', ''),
      startDate: task.startDate,
      endDate: task.endDate,
      status: task.status,
      tag: task.tag,
    }));

    baseTask.tags = tasks.map(task => task.tag);

    return baseTask;
  });

  if (!db.courses[courseAlias].tasks) {
    db.courses[courseAlias].tasks = {};
  }
  for (const task of mergedTasks) {
    db.courses[courseAlias].tasks[String(task.id)] = task;
  }

  if (!db.courses[courseAlias].taskDetails) {
    db.courses[courseAlias].taskDetails = {};
  }
  for (const test of autoTestsData) {
    db.courses[courseAlias].taskDetails[String(test.id)] = test;
  }
  console.log('Step 2/4: Schedule and Task Details processed!');

  // 3. Загрузка студентов, их результатов и создание "пустых" полных профилей
  for (const student of scoresData) {
    const userId = student.githubId;

    // --- Создаем базовый профиль в /users ---
    const baseUserPayload = {
      displayName: student.name,
      githubId: student.githubId,
      roles: { student: true, admin: false, mentor: false },
      id: student.id,
      active: student.active,
      cityName: student.cityName,
      countryName: student.countryName,
    };

    const privilegedUsers = ['pestler', 'aliakseitokarev', 'kavume'];
    if (privilegedUsers.includes(student.githubId)) {
      baseUserPayload.roles.admin = true;
      baseUserPayload.roles.mentor = true;
    }

    const emptyProfile = createEmptyProfile();
    emptyProfile.generalInfo.name = student.name;
    emptyProfile.generalInfo.githubId = student.githubId;

    db.users[userId] = { ...db.users[userId], ...baseUserPayload, ...emptyProfile };

    // --- Создаем запись в /courses/{alias}/students ---
    if (!db.courses[courseAlias].students) {
      db.courses[courseAlias].students = {};
    }
    const studentDocPayload = {
      displayName: student.name,
      githubId: student.githubId,
      rank: student.rank,
      totalScore: student.totalScore,
      mentor: student.mentor,
    };
    db.courses[courseAlias].students[userId] = studentDocPayload;

    // --- Создаем записи в /courses/{alias}/students/{id}/taskResults ---
    if (student.taskResults && student.taskResults.length > 0) {
      if (!db.courses[courseAlias].students[userId].taskResults) {
        db.courses[courseAlias].students[userId].taskResults = {};
      }
      for (const result of student.taskResults) {
        db.courses[courseAlias].students[userId].taskResults[String(result.courseTaskId)] = { score: result.score };
      }
    }
  }
  console.log('Step 3/4: All students processed!');

  // 4. Теперь ОБНОВЛЯЕМ профиль для `pestler` (или любого другого) детальными данными
  const detailedUserId = detailedProfileData.generalInfo.githubId;
  db.users[detailedUserId] = { ...db.users[detailedUserId], ...detailedProfileData };
  console.log(`Step 4/4: Detailed profile for "${detailedUserId}" merged!`);

  const outputPath = path.join(__dirname, '..', 'merged-data.json');
  fs.writeFileSync(outputPath, JSON.stringify(db, null, 2));

  console.log(`Merged data has been written to ${outputPath}`);
}

generateData();