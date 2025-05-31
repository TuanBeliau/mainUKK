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
            DROP TRIGGER IF EXISTS update_status;
            CREATE TRIGGER update_status 
            AFTER UPDATE ON pkls
            FOR EACH ROW
            BEGIN
                IF NEW.guru_id IS NOT NULL THEN
                    UPDATE siswas 
                    SET status_lapor_PKL='Sudah Lapor' 
                    WHERE id=NEW.siswa_ID;
                END IF;
            END;
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared("
            DROP TRIGGER IF EXISTS update_status;
        ");
    }
};
