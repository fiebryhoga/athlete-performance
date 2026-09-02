<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (!Schema::hasColumn('individual_trainings', 'signature_photo')) {
            Schema::table('individual_trainings', function (Blueprint $table) {
                $table->string('signature_photo')->nullable()->after('proof_photo');
                $table->timestamp('signed_at')->nullable()->after('signature_photo');
            });
        }

        Schema::table('group_trainings', function (Blueprint $table) {
            if (!Schema::hasColumn('group_trainings', 'proof_photo')) {
                $table->string('proof_photo')->nullable()->after('location');
            }
            if (!Schema::hasColumn('group_trainings', 'signature_photo')) {
                $table->string('signature_photo')->nullable()->after('proof_photo');
            }
            if (!Schema::hasColumn('group_trainings', 'signer_id')) {
                $table->foreignId('signer_id')->nullable()->after('signature_photo')->constrained('users')->nullOnDelete();
            }
            if (!Schema::hasColumn('group_trainings', 'signer_name')) {
                $table->string('signer_name')->nullable()->after('signer_id');
            }
            if (!Schema::hasColumn('group_trainings', 'signed_at')) {
                $table->timestamp('signed_at')->nullable()->after('signer_name');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('individual_trainings', 'signature_photo')) {
            Schema::table('individual_trainings', function (Blueprint $table) {
                $table->dropColumn(['signature_photo', 'signed_at']);
            });
        }

        Schema::table('group_trainings', function (Blueprint $table) {
            if (Schema::hasColumn('group_trainings', 'signer_id')) {
                $table->dropForeign(['signer_id']);
            }
            $table->dropColumn(array_filter([
                Schema::hasColumn('group_trainings', 'proof_photo') ? 'proof_photo' : null,
                Schema::hasColumn('group_trainings', 'signature_photo') ? 'signature_photo' : null,
                Schema::hasColumn('group_trainings', 'signer_id') ? 'signer_id' : null,
                Schema::hasColumn('group_trainings', 'signer_name') ? 'signer_name' : null,
                Schema::hasColumn('group_trainings', 'signed_at') ? 'signed_at' : null,
            ]));
        });
    }
};
