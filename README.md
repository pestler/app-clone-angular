# Client

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.0.5.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Database Structure (Firestore)

The application utilizes Firestore as its primary database. Below is an overview of the main collections and their typical document structures:

### `users` Collection

Stores user profile information. Each document represents a `UserProfile`.

- **Document ID:** User's GitHub ID.
- **Fields:**
  - `githubId`: (string) Unique GitHub identifier.
  - `id`: (number) Internal user ID.
  - `displayName`: (string) User's display name.
  - `primaryEmail`: (string) Primary email address.
  - `firstName`: (string) User's first name.
  - `lastName`: (string) User's last name.
  - `location`: (string) User's general location.
  - `active`: (boolean) Indicates if the user is active.
  - `cityName`: (string) City of residence.
  - `countryName`: (string) Country of residence.
  - `epamEmail`: (string, optional) EPAM email address.
  - `courses`: (string[], optional) List of course aliases the user is associated with.
  - `roles`: (object) User roles (e.g., `student`, `mentor`, `admin`).

### `courses` Collection

Stores information about each course. Each document represents a `Course`.

- **Document ID:** Course alias (e.g., 'angular-2025q3').
- **Fields:**
  - `id`: (number) Unique course ID.
  - `name`: (string) Full name of the course.
  - `startDate`: (string) Start date of the course.
  - `logo`: (string) Path or name of the course logo.
  - `alias`: (string) Unique alias for the course.
  - `usePrivateRepositories`: (boolean) Indicates if private repositories are used for the course.
  - `maxCourseScore`: (number, optional) Maximum possible score for the course.
  - `completed`: (boolean) Indicates if the course is completed.

#### `students` Subcollection (under each `course` document)

Stores student-specific data for a particular course. Each document represents `ScoreData`.

- **Document ID:** Student's GitHub ID.
- **Fields:**
  - `id`: (string) Student's internal ID.
  - `name`: (string) Student's name.
  - `githubId`: (string) Student's GitHub ID.
  - `active`: (boolean) Indicates if the student is active in this course.
  - `cityName`: (string) Student's city.
  - `countryName`: (string) Student's country.
  - `rank`: (number) Student's rank in the course.
  - `totalScore`: (number) Student's total score in the course.
  - `mentor`: (object, optional) Mentor details for the student.
  - `totalScoreChangeDate`: (string) Date of last score change.
  - `crossCheckScore`: (number) Score from cross-checks.
  - `repositoryLastActivityDate`: (string, optional) Date of last repository activity.
  - `repository`: (string, optional) URL of the student's repository.

##### `taskResults` Subcollection (under each `student` document)

Stores results for individual tasks completed by a student in a course. Each document represents `TaskResultDoc`.

- **Document ID:** Task ID.
- **Fields:**
  - `id`: (string) Task ID.
  - `score`: (number) Score obtained for the task.

### `courseStatistics` Collection

Stores aggregated statistics about courses. Each document represents `CourseStatistics`.

- **Document ID:** Typically a single document (e.g., a fixed ID like 'ZlY12vO9qy29M4a9v03l').
- **Fields:**
  - `studentsCountries`: (object) Statistics on student countries.
  - `studentsStats`: (object) Overall student statistics (e.g., `activeStudentsCount`).
  - `mentorsCountries`: (object) Statistics on mentor countries.
  - `mentorsStats`: (object) Overall mentor statistics.
  - `courseTasks`: (array) List of tasks associated with courses.
  - `studentsCertificatesCountries`: (object) Statistics on student certificate countries.

## API Interaction (Firestore)

The application primarily interacts with Firebase Firestore as its backend. Below is an overview of how the application's services interact with Firestore, serving as its API.

### Overview

- The application uses Firebase Firestore as its backend.
- Data interaction is primarily handled through `FirestoreService` and other domain-specific services (`AuthService`, `UserService`, `CourseService`, `DashboardService`).

### Key Services and their Firestore Interactions

#### `FirestoreService`

Provides generic methods for interacting with Firestore collections and documents.

- `getCollection(path, converter)`: Fetches a collection of documents.
- `getDoc(path, docId, converter)`: Fetches a single document.
- `setDoc(path, docId, data)`: Sets or updates a document.
- `getCollectionCount(path)`: Retrieves the count of documents in a specified collection.
- `getFilteredCollectionCount(path, field, value)`: Retrieves the count of documents in a collection based on a filter.

