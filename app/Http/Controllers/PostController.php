<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePostRequest;
use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function index(Request $request)
    {
        $posts = Post::with('user')
            ->active()
            ->orderBy('published_at', 'desc')
            ->paginate(20);

        return response()->json([
            'data' => $posts->items(),
            'current_page' => $posts->currentPage(),
            'last_page' => $posts->lastPage(),
            'per_page' => $posts->perPage(),
            'total' => $posts->total(),
        ]);
    }

    public function store(StorePostRequest $request)
    {
        $validated = $request->validated();
        $isDraft = (bool) $validated['is_draft'];
        $publishedAt = $validated['published_at'];

        if ($isDraft) {
            $publishedAt = null;
        } elseif (empty($publishedAt)) {
            $publishedAt = now();
        }

        // dd($publishedAt, $validated);
        Post::create([
            'user_id' => auth()->id(),
            'title' => $validated['title'],
            'content' => $validated['content'],
            'is_draft' => $validated['is_draft'],
            'published_at' => $publishedAt,
        ]);

        return redirect()->route('posts.index')->with('success', 'Mantap! Post kamu udah berhasil meluncur.');
    }
}
