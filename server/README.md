# Serveur d'envoi d'emails personnalisés - Kaay Diangu

Serveur Node.js pour envoyer des emails personnalisés via SMTP.

## Installation

```bash
cd server
npm install
```

## Configuration

1. Copiez `.env.example` vers `.env` :
```bash
cp .env.example .env
```

2. Modifiez `.env` avec vos paramètres SMTP :

### Option 1 : Gmail (Recommandé pour débuter)

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=votre-email@gmail.com
SMTP_PASS=votre-mot-de-passe-application
FROM_EMAIL=noreply@kaaydiangu.com
FROM_NAME=Kaay Diangu
```

**Important pour Gmail :**
- Activez la validation en deux étapes
- Créez un "Mot de passe d'application" : https://myaccount.google.com/apppasswords
- Utilisez ce mot de passe dans `SMTP_PASS`

### Option 2 : Votre propre serveur SMTP

```env
SMTP_HOST=smtp.votre-domaine.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=noreply@votre-domaine.com
SMTP_PASS=votre-mot-de-passe
FROM_EMAIL=noreply@votre-domaine.com
FROM_NAME=Kaay Diangu
```

## Démarrage

```bash
# Mode développement (avec rechargement automatique)
npm run dev

# Mode production
npm start
```

Le serveur démarre sur `http://localhost:3001`

## API Endpoints

### 1. Test de connexion SMTP
```bash
GET http://localhost:3001/test-smtp
```

### 2. Envoyer une notification à un étudiant
```bash
POST http://localhost:3001/api/notifications/live-course
Content-Type: application/json

{
  "studentEmail": "idoucour9@gmail.com",
  "studentName": "John Doe",
  "courseTitle": "JavaScript Fondamentaux",
  "formateur": "Martin Dubois",
  "date": "2024-12-15",
  "heure": "14:00",
  "minutesUntilStart": 10
}
```

### 3. Envoyer des notifications en masse
```bash
POST http://localhost:3001/api/notifications/live-course/bulk
Content-Type: application/json

{
  "students": [
    { "email": "student1@gmail.com", "name": "Étudiant 1" },
    { "email": "student2@gmail.com", "name": "Étudiant 2" }
  ],
  "courseData": {
    "courseTitle": "JavaScript Fondamentaux",
    "formateur": "Martin Dubois",
    "date": "2024-12-15",
    "heure": "14:00",
    "minutesUntilStart": 10
  }
}
```

## Personnalisation des templates

Modifiez `emailTemplates.js` pour personnaliser le design des emails.

## Limites

- **Gmail** : 500 emails/jour
- **Serveur SMTP dédié** : Selon votre configuration
- **Services payants** : SendGrid (100/jour gratuit), AWS SES (62 000/mois gratuit)

## Sécurité

- Ne commitez jamais le fichier `.env`
- Utilisez des variables d'environnement pour les secrets
- En production, utilisez HTTPS

