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
        Schema::create('image_downloads', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('admin_id')->nullable()->comment('ID de l\'administrateur qui a téléchargé');
            $table->unsignedBigInteger('user_id')->comment('ID de l\'étudiant propriétaire de l\'image');
            $table->string('image_path');
            $table->string('ip')->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamps();

            $table->index('admin_id');
            $table->index('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('image_downloads');
    }
};
