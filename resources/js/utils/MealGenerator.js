import { RECIPES, getRecipesBySlot } from "@/Data/AthleticMealRecipes";

/* ═══════════════════════════════════════════════════════════
   MEAL SLOTS CONFIGURATION
   ═══════════════════════════════════════════════════════════ */
export const MEAL_SLOTS = [
    { time: "07:00", type: "Sarapan", pct: 0.25, gen: "breakfast" },
    { time: "10:00", type: "Camilan Pagi", pct: 0.10, gen: "snack" },
    { time: "13:00", type: "Makan Siang", pct: 0.30, gen: "lunch" },
    { time: "16:00", type: "Camilan Sore", pct: 0.10, gen: "snack" },
    { time: "19:30", type: "Makan Malam", pct: 0.25, gen: "dinner" },
];

/* ═══════════════════════════════════════════════════════════
   PSEUDO-RANDOM GENERATOR
   ═══════════════════════════════════════════════════════════ */
function sr(seed) {
    let t = (seed + 0x6d2b79f5) | 0;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

function pickRandom(arr, seed) {
    if (!arr || arr.length === 0) return null;
    return arr[Math.floor(sr(seed) * arr.length)];
}

function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
}

/* ═══════════════════════════════════════════════════════════
   MACRO SPLITS RATIO
   ═══════════════════════════════════════════════════════════ */
function getMacroRatio(split) {
    if (split === "Lower Carb") return { p: 0.35, f: 0.35, c: 0.30 };
    if (split === "Higher Carb") return { p: 0.25, f: 0.20, c: 0.55 };
    return { p: 0.30, f: 0.25, c: 0.45 };
}

/* ═══════════════════════════════════════════════════════════
   NATURAL PORTION FORMATTER (Clean Fractions: 1/4, 1/2, 3/4, 1, 2)
   ═══════════════════════════════════════════════════════════ */
function snapFraction(scale) {
    if (scale <= 0.35) return "1/4";
    if (scale <= 0.65) return "1/2";
    if (scale <= 0.85) return "3/4";
    if (scale >= 1.85) return "2";
    return "1";
}

function formatNaturalPortion(ing, scale = 1) {
    const type = ing.type || "container";

    // 1. Fixed Broth, Condiments, Sauces (Kuah Kaldu, Sambal)
    if (type === "fixed") {
        return ing.unit || "1 porsi";
    }

    // 2. Vegetable slices / Lalapan (Mentimun, Tomat, Acar, Lemon) -> Always in "iris"
    if (type === "slice") {
        const count = Math.max(2, Math.round((ing.baseAmount || 4) * Math.min(1.2, scale)));
        return `${count} ${ing.unit || "iris"}`;
    }

    // 3. Carb Staples / Grains (Nasi, Bubur, Ubi, Singkong, Kentang, Pasta, Bihun)
    // Always provides both gram and clean fraction: e.g. "160 gram (1 porsi)", "240 gram (1 mangkuk)", "120 gram (1/2 porsi)"
    if (type === "carb_weight") {
        const baseGrams = ing.baseAmount || 150;
        const grams = Math.max(60, Math.round((baseGrams * scale) / 10) * 10);
        const frac = snapFraction(grams / baseGrams);
        const containerName = ing.unit || "porsi";
        return `${grams} gram (${frac} ${containerName})`;
    }

    // 4. Discrete Items (Telur, Pisang, Apel, Potong Tahu/Tempe, Tusuk Sate, Lembar Roti)
    if (type === "discrete") {
        const count = Math.max(1, Math.round((ing.baseAmount || 1) * scale));
        return `${count} ${ing.unit || "buah"}`;
    }

    // 5. Spoons (Sdm)
    if (type === "spoon") {
        const count = Math.max(1, Math.round((ing.baseAmount || 1) * scale));
        return `${count} ${ing.unit || "sdm"}`;
    }

    // 6. Protein / Meat Weight (Dada Ayam, Daging Sapi, Ikan)
    if (type === "weight") {
        const baseGrams = ing.baseAmount || 100;
        const grams = Math.max(30, Math.round((baseGrams * scale) / 10) * 10);
        return `${grams} gram`;
    }

    // 7. Liquids & Drinks (Air Kelapa, Susu, Jus)
    if (type === "volume") {
        const ml = Math.max(150, Math.round(((ing.baseAmount || 250) * scale) / 50) * 50);
        const container = (ing.unit || "").includes("cangkir") ? "cangkir" : "gelas";
        return `1 ${container} (${ml}ml)`;
    }

    // 8. Vegetable Soups / Bowls (Sayur Asem, Bayam, Sop, Capcay)
    const frac = snapFraction(scale);
    const unit = ing.unit || "mangkuk";
    return `${frac} ${unit}`;
}

