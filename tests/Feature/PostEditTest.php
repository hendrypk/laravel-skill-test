<?php

namespace Tests\Feature;

use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PostEditTest extends TestCase
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
     * Test author can access their own edit page.
     */
    public function test_author_can_access_edit_page(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->get(route('posts.edit', $post));

        $response->assertStatus(200);
        $response->assertSee('posts.edit');
    }

    /**
     * Test other users cannot access someone else's edit page.
     */
    public function test_other_user_cannot_access_edit_page(): void
    {
        $author = User::factory()->create();
        $stranger = User::factory()->create();
        $post = Post::factory()->create(['user_id' => $author->id]);

        $response = $this->actingAs($stranger)->get(route('posts.edit', $post));

        $response->assertStatus(403); // Forbidden
    }

    /**
     * Test guest cannot access edit page.
     */
    public function test_guest_cannot_access_edit_page(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->create(['user_id' => $user->id]);

        $response = $this->get(route('posts.edit', $post));

        $response->assertRedirect('/login');
    }
}
