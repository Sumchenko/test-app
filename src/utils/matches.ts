import type { KnownStatus, Match } from '../types';

export type MatchFilter = 'all' | 'upcoming' | 'finished';

export const FILTER_LABELS: Record<MatchFilter, string> = {
  all: 'Все',
  upcoming: 'Предстоящие',
  finished: 'Завершённые',
};

const STATUS_LABELS: Record<KnownStatus, string> = {
  scheduled: 'Запланирован',
  live: 'Идёт',
  finished: 'Завершён',
  postponed: 'Перенесён',
};

// «Предстоящие» — всё, у чего ещё нет итогового результата:
// идущий матч ещё не закончился, перенесённый всё равно будет сыгран.
const UPCOMING_STATUSES: string[] = ['scheduled', 'live', 'postponed'];
const FINISHED_STATUSES: string[] = ['finished'];

function isKnownStatus(status: string): status is KnownStatus {
  return status in STATUS_LABELS;
}

export function getStatusLabel(match: Match): string {
  if (match.status === 'live' && match.minute != null) {
    return `Идёт, ${match.minute}-я минута`;
  }
  // Незнакомый статус показываем как есть, чтобы не потерять информацию.
  return isKnownStatus(match.status) ? STATUS_LABELS[match.status] : match.status;
}

// Матчи с незнакомым статусом попадают только во вкладку «Все».
export function filterMatches(matches: Match[], filter: MatchFilter): Match[] {
  switch (filter) {
    case 'all':
      return matches;
    case 'upcoming':
      return matches.filter((match) => UPCOMING_STATUSES.includes(match.status));
    case 'finished':
      return matches.filter((match) => FINISHED_STATUSES.includes(match.status));
  }
}

function toTime(startsAt: string | null): number {
  const time = startsAt ? new Date(startsAt).getTime() : NaN;
  return Number.isNaN(time) ? Infinity : time;
}

// По времени начала; матчи без даты — в конце.
export function sortByStart(matches: Match[]): Match[] {
  return [...matches].sort((a, b) => {
    const diff = toTime(a.startsAt) - toTime(b.startsAt);
    return Number.isNaN(diff) ? 0 : diff;
  });
}

// Дата и время в часовом поясе устройства (toLocaleString без timeZone берёт его сам).
export function formatStartsAt(startsAt: string | null): string {
  if (!startsAt) {
    return 'Дата не назначена';
  }
  const date = new Date(startsAt);
  if (Number.isNaN(date.getTime())) {
    return 'Дата не назначена';
  }
  return date.toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });
}
