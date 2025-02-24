<?php
namespace Database\Seeders;

use App\Models\UserRole;
use Illuminate\Database\Seeder;

class RoleUser extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            ['name' => 'admin', 'isAdmin' => true],
            ['name' => 'technicien', 'isAdmin' => false],
            ['name' => 'partenaire', 'isAdmin' => false],
        ];

        foreach ($roles as $role) {
            UserRole::create($role);
        }
    }
}
