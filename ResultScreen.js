import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { findFoodById, COOKING_METHOD_MULTIPLIER, FOOD_DATABASE } from '../data/foodDatabase';
import { calculateCalories, calculateMealTotal, getEstimateRange } from '../utils/calorieCalculator';
import { useLog } from '../context/LogContext';

export default function ResultScreen({ route, navigation }) {
  const { photoUri, recognition } = route.params;
  const { addEntry } = useLog();

  const [items, setItems] = useState(() =>
    recognition.predictions.map((p) => {
      const food = findFoodById(p.foodId) || FOOD_DATABASE[0];
      return {
        foodId: food.id,
        name: p.foodName,
        caloriesPer100g: food.caloriesPer100g,
        grams: String(p.estimatedGrams),
        cookingMethodId: 'raw_boiled',
        confidence: p.confidence,
      };
    })
  );

  function updateItem(index, patch) {
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, ...patch } : it)));
  }

  const computedItems = items.map((it) => {
    const multiplier =
      COOKING_METHOD_MULTIPLIER.find((c) => c.id === it.cookingMethodId)?.multiplier || 1.0;
    const grams = parseFloat(it.grams) || 0;
    return {
      ...it,
      calories: calculateCalories(it.caloriesPer100g, grams, multiplier),
    };
  });

  const total = calculateMealTotal(
    computedItems.map((it) => ({
      caloriesPer100g: it.caloriesPer100g,
      servingGrams: parseFloat(it.grams) || 0,
      cookingMultiplier:
        COOKING_METHOD_MULTIPLIER.find((c) => c.id === it.cookingMethodId)?.multiplier || 1.0,
    }))
  );
  const range = getEstimateRange(total);

  function handleConfirm() {
    addEntry({
      calories: total,
      items: computedItems.map((it) => ({
        name: it.name,
        calories: it.calories,
        grams: parseFloat(it.grams) || 0,
      })),
    });
    navigation.popToTop();
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {photoUri && <Image source={{ uri: photoUri }} style={styles.photo} />}

        <Text style={styles.hint}>
          AI辨識僅供參考，請確認/調整下方份量與烹調方式，準確度會更高
        </Text>

        {computedItems.map((item, idx) => (
          <View key={idx} style={styles.itemCard}>
            <View style={styles.itemHeaderRow}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemConfidence}>
                辨識信心 {Math.round(item.confidence * 100)}%
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>份量（公克）</Text>
              <TextInput
                style={styles.gramsInput}
                keyboardType="numeric"
                value={item.grams}
                onChangeText={(text) => updateItem(idx, { grams: text })}
              />
            </View>

            <Text style={styles.label}>烹調方式</Text>
            <View style={styles.methodRow}>
              {COOKING_METHOD_MULTIPLIER.map((m) => (
                <TouchableOpacity
                  key={m.id}
                  style={[
                    styles.methodChip,
                    item.cookingMethodId === m.id && styles.methodChipActive,
                  ]}
                  onPress={() => updateItem(idx, { cookingMethodId: m.id })}
                >
                  <Text
                    style={[
                      styles.methodChipText,
                      item.cookingMethodId === m.id && styles.methodChipTextActive,
                    ]}
                  >
                    {m.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.itemCalories}>約 {item.calories} 大卡</Text>
          </View>
        ))}

        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>這一餐總熱量估計</Text>
          <Text style={styles.totalValue}>{total} 大卡</Text>
          <Text style={styles.totalRange}>
            合理範圍約 {range.low} - {range.high} 大卡（份量與烹調估計仍有誤差）
          </Text>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
        <Text style={styles.confirmBtnText}>確認並加入今日紀錄</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f7' },
  photo: { width: '100%', height: 220 },
  hint: { padding: 14, fontSize: 13, color: '#888', textAlign: 'center' },
  itemCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 14,
  },
  itemHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  itemName: { fontSize: 16, fontWeight: '600', color: '#222' },
  itemConfidence: { fontSize: 12, color: '#aaa' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  label: { fontSize: 13, color: '#666', marginBottom: 6 },
  gramsInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    width: 90,
    textAlign: 'right',
  },
  methodRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 },
  methodChip: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  methodChipActive: { backgroundColor: '#2ecc71', borderColor: '#2ecc71' },
  methodChipText: { fontSize: 12, color: '#666' },
  methodChipTextActive: { color: '#fff' },
  itemCalories: { fontSize: 15, fontWeight: '600', color: '#333', textAlign: 'right' },
  totalCard: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  totalLabel: { fontSize: 13, color: '#888' },
  totalValue: { fontSize: 30, fontWeight: '700', color: '#222', marginVertical: 4 },
  totalRange: { fontSize: 12, color: '#999' },
  confirmBtn: {
    backgroundColor: '#2ecc71',
    margin: 16,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  confirmBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
