<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfilePasswordUpdateRequest;
use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ProfileDataController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Return the current authenticated user profile data.
     */
    public function show(Request $request): JsonResponse
    {
        return response()->json([
            'data' => $request->user()->only([
                'id',
                'name',
                'email',
                'email_verified_at',
                'created_at',
                'updated_at',
                'role',
            ]),
        ]);
    }

    /**
     * Update the current user's profile information.
     */
    public function update(ProfileUpdateRequest $request): JsonResponse
    {
        $user = $request->user();
        $user->fill($request->validated());

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        return response()->json([
            'message' => 'Profil mis à jour avec succès.',
            'data' => $user->only([
                'id',
                'name',
                'email',
                'email_verified_at',
                'created_at',
                'updated_at',
                'role',
            ]),
        ]);
    }

    /**
     * Update the current user's password.
     */
    public function updatePassword(ProfilePasswordUpdateRequest $request): JsonResponse
    {
        $user = $request->user();
        $user->password = Hash::make($request->input('new_password'));
        $user->save();

        return response()->json([
            'message' => 'Mot de passe mis à jour avec succès.',
        ]);
    }
}
