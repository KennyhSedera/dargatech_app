<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Paiement extends Model
{
    use HasFactory;

    protected $fillable = [
        'numero',
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
        'date',
        'lieu_creation',
        'date_additionnel',
        'nom_vendeur',
        'nom_vendeurs',
        'select1',
        'num_tva',
        'nom_rue_vendeur',
        'ville_vendeur',
        'pays_vendeur',
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
