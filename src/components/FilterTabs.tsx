import { Pressable, StyleSheet, Text, View } from 'react-native';
import { FILTER_LABELS, type MatchFilter } from '../utils/matches';

type Props = {
  value: MatchFilter;
  onChange: (filter: MatchFilter) => void;
};

const FILTERS: MatchFilter[] = ['all', 'upcoming', 'finished'];

export function FilterTabs({ value, onChange }: Props) {
  return (
    <View style={styles.row}>
      {FILTERS.map((filter) => {
        const active = filter === value;
        return (
          <Pressable
            key={filter}
            onPress={() => onChange(filter)}
            style={[styles.tab, active && styles.tabActive]}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
          >
            <Text style={[styles.label, active && styles.labelActive]}>{FILTER_LABELS[filter]}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
  },
  tabActive: {
    backgroundColor: '#111827',
  },
  label: {
    fontSize: 14,
    color: '#374151',
  },
  labelActive: {
    color: '#fff',
  },
});
