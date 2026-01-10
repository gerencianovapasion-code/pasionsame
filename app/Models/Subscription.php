<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    protected $fillable = [
        'user_id',
        'subscription_plan_id',
        'business_id',
        'status',
        'starts_at',
        'ends_at',
        'cancelled_at',
        'payment_method',
        'payment_id',
        'amount',
        'auto_renew',
    ];

    protected $casts = [
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
        'cancelled_at' => 'datetime',
        'amount' => 'decimal:2',
        'auto_renew' => 'boolean',
    ];

    // Relaciones
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function subscriptionPlan()
    {
        return $this->belongsTo(SubscriptionPlan::class);
    }

    public function business()
    {
        return $this->belongsTo(Business::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active')
            ->where('ends_at', '>', now());
    }

    public function scopeExpired($query)
    {
        return $query->where('status', 'active')
            ->where('ends_at', '<=', now());
    }

    // Helpers
    public function isActive()
    {
        return $this->status === 'active' && $this->ends_at > now();
    }

    public function cancel()
    {
        $this->update([
            'status' => 'cancelled',
            'cancelled_at' => now(),
            'auto_renew' => false,
        ]);
    }

    public function renew()
    {
        $billing_period = $this->subscriptionPlan->billing_period;
        $ends_at = $billing_period === 'yearly'
            ? now()->addYear()
            : now()->addMonth();

        $this->update([
            'status' => 'active',
            'starts_at' => now(),
            'ends_at' => $ends_at,
        ]);
    }
}
