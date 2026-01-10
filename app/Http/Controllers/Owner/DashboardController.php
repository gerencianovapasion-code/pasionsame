<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $business = $user->businesses()->first();

        if (!$business) {
            return redirect()->route('owner.business.create')
                ->with('info', 'Primero debes crear tu negocio.');
        }

        $subscription = $user->activeSubscription;

        $stats = [
            'total_views' => $business->views_count,
            'total_products' => $business->products()->count(),
            'active_products' => $business->products()->active()->count(),
            'rating' => $business->rating,
        ];

        $recentProducts = $business->products()
            ->with('images')
            ->latest()
            ->limit(5)
            ->get();

        return view('owner.dashboard', compact('business', 'subscription', 'stats', 'recentProducts'));
    }
}
