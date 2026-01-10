<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BusinessImage extends Model
{
    protected $fillable = [
        'business_id',
        'image_path',
        'title',
        'description',
        'order',
        'is_primary',
    ];

    protected $casts = [
        'is_primary' => 'boolean',
    ];

    // Relaciones
    public function business()
    {
        return $this->belongsTo(Business::class);
    }

    // Scopes
    public function scopePrimary($query)
    {
        return $query->where('is_primary', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('order', 'asc');
    }
}
