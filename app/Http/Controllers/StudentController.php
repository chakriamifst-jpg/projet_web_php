<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;

class StudentController extends Controller
{
    /**
     * Récupérer tous les étudiants avec le rôle 'etudiant'
     */
    public function getStudents(): JsonResponse
    {
        try {
            $students = User::where('role', 'etudiant')
                ->select(['id', 'code', 'name', 'email', 'role', 'note1', 'note2', 'note3', 'latitude', 'longitude', 'city', 'cv_path', 'created_at'])
                ->get()
                ->map(function ($student) {
                    // Diviser le nom en nom et prénom
                    $parts = explode(' ', $student->name, 2);
                    return [
                        'id' => $student->id,
                        'code' => $student->code ?? 'N/A',
                        'nom' => $parts[0] ?? $student->name,
                        'prenom' => $parts[1] ?? '',
                        'email' => $student->email,
                        'role' => $student->role,
                        'note1' => $student->note1,
                        'note2' => $student->note2,
                        'note3' => $student->note3,
                        'lat' => $student->latitude ?? 33.0028,
                        'lng' => $student->longitude ?? -7.6201,
                        'ville' => $student->city ?? 'FST Settat',
                        'cv_path' => $student->cv_path,
                        'created_at' => $student->created_at,
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $students,
                'message' => 'Étudiants récupérés avec succès',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des étudiants: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Récupérer un étudiant spécifique par ID
     */
    public function getStudent($id): JsonResponse
    {
        try {
            $student = User::where('role', 'etudiant')
                ->where('id', $id)
                ->first();

            if (!$student) {
                return response()->json([
                    'success' => false,
                    'message' => 'Étudiant non trouvé',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $student->id,
                    'code' => $student->code ?? 'N/A',
                    'nom' => explode(' ', $student->name)[0] ?? $student->name,
                    'prenom' => explode(' ', $student->name)[1] ?? '',
                    'email' => $student->email,
                    'role' => $student->role,
                ],
                'message' => 'Étudiant récupéré avec succès',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération de l\'étudiant: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Récupérer les étudiants avec notes (pour le tableau d'admin)
     */
    public function getStudentsWithNotes(): JsonResponse
    {
        try {
            $students = User::where('role', 'etudiant')
                ->select(['id', 'code', 'name', 'email', 'note1', 'note2', 'note3'])
                ->get()
                ->map(function ($student) {
                    $parts = explode(' ', $student->name, 2);
                    return [
                        'id' => $student->id,
                        'code' => $student->code ?? 'N/A',
                        'nom' => $parts[0] ?? $student->name,
                        'prenom' => $parts[1] ?? '',
                        'email' => $student->email,
                        'note1' => $student->note1 ?? 0,
                        'note2' => $student->note2 ?? 0,
                        'note3' => $student->note3 ?? 0,
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $students,
                'message' => 'Étudiants avec notes récupérés avec succès',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des étudiants: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Mettre à jour les notes d'un étudiant
     */
    public function updateStudentNotes($id): JsonResponse
    {
        try {
            $validated = request()->validate([
                'note1' => 'nullable|numeric|min:0|max:20',
                'note2' => 'nullable|numeric|min:0|max:20',
                'note3' => 'nullable|numeric|min:0|max:20',
            ]);

            $student = User::where('role', 'etudiant')
                ->where('id', $id)
                ->first();

            if (!$student) {
                return response()->json([
                    'success' => false,
                    'message' => 'Étudiant non trouvé',
                ], 404);
            }

            // Mettre à jour les notes
            if (isset($validated['note1'])) $student->note1 = $validated['note1'];
            if (isset($validated['note2'])) $student->note2 = $validated['note2'];
            if (isset($validated['note3'])) $student->note3 = $validated['note3'];
            
            $student->save();

            return response()->json([
                'success' => true,
                'data' => $student,
                'message' => 'Notes mises à jour avec succès',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour des notes: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Mettre à jour les informations générales d'un étudiant (nom, prénom, localisation, notes)
     */
    public function updateStudent($id): JsonResponse
    {
        try {
            $validated = request()->validate([
                'nom' => 'required|string|max:255',
                'prenom' => 'nullable|string|max:255',
                'note1' => 'nullable|numeric|min:0|max:20',
                'note2' => 'nullable|numeric|min:0|max:20',
                'note3' => 'nullable|numeric|min:0|max:20',
                'lat' => 'nullable|numeric',
                'lng' => 'nullable|numeric',
                'ville' => 'nullable|string|max:255',
            ]);

            $student = User::where('role', 'etudiant')
                ->where('id', $id)
                ->first();

            if (!$student) {
                return response()->json([
                    'success' => false,
                    'message' => 'Étudiant non trouvé',
                ], 404);
            }

            // Construire le champ name à partir de nom + prenom
            $fullName = $validated['nom'] . (isset($validated['prenom']) && $validated['prenom'] !== '' ? ' ' . $validated['prenom'] : '');
            $student->name = $fullName;

            if (isset($validated['note1'])) $student->note1 = $validated['note1'];
            if (isset($validated['note2'])) $student->note2 = $validated['note2'];
            if (isset($validated['note3'])) $student->note3 = $validated['note3'];

            if (isset($validated['lat'])) $student->latitude = $validated['lat'];
            if (isset($validated['lng'])) $student->longitude = $validated['lng'];
            if (isset($validated['ville'])) $student->city = $validated['ville'];

            $student->save();

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $student->id,
                    'code' => $student->code,
                    'nom' => $validated['nom'],
                    'prenom' => $validated['prenom'] ?? '',
                    'note1' => $student->note1,
                    'note2' => $student->note2,
                    'note3' => $student->note3,
                    'lat' => $student->latitude,
                    'lng' => $student->longitude,
                    'ville' => $student->city,
                ],
                'message' => 'Étudiant mis à jour avec succès',
            ]);
        } catch (\Illuminate\Validation\ValidationException $ve) {
            return response()->json([
                'success' => false,
                'message' => 'Données invalides',
                'errors' => $ve->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour de l\'étudiant: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Créer un nouvel étudiant avec un compte fonctionnel
     */
    public function createStudent(): JsonResponse
    {
        try {
            $validated = request()->validate([
                'nom' => 'required|string|max:255',
                'prenom' => 'nullable|string|max:255',
                'email' => 'required|email|unique:users,email',
                'password' => 'required|string|min:6',
                'note1' => 'nullable|numeric|min:0|max:20',
                'note2' => 'nullable|numeric|min:0|max:20',
                'note3' => 'nullable|numeric|min:0|max:20',
                'lat' => 'nullable|numeric',
                'lng' => 'nullable|numeric',
                'ville' => 'nullable|string|max:255',
            ]);

            // Construire le champ name à partir de nom + prenom
            $fullName = $validated['nom'] . (isset($validated['prenom']) && $validated['prenom'] !== '' ? ' ' . $validated['prenom'] : '');

            // Créer l'utilisateur (code sera auto-généré par le hook booted() du modèle)
            $student = User::create([
                'name' => $fullName,
                'email' => $validated['email'],
                'password' => bcrypt($validated['password']),
                'role' => 'etudiant',
                'note1' => $validated['note1'] ?? null,
                'note2' => $validated['note2'] ?? null,
                'note3' => $validated['note3'] ?? null,
                'latitude' => $validated['lat'] ?? 33.0028,
                'longitude' => $validated['lng'] ?? -7.6201,
                'city' => $validated['ville'] ?? 'FST Settat',
            ]);
            
            // Recharger pour obtenir le code généré
            $student->refresh();

            // Réorganiser la réponse
            $parts = explode(' ', $student->name, 2);

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $student->id,
                    'code' => $student->code,
                    'nom' => $parts[0] ?? $student->name,
                    'prenom' => $parts[1] ?? '',
                    'email' => $student->email,
                    'role' => $student->role,
                    'note1' => $student->note1,
                    'note2' => $student->note2,
                    'note3' => $student->note3,
                    'lat' => $student->latitude,
                    'lng' => $student->longitude,
                    'ville' => $student->city,
                ],
                'message' => 'Étudiant créé avec succès',
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $ve) {
            return response()->json([
                'success' => false,
                'message' => 'Données invalides',
                'errors' => $ve->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création de l\'étudiant: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Uploader un CV pour un étudiant
     */
    public function uploadCV($id): JsonResponse
    {
        try {
            $student = User::where('role', 'etudiant')
                ->where('id', $id)
                ->first();

            if (!$student) {
                return response()->json([
                    'success' => false,
                    'message' => 'Étudiant non trouvé',
                ], 404);
            }

            // Valider le fichier
            $validated = request()->validate([
                'cv' => 'required|file|mimes:pdf,doc,docx|max:5120', // 5MB max
            ]);

            // Supprimer l'ancien CV s'il existe
            if ($student->cv_path && file_exists(storage_path('app/public/' . $student->cv_path))) {
                unlink(storage_path('app/public/' . $student->cv_path));
            }

            // Stocker le nouveau CV
            $file = request()->file('cv');
            $filename = 'cv_' . $student->id . '_' . time() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('cvs', $filename, 'public');

            // Mettre à jour l'étudiant
            $student->update([
                'cv_path' => $path,
                'cv_uploaded_at' => now(),
            ]);

            return response()->json([
                'success' => true,
                'data' => [
                    'cv_path' => $path,
                    'cv_uploaded_at' => $student->cv_uploaded_at,
                ],
                'message' => 'CV uploadé avec succès',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation: ' . implode(', ', $e->errors()['cv'] ?? ['Format invalide']),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'upload du CV: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Télécharger le CV d'un étudiant
     */
    public function downloadCV($id): \Symfony\Component\HttpFoundation\BinaryFileResponse
    {
        try {
            $student = User::where('role', 'etudiant')
                ->where('id', $id)
                ->first();

            if (!$student || !$student->cv_path) {
                abort(404, 'CV non trouvé');
            }

            $cvPath = storage_path('app/public/' . $student->cv_path);

            if (!file_exists($cvPath)) {
                abort(404, 'Fichier non trouvé');
            }

            return response()->download($cvPath);
        } catch (\Exception $e) {
            abort(500, 'Erreur lors du téléchargement du CV');
        }
    }

    /**
     * Supprimer le CV d'un étudiant
     */
    public function deleteCV($id): JsonResponse
    {
        try {
            $student = User::where('role', 'etudiant')
                ->where('id', $id)
                ->first();

            if (!$student) {
                return response()->json([
                    'success' => false,
                    'message' => 'Étudiant non trouvé',
                ], 404);
            }

            if (!$student->cv_path) {
                return response()->json([
                    'success' => false,
                    'message' => 'Aucun CV trouvé pour cet étudiant',
                ], 404);
            }

            // Supprimer le fichier du stockage
            $cvPath = storage_path('app/public/' . $student->cv_path);
            if (file_exists($cvPath)) {
                unlink($cvPath);
            }

            // Mettre à jour l'étudiant
            $student->update([
                'cv_path' => null,
                'cv_uploaded_at' => null,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'CV supprimé avec succès',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression du CV: ' . $e->getMessage(),
            ], 500);
        }
    }

}
