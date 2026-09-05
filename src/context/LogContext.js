import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LogContext = createContext(null);

const STORAGE_KEY_ENTRIES = '@food_log_entries';
const STORAGE_KEY_GOAL = '@daily_calorie_goal';

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate()
  ).padStart(2, '0')}`;
}

export function LogProvider({ children }) {
  const [entries, setEntries] = useState([]);
  const [dailyGoal, setDailyGoal] = useState(2000);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [rawEntries, rawGoal] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEY_ENTRIES),
          AsyncStorage.getItem(STORAGE_KEY_GOAL),
        ]);
        if (rawEntries) setEntries(JSON.parse(rawEntries));
        if (rawGoal) setDailyGoal(Number(rawGoal));
      } catch (e) {
        console.warn('讀取本機紀錄失敗', e);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const persistEntries = useCallback(async (next) => {
    setEntries(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY_ENTRIES, JSON.stringify(next));
    } catch (e) {
      console.warn('儲存紀錄失敗', e);
    }
  }, []);

  const addEntry = useCallback(
    (entry) => {
      const next = [
        ...entries,
        {
          id: `${Date.now()}`,
          date: todayKey(),
          timestamp: Date.now(),
          ...entry,
        },
      ];
      persistEntries(next);
    },
    [entries, persistEntries]
  );

  const removeEntry = useCallback(
    (id) => {
      persistEntries(entries.filter((e) => e.id !== id));
    },
    [entries, persistEntries]
  );

  const updateGoal = useCallback(async (goal) => {
    setDailyGoal(goal);
    try {
      await AsyncStorage.setItem(STORAGE_KEY_GOAL, String(goal));
    } catch (e) {
      console.warn('儲存目標失敗', e);
    }
  }, []);

  const todayEntries = entries.filter((e) => e.date === todayKey());
  const todayTotal = todayEntries.reduce((sum, e) => sum + e.calories, 0);

  const value = {
    loaded,
    entries,
    todayEntries,
    todayTotal,
    dailyGoal,
    addEntry,
    removeEntry,
    updateGoal,
  };

  return <LogContext.Provider value={value}>{children}</LogContext.Provider>;
}

export function useLog() {
  const ctx = useContext(LogContext);
  if (!ctx) throw new Error('useLog 必須在 LogProvider 內使用');
  return ctx;
}
