<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Models;

class Guru extends Model
{
    /** @use HasFactory<\Database\Factories\GuruFactory> */
    use HasFactory;

    protected $fillable = ['nama', 'nip', 'gender', 'alamat', 'kontak', 'email', 'password'];

    public function pkl(): HasMany{
        return $this->hasMany(Models\PKL::class);
    }

    public function user(): HasOne{
        return $this->hasOne(Models\User::class);
    }
}