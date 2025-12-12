import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sendLiveCourseReminder, sendBulkLiveCourseReminders, testSMTPConnection } from './emailService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware CORS - Autoriser plusieurs origines
app.use(cors({
  origin: function (origin, callback) {
    // Autoriser les requêtes sans origine (Postman, curl, etc.)
    if (!origin) return callback(null, true);
    
    // Liste des origines autorisées
    const allowedOrigins = [
      'http://localhost:8081',
      'http://localhost:5173',
      'http://localhost:8080',
      process.env.CORS_ORIGIN
    ].filter(Boolean);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Pour le développement, autoriser toutes les origines
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Route de test
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Serveur d\'emails actif' });
});

// Route pour tester la connexion SMTP
app.get('/test-smtp', async (req, res) => {
  try {
    const result = await testSMTPConnection();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Route pour envoyer une notification de cours en live à un étudiant
app.post('/api/notifications/live-course', async (req, res) => {
  try {
    const { studentEmail, studentName, courseTitle, formateur, date, heure, minutesUntilStart } = req.body;

    if (!studentEmail || !courseTitle || !date || !heure) {
      return res.status(400).json({
        success: false,
        error: 'Données manquantes: studentEmail, courseTitle, date, heure sont requis',
      });
    }

    const result = await sendLiveCourseReminder({
      studentEmail,
      studentName: studentName || 'Cher apprenant',
      courseTitle,
      formateur: formateur || 'Formateur',
      date,
      heure,
      minutesUntilStart: minutesUntilStart || 10,
    });

    if (result.success) {
      res.json({ success: true, message: 'Email envoyé avec succès', messageId: result.messageId });
    } else {
      res.status(500).json({ success: false, error: result.error });
    }
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Route pour envoyer des notifications en masse
app.post('/api/notifications/live-course/bulk', async (req, res) => {
  try {
    const { students, courseData } = req.body;

    if (!students || !Array.isArray(students) || students.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Liste d\'étudiants requise',
      });
    }

    if (!courseData || !courseData.courseTitle || !courseData.date || !courseData.heure) {
      return res.status(400).json({
        success: false,
        error: 'Données du cours requises: courseTitle, date, heure',
      });
    }

    const results = await sendBulkLiveCourseReminders(students, courseData);
    
    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    res.json({
      success: true,
      message: `Emails envoyés: ${successCount} réussis, ${failCount} échoués`,
      total: results.length,
      successCount,
      failCount,
      results,
    });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur d'emails démarré sur le port ${PORT}`);
  console.log(`📧 Prêt à envoyer des emails personnalisés`);
});

