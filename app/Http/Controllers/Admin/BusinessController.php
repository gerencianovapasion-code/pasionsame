<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Business;
use Illuminate\Http\Request;

class BusinessController extends Controller
{
    public function index(Request $request)
    {
        $query = Business::with(['user', 'category']);

        // Filtros
        if ($request->filled('status')) {
            if ($request->status === 'pending') {
                $query->where('is_active', false);
            } elseif ($request->status === 'active') {
                $query->where('is_active', true);
            }
        }

        if ($request->filled('category')) {
            $query->where('category_id', $request->category);
        }

        if ($request->filled('search')) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('city', 'like', '%' . $request->search . '%');
            });
        }

        $businesses = $query->latest()->paginate(15);
        $categories = \App\Models\Category::active()->ordered()->get();

        return view('admin.businesses.index', compact('businesses', 'categories'));
    }

    public function show(Business $business)
    {
        $business->load(['user', 'category', 'products', 'subscriptions.subscriptionPlan']);
        return view('admin.businesses.show', compact('business'));
    }

    public function edit(Business $business)
    {
        $categories = \App\Models\Category::active()->ordered()->get();
        return view('admin.businesses.edit', compact('business', 'categories'));
    }

    public function update(Request $request, Business $business)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'description' => 'required|string|min:50',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
        ]);

        $validated['is_active'] = $request->has('is_active');
        $validated['is_featured'] = $request->has('is_featured');

        $business->update($validated);

        return redirect()->route('admin.businesses.index')
            ->with('success', 'Negocio actualizado exitosamente.');
    }

    public function destroy(Business $business)
    {
        $business->delete();

        return redirect()->route('admin.businesses.index')
            ->with('success', 'Negocio eliminado exitosamente.');
    }

    public function approve(Business $business)
    {
        $business->update([
            'is_active' => true,
            'approved_at' => now(),
            'approved_by' => auth()->id(),
        ]);

        return back()->with('success', 'Negocio aprobado exitosamente.');
    }

    public function reject(Business $business)
    {
        $business->update([
            'is_active' => false,
            'approved_at' => null,
            'approved_by' => null,
        ]);

        return back()->with('success', 'Negocio rechazado.');
    }
}
