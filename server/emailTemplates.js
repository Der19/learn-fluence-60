/**
 * Templates d'emails personnalisés pour Kaay Diangu
 */

export function getLiveCourseReminderTemplate(data) {
  const { courseTitle, formateur, date, heure, minutesUntilStart, studentName } = data;
  
  const formattedDate = new Date(date).toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return {
    subject: `🔴 Rappel : Cours en live "${courseTitle}" dans ${minutesUntilStart} minutes`,
    html: `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Rappel Cours en Live</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f4f4f4;
    }
    .container {
      background-color: #ffffff;
      border-radius: 10px;
      padding: 30px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px;
      border-radius: 10px 10px 0 0;
      text-align: center;
      margin: -30px -30px 30px -30px;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 20px 0;
    }
    .course-info {
      background-color: #f8f9fa;
      border-left: 4px solid #667eea;
      padding: 15px;
      margin: 20px 0;
      border-radius: 5px;
    }
    .course-info h2 {
      color: #667eea;
      margin-top: 0;
    }
    .info-row {
      display: flex;
      align-items: center;
      margin: 10px 0;
      padding: 8px 0;
    }
    .info-icon {
      width: 20px;
      margin-right: 10px;
      color: #667eea;
    }
    .countdown {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      color: white;
      padding: 15px;
      border-radius: 8px;
      text-align: center;
      margin: 20px 0;
      font-size: 18px;
      font-weight: bold;
    }
    .button {
      display: inline-block;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 12px 30px;
      text-decoration: none;
      border-radius: 5px;
      margin: 20px 0;
      text-align: center;
    }
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
      text-align: center;
      color: #666;
      font-size: 12px;
    }
    .logo {
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 10px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">🎓 Kaay Diangu</div>
      <p style="margin: 5px 0 0 0; opacity: 0.9;">Plateforme E-Learning</p>
    </div>
    
    <div class="content">
      <p>Bonjour ${studentName || 'Cher apprenant'},</p>
      
      <p><strong>Rappel important :</strong> Un cours en live va bientôt commencer !</p>
      
      <div class="course-info">
        <h2>${courseTitle}</h2>
        
        <div class="info-row">
          <span class="info-icon">👨‍🏫</span>
          <strong>Formateur :</strong> ${formateur}
        </div>
        
        <div class="info-row">
          <span class="info-icon">📅</span>
          <strong>Date :</strong> ${formattedDate}
        </div>
        
        <div class="info-row">
          <span class="info-icon">⏰</span>
          <strong>Heure de début :</strong> ${heure}
        </div>
      </div>
      
      <div class="countdown">
        ⏱️ Le cours commence dans ${minutesUntilStart} minute${minutesUntilStart > 1 ? 's' : ''} !
      </div>
      
      <p style="text-align: center;">
        <a href="https://votre-site.com/live-courses" class="button">
          Rejoindre le cours en live
        </a>
      </p>
      
      <p>Assurez-vous d'être prêt à rejoindre le cours en live. Nous vous attendons !</p>
    </div>
    
    <div class="footer">
      <p>Cet email a été envoyé automatiquement par Kaay Diangu</p>
      <p>Plateforme E-Learning - Tous droits réservés</p>
    </div>
  </div>
</body>
</html>
    `,
    text: `
Bonjour ${studentName || 'Cher apprenant'},

Rappel important : Un cours en live va bientôt commencer !

📚 Cours : ${courseTitle}
👨‍🏫 Formateur : ${formateur}
📅 Date : ${formattedDate}
⏰ Heure de début : ${heure}
⏱️ Dans : ${minutesUntilStart} minute${minutesUntilStart > 1 ? 's' : ''}

Assurez-vous d'être prêt à rejoindre le cours en live !

Cordialement,
L'équipe Kaay Diangu
    `.trim()
  };
}

