<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'business_id',
        'name',
        'slug',
        'description',
        'type',
        'price',
        'sale_price',
        'on_sale',
        'stock',
        'manage_stock',
        'stock_status',
        'download_file',
        'download_limit',
        'download_expiry',
        'sku',
        'weight',
        'dimensions',
        'attributes',
        'is_active',
        'is_featured',
        'views_count',
        'sales_count',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'sale_price' => 'decimal:2',
        'on_sale' => 'boolean',
        'manage_stock' => 'boolean',
        'weight' => 'decimal:2',
        'dimensions' => 'array',
        'attributes' => 'array',
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
    ];

    // Relaciones
    public function business()
    {
        return $this->belongsTo(Business::class);
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class);
    }

    public function primaryImage()
    {
        return $this->hasOne(ProductImage::class)->where('is_primary', true);
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

    public function scopeInStock($query)
    {
        return $query->where('stock_status', 'in_stock');
    }

    public function scopePhysical($query)
    {
        return $query->where('type', 'physical');
    }

    public function scopeDigital($query)
    {
        return $query->where('type', 'digital');
    }

    // Helpers
    public function incrementViews()
    {
        $this->increment('views_count');
    }

    public function incrementSales()
    {
        $this->increment('sales_count');
        if ($this->manage_stock) {
            $this->decrement('stock');
            if ($this->stock <= 0) {
                $this->update(['stock_status' => 'out_of_stock']);
            }
        }
    }

    public function getDisplayPrice()
    {
        return $this->on_sale && $this->sale_price
            ? $this->sale_price
            : $this->price;
    }

    public function isInStock()
    {
        return $this->stock_status === 'in_stock';
    }

    public function isDigital()
    {
        return $this->type === 'digital';
    }
}
