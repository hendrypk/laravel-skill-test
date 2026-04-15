<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Post extends Model
{
    /** @use HasFactory<\Database\Factories\PostFactory> */
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'published_at' => 'datetime',
        'is_draft' => 'boolean',
    ];

    /**
     * Get the author (user) of this post
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope to get only published posts (not drafts and not scheduled)
     */
    public function scopePublished($query)
    {
        return $query->where('is_draft', false)
            ->where('published_at', '<=', now());
    }

    /**
     * Check if post is published
     */
    public function isPublished(): bool
    {
        return ! $this->is_draft && $this->published_at <= now();
    }
}
