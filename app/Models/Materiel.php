<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Materiel extends Model
{
    use HasFactory;
    /**
     * Les champs qui peuvent être remplis massivement.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'description',
        'prix',
        'puissance',
    ];
}
