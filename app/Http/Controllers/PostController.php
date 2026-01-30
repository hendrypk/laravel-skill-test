<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePostRequest;
use App\Models\Post;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PostController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->query('status', 'published');

        $query = Post::with('author');

        $query->when($status, function ($q) use ($status) {
            return match ($status) {
                'draft' => $q->draft(),
                'scheduled' => $q->scheduled(),
                'deleted' => $q->onlyTrashed(),
                default => $q->published(),
            };
        });

        return response()->json($query->latest()->paginate(20));
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
        if ($post->user_id !== auth()->id()) {
            abort(403, 'Waduh, kamu nggak punya akses buat ngedit post ini.');
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

    public function restore($id)
    {
        $post = Post::withTrashed()->findOrFail($id);

        if ($post->user_id !== auth()->id()) {
            abort(403, 'Eits! Kamu nggak punya izin buat hapus post ini.');
        }

        $post->restore();

        return Inertia::location(route('posts.index'));
    }
}
