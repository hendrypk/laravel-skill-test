<?php

namespace Tests\Feature;

use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PostIndexTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that the index page displays active, published posts with pagination.
     */
    public function test_can_list_paginated_active_posts(): void
    {
        $user = User::factory()->create();

        Post::factory()->count(25)->create([
            'user_id' => $user->id,
            'is_draft' => false,
            'published_at' => now()->subMinutes(10),
        ]);

        Post::factory()->create([
            'user_id' => $user->id,
            'is_draft' => true,
            'published_at' => now()->subDay(),
        ]);

        Post::factory()->create([
            'user_id' => $user->id,
            'is_draft' => false,
            'published_at' => now()->addDay(),
        ]);

        $response = $this->get(route('posts.index'));

        $response->assertStatus(200);

        $response->assertInertia(fn (Assert $page) => $page
            ->component('posts/index')
            ->has('posts.data', 20)
            ->has('posts.meta')
            ->where('posts.data.0.is_draft', false)
            ->has('posts.data.0.user', fn (Assert $page) => $page
                ->has('id')
                ->has('name')
            )
        );
    }

    /**
     * Test that posts are ordered by the most recent publication date.
     */
    public function test_posts_are_ordered_by_published_at_descending(): void
    {
        $user = User::factory()->create();

        $oldPost = Post::factory()->create([
            'user_id' => $user->id,
            'title' => 'Old Post',
            'is_draft' => false,
            'published_at' => now()->subDays(2),
        ]);

        $newPost = Post::factory()->create([
            'user_id' => $user->id,
            'title' => 'New Post',
            'is_draft' => false,
            'published_at' => now()->subDay(),
        ]);

        $response = $this->get(route('posts.index'));

        $response->assertInertia(fn (Assert $page) => $page
            ->where('posts.data.0.title', 'New Post')
            ->where('posts.data.1.title', 'Old Post')
        );
    }

    /**
     * Test that draft posts are excluded from the index.
     */
    public function test_draft_posts_are_excluded(): void
    {
        $user = User::factory()->create();

        Post::factory()->create([
            'user_id' => $user->id,
            'is_draft' => true,
            'published_at' => now()->subDay(),
        ]);

        $response = $this->get(route('posts.index'));

        $response->assertInertia(fn (Assert $page) => $page
            ->where('posts.meta.total', 0)
        );
    }

    /**
     * Test that scheduled posts (future published_at) are excluded.
     */
    public function test_scheduled_posts_are_excluded(): void
    {
        $user = User::factory()->create();

        Post::factory()->create([
            'user_id' => $user->id,
            'is_draft' => false,
            'published_at' => now()->addDays(5),
        ]);

        $response = $this->get(route('posts.index'));

        $response->assertInertia(fn (Assert $page) => $page
            ->where('posts.meta.total', 0)
        );
    }

    /**
     * Test pagination works correctly with 20 posts per page.
     */
    public function test_pagination_shows_20_per_page(): void
    {
        $user = User::factory()->create();

        Post::factory()->count(45)->create([
            'user_id' => $user->id,
            'is_draft' => false,
            'published_at' => now()->subMinutes(10),
        ]);

        $response = $this->get(route('posts.index'));

        $response->assertInertia(fn (Assert $page) => $page
            ->has('posts.data', 20)
            ->where('posts.meta.per_page', 20)
            ->where('posts.meta.total', 45)
            ->where('posts.meta.last_page', 3)
        );
    }
}
