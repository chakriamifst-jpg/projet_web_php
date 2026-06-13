# Diagramme des cas d'utilisation (Use Cases)

```mermaid
usecaseDiagram
  actor Admin
  actor Student
  actor "Authenticated User" as User
  actor Guest

  Admin --> (Gérer étudiants)
  Admin --> (Générer codes étudiants)
  Admin --> (Assigner positions aléatoires)
  Admin --> (Télécharger image étudiante)

  Student --> (S'inscrire)
  Student --> (Se connecter)
  Student --> (Voir son profil)
  Student --> (Éditer son profil)
  Student --> (Supprimer son compte)
  Student --> (Uploader CV)
  Student --> (Télécharger son CV)
  Student --> (Uploader image)
  Student --> (Supprimer son image)

  User --> (Voir la liste des étudiants)
  User --> (Consulter détail étudiant)
  User --> (Mettre à jour notes)  

  Guest --> (Voir la liste publique d'étudiants)
```

## Description des acteurs et cas

- **Admin**: gère tous les étudiants, exécute les commandes d'administration (`students:generate-codes`, `students:assign-random-locations`), peut télécharger les images des étudiants.
- **Student**: peut s'inscrire, se connecter, gérer son profil, uploader/télécharger CV et image, supprimer son compte.
- **Authenticated User**: utilisateur connecté qui peut consulter les listes/détails et (selon permissions) mettre à jour les notes.
- **Guest**: accès limité en lecture (si l'API frontend expose la liste publique).

## Export / utilisation
- Copier le bloc Mermaid dans un fichier Markdown et ouvrir la preview pour un rendu rapide.
- Pour exporter en image avec `mmdc` :

```bash
npm i -g @mermaid-js/mermaid-cli
mmdc -i docs/USE_CASES.md -o docs/use_cases.png
```

---
Fichiers concernés : [app/Http/Controllers/StudentController.php](app/Http/Controllers/StudentController.php), [app/Console/Commands/GenerateStudentCodes.php](app/Console/Commands/GenerateStudentCodes.php)
