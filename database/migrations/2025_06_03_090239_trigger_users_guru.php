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
        DB::unprepared('
            DROP TRIGGER IF EXISTS users_guru;
            CREATE TRIGGER users_guru
            BEFORE INSERT ON users
            FOR EACH ROW
            BEGIN
                IF NEW.guru_id IS NOT NULL THEN
                    SET NEW.email_verified_at=NOW();
                END IF;
            END;
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
