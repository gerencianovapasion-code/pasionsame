<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SubscriptionPlan extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'price',
        'billing_period',
        'max_products',
        'has_virtual_store',
        'has_ai_assistant',
        'features',
        'is_active',
        'order',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'has_virtual_store' => 'boolean',
        'has_ai_assistant' => 'boolean',
        'features' => 'array',
        'is_active' => 'boolean',
    ];

    // Relaciones
    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('order', 'asc');
    }

    // Helpers
    public function canCreateProducts()
    {
        return $this->has_virtual_store && $this->max_products > 0;
    }
}
