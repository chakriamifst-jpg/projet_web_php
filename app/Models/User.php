<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

#[Fillable(['name', 'email', 'password', 'role', 'code', 'note1', 'note2', 'note3', 'latitude', 'longitude', 'city', 'cv_path', 'cv_uploaded_at', 'image_path', 'image_uploaded_at'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * Génère un code étudiant au format D134567123 (1 lettre MAJ + 9 chiffres)
     */
    public static function generateStudentCode(): string
    {
        // Lettre majuscule aléatoire
        $letter = chr(rand(65, 90)); // A-Z
        
        // 9 chiffres aléatoires
        $digits = str_pad(rand(0, 999999999), 9, '0', STR_PAD_LEFT);
        
        $code = $letter . $digits;
        
        // Vérifier l'unicité
        while (self::where('code', $code)->exists()) {
            $letter = chr(rand(65, 90));
            $digits = str_pad(rand(0, 999999999), 9, '0', STR_PAD_LEFT);
            $code = $letter . $digits;
        }
        
        return $code;
    }

    /**
     * Générer automatiquement un code lors de la création
     */
    protected static function booted()
    {
        static::creating(function ($user) {
            if (!$user->code && $user->role === 'etudiant') {
                $user->code = self::generateStudentCode();
            }
        });
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
