import { useCallback, useEffect, useRef, useState } from 'react';
import { MATCHES_URL } from '../config';
import type { Match, MatchesResponse } from '../types';

async function fetchMatches(signal: AbortSignal): Promise<MatchesResponse> {
  const response = await fetch(MATCHES_URL, { signal });
  // fetch не выбрасывает ошибку на 404/500, поэтому проверяем статус сами.
  if (!response.ok) {
    throw new Error(`Сервер ответил ${response.status}`);
  }
  const data: MatchesResponse = await response.json();
  if (!Array.isArray(data?.matches)) {
    throw new Error('Неожиданный формат ответа');
  }
  return data;
}

// Загрузка матчей тура. Старые данные не сбрасываются при обновлении:
// если обновление упало, список остаётся на экране.
export function useMatches() {
  const [matches, setMatches] = useState<Match[] | null>(null);
  const [round, setRound] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  const load = useCallback(async () => {
    // Если предыдущий запрос ещё идёт — отменяем, чтобы он не перезаписал свежие данные.
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchMatches(controller.signal);
      setMatches(data.matches);
      setRound(data.round);
      setUpdatedAt(new Date());
    } catch (e) {
      if (controller.signal.aborted) {
        return;
      }
      setError(e instanceof Error ? e.message : 'Неизвестная ошибка');
    } finally {
      if (controllerRef.current === controller) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    load();
    return () => controllerRef.current?.abort();
  }, [load]);

  return { matches, round, error, isLoading, updatedAt, reload: load };
}
