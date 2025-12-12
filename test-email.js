// Script de test pour envoyer un email à tous les étudiants
// Utilisation: node test-email.js

const API_URL = 'http://localhost:3001';

const students = [
  { email: "idoucour9@gmail.com", name: "Étudiant Test" },
  { email: "student@edu.local", name: "Apprenant" },
];

const courseData = {
  courseTitle: "Test - JavaScript Fondamentaux",
  formateur: "Martin Dubois",
  date: new Date().toISOString().split('T')[0],
  heure: new Date(Date.now() + 2 * 60 * 1000).toTimeString().slice(0, 5), // Dans 2 minutes
  minutesUntilStart: 2,
};

async function testEmail() {
  console.log('🧪 Test d\'envoi d\'emails à tous les étudiants...\n');
  console.log(`📧 Étudiants: ${students.map(s => s.email).join(', ')}\n`);

  try {
    const response = await fetch(`${API_URL}/api/notifications/live-course/bulk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        students,
        courseData,
      }),
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Succès!\n');
      console.log(`📊 Résultats:`);
      console.log(`   - Total: ${result.total}`);
      console.log(`   - Réussis: ${result.successCount}`);
      console.log(`   - Échoués: ${result.failCount}\n`);
      
      if (result.results) {
        console.log('📧 Détails par étudiant:');
        result.results.forEach(r => {
          const status = r.success ? '✅' : '❌';
          console.log(`   ${status} ${r.student}: ${r.success ? 'Envoyé' : r.error}`);
        });
      }
    } else {
      console.log('❌ Erreur:', result.error);
    }
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message);
    console.log('\n💡 Assurez-vous que le serveur est démarré:');
    console.log('   cd server && npm start');
  }
}

testEmail();


