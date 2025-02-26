<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Alerts extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id',
        'type_alert',
        'message',
        'installation_id',
        'resolue',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function installation()
    {
        return $this->belongsTo(Installation::class);
    }
}
