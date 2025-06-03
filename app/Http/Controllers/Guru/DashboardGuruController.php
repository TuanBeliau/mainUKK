<?php

namespace App\Http\Controllers\Guru;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Models\Guru;
use App\Http\Controllers\Controller;

class DashboardGuruController extends Controller
{
    public function index(Request $request)
    {
        $guru = $request->user()->load([
            'guru' => function ($query) {
                $query->selectRaw('*, gender_detail(gender) as gender');
            }, 
            'guru.pkl.siswa', 
            'guru.pkl.industri'
        ]);

        return response()->json([
            'message' => 'Selamat datang di dashboard',
            'guru' => $guru,
        ]);
    }

    public function update(Request $request, string $id) 
    {
        $guru = Guru::findOrFail($id);

        $request->validate([
            'nama' => 'required|string|max:255',
            'nip' => 'required|numeric|digits:18|unique:gurus,nip,'.$id,
            'gender' => 'required|string|max:1',
            'alamat' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:gurus,email,'.$id,
            'kontak' => 'required|numeric|digits_between:10,15',
            'foto'  => 'file|mimes:jpg,png,jpeg|max:2048'
        ], [
            'email.unique' => 'Email Sudah Terdaftar Tolong Masukkan Email Lain!',
            'nip.digits' => 'Nomor Induk Guru Harus 18 Digit!',
        ]);

        DB::transaction(function() use ($request, $guru) {
            $dataUpdate = $request->only(['nama', 'nip', 'gender','alamat', 'email', 'kontak']);

            if ($request->hasFile('foto')) {
                if ($guru->foto && Storage::disk('public')->exists($guru->foto)) {
                    Storage::disk('public')->delete($guru->foto);
                }

                $fotoBaru = $request->file('foto')->store('foto-guru', 'public');
                $dataUpdate['foto'] = $fotoBaru;
            }

            $guru->update($dataUpdate);
        });

        return response()->json([
            'message' => 'Profile berhasil diperbarui',
            'data' => $guru
        ]);
    }
}
