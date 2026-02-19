<?php

use App\Http\Controllers\PostController;
use Illuminate\Support\Facades\Route;

Route::get('/api/posts', [PostController::class, 'getPostsApi'])->name('api.posts.index');
Route::get('/api/posts/{id}', [PostController::class, 'getPostDetailApi'])->name('api.posts.detail');
