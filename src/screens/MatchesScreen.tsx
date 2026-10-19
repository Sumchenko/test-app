import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { FilterTabs } from '../components/FilterTabs';
import { MatchCard } from '../components/MatchCard';
import { UpdatedAgo } from '../components/UpdatedAgo';
import { useMatches } from '../hooks/useMatches';
import { filterMatches, sortMatches, type MatchFilter } from '../utils/matches';

// Экран «Матчи тура» — задание в README.md, часть 1.
export function MatchesScreen() {
  const { matches, round, error, isLoading, updatedAt, reload } = useMatches();
  const [filter, setFilter] = useState<MatchFilter>('all');

  const visibleMatches = useMemo(
    () => (matches ? sortMatches(filterMatches(matches, filter)) : []),
    [matches, filter],
  );

  // Данных ещё нет совсем: первая загрузка или она упала.
  if (matches === null) {
    return (
      <View style={styles.centered}>
        {isLoading ? (
          <>
            <ActivityIndicator size="large" />
            <Text style={styles.hint}>Загружаем матчи…</Text>
          </>
        ) : (
          <>
            <Text style={styles.errorTitle}>Не удалось загрузить матчи</Text>
            {error && <Text style={styles.hint}>{error}</Text>}
            <Pressable style={styles.button} onPress={reload} accessibilityRole="button">
              <Text style={styles.buttonText}>Повторить</Text>
            </Pressable>
          </>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{round !== null ? `Матчи ${round} тура` : 'Матчи тура'}</Text>

      <View style={styles.toolbar}>
        {updatedAt && <UpdatedAgo since={updatedAt} />}
        <Pressable
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={reload}
          disabled={isLoading}
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>{isLoading ? 'Обновляем…' : 'Обновить'}</Text>
        </Pressable>
      </View>

      {/* Обновление упало, но старые данные есть — показываем их и предупреждаем. */}
      {error && <Text style={styles.errorBanner}>Не удалось обновить: {error}</Text>}

      <FilterTabs value={filter} onChange={setFilter} />

      <FlatList
        data={visibleMatches}
        keyExtractor={(match) => match.id}
        renderItem={({ item }) => <MatchCard match={item} />}
        contentContainerStyle={styles.list}
        refreshing={isLoading}
        onRefresh={reload}
        ListEmptyComponent={
          <Text style={styles.empty}>
            {matches.length === 0 ? 'В этом туре пока нет матчей' : 'Нет матчей в этой категории'}
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingBottom: 0,
    gap: 12,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#111827',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  hint: {
    color: '#6b7280',
    textAlign: 'center',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  errorBanner: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#fef2f2',
    color: '#b91c1c',
  },
  list: {
    gap: 12,
    paddingBottom: 16,
  },
  empty: {
    marginTop: 32,
    textAlign: 'center',
    color: '#6b7280',
  },
});
