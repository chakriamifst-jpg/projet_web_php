<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class AssignRandomStudentLocations extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'students:assign-random-locations {--radius=0.01 : Max offset in degrees around center (default 0.01)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Affecte des positions GPS aléatoires aux étudiants qui n\'ont pas de latitude/longitude';

    public function handle()
    {
        $centerLat = 33.0028; // centre FST
        $centerLng = -7.6201;
        $radius = (float) $this->option('radius');
        if ($radius <= 0) $radius = 0.01; // ~1km

        $students = User::where('role', 'etudiant')
            ->where(function ($q) {
                $q->whereNull('latitude')->orWhereNull('longitude');
            })->get();

        if ($students->isEmpty()) {
            $this->info('Aucun étudiant sans coordonnées trouvé.');
            return 0;
        }

        $count = 0;
        foreach ($students as $student) {
            $offsetLat = (mt_rand(-100000, 100000) / 100000) * $radius;
            $offsetLng = (mt_rand(-100000, 100000) / 100000) * $radius;
            $student->latitude = $centerLat + $offsetLat;
            $student->longitude = $centerLng + $offsetLng;
            $student->city = $student->city ?? 'Settat';
            $student->save();
            $this->line("✓ {$student->name} => lat={$student->latitude}, lng={$student->longitude}");
            $count++;
        }

        $this->info("\n✓ {$count} étudiant(s) mis à jour avec des coordonnées aléatoires.");
        return 0;
    }
}
