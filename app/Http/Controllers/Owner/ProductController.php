<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $business = $user->businesses()->first();

        if (!$business) {
            return redirect()->route('owner.business.create')
                ->with('error', 'Primero debes crear tu negocio.');
        }

        $subscription = $user->activeSubscription;

        if (!$subscription || !$subscription->subscriptionPlan->has_virtual_store) {
            return redirect()->route('owner.dashboard')
                ->with('error', 'Tu plan actual no incluye tienda virtual. Actualiza tu suscripción.');
        }

        $products = $business->products()->latest()->paginate(12);
        $plan = $subscription->subscriptionPlan;

        return view('owner.products.index', compact('products', 'business', 'plan'));
    }

    public function create()
    {
        $user = auth()->user();
        $business = $user->businesses()->first();

        if (!$business) {
            return redirect()->route('owner.business.create')
                ->with('error', 'Primero debes crear tu negocio.');
        }

        $subscription = $user->activeSubscription;

        if (!$subscription || !$subscription->subscriptionPlan->has_virtual_store) {
            return redirect()->route('owner.dashboard')
                ->with('error', 'Tu plan actual no incluye tienda virtual.');
        }

        // Verificar límite de productos
        $plan = $subscription->subscriptionPlan;
        $currentProducts = $business->products()->count();

        if ($currentProducts >= $plan->max_products) {
            return redirect()->route('owner.products.index')
                ->with('error', "Has alcanzado el límite de {$plan->max_products} productos de tu plan {$plan->name}.");
        }

        return view('owner.products.create', compact('business', 'plan'));
    }

    public function store(Request $request)
    {
        $user = auth()->user();
        $business = $user->businesses()->first();

        if (!$business) {
            return redirect()->route('owner.business.create')
                ->with('error', 'Primero debes crear tu negocio.');
        }

        $subscription = $user->activeSubscription;

        if (!$subscription || !$subscription->subscriptionPlan->has_virtual_store) {
            return redirect()->route('owner.dashboard')
                ->with('error', 'Tu plan actual no incluye tienda virtual.');
        }

        // Verificar límite
        $plan = $subscription->subscriptionPlan;
        if ($business->products()->count() >= $plan->max_products) {
            return redirect()->route('owner.products.index')
                ->with('error', "Has alcanzado el límite de productos de tu plan.");
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string|min:20',
            'type' => 'required|in:physical,digital',
            'price' => 'required|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0|lt:price',
            'on_sale' => 'boolean',
            'stock' => 'nullable|integer|min:0',
            'manage_stock' => 'boolean',
            'stock_status' => 'required|in:in_stock,out_of_stock,on_backorder',
            'sku' => 'nullable|string|max:100',
            'weight' => 'nullable|numeric|min:0',
            'is_active' => 'boolean',
        ]);

        $validated['business_id'] = $business->id;
        $validated['slug'] = Str::slug($validated['name']) . '-' . Str::random(6);
        $validated['on_sale'] = $request->has('on_sale');
        $validated['manage_stock'] = $request->has('manage_stock');
        $validated['is_active'] = $request->has('is_active');

        $product = Product::create($validated);

        return redirect()->route('owner.products.index')
            ->with('success', 'Producto creado exitosamente.');
    }

    public function edit(Product $product)
    {
        $user = auth()->user();
        $business = $user->businesses()->first();

        // Verificar que el producto pertenece al negocio del usuario
        if ($product->business_id !== $business->id) {
            abort(403);
        }

        $subscription = $user->activeSubscription;
        $plan = $subscription->subscriptionPlan;

        return view('owner.products.edit', compact('product', 'business', 'plan'));
    }

    public function update(Request $request, Product $product)
    {
        $user = auth()->user();
        $business = $user->businesses()->first();

        // Verificar que el producto pertenece al negocio del usuario
        if ($product->business_id !== $business->id) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string|min:20',
            'type' => 'required|in:physical,digital',
            'price' => 'required|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0|lt:price',
            'on_sale' => 'boolean',
            'stock' => 'nullable|integer|min:0',
            'manage_stock' => 'boolean',
            'stock_status' => 'required|in:in_stock,out_of_stock,on_backorder',
            'sku' => 'nullable|string|max:100',
            'weight' => 'nullable|numeric|min:0',
            'is_active' => 'boolean',
        ]);

        // Actualizar slug solo si cambió el nombre
        if ($product->name !== $validated['name']) {
            $validated['slug'] = Str::slug($validated['name']) . '-' . Str::random(6);
        }

        $validated['on_sale'] = $request->has('on_sale');
        $validated['manage_stock'] = $request->has('manage_stock');
        $validated['is_active'] = $request->has('is_active');

        $product->update($validated);

        return redirect()->route('owner.products.index')
            ->with('success', 'Producto actualizado exitosamente.');
    }

    public function destroy(Product $product)
    {
        $user = auth()->user();
        $business = $user->businesses()->first();

        // Verificar que el producto pertenece al negocio del usuario
        if ($product->business_id !== $business->id) {
            abort(403);
        }

        $product->delete();

        return redirect()->route('owner.products.index')
            ->with('success', 'Producto eliminado exitosamente.');
    }
}
