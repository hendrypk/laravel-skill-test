<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PostCreateTest extends TestCase
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
     * Test that guest users cannot access the create post route.
     */
    public function test_guest_cannot_access_posts_create(): void
    {
        $response = $this->get(route('posts.create'));

        $response->assertRedirect('/login');
    }

    /**
     * Test that authenticated users receive the correct string.
     */
    public function test_authenticated_user_can_access_posts_create(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get(route('posts.create'));

        $response->assertStatus(200);
        $response->assertSee('posts.create');
    }
}
