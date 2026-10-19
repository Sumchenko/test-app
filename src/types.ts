export type Team = {
  id: string;
  name: string;
  city: string;
};

export type Score = {
  home: number;
  away: number;
};

// Статусы, которые есть в данных сейчас. Сервер может прислать и другой,
// поэтому в Match поле status — просто string.
export type KnownStatus = 'scheduled' | 'live' | 'finished' | 'postponed';

export type Match = {
  id: string;
  // null — дата не назначена (например, матч перенесён).
  startsAt: string | null;
  status: string;
  // Минута матча, есть только у идущих матчей.
  minute?: number;
  home: Team;
  away: Team;
  // null — матч ещё не начался. Счёт 0:0 — это не null.
  score: Score | null;
};

export type MatchesResponse = {
  round: number;
  matches: Match[];
};
