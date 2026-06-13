<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class GenerateStudentCodes extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'students:generate-codes';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Générer des codes étudiants au format D134567123 pour tous les étudiants sans code';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🔄 Génération des codes étudiants en cours...');

        $students = User::where('role', 'etudiant')
            ->whereNull('code')
            ->get();

        if ($students->count() === 0) {
            $this->info('✓ Aucun étudiant sans code trouvé.');
            return;
        }

        foreach ($students as $student) {
            $student->code = User::generateStudentCode();
            $student->save();
            $this->line("✓ Code généré pour <comment>{$student->name}</comment>: <info>{$student->code}</info>");
        }

        $this->info("\n✓ {$students->count()} code(s) généré(s) avec succès!");
    }
}
