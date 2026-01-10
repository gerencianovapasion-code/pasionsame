<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_users' => \App\Models\User::count(),
            'total_businesses' => \App\Models\Business::count(),
            'active_businesses' => \App\Models\Business::active()->count(),
            'pending_businesses' => \App\Models\Business::where('is_active', false)->count(),
            'total_products' => \App\Models\Product::count(),
            'active_subscriptions' => \App\Models\Subscription::active()->count(),
        ];

        $recentBusinesses = \App\Models\Business::with(['user', 'category'])
            ->latest()
            ->limit(5)
            ->get();

        $recentUsers = \App\Models\User::latest()
            ->limit(5)
            ->get();

        return view('admin.dashboard', compact('stats', 'recentBusinesses', 'recentUsers'));
    }
}
