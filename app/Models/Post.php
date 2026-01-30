<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Post extends Model
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'title',
        'content',
        'is_draft',
        'published_at',
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    public function author()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
