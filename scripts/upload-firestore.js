/**
 * Скрипт для загрузки данных из локальных JSON-файлов в коллекции Firestore.
 *
 * ПОРЯДОК ИСПОЛЬЗОВАНИЯ:
 * 1. Убедитесь, что установлена зависимость: npm install firebase-admin
 * 2. Скачайте файл ключа сервис-аккаунта (service account key) из вашей консоли Firebase.
 * 3. Поместите скачанный файл в папку 'scripts' и переименуйте его в 'service-account-key.json'.
 *    ВАЖНО: Добавьте 'scripts/service-account-key.json' в ваш файл .gitignore!
 * 4. Настройте массив `filesToUpload` ниже.
 * 5. Запустите скрипт из корневой папки проекта: node scripts/upload-firestore.js
 */

import admin from 'firebase-admin';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// ES-модульный аналог __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- НАСТРОЙКА ---

// 1. Укажите путь к вашему файлу ключа сервис-аккаунта.
const serviceAccountKeyPath = path.join(__dirname, 'service-account-key.json');

// 2. Определите, какие файлы в какие коллекции загружать.
const filesToUpload = [
  {
    filePath: path.resolve(
      __dirname,
      '../src/app/core/mocks/json-data/json-rsapp-answer-server/courses.json',
    ),
    collectionName: 'courses',
  },
  {
    filePath: path.resolve(
      __dirname,
      '../src/app/core/mocks/json-data/json-rsapp-answer-server/tasks.json',
    ),
    collectionName: 'tasks',
  },
  {
    filePath: path.resolve(
      __dirname,
      '../src/app/core/mocks/json-data/json-rsapp-answer-server/interviews.json',
    ),
    collectionName: 'interviews',
  },
  {
    filePath: path.resolve(
      __dirname,
      '../src/app/core/mocks/json-data/json-rsapp-answer-server/schedule.json',
    ),
    collectionName: 'schedule',
  },
  {
    filePath: path.resolve(
      __dirname,
      '../src/app/core/mocks/json-data/json-rsapp-answer-server/score.json',
    ),
    collectionName: 'scores',
  },
  {
    filePath: path.resolve(
      __dirname,
      '../src/app/core/mocks/json-data/json-rsapp-answer-server/session.json',
    ),
    collectionName: 'sessions',
  },
  {
    filePath: path.resolve(
      __dirname,
      '../src/app/core/mocks/json-data/json-rsapp-answer-server/summary.json',
    ),
    collectionName: 'summaries',
  },
  {
    filePath: path.resolve(
      __dirname,
      '../src/app/core/mocks/json-data/json-rsapp-answer-server/course-statistics.json',
    ),
    collectionName: 'courseStatistics',
  },
  {
    filePath: path.resolve(
      __dirname,
      '../src/app/core/mocks/json-data/json-rsapp-answer-server/team-distribution.json',
    ),
    collectionName: 'teamDistribution',
  },
  {
    filePath: path.resolve(
      __dirname,
      '../src/app/core/mocks/json-data/json-rsapp-answer-server/auto-test-detailed.json',
    ),
    collectionName: 'autoTestDetailed',
  },
  {
    filePath: path.resolve(
      __dirname,
      '../src/app/core/mocks/json-data/json-rsapp-answer-server/auto-test-verification.json',
    ),
    collectionName: 'autoTestVerification',
  },
  {
    filePath: path.resolve(
      __dirname,
      '../src/app/core/mocks/json-data/json-rsapp-answer-server/task-status-review.json',
    ),
    collectionName: 'taskStatusReview',
  },
  {
    filePath: path.resolve(
      __dirname,
      '../src/app/core/mocks/json-data/json-rsapp-answer-server/task-status-submit.json',
    ),
    collectionName: 'taskStatusSubmit',
  },
  {
    filePath: path.resolve(
      __dirname,
      '../src/app/core/mocks/json-data/json-rsapp-answer-server/team-distribution-session.json',
    ),
    collectionName: 'teamDistributionSession',
  },
];

// --- КОНЕЦ НАСТРОЙКИ ---

async function uploadData() {
  try {
    // Инициализация Firebase Admin SDK
    const serviceAccount = JSON.parse(await fs.readFile(serviceAccountKeyPath, 'utf8'));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    const db = admin.firestore();
    console.log('Firebase Admin SDK инициализирован успешно.');

    for (const { filePath, collectionName } of filesToUpload) {
      console.log(`\nНачинаю обработку файла: ${path.basename(filePath)}...`);

      // Чтение и парсинг JSON-файла
      const fileContent = await fs.readFile(filePath, 'utf8');
      let data = JSON.parse(fileContent);

      // Интеллектуально находим массив данных внутри JSON
      if (data.data && Array.isArray(data.data)) {
        data = data.data;
      } else if (data.content && Array.isArray(data.content)) {
        data = data.content;
      }

      const dataToUpload = Array.isArray(data) ? data : [data];

      if (dataToUpload.length === 0) {
        console.log(`     - Файл пуст или содержит неверные данные. Пропускаю.`);
        continue;
      }

      const collectionRef = db.collection(collectionName);
      let batch = db.batch();
      let writeCounter = 0;

      console.log(`Начинаю загрузку в коллекцию '${collectionName}'...`);

      for (let i = 0; i < dataToUpload.length; i++) {
        const doc = dataToUpload[i];
        if (doc.id === undefined) {
          console.warn(
            `     - ПРЕДУПРЕЖДЕНИЕ: Пропускаю запись ${i}, так как у нее отсутствует поле 'id'.`,
          );
          continue;
        }

        const docRef = collectionRef.doc(String(doc.id));
        batch.set(docRef, doc);
        writeCounter++;

        if (writeCounter % 500 === 0 || i === dataToUpload.length - 1) {
          await batch.commit();
          console.log(`     - Загружено ${writeCounter} из ${dataToUpload.length} документов...`);
          batch = db.batch();
        }
      }

      console.log(
        `\nУспешно загружено ${writeCounter} документов в коллекцию '${collectionName}'.`,
      );
    }

    console.log('\n\nВсе операции завершены! ✨');
  } catch (error) {
    console.error('\n--- ПРОИЗОШЛА КРИТИЧЕСКАЯ ОШИБКА ---');
    if (error.code === 'ENOENT') {
      // 'MODULE_NOT_FOUND' is for require, 'ENOENT' is for file read
      console.error(
        `Ошибка: Не найден файл ключа '${path.basename(serviceAccountKeyPath)}'. Убедитесь, что он находится в папке 'scripts'.`,
      );
    } else {
      console.error(error);
    }
    process.exit(1);
  }
}

uploadData();
