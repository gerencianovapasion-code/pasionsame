<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index(Request $request)
    {
        $categories = \App\Models\Category::active()->ordered()->get();
        $featuredBusinesses = \App\Models\Business::active()
            ->featured()
            ->with(['category', 'user'])
            ->limit(6)
            ->get();

        // Búsqueda y filtros
        $query = \App\Models\Business::active()->with(['category', 'user']);

        if ($request->filled('search')) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->filled('category')) {
            $query->where('category_id', $request->category);
        }

        if ($request->filled('city')) {
            $query->where('city', 'like', '%' . $request->city . '%');
        }

        // Búsqueda por ubicación (lat/lng con radio)
        if ($request->filled('lat') && $request->filled('lng')) {
            $radius = $request->input('radius', 10); // 10km por defecto
            $query->nearby($request->lat, $request->lng, $radius);
        }

        $businesses = $query->latest()->paginate(12);

        return view('home', compact('categories', 'featuredBusinesses', 'businesses'));
    }

    public function show($slug)
    {
        $business = \App\Models\Business::where('slug', $slug)
            ->active()
            ->with(['category', 'user', 'images', 'products.images'])
            ->firstOrFail();

        // Incrementar contador de visitas
        $business->incrementViews();

        // Negocios relacionados de la misma categoría
        $relatedBusinesses = \App\Models\Business::active()
            ->where('category_id', $business->category_id)
            ->where('id', '!=', $business->id)
            ->limit(4)
            ->get();

        return view('business.show', compact('business', 'relatedBusinesses'));
    }
}
