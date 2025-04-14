<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Paiement extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id',
        'montant',
        'date_paiement',
        'mode_paiement',
        'periode_couverte',
        'echeance',
        'statut_paiement',
        'description',
        'receipt_path',
        'observation',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class, 'client_id');
    }

    public function produits()
    {
        return $this->hasMany(Products::class);
    }

}
