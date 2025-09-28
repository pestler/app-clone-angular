/* eslint-env node */

import { readFileSync, writeFileSync } from 'fs';

/**
 * Преобразует одного пользователя в новую, более плоскую структуру.
 * @param {string} userId - ID пользователя (ключ объекта).
 * @param {object} userData - Исходные данные пользователя.
 * @returns {object} - Трансформированный объект пользователя.
 */
function transformUser(userId, userData) {
  // Безопасно получаем данные из вложенных объектов, чтобы избежать ошибок
  const generalInfo = userData.generalInfo || {};
  const contacts = userData.contacts || {};
  const discord = userData.discord || {};

  // Собираем новый объект пользователя по заданным правилам
  const transformed = {
    displayName: userData.displayName || '',
    github: userData.githubId || userId, // Переименовываем githubId -> github
    id: userData.id || null,
    active: userData.active || false,
    roles: userData.roles || {},
    about: generalInfo.aboutMyself || '', // Перемещаем aboutMyself наверх
    languages: generalInfo.languages || [], // Перемещаем languages наверх
    generalInfo: {
      englishLevel: generalInfo.englishLevel || '',
      location: {
        // Создаем вложенный объект location
        countryName: userData.countryName || '', // Перемещаем countryName
        cityName: userData.cityName || '', // Перемещаем cityName
      },
    },
    contacts: {
      // Нормализуем контакты
      phone: contacts.phone ?? '',
      email: contacts.email ?? '',
      epamEmail: contacts.epamEmail ?? '', // Заменяем null на ""
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
 * Основная функция для запуска скрипта.
 */
function main() {
  const INPUT_FILENAME = 'merged-data.json';
  const OUTPUT_FILENAME = 'updated-users-only.json';

  console.log(`Чтение файла '${INPUT_FILENAME}'...`);

  let data;
  try {
    const fileContent = readFileSync(INPUT_FILENAME, 'utf-8');
    data = JSON.parse(fileContent);
  } catch (error) {
    console.error(
      `Ошибка! Не удалось прочитать или обработать файл '${INPUT_FILENAME}'.`,
      error.message,
    );
    return;
  }

  console.log('Файл успешно прочитан. Начинаю трансформацию пользователей...');

  // 1. Получаем оригинальные данные
  const originalUsers = data.users || {};
  const originalCourses = data.courses || {}; // Этот объект останется без изменений

  // 2. Трансформируем только пользователей
  const transformedUsers = {};
  for (const [userId, userData] of Object.entries(originalUsers)) {
    transformedUsers[userId] = transformUser(userId, userData);
  }
  console.log(`Обработано ${Object.keys(transformedUsers).length} пользователей.`);

  // 3. Собираем итоговый файл: нетронутые курсы + обновленные пользователи
  const finalData = {
    courses: originalCourses, // Используем оригинальные данные курсов
    users: transformedUsers,
  };

  // 4. Сохраняем результат в новый файл
  try {
    // JSON.stringify с параметрами null, 2 форматирует JSON для удобного чтения
    writeFileSync(OUTPUT_FILENAME, JSON.stringify(finalData, null, 2), 'utf-8');
    console.log(`\nГотово! Результат сохранен в файле: ${OUTPUT_FILENAME}`);
  } catch (error) {
    console.error(`Ошибка при записи файла '${OUTPUT_FILENAME}'.`, error.message);
  }
}

// Запускаем скрипт
main();
