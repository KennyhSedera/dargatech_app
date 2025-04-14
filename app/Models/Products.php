<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Products extends Model
{
    use HasFactory;

    /**
     * Les attributs qui sont mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'paiement_id',
        'designation',
        'reference',
        'quantite',
        'unite',
        'tva',
        'prix_unitaire',
        'total_ht',
        'total_ttc'
    ];

    public function paiement()
    {
        return $this->belongsTo(Paiement::class);
    }
}
