export const FOOD_DATABASE = [
  { id: 'rice_white', name: '白飯', caloriesPer100g: 130, defaultServing: 200, unit: 'g' },
  { id: 'rice_brown', name: '糙米飯', caloriesPer100g: 112, defaultServing: 200, unit: 'g' },
  { id: 'noodles', name: '麵條', caloriesPer100g: 138, defaultServing: 200, unit: 'g' },
  { id: 'bread_white', name: '白吐司', caloriesPer100g: 265, defaultServing: 60, unit: 'g' },
  { id: 'chicken_breast', name: '雞胸肉', caloriesPer100g: 165, defaultServing: 150, unit: 'g' },
  { id: 'chicken_thigh', name: '雞腿肉', caloriesPer100g: 209, defaultServing: 150, unit: 'g' },
  { id: 'pork_belly', name: '五花肉', caloriesPer100g: 518, defaultServing: 100, unit: 'g' },
  { id: 'beef', name: '牛肉', caloriesPer100g: 250, defaultServing: 150, unit: 'g' },
  { id: 'salmon', name: '鮭魚', caloriesPer100g: 208, defaultServing: 150, unit: 'g' },
  { id: 'egg', name: '雞蛋', caloriesPer100g: 155, defaultServing: 50, unit: 'g' },
  { id: 'tofu', name: '豆腐', caloriesPer100g: 76, defaultServing: 150, unit: 'g' },
  { id: 'broccoli', name: '花椰菜', caloriesPer100g: 34, defaultServing: 100, unit: 'g' },
  { id: 'cabbage', name: '高麗菜', caloriesPer100g: 25, defaultServing: 100, unit: 'g' },
  { id: 'potato', name: '馬鈴薯', caloriesPer100g: 77, defaultServing: 150, unit: 'g' },
  { id: 'french_fries', name: '薯條', caloriesPer100g: 312, defaultServing: 100, unit: 'g' },
  { id: 'fried_chicken', name: '炸雞', caloriesPer100g: 246, defaultServing: 150, unit: 'g' },
  { id: 'pizza', name: '披薩', caloriesPer100g: 266, defaultServing: 150, unit: 'g' },
  { id: 'hamburger', name: '漢堡', caloriesPer100g: 295, defaultServing: 200, unit: 'g' },
  { id: 'sushi', name: '壽司', caloriesPer100g: 150, defaultServing: 200, unit: 'g' },
  { id: 'dumpling', name: '水餃', caloriesPer100g: 220, defaultServing: 150, unit: 'g' },
  { id: 'apple', name: '蘋果', caloriesPer100g: 52, defaultServing: 150, unit: 'g' },
  { id: 'banana', name: '香蕉', caloriesPer100g: 89, defaultServing: 120, unit: 'g' },
  { id: 'salad', name: '生菜沙拉', caloriesPer100g: 40, defaultServing: 150, unit: 'g' },
];

export const COOKING_METHOD_MULTIPLIER = [
  { id: 'raw_boiled', label: '生食/水煮/清蒸', multiplier: 1.0 },
  { id: 'stir_fried', label: '炒（少油）', multiplier: 1.15 },
  { id: 'pan_fried', label: '煎', multiplier: 1.25 },
  { id: 'deep_fried', label: '油炸', multiplier: 1.5 },
  { id: 'sauced', label: '勾芡/醬汁較多', multiplier: 1.2 },
];

export function findFoodById(id) {
  return FOOD_DATABASE.find((f) => f.id === id);
}

export function searchFood(query) {
  const q = query.trim().toLowerCase();
  if (!q) return FOOD_DATABASE;
  return FOOD_DATABASE.filter((f) => f.name.toLowerCase().includes(q));
}
