<?php

use App\Http\Controllers\PostController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');
Route::get('blogs', [PostController::class, 'index'])->name('posts.index');
Route::get('posts/{post}', [PostController::class, 'show'])->name('posts.show');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('posts', PostController::class)->except(['index', 'show']);
    Route::get('my-posts', [PostController::class, 'indexAuthor'])->name('posts.index.author');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
// require __DIR__.'/api.php';
