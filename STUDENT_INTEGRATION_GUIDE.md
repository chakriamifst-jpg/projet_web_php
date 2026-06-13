# Guide d'intégration - Système de gestion des étudiants avec codes uniques

## 📋 Résumé des modifications

### 1. **Migration de base de données** (`0001_01_03_000000_add_code_to_users_table.php`)
Ajoute les colonnes suivantes à la table `users`:
- `code` (varchar, unique) - Code étudiant au format `D134567123` (1 lettre MAJ + 9 chiffres)
- `note1`, `note2`, `note3` (decimal) - Notes des étudiants
- `latitude`, `longitude` (decimal) - Coordonnées GPS
- `city` (varchar) - Ville/localité de l'étudiant

### 2. **Modèle User** (`app/Models/User.php`)
**Nouvelles méthodes:**
- `generateStudentCode()` - Génère un code étudiant unique et aléatoire
- `booted()` - Génère automatiquement un code lors de la création d'un étudiant

**Fillable mis à jour:**
```php
['name', 'email', 'password', 'role', 'code', 'note1', 'note2', 'note3', 'latitude', 'longitude', 'city']
```

### 3. **Contrôleur StudentController** (`app/Http/Controllers/StudentController.php`)
**Endpoints API disponibles:**

#### `GET /api/students`
Récupère tous les étudiants avec leurs données complètes (notes, localisation, etc.)

**Réponse:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "code": "D134567890",
      "nom": "Alami",
      "prenom": "Youssef",
      "email": "youssef@example.com",
      "role": "etudiant",
      "note1": 15,
      "note2": 14,
      "note3": 16,
      "lat": 33.0021,
      "lng": -7.6185,
      "ville": "Settat",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### `GET /api/students/{id}`
Récupère un étudiant spécifique

#### `GET /api/students/notes`
Récupère tous les étudiants avec leurs notes

#### `PUT /api/students/{id}/notes`
Met à jour les notes d'un étudiant

**Payload:**
```json
{
  "note1": 15,
  "note2": 17,
  "note3": 14
}
```

### 4. **Routes** (`routes/web.php`)
```php
// Routes protégées par authentification
Route::get('/api/students', [StudentController::class, 'getStudents']);
Route::get('/api/students/notes', [StudentController::class, 'getStudentsWithNotes']);
Route::get('/api/students/{id}', [StudentController::class, 'getStudent']);
Route::put('/api/students/{id}/notes', [StudentController::class, 'updateStudentNotes']);
```

### 5. **Frontend** (`resources/js/Pages/Dashboard.jsx`)
- Nouvelles API appelées au chargement pour récupérer les données réelles
- Le tableau admin affiche les étudiants depuis la base de données
- Barre de recherche fonctionnelle pour filtrer les étudiants

---

## 🚀 Étapes d'installation

### Étape 1: Exécuter la migration
```bash
php artisan migrate
```

### Étape 2: Générer les codes étudiants pour les utilisateurs existants

**Option A - Via Artisan Command:**
```bash
php artisan students:generate-codes
```

**Option B - Via Tinker (interactive shell):**
```bash
php artisan tinker
>>> $students = \App\Models\User::where('role', 'etudiant')->whereNull('code')->get();
>>> foreach($students as $s) { $s->code = \App\Models\User::generateStudentCode(); $s->save(); }
>>> exit;
```

**Option C - Via script PHP:**
```bash
php generate_student_codes.php
```

### Étape 3: Créer un nouvel étudiant (test)
```bash
php artisan tinker
>>> \App\Models\User::create([
...   'name' => 'Test Etudiant',
...   'email' => 'test@example.com',
...   'password' => bcrypt('password'),
...   'role' => 'etudiant'
... ]);
# Le code est généré automatiquement
```

### Étape 4: Ajouter des notes et localisation
```bash
php artisan tinker
>>> $student = \App\Models\User::where('email', 'test@example.com')->first();
>>> $student->update([
...   'note1' => 15,
...   'note2' => 17,
...   'note3' => 14,
...   'latitude' => 33.0028,
...   'longitude' => -7.6201,
...   'city' => 'Settat'
... ]);
>>> exit;
```

### Étape 5: Redémarrer le serveur Laravel
```bash
php artisan serve
```

---

## ✅ Vérification

### Vérifier que les migrations sont appliquées
```bash
php artisan migrate:status
```

### Vérifier les codes générés
```bash
php artisan tinker
>>> \App\Models\User::where('role', 'etudiant')->select('code', 'name')->get();
```

### Tester l'API
```bash
curl -X GET http://localhost:8000/api/students -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📝 Notes importantes

1. **Format du code étudiant:** `D134567890` (1 lettre majuscule + 9 chiffres)
2. **Unicité:** Chaque code est unique dans la base de données
3. **Génération automatique:** Les codes sont générés automatiquement lors de la création d'un nouvel étudiant avec `role='etudiant'`
4. **Authentification:** Toutes les routes API requièrent une authentification

---

## 🔧 Commandes artisan utiles

```bash
# Générer les codes
php artisan students:generate-codes

# Voir l'état des migrations
php artisan migrate:status

# Rollback dernière migration
php artisan migrate:rollback

# Shell interactif
php artisan tinker
```

---

## 📊 Exemples de réponses API

### GET /api/students (avec données)
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "code": "D123456789",
      "nom": "Alami",
      "prenom": "Youssef",
      "email": "youssef@example.com",
      "role": "etudiant",
      "note1": 15,
      "note2": 14,
      "note3": 16,
      "lat": 33.0021,
      "lng": -7.6185,
      "ville": "Settat Centre",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "message": "Étudiants récupérés avec succès"
}
```

---

## 🐛 Dépannage

### Erreur: "Impossible d'appeler la migration"
- Vérifier que le fichier migration existe: `database/migrations/0001_01_03_000000_add_code_to_users_table.php`
- Vérifier le fichier de configuration `.env`

### Erreur: "Class 'StudentController' not found"
- Vérifier que `app/Http/Controllers/StudentController.php` existe
- Exécuter: `composer dump-autoload`

### Erreur: "Unauthorized" sur API
- S'assurer d'être authentifié
- Ajouter le header `Authorization: Bearer YOUR_TOKEN` aux requêtes

---

## 📞 Support
Pour toute question ou problème, consultez la documentation Laravel officielle:
- https://laravel.com/docs/11.x/migrations
- https://laravel.com/docs/11.x/eloquent
- https://laravel.com/docs/11.x/artisan
