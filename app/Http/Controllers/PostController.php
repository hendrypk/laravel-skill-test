<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use App\Models\Post;
use Carbon\Carbon;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PostController extends Controller
{
    use AuthorizesRequests;

    public function index(Request $request)
    {
        $posts = Post::with('author')
            ->where(function ($query) use ($request) {
                $query->where(function ($q) {
                    $q->where('is_draft', false)
                        ->where('published_at', '<=', now());
                });

                if ($request->user()) {
                    $query->orWhere('user_id', $request->user()->id);
                }
            })
            ->latest('created_at')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('posts/index', [
            'posts' => $posts,
            'auth' => [
                'user' => $request->user() ? $request->user()->only(['id', 'name', 'email']) : null,
            ],
        ]);
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

        $isDraft = array_key_exists('is_draft', $data) ? (bool) $data['is_draft'] : false;

        if ($isDraft) {
            $data['is_draft'] = true;
            $data['published_at'] = null;
        } else {
            $data['is_draft'] = false;
            if (array_key_exists('published_at', $data) && ! empty($data['published_at'])) {
                $data['published_at'] = \Carbon\Carbon::parse($data['published_at']);
            } else {
                $data['published_at'] = now();
            }
        }

        $data['user_id'] = auth()->id();

        $post = Post::create($data);
        $post->load('author');

        return redirect()->route('posts.show', $post)->with('success', 'Post created');
    }

    public function show(Post $post)
    {
        $isOwner = auth()->id() === $post->user_id;

        $isPublic = ! $post->is_draft && ($post->published_at && $post->published_at <= now());

        if (! $isOwner && ! $isPublic) {
            abort(404);
        }

        $post->load('author');

        if (request()->wantsJson()) {
            return response()->json($post);
        }

        return inertia('posts/show', ['post' => $post]);
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
