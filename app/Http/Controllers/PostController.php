<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePostRequest;
use App\Models\Post;
use Illuminate\Http\RedirectResponse;

class PostController extends Controller
{
    public function index()
    {
        $posts = Post::with('author')
            ->where('is_draft', false)
            ->where('published_at', '<=', now())
            ->latest()
            ->paginate(20);

        return inertia('posts/index', [
            'posts' => $posts,
        ]);
    }

    public function indexAuthor()
    {
        $posts = Post::where('user_id', auth()->id())
            ->latest()
            ->withTrashed()
            ->paginate(20);

        return inertia('posts/author-index', [
            'posts' => $posts,
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

        Post::create([
            'user_id' => auth()->id(),
            'title' => $validated['title'],
            'content' => $validated['content'],
            'is_draft' => $validated['is_draft'],
            'published_at' => $publishedAt,
        ]);

        return redirect()->route('posts.index')->with('success', 'Mantap! Post kamu udah berhasil meluncur.');
    }

    public function show(Post $post)
    {
        if ($post->is_draft || $post->published_at > now() && $post->user_id !== auth()->id()) {
            abort(404, 'Post ini masih dalam tahap draf.');
        }

        $post->load('author');

        return inertia('posts/show', ['post' => $post]);
    }

    public function edit(Post $post)
    {
        if ($post->is_draft || $post->published_at > now() && $post->user_id !== auth()->id()) {
            abort(404, 'Post ini masih dalam tahap draf.');
        }

        return inertia('posts/edit', [
            'post' => [
                'id' => $post->id,
                'title' => $post->title,
                'content' => $post->content,
                'is_draft' => $post->is_draft,
                'published_at' => $post->published_at,
            ],
        ]);
    }

    public function update(StorePostRequest $request, Post $post): RedirectResponse
    {
        if ($post->is_draft || $post->published_at > now() && $post->user_id !== auth()->id()) {
            abort(404, 'Waduh, kamu nggak punya akses buat ngedit post ini.');
        }

        $validated = $request->validated();
        $isDraft = (bool) $validated['is_draft'];
        $publishedAt = $validated['published_at'];

        if ($isDraft) {
            $publishedAt = null;
        } elseif (empty($publishedAt)) {
            $publishedAt = now();
        }

        $post->update([
            'title' => $validated['title'],
            'content' => $validated['content'],
            'is_draft' => $isDraft ? 1 : 0,
            'published_at' => $publishedAt,
        ]);

        return redirect()->route('posts.show', $post->id)
            ->with('success', 'Gokil! Perubahan post kamu udah tersimpan dengan aman.');
    }

    public function destroy(Post $post): RedirectResponse
    {
        if ($post->user_id !== auth()->id()) {
            abort(403, 'Eits! Kamu nggak punya izin buat hapus post ini.');
        }

        $post->delete();

        return redirect()->route('posts.index')
            ->with('success', 'Beres! Post tadi udah resmi kita hapus dari peredaran.');
    }
}
