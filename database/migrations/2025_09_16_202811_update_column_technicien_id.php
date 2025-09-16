<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {

    public function up(): void
    {
        try {
            DB::statement('ALTER TABLE rapport_maintenances DROP CONSTRAINT IF EXISTS rapport_maintenances_technicienid_foreign');
        } catch (\Exception $e) {
        }

        DB::statement('ALTER TABLE rapport_maintenances RENAME COLUMN "technicienId" TO "userId"');

        DB::statement('ALTER TABLE rapport_maintenances ALTER COLUMN "userId" DROP NOT NULL');

        DB::statement('UPDATE rapport_maintenances SET "userId" = NULL WHERE "userId" = 0');

        DB::statement('
            UPDATE rapport_maintenances
            SET "userId" = NULL
            WHERE "userId" IS NOT NULL
            AND "userId" NOT IN (SELECT id FROM users WHERE id IS NOT NULL)
        ');

        DB::statement('
            ALTER TABLE rapport_maintenances
            ADD CONSTRAINT rapport_maintenances_userid_foreign
            FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE SET NULL
        ');
    }

    public function down(): void
    {
        try {
            DB::statement('ALTER TABLE rapport_maintenances DROP CONSTRAINT IF EXISTS rapport_maintenances_userid_foreign');
        } catch (\Exception $e) {
        }
        DB::statement('ALTER TABLE rapport_maintenances RENAME COLUMN "userId" TO "technicienId"');

        $technicienTableExists = Schema::hasTable('techniciens');
        if ($technicienTableExists) {
            try {
                DB::statement('
                    ALTER TABLE rapport_maintenances
                    ADD CONSTRAINT rapport_maintenances_technicienid_foreign
                    FOREIGN KEY ("technicienId") REFERENCES techniciens(id) ON DELETE SET NULL
                ');
            } catch (\Exception $e) {
            }
        }
    }
};
