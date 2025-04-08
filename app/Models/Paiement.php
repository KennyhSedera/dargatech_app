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
        'observation',
        'receipt_path',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class, 'client_id');
    }


}
