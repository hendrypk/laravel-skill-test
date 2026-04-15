<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PostStoreTest extends TestCase
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
     * Test guest cannot store a post.
     */
    public function test_guest_cannot_store_post(): void
    {
        $response = $this->postJson(route('posts.store'), [
            'title' => 'New Post',
            'content' => 'Content here',
            'is_draft' => false,
        ]);

        $response->assertStatus(401);
    }

    /**
     * Test authenticated user can store post with valid data.
     */
    public function test_authenticated_user_can_store_post(): void
    {
        $user = User::factory()->create();

        $data = [
            'title' => 'Inovasi Manufaktur 2026',
            'content' => 'Detail sistem ERP Nih...',
            'is_draft' => false,
            'published_at' => now()->toDateTimeString(),
        ];

        $response = $this->actingAs($user)
            ->postJson(route('posts.store'), $data);

        $response->assertStatus(201);

        $this->assertDatabaseHas('posts', [
            'title' => 'Inovasi Manufaktur 2026',
            'user_id' => $user->id,
        ]);
    }

    /**
     * Test validation works for store request.
     */
    public function test_store_validation_fails_if_data_missing(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson(route('posts.store'), []);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['title', 'content', 'is_draft']);
    }
}
