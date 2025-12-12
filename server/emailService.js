import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { getLiveCourseReminderTemplate } from './emailTemplates.js';

dotenv.config();

// Configuration du transporteur SMTP
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true', // true pour 465, false pour autres ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
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
 */
export async function sendBulkLiveCourseReminders(students, courseData) {
  const results = [];
  
  for (const student of students) {
    const result = await sendLiveCourseReminder({
      studentEmail: student.email,
      studentName: student.name,
      ...courseData,
    });
    results.push({ student: student.email, ...result });
    
    // Petite pause pour éviter de surcharger le serveur SMTP
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
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

