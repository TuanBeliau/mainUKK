<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::unprepared("
            DROP TRIGGER IF EXISTS status_pkl;
            CREATE TRIGGER status_pkl
            AFTER INSERT ON pkls
            FOR EACH ROW
            BEGIN
                UPDATE siswas 
                SET status_lapor_PKL='Request Guru' 
                WHERE id=NEW.siswa_id;
            END;
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared("
            DROP TRIGGER IF EXISTS status_PKL;
        ");
    }
};
