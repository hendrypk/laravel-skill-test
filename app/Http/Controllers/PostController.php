<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use App\Models\Post;
use Carbon\Carbon;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PostController extends Controller
{
    use AuthorizesRequests;

    public function index()
    {
        return Inertia::render('posts/index');
    }

    public function getPostsApi()
    {
        $posts = Post::with('author')
            ->where('is_draft', false)
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now())
            ->latest()
            ->paginate(20);

        return response()->json($posts);
    }

    public function create()
    {
        $this->authorize('create', Post::class);

        return Inertia::render('posts/create');
    }

    public function store(StorePostRequest $request)
    {
        $this->authorize('create', Post::class);

        $data = $request->validated();
        $data['user_id'] = Auth::id();

        if (! $data['is_draft'] && empty($data['published_at'])) {
            $data['published_at'] = now();
        } elseif ($data['is_draft']) {
            $data['published_at'] = null;
        }

        $post = Post::create($data);
        $post->load('author');

        return redirect()->route('posts.show', $post->id)->with('success', 'Post created');
    }

    public function show($id)
    {
        return Inertia::render('posts/show', [
            'id' => $id,
        ]);
    }

    public function getPostDetailApi($id)
    {
        $post = Post::with('author')
            ->where('is_draft', false)
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now())
            ->find($id);

        if (! $post) {
            return response()->json(['message' => 'Post not found'], 404);
        }

        return response()->json($post);
    }

    public function edit(Post $post)
    {
        $this->authorize('update', $post);

        return Inertia::render('posts/edit', [
            'post' => $post->load('author'),
        ]);
    }

    public function update(UpdatePostRequest $request, Post $post)
    {
        $this->authorize('update', $post);

        $data = $request->validated();

        $isDraft = array_key_exists('is_draft', $data) ? (bool) $data['is_draft'] : (bool) $post->is_draft;

        if ($isDraft) {
            $data['is_draft'] = true;
            $data['published_at'] = null;
        } else {
            $data['is_draft'] = false;

            if (array_key_exists('published_at', $data) && ! empty($data['published_at'])) {
                $data['published_at'] = Carbon::parse($data['published_at']);
            } else {
                $data['published_at'] = now();
            }
        }

        $post->update($data);

        return redirect()->route('posts.show', $post)->with('success', 'Post updated');
    }

    public function destroy(Request $request, Post $post)
    {
        $this->authorize('delete', $post);
        $post->delete();

        if ($request->wantsJson()) {
            return response()->json(null, 204);
        }

        return redirect()->route('posts.index')->with('success', 'Post deleted');
    }
}
