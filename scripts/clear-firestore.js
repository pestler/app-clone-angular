import admin from 'firebase-admin';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceAccountKeyPath = path.join(__dirname, 'service-account-key.json');

// Список коллекций для очистки
const collectionsToDelete = [
  'tasks',
  'courses',
  'interviews',
  'schedule',
  'scores',
  'sessions',
  'summaries',
  'courseStatistics',
  'teamDistribution',
  'autoTestDetailed',
  'autoTestVerification',
];

async function deleteCollection(db, collectionPath, batchSize) {
  const collectionRef = db.collection(collectionPath);
  const query = collectionRef.orderBy('__name__').limit(batchSize);

  return new Promise((resolve, reject) => {
    deleteQueryBatch(db, query, resolve, reject);
  });
}

async function deleteQueryBatch(db, query, resolve, reject) {
  try {
    const snapshot = await query.get();

    if (snapshot.size === 0) {
      // Когда нет больше документов, завершаем
      return resolve();
    }

    // Удаляем документы в пакете
    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    // Рекурсивно вызываем для следующей пачки документов
    process.nextTick(() => {
      deleteQueryBatch(db, query, resolve, reject);
    });
  } catch (error) {
    console.error('Ошибка при удалении пакета документов:', error);
    reject(error);
  }
}

async function clearFirestore() {
  try {
    const serviceAccount = JSON.parse(await fs.readFile(serviceAccountKeyPath, 'utf8'));
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    const db = admin.firestore();
    console.log('Firebase Admin SDK инициализирован успешно.');

    for (const collectionName of collectionsToDelete) {
      console.log(`
Начинаю очистку коллекции: ${collectionName}...`);
      await deleteCollection(db, collectionName, 500);
      console.log(`Коллекция '${collectionName}' успешно очищена.`);
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
    console.log('--- ОЧИСТКА ЗАВЕРШЕНА ---');
    console.log('Все указанные коллекции были очищены. ✨');
    console.log('--------------------------');
  }
}

clearFirestore();
