import admin from 'firebase-admin';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceAccountKeyPath = path.join(__dirname, 'service-account-key.json');

const filesToUpload = [
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
      '../src/app/core/mocks/json-data/json-rsapp-answer-server/courses.json',
    ),
    collectionName: 'courses',
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
      '../src/app/core/mocks/json-data/json-rsapp-answer-server/team-distribution-session.json',
    ),
    collectionName: 'teamDistributionSession',
  },
];

async function uploadData() {
  let successCount = 0;
  let failureCount = 0;

  try {
    const serviceAccount = JSON.parse(await fs.readFile(serviceAccountKeyPath, 'utf8'));
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    const db = admin.firestore();
    console.log('Firebase Admin SDK инициализирован успешно.');

    for (const { filePath, collectionName } of filesToUpload) {
      try {
        console.log(`\nНачинаю обработку файла: ${path.basename(filePath)}...`);
        const fileContent = await fs.readFile(filePath, 'utf8');
        let data = JSON.parse(fileContent);

        const collectionRef = db.collection(collectionName);

        if (data.data && Array.isArray(data.data)) {
          data = data.data;
        } else if (data.content && Array.isArray(data.content)) {
          data = data.content;
        }

        if (Array.isArray(data)) {
          if (data.length === 0) {
            console.log('     - Файл пуст. Пропускаю.');
            failureCount++;
            continue;
          }
          let writeCounter = 0;
          let batch = db.batch();
          console.log(
            `Начинаю загрузку ${data.length} документов в коллекцию '${collectionName}'...`,
          );
          for (let i = 0; i < data.length; i++) {
            const doc = data[i];
            if (doc.id === undefined) {
              console.warn(
                `     - ПРЕДУПРЕЖДЕНИЕ: Пропускаю запись ${i}, так как у нее отсутствует поле 'id'.`,
              );
              continue;
            }
            const docRef = collectionRef.doc(String(doc.id));
            batch.set(docRef, doc);
            writeCounter++;

            if (writeCounter % 500 === 0 || i === data.length - 1) {
              await batch.commit();
              console.log(`     - Загружено ${writeCounter} из ${data.length} документов...`);
              batch = db.batch();
            }
          }
          console.log(
            `\nУспешно загружено ${writeCounter} документов в коллекцию '${collectionName}'.`,
          );
          successCount++;
        } else if (typeof data === 'object' && data !== null) {
          let docName;
          if (['sessions', 'summaries'].includes(collectionName) && data.githubId) {
            docName = data.githubId;
            console.log(
              `Файл является пользовательским объектом. Использую githubId '${docName}' как ID документа...`,
            );
          } else {
            docName = path.basename(filePath, '.json');
            console.log(
              `Файл является одиночным объектом. Загружаю как один документ с ID '${docName}'...`,
            );
          }

          const docRef = collectionRef.doc(docName);
          await docRef.set(data);
          console.log(`Документ '${docName}' успешно загружен в коллекцию '${collectionName}'.`);
          successCount++;
        } else {
          console.warn(`     - Неподдерживаемый формат JSON в файле. Пропускаю.`);
          failureCount++;
        }
      } catch (fileError) {
        console.error(
          `     - ОШИБКА при обработке файла ${path.basename(filePath)}:`,
          fileError.message,
        );
        failureCount++;
      }
    }
  } catch (error) {
    console.error('\n--- ПРОИЗОШЛА КРИТИЧЕСКАЯ ОШИБКА ---');
    if (error.code === 'ENOENT') {
      console.error(
        `Ошибка: Не найден файл ключа '${path.basename(serviceAccountKeyPath)}'. Убедитесь, что он находится в папке 'scripts'.`,
      );
    } else {
      console.error(error);
    }
    process.exit(1);
  } finally {
    console.log('\n--------------------------');
    console.log('--- ИТОГОВАЯ СВОДКА ---');
    console.log(`- Успешно обработано файлов: ${successCount}`);
    console.log(`- Файлов с ошибками/пропущено: ${failureCount}`);
    console.log('--------------------------');
    console.log('\nВсе операции завершены! ✨');
  }
}

uploadData();
