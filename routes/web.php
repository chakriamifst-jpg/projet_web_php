<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProfileDataController;
use App\Http\Controllers\StudentController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/profile/data', [ProfileDataController::class, 'show'])->name('profile.data.show');
    Route::put('/profile/data', [ProfileDataController::class, 'update'])->name('profile.data.update');
    Route::post('/profile/password', [ProfileDataController::class, 'updatePassword'])->name('profile.data.password');

    // Routes pour les étudiants (Récupération des étudiants depuis la BD)
    Route::get('/api/students', [StudentController::class, 'getStudents']);
    Route::post('/api/students', [StudentController::class, 'createStudent']);
    Route::get('/api/students/notes', [StudentController::class, 'getStudentsWithNotes']);
    Route::get('/api/students/{id}', [StudentController::class, 'getStudent'])->where('id', '[0-9]+');
    Route::put('/api/students/{id}/notes', [StudentController::class, 'updateStudentNotes'])->where('id', '[0-9]+');
    Route::put('/api/students/{id}', [StudentController::class, 'updateStudent'])->where('id', '[0-9]+');
        
    // Routes pour les CVs
    Route::post('/api/students/{id}/cv', [StudentController::class, 'uploadCV'])->where('id', '[0-9]+');
    Route::get('/api/students/{id}/cv', [StudentController::class, 'downloadCV'])->where('id', '[0-9]+');
    Route::get('/api/students/{id}/cv-check', [StudentController::class, 'hasCVFile'])->where('id', '[0-9]+');
    Route::delete('/api/students/{id}/cv', [StudentController::class, 'deleteCV'])->where('id', '[0-9]+');

    // Routes pour les images des étudiants
    Route::post('/api/students/{id}/image', [App\Http\Controllers\StudentImageController::class, 'uploadImage'])->where('id', '[0-9]+');
    Route::get('/api/students/{id}/image', [App\Http\Controllers\StudentImageController::class, 'downloadImage'])->where('id', '[0-9]+');
    Route::get('/api/students/images', [App\Http\Controllers\StudentImageController::class, 'listStudentImages']);
    Route::delete('/api/students/{id}/image', [App\Http\Controllers\StudentImageController::class, 'deleteImage'])->where('id', '[0-9]+');
});

require __DIR__.'/auth.php';

