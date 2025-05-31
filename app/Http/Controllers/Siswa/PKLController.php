<?php

namespace App\Http\Controllers\Siswa;

use Illuminate\Http\Request;
use App\Models\PKL;
use App\Models\Siswa;
use App\Models\Industri;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class PKLController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $laporan = PKL::all()->load('siswa:id,nama,status_lapor_pkl', 'industri:id,nama', 'guru:id,nama');

        return response()->json([
            'pkl'=>$laporan
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        Log::info($request->all());

        $validated = $request->validate([
            'nama' => 'string|required|max:255|unique:industris,nama',
            'email' => 'email|required|max:255|unique:industris,email',
            'website' => 'string|required|max:255|unique:industris,website',
            'alamat' => 'string|required|max:255',
            'bidang_usaha' => 'string|required|max:255',
            'kontak' => 'numeric|required|digits_between:10,15',
        ], [
            'kontak.digits' => 'Range Nomor Telepon 10 Sampai 15 Digit'
        ]);

        $industri = Industri::create([
            'nama' => $request->nama,
            'website' => $request->website,
            'bidang_usaha' => $request->bidang_usaha,
            'alamat' => $request->alamat,
            'email' => $request->email,
            'kontak' => $request->kontak,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Data Industri Berhasil di Buat'
        ]);
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
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $laporanPKl = Siswa::findOrFail($id)->pkl;

        $laporanPKl->delete();
    }
}