<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Ajouter une colonne 'code' unique au format D134567123 (1 lettre MAJ + 9 chiffres)
            $table->string('code')->unique()->nullable()->after('id');
            
            // Ajouter les colonnes pour les notes
            $table->decimal('note1', 5, 2)->nullable()->after('code');
            $table->decimal('note2', 5, 2)->nullable()->after('note1');
            $table->decimal('note3', 5, 2)->nullable()->after('note2');
            
            // Ajouter les colonnes de géolocalisation
            $table->decimal('latitude', 10, 6)->nullable()->after('note3');
            $table->decimal('longitude', 10, 6)->nullable()->after('latitude');
            $table->string('city')->nullable()->after('longitude');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['code', 'note1', 'note2', 'note3', 'latitude', 'longitude', 'city']);
        });
    }
};
