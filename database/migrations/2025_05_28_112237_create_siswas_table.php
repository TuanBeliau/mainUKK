<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('siswas', function (Blueprint $table) {
            $table->id();
            $table->string('nama')->unique();
            $table->string('nis')->unique();
            $table->enum('gender', ['L', 'P']);
            $table->string('alamat')->nullable();
            $table->string('kontak')->nullable();
            $table->string('foto')->nullable();
            $table->string('email')->unique();
            $table->enum('status_lapor_pkl', ['Belum Lapor', 'Request Guru', 'Sudah Lapor'])->default('Belum Lapor');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('siswas');
    }
};