/* ═══════════════════════════════════════════════════════════
   RECIPE SCALER & BUILDER
   ═══════════════════════════════════════════════════════════ */
function buildMealFromRecipe(recipe, targetSlot, seed) {
    if (!recipe) {
        return {
            menu: "Menu Nutrisi Atlet",
            calories: Math.round(targetSlot.calories),
            protein: Math.round(targetSlot.protein),
            carbs: Math.round(targetSlot.carbs),
            fats: Math.round(targetSlot.fats),
            items: []
        };
    }

    // SNACKS: Standalone item with exact real nutrition & portion (no fake scaling)
    if (recipe.type === "snack") {
        const items = (recipe.ingredients || []).map(ing => ({
            name: ing.name,
            displayName: ing.name,
            scaledPortion: formatNaturalPortion(ing, 1),
            scale: 1
        }));

        return {
            menu: recipe.name,
            recipeId: recipe.id,
            items: items,
            calories: Math.round(recipe.baseCalories),
            protein: Math.round(recipe.baseProtein),
            carbs: Math.round(recipe.baseCarbs),
            fats: Math.round(recipe.baseFats)
        };
    }

    // MAIN MEALS (Breakfast, Lunch, Dinner):
    // Scale ingredients & macros proportionally to match athlete's energy requirements
    const scale = clamp(targetSlot.calories / (recipe.baseCalories || 400), 0.75, 1.6);

    const scaledItems = (recipe.ingredients || []).map(ing => {
        const naturalPortion = formatNaturalPortion(ing, scale);
        return {
            name: ing.name,
            displayName: ing.name,
            scaledPortion: naturalPortion,
            scale: Math.round(scale * 100) / 100
        };
    });

    const scaledCalories = Math.round(recipe.baseCalories * scale);
    const scaledProtein = Math.round(recipe.baseProtein * scale);
    const scaledCarbs = Math.round(recipe.baseCarbs * scale);
    const scaledFats = Math.round(recipe.baseFats * scale);

    return {
        menu: recipe.name,
        recipeId: recipe.id,
        items: scaledItems,
        calories: scaledCalories,
        protein: scaledProtein,
        carbs: scaledCarbs,
        fats: scaledFats
    };
}

export function createDishTitle(items, fallbackMenu) {
    if (fallbackMenu && typeof fallbackMenu === "string" && !fallbackMenu.includes("+")) {
        return fallbackMenu;
    }
    if (!items || items.length === 0) return fallbackMenu || "Menu Seimbang";
    const names = items.map(i => i.displayName || i.name);
    if (names.length === 1) return names[0];
    if (names.length === 2) return `${names[0]} & ${names[1]}`;
    if (names.length === 3) return `${names[0]} & ${names[1]} dengan ${names[2]}`;
    return `${names[0]} & ${names[1]} dengan ${names.slice(2).join(", ")}`;
}

/* ═══════════════════════════════════════════════════════════
   WEEKLY MEAL PLAN GENERATOR
   ═══════════════════════════════════════════════════════════ */
