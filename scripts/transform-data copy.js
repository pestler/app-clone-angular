// Используем встроенный модуль для работы с файловой системой
import { readFileSync, writeFileSync } from 'fs';

/**
 * Преобразует одного пользователя в новую, более плоскую структуру.
 * @param {string} userId - ID пользователя (ключ объекта).
 * @param {object} userData - Данные пользователя.
 * @returns {object} - Трансформированный объект пользователя.
 */
function transformUser(userId, userData) {
  // Безопасно получаем данные из вложенных объектов, предоставляя значения по умолчанию
  const generalInfo = userData.generalInfo || {};
  const contacts = userData.contacts || {};
  const discord = userData.discord || {};

  const transformed = {
    displayName: userData.displayName || '',
    github: userData.githubId || userId,
    id: userData.id || null,
    active: userData.active || false,
    roles: userData.roles || {},
    about: generalInfo.aboutMyself || '',
    languages: generalInfo.languages || [],
    generalInfo: {
      englishLevel: generalInfo.englishLevel || '',
      location: {
        countryName: userData.countryName || '',
        cityName: userData.cityName || '',
      },
    },
    contacts: {
      phone: contacts.phone ?? '',
      email: contacts.email ?? '',
      epamEmail: contacts.epamEmail ?? '',
      telegram: contacts.telegram ?? '',
      notes: contacts.notes ?? '',
    },
    discord: {
      username: discord.username || '',
      id: discord.id || '',
    },
    publicFeedback: userData.publicFeedback || [],
  };

  return transformed;
}

/**
 * Преобразует курсы, разделяя их на метаданные и подколлекции.
 * @param {object} coursesData - Исходный объект курсов.
 * @param {object} allUsersData - Объект всех пользователей для денормализации.
 * @returns {object} - Трансформированный объект курсов.
 */
function transformCourses(coursesData, allUsersData) {
  const transformedCourses = {};

  for (const [courseId, courseInfo] of Object.entries(coursesData)) {
    // 1. Копируем данные и извлекаем вложенные объекты
    const metadata = { ...courseInfo };
    const studentsData = metadata.students;
    const tasksData = metadata.tasks;
    const taskDetailsData = metadata.taskDetails;

    // Удаляем большие объекты из метаданных
    delete metadata.students;
    delete metadata.tasks;
    delete metadata.taskDetails;

    // 2. Формируем подколлекцию заданий
    const tasksCollection = {};
    if (tasksData) {
      for (const [taskId, taskSummary] of Object.entries(tasksData)) {
        // Объединяем данные из tasks и taskDetails
        tasksCollection[taskId] = {
          ...taskSummary,
          ...(taskDetailsData ? taskDetailsData[taskId] : {}),
        };
      }
    }

    // 3. Формируем подколлекцию студентов
    const studentsCollection = {};
    if (studentsData) {
      for (const [studentId, studentDetails] of Object.entries(studentsData)) {
        const studentInfo = { ...studentDetails };
        // Денормализация: добавляем displayName для удобства
        if (allUsersData[studentId]) {
          studentInfo.displayName = allUsersData[studentId].displayName || studentId;
        }
        studentsCollection[studentId] = studentInfo;
      }
    }

    // Собираем итоговую структуру для курса
    transformedCourses[courseId] = {
      metadata,
      tasks: tasksCollection,
      students: studentsCollection,
    };
  }
  return transformedCourses;
}

/**
 * Основная функция для запуска скрипта.
 */
function main() {
  const INPUT_FILENAME = 'merged-data.json';
  const OUTPUT_FILENAME = 'firestore-ready-data.json';

  console.log(`Начинаю чтение файла '${INPUT_FILENAME}'...`);

  let data;
  try {
    const fileContent = readFileSync(INPUT_FILENAME, 'utf-8');
    data = JSON.parse(fileContent);
  } catch (error) {
    console.error(`Ошибка при чтении или парсинге файла '${INPUT_FILENAME}':`, error.message);
    return;
  }

  console.log('Файл успешно прочитан. Начинаю трансформацию данных...');

  // Трансформация пользователей
  const originalUsers = data.users || {};
  const transformedUsers = {};
  for (const [userId, userData] of Object.entries(originalUsers)) {
    transformedUsers[userId] = transformUser(userId, userData);
  }
  console.log(`Трансформировано ${Object.keys(transformedUsers).length} пользователей.`);

  // Трансформация курсов
  const originalCourses = data.courses || {};
  const transformedCourses = transformCourses(originalCourses, originalUsers);
  console.log(`Трансформировано ${Object.keys(transformedCourses).length} курсов.`);

  // Сборка итогового объекта
  const finalData = {
    users: transformedUsers,
    courses: transformedCourses,
  };

  // Сохранение в новый файл с красивым форматированием (отступ в 2 пробела)
  try {
    writeFileSync(OUTPUT_FILENAME, JSON.stringify(finalData, null, 2), 'utf-8');
    console.log(`\nПреобразование успешно завершено!`);
    console.log(`Результат сохранен в файле: ${OUTPUT_FILENAME}`);
  } catch (error) {
    console.error(`Ошибка при записи файла '${OUTPUT_FILENAME}':`, error.message);
  }
}

// Запускаем основную функцию
main();
