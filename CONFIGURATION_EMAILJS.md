# Configuration EmailJS pour envoyer de vrais emails

## Étapes pour configurer EmailJS

### 1. Créer un compte EmailJS

1. Allez sur https://www.emailjs.com/
2. Cliquez sur "Sign Up" (gratuit)
3. Créez un compte avec votre email
4. Vérifiez votre email

### 2. Ajouter un service email (Gmail recommandé)

1. Dans le dashboard EmailJS, allez dans **"Email Services"**
2. Cliquez sur **"Add New Service"**
3. Choisissez **"Gmail"** (ou votre fournisseur)
4. Cliquez sur **"Connect Account"**
5. Autorisez EmailJS à utiliser votre compte Gmail
6. **Notez le Service ID** (ex: `service_xxxxx`)

### 3. Créer un template d'email

1. Allez dans **"Email Templates"**
2. Cliquez sur **"Create New Template"**
3. Utilisez ce template :

**Subject (Sujet):**
```
{{subject}}
```

**Content (Contenu):**
```
{{message}}
```

4. **Notez le Template ID** (ex: `template_xxxxx`)

### 4. Obtenir votre clé publique

1. Allez dans **"Account"** > **"General"**
2. Trouvez **"Public Key"**
3. **Copiez la clé publique** (ex: `xxxxxxxxxxxxx`)

### 5. Configurer dans le code

Ouvrez `src/lib/emailNotifications.ts` et remplacez les valeurs :

```typescript
const EMAILJS_SERVICE_ID = "service_xxxxx"; // Votre Service ID
const EMAILJS_TEMPLATE_ID = "template_xxxxx"; // Votre Template ID
const EMAILJS_PUBLIC_KEY = "xxxxxxxxxxxxx"; // Votre Public Key
```

### 6. Tester

1. Rechargez l'application
2. Connectez-vous en tant qu'étudiant (`student@edu.local`)
3. Attendez 2 minutes (le cours de test commence dans 2 minutes)
4. Vérifiez la boîte email de `idoucour9@gmail.com`

## Limites du plan gratuit EmailJS

- 200 emails/mois
- Suffisant pour les tests

## Dépannage

Si les emails ne sont pas envoyés :
1. Vérifiez la console du navigateur pour les erreurs
2. Vérifiez que les clés sont correctes
3. Vérifiez que le service email est bien connecté
4. Vérifiez que le template utilise bien `{{subject}}` et `{{message}}`

