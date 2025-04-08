<?php
namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Run the RoleUser seeder first
        $this->call([
            RoleUser::class
        ]);

        // Then create the admin user
        User::factory()->create([
            'name'      => 'Admin',
            'email'     => 'admin@example.com',
            'user_role' => 1,
        ]);
    }
}
