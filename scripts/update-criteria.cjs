const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// --- ВАЖНО: Убедитесь, что у вас есть файл service-account-key.json в этой же папке ---
try {
  const serviceAccount = require('./service-account-key.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} catch (error) {
  console.error("Ошибка: Не найден файл 'service-account-key.json'.");
  console.error("Пожалуйста, скачайте его из вашей Firebase Console (Project Settings -> Service accounts -> Generate new private key) и положите в папку 'scripts'.");
  process.exit(1);
}

const db = admin.firestore();

// --- Данные для вставки --- 
const courseId = 'angular-2025Q3';
const taskId = '4744';

// Собираем путь к файлу относительно текущего скрипта
const criteriaFilePath = path.join(__dirname, 'criteria-data.json');
const criteriaFile = fs.readFileSync(criteriaFilePath, 'utf-8');
const criteriaData = JSON.parse(criteriaFile);

// --- Логика скрипта ---
async function updateTaskCriteria() {
  // Ссылка на документ
  const docRef = db.collection('courses').doc(courseId).collection('taskDetails').doc(taskId);

  try {
    // Обновляем документ.
    await docRef.update(criteriaData);
    console.log(`Документ /courses/${courseId}/taskDetails/${taskId} успешно обновлен!`);
  } catch (error) {
    console.error('Ошибка при обновлении документа: ', error);
  }
}

// Запускаем скрипт
updateTaskCriteria();