#### `AuthService`

Handles user authentication and retrieves user-specific course data.

- `getScoreData(courseAlias)`: Retrieves a student's score data for a specific course from the `courses/{courseAlias}/students/{githubId}` path.

#### `UserService`

Manages user profile data.

- `getUserProfile(githubId)`: Retrieves a user's profile from the `users/{githubId}` path.
- `saveUserProfile(githubId, data)`: Saves or updates a user's profile.
- `doesUserProfileExist(githubId)`: Checks for the existence of a user profile.

#### `CourseService`

Manages course-related data.

- `getCourses()`: Fetches all available courses from the `courses` collection.

#### `DashboardService`

Aggregates and processes data for the student dashboard.

- `getDashboardData(student, courseAlias)`: Gathers various data points for the student dashboard, fetching information from `courses/{courseAlias}/students/{githubId}/taskResults`, `courses/{courseAlias}/tasks`, and `courseStatistics`.

### Firestore Converters: Your Data's Translator

Imagine your app speaks TypeScript (with its nice, structured objects) and Firestore speaks its own database language (simple key-value pairs). Converters are like a special translator that helps these two talk to each other smoothly!

**What they do:**
When you send data from your app to Firestore, the converter takes your TypeScript object and turns it into something Firestore understands. When you get data back from Firestore, the converter takes that raw data and turns it back into your familiar TypeScript object.

**Why use them?**

- **No more manual mapping:** You don't have to manually pick out each piece of data. The converter does it automatically.
- **Keeps your data safe:** It makes sure the data you read and write always matches the types you defined in your TypeScript code.
- **Handles the ID magic:** Firestore gives each document a unique ID. Converters make it easy to automatically add this ID to your TypeScript object when you read it, and remove it when you save (because Firestore manages the ID itself).
- **Custom transformations:** Need to change a date format or set a default value? Converters let you do that during the translation process.

**How they work (the two main parts):**

Each converter has two important methods:

1. `toFirestore(yourObject)`: **Sending data to Firestore**
   - This method runs when you're saving or updating data in Firestore.
   - It takes your TypeScript object (e.g., a `ScoreData` object) and prepares it for storage.
   - **Example:** You might tell it to ignore the `id` property because Firestore will generate its own.

2. `fromFirestore(snapshot)`: **Getting data from Firestore**
   - This method runs when you're reading data from Firestore.
   - It takes the raw data from a Firestore document (`snapshot`) and rebuilds your TypeScript object.
   - **Example:** This is where you'd typically grab the document's `id` from `snapshot.id` and add it to your `ScoreData` object.

**Let's see an example with `ScoreData`:**

```typescript
// 1. Your TypeScript data model (e.g., in dashboard.models.ts)
export interface ScoreData {
  id: string; // This will be the Firestore document ID
  totalScore: number;
  // ... other fields like githubId, rank, etc.
}

// 2. Your Converter (e.g., also in dashboard.models.ts)
// This tells Firestore how to translate ScoreData objects
export const scoreDataConverter: FirestoreDataConverter<ScoreData> = {
  // When sending ScoreData to Firestore:
  toFirestore: (scoreData: ScoreData): DocumentData => {
    // We don't want to save the 'id' property *in-side* the document,
    // because Firestore uses it as the document's unique identifier.
    const { id, ...rest } = scoreData; // So, we separate 'id' from the rest of the data
    return rest; // And send only the 'rest' of the properties
  },

  // When getting data from Firestore:
  fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions): ScoreData => {
    const data = snapshot.data(options); // Get the raw data from the document
    return {
      id: snapshot.id, // Take the document's ID and put it into our 'id' property
      totalScore: data['totalScore'],
      // ... map other fields from 'data' to your ScoreData object
    } as ScoreData; // Tell TypeScript this is a ScoreData object
  },
};

// 3. How you'd use it in a service (e.g., in auth.service.ts)
// When you get a reference to a Firestore document, you "attach" the converter to it.
// Now, any read/write operations on this 'studentDocRef' will use scoreDataConverter!
//
// const studentDocRef = doc(this.firestore, `courses/${courseAlias}/students/${githubId}`).withConverter(scoreDataConverter);
// return docData(studentDocRef); // This will automatically give you a ScoreData object!
```
