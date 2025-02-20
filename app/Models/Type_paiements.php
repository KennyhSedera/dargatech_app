<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Type_paiements extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'logo_path',
    ];

    public function paiement()
    {
        return $this->hasMany(Paiement::class, 'mode_paiement');
    }

    public function getLogoUrlAttribute()
    {
        return asset('storage/' . $this->logo_path);
    }

}
