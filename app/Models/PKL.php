<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;
use App\Models;

class PKL extends Model
{
    /** @use HasFactory<\Database\Factories\PklFactory> */
    use HasFactory;

    protected $table = 'pkls';

    protected $fillable = ['siswa_id', 'guru_id', 'industri_id', 'mulai', 'selesai'];

    public function siswa(): BelongsTo{
        return $this->belongsTo(Models\Siswa::class);
    }

    public function guru(): BelongsTo{
        return $this->belongsTo(Models\Guru::class);
    }

    public function industri(): BelongsTo{
        return $this->belongsTo(Models\Industri::class);
    }
}