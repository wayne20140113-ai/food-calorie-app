import { FOOD_DATABASE } from '../data/foodDatabase';

export async function recognizeFoodFromPhoto(photoUri) {
  await new Promise((resolve) => setTimeout(resolve, 1200));

  const shuffled = [...FOOD_DATABASE].sort(() => Math.random() - 0.5);
  const picks = shuffled.slice(0, 2);

  return {
    success: true,
    predictions: picks.map((food, idx) => ({
      foodId: food.id,
      foodName: food.name,
      confidence: idx === 0 ? 0.78 : 0.55,
      estimatedGrams: food.defaultServing,
    })),
  };
}
