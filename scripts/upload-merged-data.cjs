const admin = require('firebase-admin');
const serviceAccount = require('./service-account-key.json');
const mergedData = require('../merged-data.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function uploadData() {
  console.log('Starting data upload process...');

  // Upload users
  console.log('Uploading users...');
  for (const userId in mergedData.users) {
    const user = mergedData.users[userId];
    await db.collection('users').doc(userId).set(user);
  }
  console.log('Users uploaded!');

  // Upload courses
  console.log('Uploading courses...');
  for (const courseAlias in mergedData.courses) {
    const course = mergedData.courses[courseAlias];
    const courseRef = db.collection('courses').doc(courseAlias);

    // Upload course data
    const courseData = { ...course };
    delete courseData.tasks;
    delete courseData.taskDetails;
    delete courseData.students;
    await courseRef.set(courseData);

    // Upload tasks
    if (course.tasks) {
      for (const taskId in course.tasks) {
        await courseRef.collection('tasks').doc(taskId).set(course.tasks[taskId]);
      }
    }

    // Upload taskDetails
    if (course.taskDetails) {
      for (const taskId in course.taskDetails) {
        await courseRef.collection('taskDetails').doc(taskId).set(course.taskDetails[taskId]);
      }
    }

    // Upload students
    if (course.students) {
      for (const studentId in course.students) {
        const student = course.students[studentId];
        const studentRef = courseRef.collection('students').doc(studentId);

        const studentData = { ...student };
        delete studentData.taskResults;
        await studentRef.set(studentData);

        // Upload taskResults
        if (student.taskResults) {
          for (const taskId in student.taskResults) {
            await studentRef.collection('taskResults').doc(taskId).set(student.taskResults[taskId]);
          }
        }
      }
    }
  }
  console.log('Courses uploaded!');

  console.log('Data upload complete!');
}

uploadData().catch(console.error);
