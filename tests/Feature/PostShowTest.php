<?php

namespace Tests\Feature;

use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PostShowTest extends TestCase
{
    use RefreshDatabase;

    /**
     * A basic feature test example.
     */
    public function test_example(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }

    /**
     * Test can view an active published post.
     */
    public function test_can_view_active_post(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->create([
            'user_id' => $user->id,
            'is_draft' => false,
            'published_at' => now()->subDay(),
        ]);

        $response = $this->getJson(route('posts.show', $post));

        $response->assertStatus(200)
            ->assertJsonPath('data.title', $post->title);
    }

    /**
     * Test cannot view a draft post (Returns 404).
     */
    public function test_cannot_view_draft_post(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->create([
            'user_id' => $user->id,
            'is_draft' => true,
        ]);

        $response = $this->getJson(route('posts.show', $post));

        $response->assertStatus(404);
    }

    /**
     * Test cannot view a scheduled post (Returns 404).
     */
    public function test_cannot_view_scheduled_post(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->create([
            'user_id' => $user->id,
            'is_draft' => false,
            'published_at' => now()->addDays(2),
        ]);

        $response = $this->getJson(route('posts.show', $post));

        $response->assertStatus(404);
    }
}
