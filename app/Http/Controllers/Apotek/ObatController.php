<?php

namespace App\Http\Controllers\Apotek;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ObatController extends Controller
{
    public function index()
    {
        return Inertia::render('obat/index');
    }
    
    public function create()
    {
        return Inertia::render('obat/tambah');
    }
    
    public function store(Request $request)
    {
        // Validasi input
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'kategori' => 'required|string',
            'bentuk' => 'required|string',
            'harga' => 'required|numeric|min:0',
            'stok' => 'required|numeric|min:0',
        ]);

        // TODO: Simpan ke database
        // Medicine::create($validated);

        return redirect()->route('apotek.obat.index')->with('success', 'Obat berhasil ditambahkan');
    }
    
    public function edit($id)
    {
        return Inertia::render('obat/edit', ['id' => $id]);
    }
    
    public function update(Request $request, $id)
    {
        // Validasi input
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'kategori' => 'required|string',
            'bentuk' => 'required|string',
            'harga' => 'required|numeric|min:0',
            'stok' => 'required|numeric|min:0',
        ]);

        // TODO: Update database
        // $medicine = Medicine::findOrFail($id);
        // $medicine->update($validated);

        return redirect()->route('apotek.obat.index')->with('success', 'Obat berhasil diperbarui');
    }
    
    public function destroy($id)
    {
        // TODO: Hapus dari database
        // Medicine::findOrFail($id)->delete();

        return redirect()->route('apotek.obat.index')->with('success', 'Obat berhasil dihapus');
    }
}