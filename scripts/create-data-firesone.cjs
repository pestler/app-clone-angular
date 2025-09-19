const admin = require('firebase-admin');
const serviceAccount = require('./service-account-key.json');
//const serviceAccountKeyPath = path.join(__dirname, 'service-account-key.json');

// Данные из ваших файлов
const courses = require('../src/app/core/mocks/json-data/json-rsapp-answer-server/courses.json');
const schedule = require('../src/app/core/mocks/json-data/json-rsapp-answer-server/schedule.json');
const autoTests = require('../src/app/core/mocks/json-data/json-rsapp-answer-server/auto-test-detailed.json');
const scores = require('../src/app/core/mocks/json-data/json-rsapp-answer-server/score.json').content; // Берем массив 'content'
const tasks = require('../src/app/core/mocks/json-data/json-rsapp-answer-server/tasks.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // ...
});

const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true });

async function uploadData() {
  // 1. Загрузка курсов
  for (const course of courses) {
    await db.collection('courses').doc(course.alias).set(course);
  }
  console.log('Courses uploaded!');

  // 2. Загрузка расписания и деталей тестов (для одного курса "angular-2025Q3")
  const courseAlias = 'angular-2025Q3';
  for (const event of schedule) {
    await db.collection('courses').doc(courseAlias).collection('tasks').doc(String(event.id)).set(event);
  }
  for (const test of autoTests) {
      await db.collection('courses').doc(courseAlias).collection('taskDetails').doc(String(test.id)).set(test);
  }
  console.log('Schedule and Details uploaded!');

  // 3. Загрузка мастер-листа заданий
  for (const task of tasks) {
    await db.collection('tasks').doc(String(task.id)).set(task);
  }
  console.log('Master Tasks uploaded!');

  // 4. Загрузка студентов и их результатов
  for (const student of scores) {
    // !!! ВАЖНО: Здесь вам нужно будет придумать, как сгенерировать userId.
    // Для примера используем githubId. В реальном приложении это будет uid из Auth.
    const userId = student.githubId;

    // Создаем запись в /users
    await db.collection('users').doc(userId).set({
      displayName: student.name,
      githubId: student.githubId,
      roles: { student: true, admin: false, mentor: false }, // По умолчанию
      id: student.id,
      active: student.active,
      cityName: student.cityName,
      countryName: student.countryName,
      mentor: student.mentor
    });

    // Создаем запись в /courses/{alias}/students
    await db.collection('courses').doc(courseAlias).collection('students').doc(userId).set({
        displayName: student.name,
        githubId: student.githubId,
        rank: student.rank,
        totalScore: student.totalScore,
        // mentorId нужно будет связать позже
    });

    // Создаем записи в /courses/{alias}/students/{id}/taskResults
    for (const result of student.taskResults) {
        await db.collection('courses').doc(courseAlias).collection('students').doc(userId)
                .collection('taskResults').doc(String(result.courseTaskId)).set({ score: result.score });
    }
  }
  console.log('Students and Scores uploaded!');
}

uploadData();
