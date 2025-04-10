<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Partenaire extends Model
{
    use HasFactory;

    /**
     * Les attributs qui sont mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'logo',
        'adresse',
        'ville',
        'pays',
        'telephone',
        'site_web',
        'categorie',
        'description',
        'highlighted',
    ];

    /**
     * Les attributs qui doivent être castés.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'highlighted' => 'boolean',
    ];

    /**
     * Obtenir l'utilisateur associé au partenaire.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Obtenir le nom du partenaire via la relation utilisateur.
     */
    public function getNomAttribute()
    {
        return $this->user->name;
    }

    /**
     * Obtenir l'email du partenaire via la relation utilisateur.
     */
    public function getEmailAttribute()
    {
        return $this->user->email;
    }
}