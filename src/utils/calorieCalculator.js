export function calculateCalories(caloriesPer100g, servingGrams, cookingMultiplier = 1.0) {
  if (!caloriesPer100g || !servingGrams) return 0;
  const raw = (caloriesPer100g * servingGrams * cookingMultiplier) / 100;
  return Math.round(raw);
}

export function calculateMealTotal(items) {
  return items.reduce(
    (sum, item) =>
      sum + calculateCalories(item.caloriesPer100g, item.servingGrams, item.cookingMultiplier),
    0
  );
}

export function getEstimateRange(calories) {
  const margin = 0.15;
  return {
    low: Math.round(calories * (1 - margin)),
    high: Math.round(calories * (1 + margin)),
  };
}
