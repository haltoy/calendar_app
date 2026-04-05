import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import type { EventItem } from "@/types/event";

type EventFormProps = {
  selectedDate: string;
  editingEvent: EventItem | null;
  onAddEvent: (title: string, description: string) => void;
  onUpdateEvent: (id: string, title: string, description: string) => void;
};

export default function EventForm({
  selectedDate,
  editingEvent,
  onAddEvent,
  onUpdateEvent,
}: EventFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (editingEvent) {
      setTitle(editingEvent.title);
      setDescription(editingEvent.description ?? "");
      return;
    }

    setTitle("");
    setDescription("");
  }, [editingEvent]);

  const handleSubmit = () => {
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (!trimmedTitle) {
      return;
    }

    if (editingEvent) {
      onUpdateEvent(editingEvent.id, trimmedTitle, trimmedDescription);
      return;
    }

    onAddEvent(trimmedTitle, trimmedDescription);
    setTitle("");
    setDescription("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {editingEvent ? "編集中の日付" : "選択中の日付"}
      </Text>
      <Text style={styles.dateText}>{selectedDate}</Text>

      <Text style={styles.label}>
        {editingEvent ? "予定を編集" : "予定を追加"}
      </Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="タイトル"
        style={styles.input}
      />

      <Text style={styles.label}>詳細</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="詳細"
        multiline
        textAlignVertical="top"
        style={[styles.input, styles.textArea]}
      />

      <Pressable onPress={handleSubmit} style={styles.button}>
        <Text style={styles.buttonText}>
          {editingEvent ? "更新する" : "追加する"}
        </Text>
      </Pressable>
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
    gap: 12,
    shadowColor: "#0f172a",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#64748b",
  },
  dateText: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0f172a",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d7dfe8",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#0f172a",
    backgroundColor: "#f8fafc",
  },
  textArea: {
    minHeight: 116,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 46,
    borderRadius: 14,
    paddingVertical: 13,
    backgroundColor: "#2563eb",
    shadowColor: "#2563eb",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#ffffff",
  },
});
