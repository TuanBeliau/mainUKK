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

        $token = $user->createToken('Touken')->plainTextToken;

        return response()->json([
            'success' => true,
            'token' => $token
        ]);
    }

    public function register(Request $request) {
        $validated = $request->validate([
            'nama' => 'required|string',
            'nis' => 'required|string|digits:5|unique:siswas,nis',
            'email' => 'required|email|unique:siswas,email',
            'password' => 'required|string|min:6'
        ], [
            'nis.unique' => 'NIS Sudah tersedia',
            'nis.digits' => 'NIS Harus 5 Digit',
            'email.unique' => 'Email Sudah tersedia',
        ]);

        $siswa = Models\Siswa::create([
            'nama' => $validated['nama'],
            'email' => $validated['email'],
            'nis' => $validated['nis'],
        ]);

        $user = Models\User::create([
            'siswa_id' => $siswa->id,
            'password' => Hash::make($validated['password'],)
        ]);

        Auth::login($user);

        $token = $user->createToken('Touken')->plainTextToken;

        return response()->json([
            'success' => true,
            'token' => $token
        ]);
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