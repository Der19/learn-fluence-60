import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { getLiveCourseReminderTemplate } from './emailTemplates.js';

dotenv.config();

// Configuration du transporteur SMTP
const createTransporter = () => {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  
  // Vérifier que les identifiants sont configurés
  if (!user || !pass) {
    throw new Error('Identifiants SMTP non configurés. Veuillez remplir SMTP_USER et SMTP_PASS dans le fichier .env');
  }
  
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true', // true pour 465, false pour autres ports
    auth: {
      user: user,
      pass: pass,
    },
  });
};

/**
 * Envoie un email de rappel pour un cours en live
 */
export async function sendLiveCourseReminder(data) {
  const { studentEmail, studentName, courseTitle, formateur, date, heure, minutesUntilStart } = data;

  try {
    const transporter = createTransporter();
    const template = getLiveCourseReminderTemplate({
      courseTitle,
      formateur,
      date,
      heure,
      minutesUntilStart,
      studentName,
    });

    const mailOptions = {
      from: `"${process.env.FROM_NAME || 'Kaay Diangu'}" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
      to: studentEmail,
      subject: template.subject,
      text: template.text,
      html: template.html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email envoyé à ${studentEmail}:`, info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Erreur lors de l'envoi à ${studentEmail}:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * Envoie des emails en masse à plusieurs étudiants
 * Optimisé pour envoyer à tous les étudiants d'un coup
 */
export async function sendBulkLiveCourseReminders(students, courseData) {
  const results = [];
  const batchSize = 10; // Envoyer par lots de 10 pour éviter de surcharger
  
  console.log(`📧 Envoi de ${students.length} emails pour le cours "${courseData.courseTitle}"...`);
  
  // Envoyer par lots
  for (let i = 0; i < students.length; i += batchSize) {
    const batch = students.slice(i, i + batchSize);
    
    // Envoyer en parallèle dans chaque lot
    const batchPromises = batch.map(async (student) => {
      const result = await sendLiveCourseReminder({
        studentEmail: student.email,
        studentName: student.name || student.email.split('@')[0],
        ...courseData,
      });
      return { student: student.email, ...result };
    });
    
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    
    // Petite pause entre les lots pour éviter de surcharger le serveur SMTP
    if (i + batchSize < students.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  const successCount = results.filter(r => r.success).length;
  const failCount = results.filter(r => !r.success).length;
  
  console.log(`✅ Envoi terminé: ${successCount} réussis, ${failCount} échoués`);
  
  return results;
}

/**
 * Teste la connexion SMTP
 */
export async function testSMTPConnection() {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('✅ Connexion SMTP réussie');
    return { success: true };
  } catch (error) {
    console.error('❌ Erreur de connexion SMTP:', error);
    return { success: false, error: error.message };
  }
}

