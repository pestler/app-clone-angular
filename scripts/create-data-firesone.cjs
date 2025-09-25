const admin = require('firebase-admin');
const serviceAccount = require('./service-account-key.json');

// Данные из ваших файлов
const coursesData = require('../src/app/core/mocks/json-data/json-rsapp-answer-server/courses.json');
const scheduleData = require('../src/app/core/mocks/json-data/json-rsapp-answer-server/schedule.json');
const autoTestsData = require('../src/app/core/mocks/json-data/json-rsapp-answer-server/auto-test-detailed.json');
const scoresData = require('../src/app/core/mocks/json-data/json-rsapp-answer-server/score.json').content;
const tasksData = require('../src/app/core/mocks/json-data/json-rsapp-answer-server/tasks.json');
const detailedProfileData = require('../src/app/core/mocks/json-data/json-rsapp-answer-server/about.json').data; // Берем сразу вложенный объект `data`

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true });

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


async function uploadData() {
  console.log('Starting data upload process...');
  const courseAlias = 'angular-2025Q3'; // Определяем алиас курса один раз

  // 1. Загрузка курсов
  for (const course of coursesData) {
    await db.collection('courses').doc(course.alias).set(course);
  }
  console.log('Step 1/5: Courses uploaded!');

  // 2. Загрузка расписания и деталей тестов
  for (const event of scheduleData) {
    await db.collection('courses').doc(courseAlias).collection('tasks').doc(String(event.id)).set(event);
  }
  for (const test of autoTestsData) {
      await db.collection('courses').doc(courseAlias).collection('taskDetails').doc(String(test.id)).set(test);
  }
  console.log('Step 2/5: Schedule and Task Details uploaded!');

  // 3. Загрузка мастер-листа заданий
  for (const task of tasksData) {
    await db.collection('tasks').doc(String(task.id)).set(task);
  }
  console.log('Step 3/5: Master Task list uploaded!');

  // 4. Загрузка студентов, их результатов и создание "пустых" полных профилей
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

    // Добавляем права админа и ментора для указанных пользователей
    const privilegedUsers = ['pestler', 'aliakseitokarev', 'kavume'];
    if (privilegedUsers.includes(student.githubId)) {
      baseUserPayload.roles.admin = true;
      baseUserPayload.roles.mentor = true;
    }

    // Создаем "пустой" полный профиль
    const emptyProfile = createEmptyProfile();
    // Заполняем его базовой информацией, которая у нас есть
    emptyProfile.generalInfo.name = student.name;
    emptyProfile.generalInfo.githubId = student.githubId;

    // С помощью `merge: true` мы создаем документ со всеми полями,
    // но если документ уже существует, мы просто добавляем недостающие.
    await db.collection('users').doc(userId).set(baseUserPayload, { merge: true });
    await db.collection('users').doc(userId).set(emptyProfile, { merge: true });

    // --- Создаем запись в /courses/{alias}/students ---
    const studentDocPayload = {
      displayName: student.name,
      githubId: student.githubId,
      rank: student.rank,
      totalScore: student.totalScore,
      mentor: student.mentor, // mentor может быть undefined, что нормально
    };
    await db.collection('courses').doc(courseAlias).collection('students').doc(userId).set(studentDocPayload);

    // --- Создаем записи в /courses/{alias}/students/{id}/taskResults ---
    if (student.taskResults && student.taskResults.length > 0) {
      for (const result of student.taskResults) {
        await db.collection('courses').doc(courseAlias).collection('students').doc(userId)
                .collection('taskResults').doc(String(result.courseTaskId)).set({ score: result.score });
      }
    }
  }
  console.log('Step 4/5: All students processed with empty profiles!');

  // 5. Теперь ОБНОВЛЯЕМ профиль для `pestler` (или любого другого) детальными данными
  const detailedUserId = detailedProfileData.generalInfo.githubId;
  await db.collection('users').doc(detailedUserId).set(detailedProfileData, { merge: true });
  console.log(`Step 5/5: Detailed profile for "${detailedUserId}" merged!`);

  console.log('Data upload complete!');
}

uploadData().catch(console.error);
