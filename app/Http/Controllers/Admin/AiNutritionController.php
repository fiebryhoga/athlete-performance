<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AiNutritionController extends Controller
{
    public function analyze(Request $request)
    {
        $request->validate([
            'composition_data' => 'required|array',
        ]);

        $data = $request->input('composition_data');
        $apiKey = config('services.gemini.api_key');

        if (!$apiKey) {
            return response()->json([
                'success' => false,
                'message' => 'Gemini API key is not configured.',
            ], 500);
        }

        $prompt = $this->buildPrompt($data);

        $models = [
            'gemini-2.0-flash',
            'gemini-2.0-flash-lite',
        ];

        try {
            $response = null;
            $lastError = null;

            foreach ($models as $model) {
                for ($attempt = 1; $attempt <= 3; $attempt++) {
                    $response = Http::timeout(60)->post(
                        "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$apiKey}",
                        [
                            'contents' => [
                                [
                                    'parts' => [
                                        ['text' => $prompt]
                                    ]
                                ]
                            ],
                            'generationConfig' => [
                                'temperature' => 0.7,
                                'topP' => 0.9,
                                'maxOutputTokens' => 8192,
                                'responseMimeType' => 'application/json',
                            ],
                        ]
                    );

                    if ($response->successful()) {
                        break 2; // Success — exit both loops
                    }

                    $lastError = "Model {$model} attempt {$attempt}: HTTP {$response->status()}";
                    Log::warning("Gemini API retry", ['error' => $lastError, 'body' => substr($response->body(), 0, 500)]);

                    if ($response->status() === 429) {
                        // Rate limited — wait before retry
                        sleep($attempt * 2); // 2s, 4s, 6s
                    } else {
                        break; // Non-429 error — try next model
                    }
                }
            }

            if (!$response || !$response->successful()) {
                return response()->json([
                    'success' => false,
                    'message' => 'AI service unavailable. ' . ($lastError ?? 'Please try again in a moment.'),
                ], 500);
            }

            $result = $response->json();
            $text = $result['candidates'][0]['content']['parts'][0]['text'] ?? null;

            if (!$text) {
                return response()->json([
                    'success' => false,
                    'message' => 'Empty response from AI.',
                ], 500);
            }

            $aiData = json_decode($text, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                // Try to extract JSON from the response
                preg_match('/\{[\s\S]*\}/', $text, $matches);
                if (!empty($matches[0])) {
                    $aiData = json_decode($matches[0], true);
                }
                
                if (json_last_error() !== JSON_ERROR_NONE) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Failed to parse AI response.',
                        'raw' => $text,
                    ], 500);
                }
            }

            return response()->json([
                'success' => true,
                'data' => $aiData,
            ]);
        } catch (\Exception $e) {
            Log::error('Gemini API exception', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'AI service error: ' . $e->getMessage(),
            ], 500);
        }
    }

    private function buildPrompt(array $data): string
    {
        $name = $data['name'] ?? 'Athlete';
        $gender = $data['gender'] ?? 'male';
        $age = $data['age'] ?? 0;
        $weight = $data['weight'] ?? 0;
        $height = $data['height'] ?? 0;
        $bmi = $data['bmi'] ?? 0;
        $bodyFat = $data['body_fat_percentage'] ?? 0;
        $muscleMass = $data['muscle_mass'] ?? 0;
        $skeletalMuscle = $data['skeletal_muscle_mass'] ?? 0;
        $boneMass = $data['bone_mass'] ?? 0;
        $visceralFat = $data['visceral_fat'] ?? 0;
        $totalBodyWater = $data['total_body_water'] ?? 0;
        $phaseAngle = $data['phase_angle'] ?? 0;
        $metabolicAge = $data['metabolic_age'] ?? 0;
        $bmr = $data['bmr'] ?? 0;
        $tdee = $data['tdee'] ?? 0;
        $activityLevel = $data['activity_level'] ?? 0;

        return <<<PROMPT
You are an expert sports nutritionist and exercise physiologist AI assistant. Analyze the following athlete's body composition data and provide a comprehensive, personalized nutrition recommendation.

## ATHLETE DATA:
- Name: {$name}
- Gender: {$gender}
- Age: {$age} years
- Weight: {$weight} kg
- Height: {$height} cm
- BMI: {$bmi}
- Body Fat Percentage: {$bodyFat}%
- Muscle Mass: {$muscleMass} kg
- Skeletal Muscle Mass: {$skeletalMuscle} kg
- Bone Mass: {$boneMass} kg
- Visceral Fat Level: {$visceralFat}
- Total Body Water: {$totalBodyWater}%
- Phase Angle: {$phaseAngle}°
- Metabolic Age: {$metabolicAge} years
- BMR: {$bmr} kcal/day
- TDEE: {$tdee} kcal/day
- Activity Level Multiplier: {$activityLevel}

## INSTRUCTIONS:
Provide your analysis in the following JSON structure. Be very specific and personalized. Use actual numbers from the data. Make all recommendations data-driven and actionable.

{
  "overall_assessment": "A 2-3 sentence overall assessment of the athlete's current body composition status.",
  "recommendation": "cutting" | "maintenance" | "bulking",
  "recommendation_reason": "Detailed explanation of why this recommendation (2-3 sentences).",
  "confidence_level": "high" | "medium" | "low",
  "body_composition_analysis": {
    "strengths": ["List 2-3 specific strengths based on the data"],
    "concerns": ["List 2-3 specific concerns or areas for improvement"],
    "risk_factors": ["List any health risk factors, or empty array if none"]
  },
  "calorie_targets": {
    "deficit": { "calories": number, "description": "Brief description" },
    "maintenance": { "calories": number, "description": "Brief description" },
    "surplus": { "calories": number, "description": "Brief description" }
  },
  "macro_plan": {
    "protein": { "grams": number, "per_kg": number, "reasoning": "Why this amount" },
    "fats": { "grams": number, "pct": number, "reasoning": "Why this amount" },
    "carbs": { "grams": number, "pct": number, "reasoning": "Why this amount" }
  },
  "weekly_meal_plan": [
    {
      "day": "Monday",
      "meals": [
        { "time": "07:00", "type": "Breakfast", "menu": "Specific meal name", "protein": number, "carbs": number, "fats": number, "calories": number },
        { "time": "10:00", "type": "Snack", "menu": "Specific snack name", "protein": number, "carbs": number, "fats": number, "calories": number },
        { "time": "13:00", "type": "Lunch", "menu": "Specific meal name", "protein": number, "carbs": number, "fats": number, "calories": number },
        { "time": "16:00", "type": "Snack", "menu": "Specific snack name", "protein": number, "carbs": number, "fats": number, "calories": number },
        { "time": "19:30", "type": "Dinner", "menu": "Specific meal name", "protein": number, "carbs": number, "fats": number, "calories": number }
      ]
    }
  ],
  "hydration": {
    "daily_water_liters": number,
    "pre_training": "Specific hydration advice",
    "during_training": "Specific hydration advice",
    "post_training": "Specific hydration advice"
  },
  "supplements": [
    { "name": "Supplement name", "dosage": "Specific dosage", "timing": "When to take", "reason": "Why recommended" }
  ],
  "training_nutrition_tips": [
    "Specific tip 1 related to training and nutrition timing",
    "Specific tip 2",
    "Specific tip 3"
  ],
  "weekly_goals": [
    "Specific measurable goal 1 for this week",
    "Specific measurable goal 2",
    "Specific measurable goal 3"
  ],
  "warnings": ["Any important warnings or contraindications based on the data"]
}

IMPORTANT: 
- Generate exactly 7 days of meal plans (Monday through Sunday).
- Make meal suggestions realistic and varied (mix Asian, Western, Mediterranean cuisines).
- All macros in the meal plan should approximately sum up to the daily target.
- Base protein recommendation on g/kg bodyweight (1.6-2.2g/kg for athletes).
- Respond ONLY with valid JSON, no markdown or extra text.
PROMPT;
    }
}
