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
            DROP FUNCTION IF EXISTS gender_detail;
            CREATE FUNCTION gender_detail(gender_alias CHAR(1)) RETURNS VARCHAR(20)
            DETERMINISTIC
            BEGIN
                DECLARE gender_label VARCHAR(20);

                IF gender_alias = 'L' THEN
                    SET gender_label = 'Laki-laki';
                ELSEIF gender_alias = 'P' THEN
                    SET gender_label = 'Perempuan';
                END IF;

                RETURN gender_label;
            END;
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared('DROP FUNCTION IF EXISTS gender_detail;');
    }
};
