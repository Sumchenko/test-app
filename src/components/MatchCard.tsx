import { StyleSheet, Text, View } from 'react-native';
import type { Match, Team } from '../types';
import { formatStartsAt, getStatusLabel } from '../utils/matches';

type Props = {
  match: Match;
};

export function MatchCard({ match }: Props) {
  const { score } = match;
  const isLive = match.status === 'live';

  return (
    <View style={[styles.card, isLive && styles.cardLive]}>
      <View style={styles.header}>
        <Text style={styles.date}>{formatStartsAt(match.startsAt)}</Text>
        <Text style={[styles.status, isLive && styles.statusLive]}>{getStatusLabel(match)}</Text>
      </View>
      {/* Проверяем именно null: счёт 0 — это тоже счёт. */}
      <TeamRow team={match.home} goals={score !== null ? score.home : null} />
      <TeamRow team={match.away} goals={score !== null ? score.away : null} />
    </View>
  );
}

function TeamRow({ team, goals }: { team: Team; goals: number | null }) {
  return (
    <View style={styles.teamRow}>
      <View style={styles.teamInfo}>
        <Text style={styles.teamName}>{team.name}</Text>
        <Text style={styles.teamCity}>{team.city}</Text>
      </View>
      {goals !== null && <Text style={styles.goals}>{goals}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
    gap: 8,
  },
  cardLive: {
    borderColor: '#ef3124',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  date: {
    fontSize: 13,
    color: '#6b7280',
  },
  status: {
    fontSize: 13,
    color: '#374151',
  },
  statusLive: {
    color: '#ef3124',
    fontWeight: '600',
  },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  teamInfo: {
    flex: 1,
  },
  teamName: {
    fontSize: 16,
    fontWeight: '600',
  },
  teamCity: {
    fontSize: 12,
    color: '#9ca3af',
  },
  goals: {
    fontSize: 20,
    fontWeight: '700',
    minWidth: 24,
    textAlign: 'right',
  },
});