export function generateWeeklyMealPlan(targetCalories, dailySplits, goal = "maintenance") {
    return dailySplits.map((split, dayIdx) => {
        const ratio = getMacroRatio(split.split);
        const dayP = (targetCalories * ratio.p) / 4;
        const dayC = (targetCalories * ratio.c) / 4;
        const dayF = (targetCalories * ratio.f) / 9;

        const meals = MEAL_SLOTS.map((slot, mealIdx) => {
            const targetSlot = {
                calories: targetCalories * slot.pct,
                protein: dayP * slot.pct,
                carbs: dayC * slot.pct,
                fats: dayF * slot.pct
            };

            const seed = (dayIdx + 1) * 7919 + (mealIdx + 1) * 6271 + 1013;
            const availableRecipes = getRecipesBySlot(slot.type, goal);
            
            // Pick recipe deterministically with seed offset so days don't repeat the exact same dishes
            const recipeIdx = (dayIdx * 2 + mealIdx) % availableRecipes.length;
            const selectedRecipe = availableRecipes[recipeIdx] || pickRandom(availableRecipes, seed);

            const builtMeal = buildMealFromRecipe(selectedRecipe, targetSlot, seed);

            return {
                time: slot.time,
                type: slot.type,
                menu: builtMeal.menu,
                recipeId: builtMeal.recipeId,
                items: builtMeal.items,
                calories: builtMeal.calories,
                protein: builtMeal.protein,
                carbs: builtMeal.carbs,
                fats: builtMeal.fats,
                _seed: seed,
                _gen: slot.gen,
                _targets: targetSlot,
                _goal: goal,
                _splitType: split.split
            };
        });

        return {
            day: split.label,
            date: split.date,
            splitType: split.split,
            meals
        };
    });
}

function ensureMealMeta(meal) {
    if (!meal) return meal;
    const m = { ...meal };
    if (!m._gen) {
        const t = (m.type || "").toLowerCase();
        if (t.includes("sarapan") || t.includes("breakfast")) m._gen = "breakfast";
        else if (t.includes("siang") || t.includes("lunch")) m._gen = "lunch";
        else if (t.includes("malam") || t.includes("dinner")) m._gen = "dinner";
        else if (t.includes("snack")) m._gen = "snack";
        else m._gen = "lunch";
    }
    if (!m._targets) {
        m._targets = {
            calories: m.calories || 500,
            protein: m.protein || 35,
            carbs: m.carbs || 50,
            fats: m.fats || 15
        };
    }
    if (!m._seed) {
        m._seed = Math.floor(Math.random() * 100000);
    }
    return m;
}

/* ═══════════════════════════════════════════════════════════
   REROLL MEAL (Pick alternative recipe for session)
   ═══════════════════════════════════════════════════════════ */
export function rerollMeal(rawMeal) {
    const meal = ensureMealMeta(rawMeal);
    const goal = meal._goal || "maintenance";
    const availableRecipes = getRecipesBySlot(meal.type, goal);

    // Filter out current recipe to get a fresh dish
    const otherRecipes = availableRecipes.filter(r => r.name !== meal.menu && r.id !== meal.recipeId);
    const pool = otherRecipes.length > 0 ? otherRecipes : availableRecipes;

    const newSeed = (meal._seed || 1000) + Math.floor(Math.random() * 5000) + 500;
    const newRecipe = pickRandom(pool, newSeed);

    const builtMeal = buildMealFromRecipe(newRecipe, meal._targets, newSeed);

    return {
        ...meal,
        menu: builtMeal.menu,
        recipeId: builtMeal.recipeId,
        items: builtMeal.items,
        calories: builtMeal.calories,
        protein: builtMeal.protein,
        carbs: builtMeal.carbs,
        fats: builtMeal.fats,
        _seed: newSeed
    };
}

export function rerollMealItem(rawMeal) {
    return rerollMeal(rawMeal);
}
