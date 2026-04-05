import { Pressable, StyleSheet, Text, View } from "react-native";

import { buildMonthDays, getDateKey } from "@/utils/date";

type CalendarGridProps = {
  currentMonth: Date;
  selectedDate: string;
  eventCounts: Record<string, number>;
  onSelectDate: (date: string) => void;
};

const WEEK_LABELS = ["日", "月", "火", "水", "木", "金", "土"];

export default function CalendarGrid({
  currentMonth,
  selectedDate,
  eventCounts,
  onSelectDate,
}: CalendarGridProps) {
  const days = buildMonthDays(currentMonth);
  const todayKey = getDateKey(new Date());
  const currentMonthKey = `${currentMonth.getFullYear()}-${currentMonth.getMonth()}`;

  return (
    <View style={styles.container}>
      <View style={styles.weekRow}>
        {WEEK_LABELS.map((label) => (
          <Text key={label} style={styles.weekLabel}>
            {label}
          </Text>
        ))}
      </View>

      <View style={styles.grid}>
        {days.map((date) => {
          const dateKey = getDateKey(date);
          const isToday = dateKey === todayKey;
          const isSelected = dateKey === selectedDate;
          const eventCount = eventCounts[dateKey] ?? 0;
          const hasEvent = eventCount > 0;
          const isCurrentMonth =
            `${date.getFullYear()}-${date.getMonth()}` === currentMonthKey;

          return (
            <Pressable
              key={dateKey}
              onPress={() => onSelectDate(dateKey)}
              style={[
                styles.dayCell,
                isToday && styles.todayCell,
                isSelected && styles.selectedCell,
              ]}
            >
              <Text
                style={[
                  styles.dayText,
                  !isCurrentMonth && styles.outsideMonthText,
                  isToday && styles.todayText,
                ]}
              >
                {date.getDate()}
              </Text>
              {eventCount > 0 ? (
                <Text
                  style={[
                    styles.countText,
                    !isCurrentMonth && styles.outsideCountText,
                    isToday && styles.todayText,
                  ]}
                >
                  {eventCount}件
                </Text>
              ) : null}
              {hasEvent ? (
                <View style={styles.dot} />
              ) : (
                <View style={styles.dotPlaceholder} />
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#dde5ee",
    padding: 16,
    shadowColor: "#0f172a",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  weekRow: {
    flexDirection: "row",
    marginBottom: 12,
    marginTop: 4,
  },
  weekLabel: {
    width: "14.285%",
    textAlign: "center",
    fontSize: 11,
    fontWeight: "700",
    color: "#64748b",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 10,
  },
  dayCell: {
    width: "14.285%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5ebf2",
    backgroundColor: "#f8fafc",
    paddingVertical: 6,
  },
  todayCell: {
    backgroundColor: "#e0f2fe",
    borderColor: "#7dd3fc",
  },
  selectedCell: {
    borderColor: "#2563eb",
    backgroundColor: "#eff6ff",
    shadowColor: "#2563eb",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  dayText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
  },
  countText: {
    marginTop: 3,
    fontSize: 10,
    fontWeight: "600",
    color: "#64748b",
  },
  todayText: {
    fontWeight: "800",
    color: "#1d4ed8",
  },
  outsideMonthText: {
    color: "#94a3b8",
  },
  outsideCountText: {
    color: "#94a3b8",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#f97316",
    marginTop: 7,
  },
  dotPlaceholder: {
    width: 6,
    height: 6,
    marginTop: 7,
  },
});
