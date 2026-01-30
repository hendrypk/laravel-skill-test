<?php

use App\Http\Controllers\PostController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');
Route::get('posts/json', [PostController::class, 'index'])->name('posts.json');
Route::get('posts', function () {
    return Inertia::render('posts/index');
})->name('posts.index');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    Route::get('posts/create', function () {
        return Inertia::render('posts/create');
    })->name('posts.create');
    Route::post('posts/store', [PostController::class, 'store'])
        ->name('posts.store');
    Route::post('posts/edit', [PostController::class, 'edit'])
        ->name('posts.edit');
});

Route::get('posts/{post}', [PostController::class, 'show'])->name('posts.show');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
// require __DIR__.'/api.php';
