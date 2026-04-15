<?php

namespace Tests\Feature;

use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PostDestroyTest extends TestCase
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
     * Test author can delete their own post.
     */
    public function test_author_can_delete_post(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->deleteJson(route('posts.destroy', $post));

        $response->assertStatus(204);
        $this->assertDatabaseMissing('posts', ['id' => $post->id]);
    }

    /**
     * Test other users cannot delete someone else's post.
     */
    public function test_other_user_cannot_delete_post(): void
    {
        $author = User::factory()->create();
        $stranger = User::factory()->create();
        $post = Post::factory()->create(['user_id' => $author->id]);

        $response = $this->actingAs($stranger)->deleteJson(route('posts.destroy', $post));

        $response->assertStatus(403); // Forbidden
        $this->assertDatabaseHas('posts', ['id' => $post->id]);
    }

    /**
     * Test guest cannot delete any post.
     */
    public function test_guest_cannot_delete_post(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->create(['user_id' => $user->id]);

        $response = $this->deleteJson(route('posts.destroy', $post));

        $response->assertStatus(401); // Unauthorized
    }
}
