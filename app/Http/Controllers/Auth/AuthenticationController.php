<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Hash;
use App\Models;
use Inertia\Inertia;

class AuthenticationController extends Controller
{
    /**
     * Show the login page.
     */
    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string|min:6'
        ], [
            'password.min' => 'Panjang Password Minimal 6 Karakter'
        ]);

        $user = Models\User::whereHas('siswa', function ($query) use ($validated) {
                $query->where('email', $validated['email']);
            })
            ->with('siswa')
            ->first();
        
        if (!$user) {
            throw new \Exception('Pengguna Tidak di Temukan');
        };

        if (!Hash::check($validated['password'], $user->password)) {
            throw new \Exception('Password salah');
        }

        Auth::login($user);

        $userRole = Auth::user()->getRoleNames();

        Log::info($userRole);

        if ($userRole->isEmpty()) {
            throw new \Exception('Pengguna Belum Mendapatkan Role yang Diperlukan');
        }

        $token = $user->createToken('Touken')->plainTextToken;

        return response()->json([
            'success' => true,
            'token' => $token,
            'user' => $userRole,
        ]);
    }

    public function getRegister() {
        $siswa = Models\Siswa::where('nama', null)->get();

        return response()->json([
            'siswa' => $siswa,
            'success' => true
        ]);
    }

    public function register(Request $request) {
        $siswa = Models\Siswa::where('email', $request->email)
                 ->where('nis', $request->nis)
                 ->where('nama', null)
                 ->first();
        
        if (!$siswa) {
            throw new \Exception('Email Siswa Tidak Dapat di Temukan');
        }

        $validated = $request->validate([
            'nama' => 'required|string',
            'password' => 'required|string|min:6'
        ], [
            'password.min' => 'Password Minimal 6 Karakter'
        ]);

        DB::beginTransaction();
        try {
            $siswaUpdate = $siswa->update([
                'nama' => $validated['nama'],
            ]);

            $userCreate = Models\User::create([
                'siswa_id' => $siswa->id,
                'password' => Hash::make($validated['password']),
                'email_verified_at' => now()
            ]);

            $userCreate->assignRole('siswa');

            Auth::login($userCreate);

            $token = $userCreate->createToken('Touken')->plainTextToken;
            $role = Auth::user()->getRoleNames();

            Log::info($role);

            DB::commit();

            return response()->json([
                'message' => 'Berhasil Login Sebagai Siswa',
                'success' =>true,
                'token' => $token,
                'role' => $role,
            ]);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'message' => 'Terjadi Kesalahan Saat Tambah User',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function logout(Request $request) {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'siswa not authenticated'], 401);
        }

        $user->tokens()->delete();

        return response()->json([
            'message' => 'Logout Berhasil'
        ]);
    }
}