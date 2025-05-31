<?php

namespace App\Http\Controllers\Siswa;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Siswa;
use App\Models\Industri;
use App\Models\PKL;
use Inertia\Inertia;
use Carbon\Carbon;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $siswa = $request->user()->load([
            'siswa' => function ($query) {
                $query->selectRaw('*, gender_detail(gender) as gender');
            }, 
            'siswa.pkl', 
            'siswa.pkl.industri',
            'siswa.pkl.guru']); 
        $industri = Industri::all();

        return response()->json([
            'message' => 'Selamat datang di dashboard',
            'siswa' => $siswa,
            'industri' => $industri,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $cek_industri = Industri::where('nama', $request->nama)
                        ->orWhere('email', $request->email)
                        ->first();

        if ($cek_industri) {
            $request->validate([
                'mulai' => 'required|date',
                'selesai' => 'required|date|after:mulai',
            ]);
        } else {
            $request->validate([
                'nama' => 'required|string|max:255|unique:industris,nama',
                'bidang_usaha' => 'required|string|max:255',
                'website' => 'required|string|max:255',
                'alamat' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:industris,email',
                'kontak' => 'required|numeric|digits_between:10,15',
                'mulai' => 'required|date',
                'selesai' => 'required|date|after:mulai',
            ], [
                'nama.unique'=>'Nama Perusahaan Sudah Ada',
                'email.unique'=>'Email Perusahaan Sudah Ada',
                'email.email'=>'Format Email Salah',
            ]);
        }

        $mulai = Carbon::parse($request->mulai);
        $selesai = Carbon::parse($request->selesai);

        if ($mulai->diffInMonths($selesai) < 1) {
            return response()->json([
                'message'=>'Lama PKL Minimal 1 Bulan'
            ], 422);
        }

        $siswa_id = auth()->user()?->siswa?->id;

        DB::beginTransaction();
        try {
            if ($cek_industri) {
                $pkl = PKL::create([
                    'siswa_id' => $siswa_id,
                    'industri_id' => $cek_industri->id,
                    'mulai' => $request->mulai,
                    'selesai' => $request->selesai,
                ]);
            } else {  
                $industri = Industri::create([
                    'nama' => $request->nama,
                    'website' => $request->website,
                    'bidang_usaha' => $request->bidang_usaha,
                    'alamat' => $request->alamat,
                    'email' => $request->email,
                    'kontak' => $request->kontak,
                ]);

                $pkl = PKL::create([
                    'siswa_id' => $siswa_id,
                    'industri_id' => $industri->id,
                    'mulai' => $request->mulai,
                    'selesai' => $request->selesai,
                ]);

            }

            DB::commit();
            return response()->json([
                'message' => 'Laporan PKL Berhasil di Buat'
            ], 201);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'message' => 'Terjadi Kesalahan Saat Menyimpan Data',
                'error' => $e->getMessage()
            ], 500);
        }

        return response()->json([
            'message' => 'Laporan PKL berhasil di buat',
            'data' => $industri,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $siswa = Siswa::findOrFail($id)->load(['pkl', 'pkl.industri']);
        $cek_industri = Industri::where('nama', $request->nama)->orWhere('email', $request->email)->firstOrFail();

        if($cek_industri) {
            $request->validate([
                'mulai' => 'required|date',
                'selesai' => 'required|date|after:mulai'
            ]);
        } else {
            $request->validate([
                'nama' => 'required|string|max:255|unique:industris,nama,'.$siswa->pkl->industri->id,
                'website' => 'required|string|max:255',
                'bidang_usaha' => 'required|string|max:255',
                'alamat' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:industris,email,'.$siswa->pkl->industri->id,
                'kontak' => 'required|string|digist_between:10,15',
                'mulai' => 'required|date',
                'selesai' => 'required|date|after:mulai',
            ], [
                'nama.unique'=>'Nama Perusahaan Sudah Ada',
                'email.unique'=>'Email Perusahaan Sudah Ada',
                'email.email'=>'Format Email Salah',
                'kontak.digits'=>'Range Telepon 10 sampai 15 Digits',
            ]);
        }

        
        $mulai = Carbon::parse($request->mulai);
        $selesai = Carbon::parse($request->selesai);

        if ($mulai->diffInMonths($selesai) < 1) {
            return response()->json([
                'message'=>'Lama PKL Minimal 1 Bulan'
            ], 422);
        }

        if (!$siswa->pkl || !$siswa->pkl->industri) {
            return response()->json(['message' => 'Industri tidak ditemukan'], 404);
        }

        DB::beginTransaction();
        try {
            if ($cek_industri) {
                $siswa->pkl->update([
                    'industri_id' => $cek_industri->id,
                    'mulai' => $mulai,
                    'selesai' => $selesai
                ]);
            } else {
                Industri::create([
                    'nama' => $request->nama,
                    'website' => $request->website,
                    'bidang_usaha' => $request->bidang_usaha,
                    'alamat' => $request->alamat,
                    'email' => $request->email,
                    'kontak' => $request->kontak,
                ]);

                $siswa->pkl->update([
                    'mulai' => $mulai,
                    'selesai' => $selesai,
                ]);
            }

            DB::commit();

            return response()->json([
                'message' => 'Laporan PKL Berhasil di Ubah'
            ], 201);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'message' => 'Terjadi Kesalahan Saat Menyimpan Data',
                'error' => $e->getMessage()
            ], 500);
        }

        return response()->json([
            'message' => 'Laporan PKl berhasil di ubah'
        ], 201);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $laporanPKl = Siswa::findOrFail($id)->pkl;
        $industri = $laporanPKl->industri;

        DB::beginTransaction();
        try {
            $laporanPKl->delete();
            $industri->delete();
            
            DB::commit();
            return response()->json([
                'message' => 'Berhasil di Hapus'
            ]);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'message' => 'Terjadi Kesalahan Saat Menyimpan Data',
                'error' => $e->getMessage()
            ], 500);
        }
        
        return response()->json([
            'message' => 'Laporan PKL dan data Industri Berhasil di Hapus'
        ], 201);
    }
}