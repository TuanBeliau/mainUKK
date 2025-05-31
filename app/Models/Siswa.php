<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use App\Models\PKL;
use App\Models\User;

class Siswa extends Model
{
    /** @use HasFactory<\Database\Factories\SiswaFactory> */
    use HasFactory;

    protected $fillable = ['nama', 'nis', 'gender', 'alamat', 'kontak','email', 'foto', 'status_lapor_pkl'];

    // protected $guard_name = 'siswa';

    public function pkl(): HasOne{
        return $this->hasOne(PKL::class);
    }

    public function user(): HasOne{
        return $this->hasOne(User::class);
    }
}