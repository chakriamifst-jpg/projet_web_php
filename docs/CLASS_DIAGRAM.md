# Diagramme de classes

Résumé du projet
- Application Laravel de gestion d'utilisateurs / étudiants : création, modification, upload/download de CV et images, génération de codes étudiants et commandes d'administration.

## Diagramme (Mermaid)

```mermaid
classDiagram
    direction TB
    class Authenticatable
    class User {
        +int id
        +string name
        +string email
        +string password
        +string role
        +string code
        +float latitude
        +float longitude
        +string city
        +string cv_path
        +string image_path
        +static generateStudentCode() string
    }
    Authenticatable <|-- User
    class Controller
    class StudentController
    class StudentImageController
    class ProfileController
    class ProfileDataController
    class ProfileUpdateRequest
    class ProfilePasswordUpdateRequest
    class GenerateStudentCodes
    class AssignRandomStudentLocations
    class HandleInertiaRequests
    class AppServiceProvider
    class UserFactory
    Controller <|-- StudentController
    Controller <|-- StudentImageController
    Controller <|-- ProfileController
    Controller <|-- ProfileDataController
    StudentController --> User : uses
    StudentImageController --> User : uses
    ProfileDataController --> User : uses
    ProfileController --> ProfileUpdateRequest : uses
    ProfileDataController --> ProfileUpdateRequest : uses
    ProfileDataController --> ProfilePasswordUpdateRequest : uses
    GenerateStudentCodes --> User : batch operate
    AssignRandomStudentLocations --> User : batch operate
    HandleInertiaRequests --> User : shares auth.user
    AppServiceProvider ..> Vite : configures
    UserFactory --> User : creates
```

## Description détaillée des classes

- **`User` — app/Models/User.php**
  - Modèle principal des utilisateurs.
  - Attributs importants : `name`, `email`, `password`, `role`, `code`, `note1/2/3`, `latitude`, `longitude`, `city`, `cv_path`, `image_path`.
  - Méthodes: `generateStudentCode()` crée un code unique; `booted()` assigne automatiquement un code à la création si `role === 'etudiant'`.

- **`StudentController` — app/Http/Controllers/StudentController.php**
  - Endpoints JSON pour : lister étudiants, récupérer détail, créer, mettre à jour, mettre à jour notes, upload/download CV.
  - Valide les données via `request()->validate()` et retourne des réponses structurées.

- **`StudentImageController` — app/Http/Controllers/StudentImageController.php**
  - Gestion upload/download/suppression d'images d'étudiants.
  - Permissions: téléchargement restreint à l'admin ou au propriétaire; insertion d'un log dans `image_downloads`.

- **`ProfileController` — app/Http/Controllers/ProfileController.php**
  - Contrôleur Inertia pour l'interface utilisateur: édition de profil, suppression de compte, redirections.

- **`ProfileDataController` — app/Http/Controllers/ProfileDataController.php**
  - API JSON pour afficher/mettre à jour le profil courant et changer le mot de passe (utilise `ProfileUpdateRequest` et `ProfilePasswordUpdateRequest`).

- **`ProfileUpdateRequest` / `ProfilePasswordUpdateRequest` — app/Http/Requests/**
  - Classes `FormRequest` centralisant les règles de validation pour mise à jour du profil et changement de mot de passe.

- **`GenerateStudentCodes` / `AssignRandomStudentLocations` — app/Console/Commands/**
  - Commandes Artisan pour opérations batch : génération de codes manquants et affectation de coordonnées aléatoires.

- **`HandleInertiaRequests` — app/Http/Middleware/HandleInertiaRequests.php**
  - Middleware qui partage `auth.user` aux props Inertia et gère la version des assets.

- **`AppServiceProvider` — app/Providers/AppServiceProvider.php**
  - Hook bootstrap (ex: `Vite::prefetch`).

- **`UserFactory` — database/factories/UserFactory.php**
  - Génération de fixtures pour les tests / seeders.

## Export / création d'un diagramme visuel
Options pour obtenir une image PNG/SVG depuis le Mermaid ci‑dessus :

- Via VS Code : installer l'extension "Markdown Preview Mermaid Support" et ouvrir `docs/CLASS_DIAGRAM.md` puis exporter la preview.
- Via mermaid-cli :

```bash
npm i -g @mermaid-js/mermaid-cli
mmdc -i docs/CLASS_DIAGRAM.md -o docs/class_diagram.png
```

ou copier seulement le bloc Mermaid dans un fichier `.mmd` et exécuter `mmdc -i diagram.mmd -o diagram.png`.

---
Fichier de référence : [app/Models/User.php](app/Models/User.php)
