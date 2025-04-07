<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class maintenacesSemestre extends Model
{
    use HasFactory;

    protected $table = 'maintenances_semestres';
    protected $fillable = ['categorie', 'point_controller', 'statut', 'actions'];
}
