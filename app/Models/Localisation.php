<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Localisation extends Model
{
    use HasFactory;

    protected $table    = 'localisations';
    protected $fillable = ['latitude', 'longitude', 'pays', 'ville'];

    public function client()
    {
        return $this->hasOne(Client::class, 'localisation_id');
    }
}
