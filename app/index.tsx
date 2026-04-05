import AsyncStorage from "expo-sqlite/kv-store";
import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CalendarGrid from "@/components/CalendarGrid";
import EventForm from "@/components/EventForm";
import EventList from "@/components/EventList";
import type { EventItem } from "@/types/event";
import { getDateKey, getMonthLabel } from "@/utils/date";

const STORAGE_KEY = "calendar_app_events";

const moveMonth = (baseDate: Date, diff: number) =>
  new Date(baseDate.getFullYear(), baseDate.getMonth() + diff, 1);

export default function HomeScreen() {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState(() =>
    getDateKey(new Date()),
  );
  const [events, setEvents] = useState<EventItem[]>([]);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);

        if (stored) {
          setEvents(JSON.parse(stored) as EventItem[]);
        }
      } catch (error) {
        console.error("Failed to load events", error);
      } finally {
        setIsLoaded(true);
      }
    };

    void loadEvents();
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    const saveEvents = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(events));
      } catch (error) {
        console.error("Failed to save events", error);
      }
    };

    void saveEvents();
  }, [events, isLoaded]);

  const eventCounts = useMemo(
    () =>
      events.reduce<Record<string, number>>((counts, event) => {
        counts[event.date] = (counts[event.date] ?? 0) + 1;
        return counts;
      }, {}),
    [events],
  );

  const handleAddEvent = (title: string, description: string) => {
    const newEvent: EventItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      title,
      description,
      date: selectedDate,
    };

    setEvents((prev) => [newEvent, ...prev]);
    setEditingEvent(null);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
    setEditingEvent((prev) => (prev?.id === id ? null : prev));
  };

  const handleUpdateEvent = (
    id: string,
    title: string,
    description: string,
  ) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === id ? { ...event, title, description } : event,
      ),
    );
    setEditingEvent(null);
  };

  const handleStartEdit = (event: EventItem) => {
    setEditingEvent(event);
    setSelectedDate(event.date);
  };

  const handleGoToToday = () => {
    const today = new Date();
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDate(getDateKey(today));
    setEditingEvent(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Pressable
            onPress={() => setCurrentMonth((prev) => moveMonth(prev, -1))}
            style={styles.monthButton}
          >
            <Text style={styles.monthButtonText}>前月</Text>
          </Pressable>

          <Text style={styles.monthLabel}>{getMonthLabel(currentMonth)}</Text>

          <Pressable
            onPress={() => setCurrentMonth((prev) => moveMonth(prev, 1))}
            style={styles.monthButton}
          >
            <Text style={styles.monthButtonText}>次月</Text>
          </Pressable>
        </View>

        <Pressable onPress={handleGoToToday} style={styles.todayButton}>
          <Text style={styles.todayButtonText}>今日へ戻る</Text>
        </Pressable>

        <CalendarGrid
          currentMonth={currentMonth}
          selectedDate={selectedDate}
          eventCounts={eventCounts}
          onSelectDate={(date) => {
            setSelectedDate(date);
            setEditingEvent(null);
          }}
        />

        <EventForm
          selectedDate={selectedDate}
          editingEvent={editingEvent}
          onAddEvent={handleAddEvent}
          onUpdateEvent={handleUpdateEvent}
        />

        <EventList
          selectedDate={selectedDate}
          events={events}
          onEditEvent={handleStartEdit}
          onDeleteEvent={handleDeleteEvent}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#eef2f7",
  },
  container: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 36,
    gap: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 2,
  },
  monthButton: {
    minWidth: 60,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#d6dee8",
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: "#0f172a",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  monthButtonText: {
    color: "#0f172a",
    fontSize: 15,
    fontWeight: "700",
  },
  monthLabel: {
    flex: 1,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "800",
    color: "#0f172a",
  },
  todayButton: {
    alignSelf: "flex-end",
    minWidth: 112,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#d6dee8",
    paddingHorizontal: 16,
    paddingVertical: 10,
    shadowColor: "#0f172a",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  todayButtonText: {
    color: "#0f172a",
    fontSize: 14,
    fontWeight: "700",
  },
});
