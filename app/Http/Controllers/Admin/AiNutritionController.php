<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AiNutritionController extends Controller
{
    // Meal Templates (Local Database)
    private $breakfasts = [
        "Oatmeal & Telur Rebus",
        "Roti Gandum & Selai Kacang",
        "Smoothie Protein & Pisang",
        "Omelet Sayur & Roti Gandum",
        "Nasi Merah & Telur Mata Sapi"
    ];

    private $lunches = [
        "Nasi Merah & Dada Ayam Bakar",
        "Pasta Gandum & Daging Sapi Cincang",
        "Kentang Rebus & Ikan Nila Bakar",
        "Nasi Putih & Sate Ayam Tanpa Bumbu Kacang",
        "Salad Sayur & Tuna Kaleng"
    ];

    private $dinners = [
        "Salad Sayur & Dada Ayam Rebus",
        "Nasi Putih Sedikit & Ikan Salmon",
        "Ubi Jalar & Tempe Tahu Bakar",
        "Sup Sayur Bening & Fillet Ikan",
        "Quinoa & Daging Sapi Tumis Kecap"
    ];

    private $snacks = [
        "Buah Apel",
        "Kacang Almond",
        "Yogurt Greek",
        "Whey Protein Shake",
        "Pisang & Selai Kacang",
        "Protein Bar",
        "Edamame Rebus"
    ];

    public function analyze(Request $request)
    {
        $request->validate([
            'composition_data' => 'required|array',
            'goal' => 'nullable|string',
            'start_date' => 'nullable|date',
            'daily_splits' => 'nullable|array',
        ]);

        $data = $request->input('composition_data');
        $goal = $request->input('goal', 'maintenance');
        $startDate = $request->input('start_date');
        $dailySplits = $request->input('daily_splits');

        try {
            $generatedData = $this->generateLocalPlan($data, $goal, $startDate, $dailySplits);

            return response()->json([
                'success' => true,
                'data' => $generatedData,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal membuat rencana makan secara lokal: ' . $e->getMessage(),
            ], 500);
        }
    }

    private function generateLocalPlan(array $data, string $goal, ?string $startDate, ?array $dailySplits)
    {
        $tdee = (float) ($data['tdee'] ?? 2000);
        
        // Target Kalori
        if ($goal === 'cutting') {
            $targetCals = $tdee - 500;
            $overall = "Berdasarkan data komposisi tubuh, atlet direkomendasikan untuk melakukan defisit kalori guna mengurangi persentase lemak tubuh tanpa mengorbankan massa otot.";
        } elseif ($goal === 'bulking') {
            $targetCals = $tdee + 500;
            $overall = "Atlet disarankan untuk melakukan surplus kalori (bulking) demi mendukung pembentukan massa otot baru dan pemulihan optimal setelah latihan intens.";
        } else {
            $targetCals = $tdee;
            $overall = "Rencana makan difokuskan pada pemeliharaan (maintenance) untuk menjaga komposisi tubuh saat ini dan memastikan ketersediaan energi harian.";
        }

        $targetCals = max(1200, round($targetCals)); // minimal 1200 kalori
        $weight = (float) ($data['weight'] ?? 70);

        // Jika start_date atau dailySplits kosong, buat default 7 hari
        if (!$dailySplits || count($dailySplits) === 0) {
            $dailySplits = [];
            for ($i = 0; $i < 7; $i++) {
                $dailySplits[] = [
                    'label' => 'Hari ' . ($i + 1),
                    'split' => 'Moderate Carb'
                ];
            }
        }

        $weeklyPlan = [];

        foreach ($dailySplits as $split) {
            $splitType = $split['split'] ?? 'Moderate Carb';
            $ratios = $this->getMacrosRatio($splitType);

            // Hitung target makronutrisi harian dalam gram
            $dayProtein = round(($targetCals * $ratios['p']) / 4);
            $dayFats = round(($targetCals * $ratios['f']) / 9);
            $dayCarbs = round(($targetCals * $ratios['c']) / 4);

            $meals = [
                $this->createMeal("07:00", "Breakfast", $this->getRandom($this->breakfasts), 0.25, $targetCals, $dayProtein, $dayCarbs, $dayFats),
                $this->createMeal("10:00", "Snack", $this->getRandom($this->snacks), 0.10, $targetCals, $dayProtein, $dayCarbs, $dayFats),
                $this->createMeal("13:00", "Lunch", $this->getRandom($this->lunches), 0.30, $targetCals, $dayProtein, $dayCarbs, $dayFats),
                $this->createMeal("16:00", "Snack", $this->getRandom($this->snacks), 0.10, $targetCals, $dayProtein, $dayCarbs, $dayFats),
                $this->createMeal("19:30", "Dinner", $this->getRandom($this->dinners), 0.25, $targetCals, $dayProtein, $dayCarbs, $dayFats),
            ];

            $weeklyPlan[] = [
                "day" => $split['label'] ?? "Hari",
                "meals" => $meals
            ];
        }

        // Susun JSON response sesuai ekspektasi frontend
        return [
            "overall_assessment" => $overall,
            "recommendation" => $goal,
            "recommendation_reason" => "Dipilih berdasarkan pengaturan manual oleh pelatih/admin.",
            "confidence_level" => "high",
            "body_composition_analysis" => [
                "strengths" => ["Otomatis dikalkulasi dari data TDEE dan Berat Badan"],
                "concerns" => [],
                "risk_factors" => []
            ],
            "calorie_targets" => [
                $goal => [
                    "calories" => $targetCals,
                    "description" => "Target kalori utama untuk program $goal"
                ]
            ],
            // Ambil sample makro dari hari pertama (opsional, karena setiap hari bisa beda, tapi frontend baca ini untuk ringkasan)
            "macro_plan" => [
                "protein" => [
                    "grams" => round(($targetCals * 0.3) / 4), // Default ringkasan Moderate
                    "per_kg" => round((($targetCals * 0.3) / 4) / ($weight ?: 1), 1),
                    "reasoning" => "Penting untuk pemulihan dan sintesis protein otot."
                ],
                "fats" => [
                    "grams" => round(($targetCals * 0.35) / 9),
                    "pct" => 35,
                    "reasoning" => "Dibutuhkan untuk produksi hormon dan energi."
                ],
                "carbs" => [
                    "grams" => round(($targetCals * 0.35) / 4),
                    "pct" => 35,
                    "reasoning" => "Bahan bakar utama untuk intensitas tinggi."
                ]
            ],
            "weekly_meal_plan" => $weeklyPlan,
            "hydration" => [
                "daily_water_liters" => round($weight * 0.04, 1), // 40ml per kg
                "pre_training" => "500ml air 2 jam sebelum latihan.",
                "during_training" => "200ml setiap 15-20 menit selama latihan.",
                "post_training" => "Ganti 150% dari berat badan yang hilang dengan cairan."
            ],
            "supplements" => [
                [
                    "name" => "Whey Protein",
                    "dosage" => "1 scoop (25g protein)",
                    "timing" => "Segera setelah latihan",
                    "reason" => "Mempercepat pemulihan otot."
                ]
            ],
            "training_nutrition_tips" => [
                "Pastikan makan karbohidrat kompleks 2-3 jam sebelum latihan berat.",
                "Hindari lemak tinggi sebelum bertanding untuk mencegah masalah pencernaan."
            ],
            "weekly_goals" => [
                "Capai target kalori harian minimal 6 hari dalam seminggu.",
                "Tingkatkan konsumsi sayuran hijau di setiap makan utama."
            ],
            "warnings" => []
        ];
    }

    private function getMacrosRatio(string $splitType)
    {
        // format: [protein, fat, carb]
        switch (strtolower($splitType)) {
            case 'lower carb':
                return ['p' => 0.40, 'f' => 0.40, 'c' => 0.20]; // 40/40/20
            case 'higher carb':
                return ['p' => 0.30, 'f' => 0.20, 'c' => 0.50]; // 30/20/50
            case 'moderate carb':
            default:
                return ['p' => 0.30, 'f' => 0.35, 'c' => 0.35]; // 30/35/35
        }
    }

    private function getRandom(array $array)
    {
        return $array[array_rand($array)];
    }

    private function createMeal($time, $type, $menu, $percentage, $totalCals, $totalP, $totalC, $totalF)
    {
        return [
            "time" => $time,
            "type" => $type,
            "menu" => $menu . " (Porsi Disesuaikan)",
            "protein" => round($totalP * $percentage),
            "carbs" => round($totalC * $percentage),
            "fats" => round($totalF * $percentage),
            "calories" => round($totalCals * $percentage)
        ];
    }
}
