<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Model;
use App\Models;

class Industri extends Model
{
    /** @use HasFactory<\Database\Factories\IndustriFactory> */
    use HasFactory;

    protected $fillable = ['nama', 'bidang_usaha', 'alamat', 'kontak', 'email', 'guru_pembimbing', 'website'];

    public function pkl(): HasMany{
        return $this->hasMany(Models\PKL::class);
    }
}