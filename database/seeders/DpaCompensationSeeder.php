<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\DpaCompensation;

class DpaCompensationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
                'category' => 'Anterior View',
                'name' => 'Feet - Turns Out',
                'overactive_muscles' => "Soleus\nLat. Gastrocnemius\nBiceps Femoris (short head)\nTensor Fascia Latae (TFL)",
                'underactive_muscles' => "Med. Gastrocnemius\nMed. Hamstring\nGluteus Medius/Maximus\nGracilis\nPopliteus\nSartorius",
                'possible_injuries' => "Plantar fasciitis\nAchilles tendinopathy\nMedial tibial stress syndrome\nAnkle sprains\nPatellar tendinopathy (jumper's knee)",
                'exercises_smr' => "Lateral gastrocnemius and peroneals\nBiceps femoris (short head)",
                'exercises_stretching' => "Gastrocnemius/soleus\nBiceps femoris (short head)",
                'exercises_isometrics' => "Posterior tibialis\nAnterior tibialis\nMedial hamstrings",
                'exercises_integrated' => "Step-up to balance\nSingle-leg balance reach",
            ],
            [
                'category' => 'Anterior View',
                'name' => 'Feet - Flatten',
                'overactive_muscles' => "Peroneal Complex\nLat. Gastrocnemius\nBiceps Femoris\nTFL",
                'underactive_muscles' => "Anterior Tibialis\nPosterior Tibialis\nMed. Gastrocnemius\nGluteus Medius",
                'possible_injuries' => "Plantar fasciitis\nAchilles tendinopathy\nMedial tibial stress syndrome\nAnkle sprains\nPatellar tendinopathy (jumper's knee)",
                'exercises_smr' => "Lateral gastrocnemius and peroneals\nBiceps femoris (short head)",
                'exercises_stretching' => "Gastrocnemius/soleus\nBiceps femoris (short head)",
                'exercises_isometrics' => "Posterior tibialis\nAnterior tibialis\nMedial hamstrings",
                'exercises_integrated' => "Step-up to balance\nSingle-leg balance reach",
            ],
            [
                'category' => 'Anterior View',
                'name' => 'Knees - Move Inward (Valgus)',
                'overactive_muscles' => "Adductor Complex\nBiceps Femoris (short head)\nTFL\nLat Gastrocnemius\nVastus Lateralis",
                'underactive_muscles' => "Med. Hamstring\nMed. Gastrocnemius\nGluteus Medius/Maximus\nVastus Medialis Oblique (VMO)\nAnterior Tibialis\nPosterior Tibialis",
                'possible_injuries' => "Patellar tendinopathy (jumpers knee)\nPatellofemoral Syndrome\nACL Injury\nIT band tendonitis",
                'exercises_smr' => "Gastrocnemius/soleus, adductors, TFL/IT-band, biceps femoris (short head)\nPiriformis (knee moves out during overhead squat)",
                'exercises_stretching' => "Gastrocnemius/soleus, adductors, TFL, biceps femoris\nPiriformis (knee moves out during overhand squat)",
                'exercises_isometrics' => "Anterior/posterior tibialis, gluteus medius, gluteus maximus\nAdductors and medial hamstring complex (knee moves out during overhead squat)",
                'exercises_integrated' => "Jumping progression\nFunctional movement progression: Ball squats, Step-ups, Lunges, Single-leg squat",
            ],
            [
                'category' => 'Anterior View',
                'name' => 'Knees - Move Outward',
                'overactive_muscles' => "Piriformis\nBiceps Femoris\nTFL/Gluteus Minimus",
                'underactive_muscles' => "Adductors Complex\nMed. Hamstring\nGluteus Maximus",
                'possible_injuries' => "Patellar tendinopathy (jumpers knee)\nPatellofemoral Syndrome\nACL Injury\nIT band tendonitis",
                'exercises_smr' => "Gastrocnemius/soleus, adductors, TFL/IT-band, biceps femoris (short head)\nPiriformis (knee moves out during overhead squat)",
                'exercises_stretching' => "Gastrocnemius/soleus, adductors, TFL, biceps femoris\nPiriformis (knee moves out during overhand squat)",
                'exercises_isometrics' => "Anterior/posterior tibialis, gluteus medius, gluteus maximus\nAdductors and medial hamstring complex (knee moves out during overhead squat)",
                'exercises_integrated' => "Jumping progression\nFunctional movement progression: Ball squats, Step-ups, Lunges, Single-leg squat",
            ],
            [
                'category' => 'Lateral View',
                'name' => 'LPHC - Excessive Forward Lean',
                'overactive_muscles' => "Soleus\nGastrocnemius\nHip Flexor Complex\nPiriformis\nAbdominal Complex (rectus abdominus, external oblique)",
                'underactive_muscles' => "Anterior Tibialis\nGluteus Maximus\nErector Spinae\nIntrinsic Core Stabilizers (transverse abdominis, multifidus, transversospinalis, internal oblique, pelvic floor muscles)",
                'possible_injuries' => "Hamstring, quad & groin strain\nLow back pain",
                'exercises_smr' => "Gastrocnemius/soleus\nHip flexor complex",
                'exercises_stretching' => "Gastrocnemius/soleus\nHip flexor complex\nAbdominal complex",
                'exercises_isometrics' => "Anterior tibialis\nGluteus maximus\nErector spinae\nCore stabilizers",
                'exercises_integrated' => "Ball wall squat with overhead press",
            ],
            [
                'category' => 'Lateral View',
                'name' => 'LPHC - Low Back Arches',
                'overactive_muscles' => "Hip Flexor Complex\nErector Spinae\nLatissimus Dorsi",
                'underactive_muscles' => "Gluteus Maximus\nHamstrings\nIntrinsic Core Stabilizers",
                'possible_injuries' => "Hamstring, quad & groin strain\nLow back pain",
                'exercises_smr' => "Hip flexor complex\nLatissimus dorsi",
                'exercises_stretching' => "Hip flexor complex\nLatissimus dorsi\nErector spinae",
                'exercises_isometrics' => "Gluteus maximus\nAbdominal complex/intrinsic core stabilizers",
                'exercises_integrated' => "Ball wall squat with overhead press",
            ],
            [
                'category' => 'Lateral View',
                'name' => 'LPHC - Low Back Rounds',
                'overactive_muscles' => "Hamstrings\nAdductor Magnus\nRectus Abdominis\nExternal Obliques",
                'underactive_muscles' => "Gluteus Maximus\nErector Spinae\nIntrinsic Core Stabilizers\nHip Flexor Complex\nLatissimus Dorsi",
                'possible_injuries' => "Hamstring, quad & groin strain\nLow back pain",
                'exercises_smr' => "Hamstring complex\nAdductor magnus",
                'exercises_stretching' => "Hamstring complex\nAdductor magnus",
                'exercises_isometrics' => "Hamstring complex\nAdductor magnus",
                'exercises_integrated' => "Ball wall squat with overhead press",
            ],
            [
                'category' => 'Lateral View',
                'name' => 'Shoulders - Arms Fall Forward',
                'overactive_muscles' => "Latissimus Dorsi\nPectoralis Major/Minor\nCoracobrachialis\nTeres Major",
                'underactive_muscles' => "Mid/Lower Trapezius\nRhomboids\nPosterior Deltoid\nRotator Cuff",
                'possible_injuries' => "Headaches\nBiceps tendonitis\nShoulder injuries",
                'exercises_smr' => "Latissimus dorsi\nThoracic spine",
                'exercises_stretching' => "Latissimus dorsi\nPectoralis major",
                'exercises_isometrics' => "Rotator cuff\nMiddle and lower trapezius",
                'exercises_integrated' => "Squat to row",
            ],
            [
                'category' => 'Posterior View',
                'name' => 'Foot - Foot Flattens',
                'overactive_muscles' => "Peroneal Complex\nLat. Gastrocnemius\nBiceps Femoris (short head)\nTFL",
                'underactive_muscles' => "Anterior Tibialis\nPosterior Tibialis\nMed. Gastrocnemius\nGluteus Medius",
                'possible_injuries' => "Plantar fascitis\nAchilles tendinopathy\nMedial tibial stress syndrome\nAnkle sprains\nPatellar Tendinopathy (jumper’s knee)",
                'exercises_smr' => "Lateral gastrocnemius and peroneals\nBiceps femoris (short head)",
                'exercises_stretching' => "Gastrocnemius/soleus\nBiceps femoris (short head)",
                'exercises_isometrics' => "Posterior tibialis\nAnterior tibialis\nMedial hamstrings",
                'exercises_integrated' => "Step-up to balance\nSingle-leg balance reach",
            ],
            [
                'category' => 'Posterior View',
                'name' => 'Foot - Heel of Foot Rises',
                'overactive_muscles' => "Soleus",
                'underactive_muscles' => "Anterior Tibialis",
                'possible_injuries' => "Plantar fascitis\nAchilles tendinopathy\nMedial tibial stress syndrome\nAnkle sprains\nPatellar Tendinopathy (jumper’s knee)",
                'exercises_smr' => "Gastrocnemius/soleus\nBiceps femoris (short head)",
                'exercises_stretching' => null,
                'exercises_isometrics' => null,
                'exercises_integrated' => null,
            ],
            [
                'category' => 'Posterior View',
                'name' => 'LPHC - Asymmetrical Weight Shift',
                'overactive_muscles' => "Adductor Complex\nTFL (same side of shift)\nGastrocnemius/soleus\nPiriformis\nBicep Femoris\nGluteus Medius (opposite side of shift)",
                'underactive_muscles' => "Gluteus Medius (same side of shift)\nAnterior Tibialis\nAdductor Complex (opposite side of shift)",
                'possible_injuries' => "Hamstring, Quad & Groin strain\nLow back pain\nSI joint pain",
                'exercises_smr' => "Adductors and TFL/IT-band (same side)\nPiriformis, bicep femoris and gastrocnemius/soleus (opposite side)",
                'exercises_stretching' => "Adductors and TFL (same side)\nPiriformis, gastrocnemius/soleus and biceps femoris (opposite side)",
                'exercises_isometrics' => "Gluteus medius (same side)\nAdductors (opposite side)",
                'exercises_integrated' => "Ball wall squat to overhead press",
            ],
            [
                'category' => 'Single Leg',
                'name' => 'Knee - Move Inward (Valgus)',
                'overactive_muscles' => "Adductor Complex\nBicep Femoris (short head)\nTFL\nLat. Gastrocnemius\nVastus Lateralis",
                'underactive_muscles' => "Med. Hamstring\nMed. Gastrocnemius\nGluteus Medius/Maximus\nVMO",
                'possible_injuries' => null,
                'exercises_smr' => "Gastrocnemius/soleus, adductors, TFL/IT-band, biceps femoris (short head)\nPiriformis (knee moves out during overhead squat)",
                'exercises_stretching' => "Gastrocnemius/soleus, adductors, TFL, biceps femoris\nPiriformis (knee moves out during overhand squat)",
                'exercises_isometrics' => "Anterior/posterior tibialis, gluteus medius, gluteus maximus\nAdductors and medial hamstring complex (knee moves out during overhead squat)",
                'exercises_integrated' => "Jumping progression\nFunctional movement progression: Ball squats, Step-ups, Lunges, Single-leg squat",
            ],
            [
                'category' => 'Single Leg',
                'name' => 'LPHC - Hip Hike',
                'overactive_muscles' => "Quadratus Lumborum (opposite side of stance leg)\nTFL/Gluteus Minimus (same side as stance leg)",
                'underactive_muscles' => "Adductor Complex (same side as stance leg)\nGluteus Medius (same side)",
                'possible_injuries' => null,
                'exercises_smr' => null,
                'exercises_stretching' => null,
                'exercises_isometrics' => null,
                'exercises_integrated' => null,
            ],
            [
                'category' => 'Single Leg',
                'name' => 'LPHC - Hip Drop',
                'overactive_muscles' => "Adductor Complex (same side as stance leg)",
                'underactive_muscles' => "Gluteus Medius (same side as stance leg)\nQuadratrus Lumborum (same side as stance leg)",
                'possible_injuries' => null,
                'exercises_smr' => null,
                'exercises_stretching' => null,
                'exercises_isometrics' => null,
                'exercises_integrated' => null,
            ],
            [
                'category' => 'Single Leg',
                'name' => 'Upper Body - Inward Trunk Rotation',
                'overactive_muscles' => "Internal Oblique (same side as stance leg)\nExternal Oblique (opposite side of stance leg)\nTFL (same side)\nAdductor complex (same side as stance leg)",
                'underactive_muscles' => "Internal Oblique (opposite side of stance leg)\nExternal Oblique (same side as stance leg)\nGluteus Medius/Maximus",
                'possible_injuries' => null,
                'exercises_smr' => null,
                'exercises_stretching' => null,
                'exercises_isometrics' => null,
                'exercises_integrated' => null,
            ],
            [
                'category' => 'Single Leg',
                'name' => 'Upper Body - Outward Trunk Rotation',
                'overactive_muscles' => "Internal Oblique (opposite side of stance leg)\nExternal Oblique (same side as stance leg)\nPiriformis (same side as stance leg)",
                'underactive_muscles' => "Internal Oblique (same side)\nExternal Oblique (opposite side of stance leg)\nAdductor Complex (opposite side of stance leg)\nGluteus Medius/Maximus",
                'possible_injuries' => null,
                'exercises_smr' => null,
                'exercises_stretching' => null,
                'exercises_isometrics' => null,
                'exercises_integrated' => null,
            ]
        ];

        foreach ($data as $item) {
            DpaCompensation::updateOrCreate(
                ['category' => $item['category'], 'name' => $item['name']],
                $item
            );
        }
    }
}
