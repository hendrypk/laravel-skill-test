<?php

namespace App\Http\Controllers;

use App\Http\Resources\PostResource;
use App\Models\Post;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Inertia\Inertia;

class PostController extends Controller
{
    use AuthorizesRequests;

    /**
     * 4-1. Display a paginated list of active (published) posts
     */
    public function index()
    {
        $posts = Post::with('user')
            ->published()
            ->orderBy('published_at', 'desc')
            ->paginate(20);

        return Inertia::render('posts/index', [
            'posts' => [
                'data' => PostResource::collection($posts)->resolve(),
                'meta' => [
                    'current_page' => $posts->currentPage(),
                    'total' => $posts->total(),
                    'per_page' => $posts->perPage(),
                    'last_page' => $posts->lastPage(),
                    'links' => $posts->getUrlRange(1, $posts->lastPage()),
                ],
            ],
        ]);
    }

    /**
     * 4-2. Show the form for creating a new post
     */
    public function create()
    {
        return 'posts.create';
    }

    /**
     * 4-3. Store a newly created post in storage
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'is_draft' => 'required|boolean',
            'published_at' => 'nullable|date_format:Y-m-d H:i:s',
        ]);

        $post = auth()->user()->posts()->create($validated);

        return response()->json(
            new PostResource($post),
            Response::HTTP_CREATED
        );
    }

    /**
     * 4-4. Display a single active post
     */
    public function show(Post $post)
    {
        // Return 404 if post is draft or scheduled
        if (! $post->isPublished()) {
            abort(404);
        }

        $post->load('user');

        return response()->json([
            'data' => new PostResource($post),
        ]);
    }

    /**
     * 4-5. Show the form for editing the post
     */
    public function edit(Post $post)
    {
        $this->authorize('update', $post);

        return 'posts.edit';
    }

    /**
     * 4-6. Update the post in storage
     */
    public function update(Request $request, Post $post)
    {
        $this->authorize('update', $post);

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'content' => 'sometimes|required|string',
            'is_draft' => 'sometimes|required|boolean',
            'published_at' => 'nullable|date_format:Y-m-d H:i:s',
        ]);

        $post->update($validated);

        return response()->json([
            'data' => new PostResource($post->load('user')),
            'message' => 'Post updated successfully',
        ]);
    }

    /**
     * 4-7. Delete the post from storage
     */
    public function destroy(Post $post)
    {
        $this->authorize('update', $post); // Only author can delete

        $post->delete();

        return response()->json(
            ['message' => 'Post deleted successfully'],
            Response::HTTP_NO_CONTENT
        );
    }
}
