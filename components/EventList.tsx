import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

import type { EventItem } from "@/types/event";

type EventListProps = {
  selectedDate: string;
  events: EventItem[];
  onEditEvent: (event: EventItem) => void;
  onDeleteEvent: (id: string) => void;
};

export default function EventList({
  selectedDate,
  events,
  onEditEvent,
  onDeleteEvent,
}: EventListProps) {
  const filteredEvents = events.filter((event) => event.date === selectedDate);

  const handleDelete = (id: string) => {
    Alert.alert("予定を削除", "この予定を削除しますか？", [
      { text: "キャンセル", style: "cancel" },
      {
        text: "削除",
        style: "destructive",
        onPress: () => onDeleteEvent(id),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{selectedDate} の予定</Text>

      {filteredEvents.length === 0 ? (
        <Text style={styles.emptyText}>予定はありません</Text>
      ) : (
        filteredEvents.map((event) => (
          <View key={event.id} style={styles.card}>
            <View style={styles.content}>
              <Text style={styles.title}>{event.title}</Text>
              {event.description ? (
                <Text style={styles.description}>{event.description}</Text>
              ) : null}
            </View>

            <View style={styles.actions}>
              <Pressable
                onPress={() => onEditEvent(event)}
                style={styles.editButton}
              >
                <Text style={styles.editButtonText}>編集</Text>
              </Pressable>

              <Pressable
                onPress={() => handleDelete(event.id)}
                style={styles.deleteButton}
              >
                <Text style={styles.deleteButtonText}>削除</Text>
              </Pressable>
            </View>
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#dde5ee",
    padding: 18,
    gap: 14,
    shadowColor: "#0f172a",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  heading: {
    fontSize: 21,
    fontWeight: "800",
    color: "#0f172a",
  },
  emptyText: {
    fontSize: 15,
    color: "#64748b",
  },
  card: {
    borderWidth: 1,
    borderColor: "#e3eaf2",
    borderRadius: 16,
    padding: 15,
    gap: 12,
    backgroundColor: "#f8fafc",
  },
  content: {
    gap: 6,
  },
  title: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0f172a",
  },
  description: {
    fontSize: 14,
    lineHeight: 21,
    color: "#475569",
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 2,
  },
  editButton: {
    alignSelf: "flex-start",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e2e8f0",
    minHeight: 40,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0f172a",
  },
  deleteButton: {
    alignSelf: "flex-start",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#dc2626",
    minHeight: 40,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#ffffff",
  },
});
