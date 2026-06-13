<?php

use App\Models\User;

require __DIR__ . '/bootstrap/app.php';

$app = new Illuminate\Container\Container();

// Charger Eloquent
$app->singleton('db', function () {
    return new Illuminate\Database\DatabaseManager(
        new Illuminate\Database\ConnectionFactory(),
        config('database')
    );
});

// Initialiser la base de données manuellement
$db = app('db');

// Récupérer tous les étudiants sans code
$students = User::where('role', 'etudiant')
    ->whereNull('code')
    ->get();

foreach ($students as $student) {
    $student->code = User::generateStudentCode();
    $student->save();
    echo "✓ Code généré pour {$student->name}: {$student->code}\n";
}

if ($students->count() === 0) {
    echo "Aucun étudiant sans code trouvé.\n";
} else {
    echo "\n✓ {$students->count()} code(s) généré(s) avec succès!\n";
}
