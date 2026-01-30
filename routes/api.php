<?php

use App\Http\Controllers\PostController;
use Illuminate\Support\Facades\Route;

Route::get('/posts/json', [PostController::class, 'index'])
    ->name('posts.json');
