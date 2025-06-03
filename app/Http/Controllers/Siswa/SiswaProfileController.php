<?php

namespace App\Http\Controllers\Siswa; // Correct rute

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Models\Siswa;
use Inertia\Inertia;

class SiswaProfileController extends Controller
{
    public function update(Request $request, string $id) {
        $siswa = Siswa::findOrFail($id);

        $request->validate([
            'nama' => 'required|string|max:255',
            'nis' => 'required|numeric|digits:5|unique:siswas,nis,'.$id,
            'gender' => 'required|string|max:1',
            'alamat' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:siswas,email,'.$id,
            'kontak' => 'required|numeric|digits_between:10,15',
            'foto'  => 'file|mimes:jpg,png,jpeg|max:2048'
        ], [
            'email.unique' => 'Email Sudah Terdaftar Tolong Masukkan Email Lain!',
            'nis.digits' => 'Nomor Induk Siswa Tidak Boleh Lebih dari 5 Digut!',
            'nis.digits' => 'Nomor Induk Siswa Tidak Boleh Lebih dari 5 Digut!',
        ]);

        DB::transaction(function() use ($request, $siswa) {
            $dataUpdate = $request->only(['nama', 'nis', 'gender','alamat', 'email', 'kontak']);

            if ($request->hasFile('foto')) {
                if ($siswa->foto && Storage::disk('public')->exists($siswa->foto)) {
                    Storage::disk('public')->delete($siswa->foto);
                }

                $fotoBaru = $request->file('foto')->store('foto-siswa', 'public');
                $dataUpdate['foto'] = $fotoBaru;
            }

            $siswa->update($dataUpdate);
        });

        return response()->json([
            'message' => 'Profile berhasil diperbarui',
            'data' => $siswa
        ]);
    }
}