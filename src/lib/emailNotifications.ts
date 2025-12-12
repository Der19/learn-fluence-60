
// Service de notifications par email
// Utilise le backend SMTP personnalisé pour envoyer des emails

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface StudentEmail {
  email: string;
  name?: string;
}

interface LiveCourseReminder {
  courseId: string;
  courseTitle: string;
  formateur: string;
  date: string;
  heure: string;
  studentEmail: string;
  studentName?: string;
  minutesUntilStart: number;
}

// Configuration du backend SMTP
// Le backend doit être démarré sur le port 3001 (ou configuré via VITE_API_URL)

// Liste des emails des étudiants pour les notifications
// En production, cela devrait venir d'une base de données
const STUDENT_EMAILS: StudentEmail[] = [
  { email: "idoucour9@gmail.com", name: "Étudiant Test" },
  { email: "student@edu.local", name: "Apprenant" },
];

/**
 * Envoie un email via le backend SMTP personnalisé
 */
async function sendEmailViaBackend(
  studentEmail: string,
  studentName: string,
  courseTitle: string,
  formateur: string,
  date: string,
  heure: string,
  minutesUntilStart: number
): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/notifications/live-course`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        studentEmail,
        studentName,
        courseTitle,
        formateur,
        date,
        heure,
        minutesUntilStart,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de l\'envoi de l\'email');
    }

    const result = await response.json();
    console.log("✅ Email envoyé avec succès à:", studentEmail);
    return result.success;
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi de l'email:", error);
    // En cas d'erreur (backend non disponible), on simule pour le développement
    console.log("📧 [SIMULATION] Email envoyé:", {
      to: studentEmail,
      course: courseTitle,
      minutesUntilStart,
    });
    return false;
  }
}

/**
 * Envoie une notification pour un cours en live qui commence bientôt
 */
export async function sendLiveCourseReminder(
  reminder: LiveCourseReminder
): Promise<boolean> {
  return await sendEmailViaBackend(
    reminder.studentEmail,
    reminder.studentName || 'Cher apprenant',
    reminder.courseTitle,
    reminder.formateur,
    reminder.date,
    reminder.heure,
    reminder.minutesUntilStart
  );
}

/**
 * Récupère la liste des emails des étudiants
 */
export function getStudentEmails(): StudentEmail[] {
  return STUDENT_EMAILS;
}

/**
 * Vérifie les cours en live qui commencent bientôt et envoie des notifications
 */
export async function checkLiveCourseReminders(
  liveCourses: Array<{
    id: string;
    titre: string;
    formateur: string;
    date: string;
    heure: string;
    statut: string;
  }>
): Promise<number> {
  const now = new Date();
  let count = 0;

  for (const course of liveCourses) {
    // Vérifier seulement les cours à venir
    if (course.statut !== "a_venir") {
      continue;
    }

    // Calculer la date/heure de début du cours
    const [hours, minutes] = course.heure.split(":").map(Number);
    const courseDateTime = new Date(course.date);
    courseDateTime.setHours(hours, minutes, 0, 0);

    const diffMs = courseDateTime.getTime() - now.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    // Envoyer une notification si le cours commence dans 10 minutes (± 1 minute de tolérance)
    // Pour le test : détecte aussi les cours qui commencent dans 1-3 minutes (2 minutes avant)
    console.log(`🔍 Cours "${course.titre}": ${diffMinutes} minutes avant le début`);
    
    if ((diffMinutes >= 9 && diffMinutes <= 11) || (diffMinutes >= 1 && diffMinutes <= 3)) {
      const notificationKey = `live-${course.id}`;
      
      // Vérifier si on a déjà envoyé une notification pour ce cours
      const lastNotification = localStorage.getItem(notificationKey);
      const nowMinutes = Math.floor(now.getTime() / (1000 * 60));
      
      console.log(`📧 Cours "${course.titre}" dans la fenêtre de notification (${diffMinutes} min)`);
      console.log(`   Dernière notification: ${lastNotification}, Maintenant: ${nowMinutes}`);
      
      if (lastNotification !== String(nowMinutes)) {
        console.log(`✅ Envoi des notifications pour "${course.titre}"...`);
        // Envoyer à tous les étudiants en masse via l'API backend
        try {
          const response = await fetch(`${API_BASE_URL}/api/notifications/live-course/bulk`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              students: STUDENT_EMAILS,
              courseData: {
                courseTitle: course.titre,
                formateur: course.formateur,
                date: course.date,
                heure: course.heure,
                minutesUntilStart: diffMinutes,
              },
            }),
          });

          if (response.ok) {
            const result = await response.json();
            console.log(`✅ ${result.successCount} emails envoyés sur ${result.total} étudiants pour "${course.titre}"`);
            console.log(`   Détails:`, result.results);
            localStorage.setItem(notificationKey, String(nowMinutes));
            count = result.successCount;
          } else {
            // Si le backend n'est pas disponible, envoyer individuellement
            const errorText = await response.text();
            console.error(`❌ Erreur backend (${response.status}):`, errorText);
            console.log("⚠️ Backend non disponible, envoi individuel...");
            for (const student of STUDENT_EMAILS) {
              const sent = await sendLiveCourseReminder({
                courseId: course.id,
                courseTitle: course.titre,
                formateur: course.formateur,
                date: course.date,
                heure: course.heure,
                studentEmail: student.email,
                studentName: student.name,
                minutesUntilStart: diffMinutes,
              });

              if (sent) {
                count++;
              }
            }
            if (count > 0) {
              localStorage.setItem(notificationKey, String(nowMinutes));
            }
          }
        } catch (error) {
          console.error("Erreur lors de l'envoi en masse:", error);
          // Fallback : envoi individuel
          for (const student of STUDENT_EMAILS) {
            const sent = await sendLiveCourseReminder({
              courseId: course.id,
              courseTitle: course.titre,
              formateur: course.formateur,
              date: course.date,
              heure: course.heure,
              studentEmail: student.email,
              studentName: student.name,
              minutesUntilStart: diffMinutes,
            });

            if (sent) {
              count++;
            }
          }
          if (count > 0) {
            localStorage.setItem(notificationKey, String(nowMinutes));
          }
        }
      }
    }
  }

  return count;
}

/**
 * Initialise le système de notifications
 * Vérifie périodiquement les cours en live et envoie des notifications
 */
export function initializeEmailNotifications(
  getLiveCourses: () => Array<{
    id: string;
    titre: string;
    formateur: string;
    date: string;
    heure: string;
    statut: string;
  }>
) {
  console.log("🔔 Système de notifications initialisé");
  
  const courses = getLiveCourses();
  console.log(`📚 ${courses.length} cours en live chargés:`, courses.map(c => `${c.titre} (${c.date} ${c.heure})`));
  
  // Vérifier immédiatement
  checkLiveCourseReminders(courses);

  // Vérifier toutes les 15 secondes pour les tests (plus réactif)
  const interval = setInterval(() => {
    console.log("🔍 Vérification des cours en live...");
    const currentCourses = getLiveCourses();
    checkLiveCourseReminders(currentCourses);
  }, 15 * 1000); // 15 secondes pour les tests

  return () => clearInterval(interval);
}

