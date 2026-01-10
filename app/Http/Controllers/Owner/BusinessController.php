<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\Business;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BusinessController extends Controller
{
    public function create()
    {
        // Verificar si ya tiene un negocio
        if (auth()->user()->businesses()->exists()) {
            return redirect()->route('owner.business.edit', auth()->user()->businesses()->first())
                ->with('info', 'Ya tienes un negocio registrado. Puedes editarlo aquí.');
        }

        $categories = Category::active()->ordered()->get();
        return view('owner.business.create', compact('categories'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'description' => 'required|string|min:50',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'website' => 'nullable|url|max:255',
            'whatsapp' => 'nullable|string|max:20',
            'facebook' => 'nullable|url|max:255',
            'instagram' => 'nullable|url|max:255',
            'twitter' => 'nullable|url|max:255',
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:100',
            'state' => 'required|string|max:100',
            'country' => 'required|string|max:100',
            'postal_code' => 'nullable|string|max:20',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
        ]);

        $validated['user_id'] = auth()->id();
        $validated['slug'] = Str::slug($validated['name']) . '-' . Str::random(6);
        $validated['is_active'] = false; // Requiere aprobación

        $business = Business::create($validated);

        return redirect()->route('owner.dashboard')
            ->with('success', 'Negocio creado exitosamente. Está pendiente de aprobación por un administrador.');
    }

    public function edit(Business $business)
    {
        // Verificar que el negocio pertenece al usuario
        if ($business->user_id !== auth()->id()) {
            abort(403);
        }

        $categories = Category::active()->ordered()->get();
        return view('owner.business.edit', compact('business', 'categories'));
    }

    public function update(Request $request, Business $business)
    {
        // Verificar que el negocio pertenece al usuario
        if ($business->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'description' => 'required|string|min:50',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'website' => 'nullable|url|max:255',
            'whatsapp' => 'nullable|string|max:20',
            'facebook' => 'nullable|url|max:255',
            'instagram' => 'nullable|url|max:255',
            'twitter' => 'nullable|url|max:255',
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:100',
            'state' => 'required|string|max:100',
            'country' => 'required|string|max:100',
            'postal_code' => 'nullable|string|max:20',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
        ]);

        // Actualizar slug solo si cambió el nombre
        if ($business->name !== $validated['name']) {
            $validated['slug'] = Str::slug($validated['name']) . '-' . Str::random(6);
        }

        $business->update($validated);

        return redirect()->route('owner.dashboard')
            ->with('success', 'Negocio actualizado exitosamente.');
    }

    public function destroy(Business $business)
    {
        // Verificar que el negocio pertenece al usuario
        if ($business->user_id !== auth()->id()) {
            abort(403);
        }

        $business->delete();

        return redirect()->route('owner.dashboard')
            ->with('success', 'Negocio eliminado exitosamente.');
    }
}
