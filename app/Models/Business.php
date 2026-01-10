<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Business extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'category_id',
        'name',
        'slug',
        'description',
        'logo',
        'cover_image',
        'phone',
        'email',
        'website',
        'whatsapp',
        'facebook',
        'instagram',
        'twitter',
        'address',
        'city',
        'state',
        'country',
        'postal_code',
        'latitude',
        'longitude',
        'business_hours',
        'is_active',
        'is_featured',
        'approved_at',
        'approved_by',
        'views_count',
        'rating',
        'reviews_count',
    ];

    protected $casts = [
        'latitude' => 'decimal:7',
        'longitude' => 'decimal:7',
        'business_hours' => 'array',
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
        'approved_at' => 'datetime',
        'rating' => 'decimal:2',
    ];

    // Relaciones
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function images()
    {
        return $this->hasMany(BusinessImage::class);
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }

    public function activeSubscription()
    {
        return $this->hasOne(Subscription::class)->where('status', 'active')->latest();
    }

    public function approvedBy()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeNearby($query, $lat, $lng, $radius = 10)
    {
        // Búsqueda por radio en km usando fórmula Haversine
        $query->selectRaw("*,
            ( 6371 * acos( cos( radians(?) ) *
            cos( radians( latitude ) ) *
            cos( radians( longitude ) - radians(?) ) +
            sin( radians(?) ) *
            sin( radians( latitude ) ) ) ) AS distance",
            [$lat, $lng, $lat])
            ->having('distance', '<', $radius)
            ->orderBy('distance');
    }

    // Helpers
    public function incrementViews()
    {
        $this->increment('views_count');
    }

    public function canAddProducts()
    {
        $subscription = $this->activeSubscription;
        if (!$subscription) {
            return false;
        }

        $plan = $subscription->subscriptionPlan;
        if (!$plan->has_virtual_store) {
            return false;
        }

        return $this->products()->count() < $plan->max_products;
    }

    public function hasAIAssistant()
    {
        $subscription = $this->activeSubscription;
        return $subscription && $subscription->subscriptionPlan->has_ai_assistant;
    }
}
