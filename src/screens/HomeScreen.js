import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { useLog } from '../context/LogContext';

export default function HomeScreen({ navigation }) {
  const { todayEntries, todayTotal, dailyGoal, removeEntry } = useLog();
  const remaining = dailyGoal - todayTotal;
  const progress = Math.min(todayTotal / dailyGoal, 1);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>今日已攝取</Text>
        <Text style={styles.summaryValue}>{todayTotal} 大卡</Text>
        <View style={styles.progressBarBg}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${progress * 100}%`, backgroundColor: remaining < 0 ? '#e74c3c' : '#2ecc71' },
            ]}
          />
        </View>
        <Text style={styles.summarySub}>
          {remaining >= 0 ? `距離目標還可攝取 ${remaining} 大卡` : `已超過目標 ${-remaining} 大卡`}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.mainButton}
        onPress={() => navigation.navigate('Camera')}
      >
        <Text style={styles.mainButtonText}>📷 拍照計算熱量</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>今日紀錄</Text>
      <FlatList
        data={[...todayEntries].reverse()}
        keyExtractor={(item) => item.id}
        style={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>還沒有紀錄，拍張照片開始吧！</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.entryRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.entryItems}>
                {item.items.map((i) => i.name).join('、')}
              </Text>
              <Text style={styles.entryTime}>
                {new Date(item.timestamp).toLocaleTimeString('zh-TW', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
            <Text style={styles.entryCalories}>{item.calories} 大卡</Text>
            <TouchableOpacity onPress={() => removeEntry(item.id)} style={styles.deleteBtn}>
              <Text style={styles.deleteBtnText}>刪除</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.settingsLink}
        onPress={() => navigation.navigate('Settings')}
      >
        <Text style={styles.settingsLinkText}>⚙️ 設定每日熱量目標</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f7', padding: 16 },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryLabel: { fontSize: 14, color: '#888' },
  summaryValue: { fontSize: 36, fontWeight: '700', marginVertical: 6, color: '#222' },
  progressBarBg: {
    width: '100%',
    height: 10,
    backgroundColor: '#eee',
    borderRadius: 5,
    overflow: 'hidden',
    marginVertical: 8,
  },
  progressBarFill: { height: '100%', borderRadius: 5 },
  summarySub: { fontSize: 13, color: '#666' },
  mainButton: {
    backgroundColor: '#2ecc71',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  mainButtonText: { color: '#fff', fontSize: 17, fontWeight: '600' },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginTop: 24, marginBottom: 8, color: '#333' },
  list: { flex: 1 },
  emptyText: { textAlign: 'center', color: '#aaa', marginTop: 24 },
  entryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  entryItems: { fontSize: 15, color: '#333' },
  entryTime: { fontSize: 12, color: '#999', marginTop: 2 },
  entryCalories: { fontSize: 15, fontWeight: '600', color: '#333', marginRight: 10 },
  deleteBtn: { paddingHorizontal: 8, paddingVertical: 4 },
  deleteBtnText: { color: '#e74c3c', fontSize: 13 },
  settingsLink: { alignItems: 'center', paddingVertical: 14 },
  settingsLinkText: { color: '#888', fontSize: 14 },
});
