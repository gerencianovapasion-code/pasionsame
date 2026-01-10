<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\Admin;
use App\Http\Controllers\Owner;
use Illuminate\Support\Facades\Route;

// Rutas públicas
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/negocio/{slug}', [HomeController::class, 'show'])->name('business.show');
Route::get('/planes', [SubscriptionController::class, 'plans'])->name('plans');

// Autenticación
require __DIR__.'/auth.php';

// Rutas de perfil (autenticadas)
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Rutas de administrador
Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [Admin\DashboardController::class, 'index'])->name('dashboard');

    Route::resource('businesses', Admin\BusinessController::class);
    Route::post('/businesses/{business}/approve', [Admin\BusinessController::class, 'approve'])->name('businesses.approve');
    Route::post('/businesses/{business}/reject', [Admin\BusinessController::class, 'reject'])->name('businesses.reject');

    Route::resource('users', Admin\UserController::class);
});

// Rutas de dueños de negocio
Route::middleware(['auth', 'role:owner'])->prefix('owner')->name('owner.')->group(function () {
    Route::get('/dashboard', [Owner\DashboardController::class, 'index'])->name('dashboard');

    Route::resource('business', Owner\BusinessController::class)->except(['index', 'show']);

    Route::resource('products', Owner\ProductController::class);

    Route::get('/subscription', [SubscriptionController::class, 'index'])->name('subscription');
    Route::post('/subscription/subscribe', [SubscriptionController::class, 'subscribe'])->name('subscription.subscribe');
    Route::post('/subscription/cancel', [SubscriptionController::class, 'cancel'])->name('subscription.cancel');
});

// Ruta de dashboard general (redirige según rol)
Route::get('/dashboard', function () {
    $user = auth()->user();

    if ($user->isAdmin()) {
        return redirect()->route('admin.dashboard');
    }

    if ($user->isOwner()) {
        return redirect()->route('owner.dashboard');
    }

    return redirect()->route('home');
})->middleware(['auth', 'verified'])->name('dashboard');
