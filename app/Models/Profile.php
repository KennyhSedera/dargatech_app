<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'genre',
        'contact',
        'adress',
        'speciality',
        'photo',
        'telegram_username',
        'telegram_user_id',
        'bot_active'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
