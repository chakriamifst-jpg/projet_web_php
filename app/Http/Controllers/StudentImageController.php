<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class StudentImageController extends Controller
{
    /**
     * List students with images (for admin view)
     */
    public function listStudentImages(): JsonResponse
    {
        try {
            $students = User::where('role', 'etudiant')
                ->select(['id', 'name', 'email', 'image_path', 'image_uploaded_at'])
                ->get()
                ->map(function ($s) {
                    $parts = explode(' ', $s->name, 2);
                    return [
                        'id' => $s->id,
                        'nom' => $parts[0] ?? $s->name,
                        'prenom' => $parts[1] ?? '',
                        'email' => $s->email,
                        'image_path' => $s->image_path,
                        'image_uploaded_at' => $s->image_uploaded_at,
                    ];
                });

            return response()->json([ 'success' => true, 'data' => $students ]);
        } catch (\Exception $e) {
            return response()->json([ 'success' => false, 'message' => $e->getMessage() ], 500);
        }
    }

    /**
     * Upload student image (student only for their own profile)
     */
    public function uploadImage($id): JsonResponse
    {
        try {
            $student = User::where('role', 'etudiant')->where('id', $id)->first();
            if (!$student) {
                return response()->json([ 'success' => false, 'message' => 'Étudiant non trouvé' ], 404);
            }

            $validated = request()->validate([
                'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            ]);

            $file = request()->file('image');
            $originalName = $file->getClientOriginalName();
            $nameOnly = pathinfo($originalName, PATHINFO_FILENAME);

            if (mb_strlen($nameOnly) > 20) {
                return response()->json([ 'success' => false, 'message' => 'Le nom du fichier (sans extension) ne doit pas dépasser 20 caractères.' ], 422);
            }

            // remove old image
            if ($student->image_path && file_exists(storage_path('app/public/' . $student->image_path))) {
                @unlink(storage_path('app/public/' . $student->image_path));
            }

            $filename = 'img_' . $student->id . '_' . time() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('images', $filename, 'public');

            $student->update([
                'image_path' => $path,
                'image_uploaded_at' => now(),
            ]);

            return response()->json([ 'success' => true, 'data' => [ 'image_path' => $path, 'image_uploaded_at' => $student->image_uploaded_at ], 'message' => 'Image uploadée avec succès' ]);
        } catch (\Illuminate\Validation\ValidationException $ve) {
            return response()->json([ 'success' => false, 'message' => implode(', ', $ve->errors()['image'] ?? ['Format invalide']) ], 422);
        } catch (\Exception $e) {
            return response()->json([ 'success' => false, 'message' => 'Erreur lors de l\'upload de l\'image: ' . $e->getMessage() ], 500);
        }
    }

    /**
     * Download student image
     */
    public function downloadImage($id)
    {
        try {
            $student = User::where('role', 'etudiant')->where('id', $id)->first();
            if (!$student || !$student->image_path) {
                abort(404, 'Image non trouvée');
            }

            $user = auth()->user();
            // Only allow admins or the student owner to download
            if (!$user || ($user->role !== 'admin' && $user->id !== $student->id)) {
                abort(403, 'Accès refusé');
            }

            $imgPath = storage_path('app/public/' . $student->image_path);
            if (!file_exists($imgPath)) abort(404, 'Fichier introuvable');

            // Log download to DB (best-effort)
            try {
                \Illuminate\Support\Facades\DB::table('image_downloads')->insert([
                    'admin_id' => $user->role === 'admin' ? $user->id : null,
                    'user_id' => $student->id,
                    'image_path' => $student->image_path,
                    'ip' => request()->ip(),
                    'user_agent' => request()->header('User-Agent'),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            } catch (\Exception $e) {
                // swallow logging errors
            }

            return response()->file($imgPath);
        } catch (\Symfony\Component\HttpKernel\Exception\HttpException $he) {
            throw $he;
        } catch (\Exception $e) {
            abort(500, 'Erreur lors du téléchargement de l\'image');
        }
    }

    /**
     * Delete student image
     */
    public function deleteImage($id): JsonResponse
    {
        try {
            $student = User::where('role', 'etudiant')->where('id', $id)->first();
            if (!$student) {
                return response()->json([ 'success' => false, 'message' => 'Étudiant non trouvé' ], 404);
            }

            if (!$student->image_path) {
                return response()->json([ 'success' => false, 'message' => 'Aucune image trouvée pour cet étudiant' ], 404);
            }

            $imgPath = storage_path('app/public/' . $student->image_path);
            if (file_exists($imgPath)) {
                @unlink($imgPath);
            }

            $student->update([ 'image_path' => null, 'image_uploaded_at' => null ]);

            return response()->json([ 'success' => true, 'message' => 'Image supprimée avec succès' ]);
        } catch (\Exception $e) {
            return response()->json([ 'success' => false, 'message' => 'Erreur lors de la suppression de l\'image: ' . $e->getMessage() ], 500);
        }
    }
}
