npm install firebase-admin csv-parser

const admin = require('firebase-admin');
const fs = require('fs');
const csv = require('csv-parser');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert('path/to/your/serviceAccountKey.json'), // Path to your Firebase service account key
});

const db = admin.firestore(); // Use Firestore for storage

// Function to upload CSV data to Firestore
async function uploadCsvToFirestore(csvFilePath) {
  const results = [];

  // Read and parse CSV file
  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (row) => {
      results.push({
        studentId: row['Student_ID'],
        age: parseInt(row['Age']),
        gender: row['Gender'],
        heartRate: parseInt(row['Heart_Rate']),
        bloodPressureSystolic: parseInt(row['Blood_Pressure_Systolic']),
        bloodPressureDiastolic: parseInt(row['Blood_Pressure_Diastolic']),
        stressLevelBiosensor: parseInt(row['Stress_Level_Biosensor']),
        stressLevelSelfReport: parseInt(row['Stress_Level_Self_Report']),
        physicalActivity: row['Physical_Activity'],
        sleepQuality: row['Sleep_Quality'],
        mood: row['Mood'],
        studyHours: parseFloat(row['Study_Hours']),
        projectHours: parseFloat(row['Project_Hours']),
        healthRiskLevel: row['Health_Risk_Level']
      });
    })
    .on('end', async () => {
      console.log(`CSV file successfully processed. Data:`, results);

      // Upload data to Firestore
      const collectionRef = db.collection('student_health_data'); // Specify your Firestore collection

      const batch = db.batch(); // Start a batch operation

      results.forEach((row) => {
        const docRef = collectionRef.doc(row.studentId);  // Use Student_ID as the document ID
        batch.set(docRef, row);  // Add data to batch
      });

      try {
        await batch.commit(); // Commit the batch
        console.log('CSV data successfully uploaded to Firestore!');
      } catch (error) {
        console.error('Error uploading data to Firestore:', error);
      }
    });
}

// Path to your CSV file
const csvFilePath = 'path/to/your/csvfile.csv';

// Call the function to upload CSV data to Firestore
uploadCsvToFirestore(csvFilePath);
