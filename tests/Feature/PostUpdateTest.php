<?php

namespace Tests\Feature;

use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PostUpdateTest extends TestCase
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
     * Test author can update their own post.
     */
    public function test_author_can_update_post(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->create(['user_id' => $user->id, 'title' => 'Old Title']);

        $response = $this->actingAs($user)->putJson(route('posts.update', $post), [
            'title' => 'Updated Title',
            'content' => 'Updated Content',
            'is_draft' => false,
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('posts', [
            'id' => $post->id,
            'title' => 'Updated Title',
        ]);
    }

    /**
     * Test other users cannot update someone else's post.
     */
    public function test_other_user_cannot_update_post(): void
    {
        $author = User::factory()->create();
        $stranger = User::factory()->create();
        $post = Post::factory()->create(['user_id' => $author->id]);

        $response = $this->actingAs($stranger)->putJson(route('posts.update', $post), [
            'title' => 'Hacked Title',
        ]);

        $response->assertStatus(403);
        $this->assertDatabaseMissing('posts', ['title' => 'Hacked Title']);
    }

    /**
     * Test validation fails during update.
     */
    public function test_update_validation_fails_if_invalid_data(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->putJson(route('posts.update', $post), [
            'title' => '',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['title']);
    }
}
