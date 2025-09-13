<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Technicien extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'genre',
        'contact',
        'adress',
        'speciality',
        'photo',
        'telegram_user_id',
        'telegram_username'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function maintenance()
    {
        return $this->hasMany(Maintenance::class, 'technicien');
    }
}
