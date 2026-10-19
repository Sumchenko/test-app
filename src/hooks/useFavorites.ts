import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'favorites';

// Избранные матчи (по id). Сохраняются в AsyncStorage и восстанавливаются при запуске.
export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        const stored: unknown = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(stored)) {
          return;
        }
        const ids = stored.filter((id): id is string => typeof id === 'string');
        // Объединяем с текущими: вдруг пользователь успел нажать звёздочку до окончания чтения.
        setFavorites((prev) => [...new Set([...ids, ...prev])]);
      })
      // Хранилище недоступно или там мусор — просто работаем без сохранения.
      .catch(() => {})
      .finally(() => setIsLoaded(true));
  }, []);

  useEffect(() => {
    // Пока не прочитали сохранённое, не записываем, иначе затрём его пустым списком.
    if (!isLoaded) {
      return;
    }
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(favorites)).catch(() => {});
  }, [favorites, isLoaded]);

  // Было Boolean(indexOf(id)): -1 («нет в списке») давало true, а 0 (первый в списке) — false.
  const isFavorite = (id: string) => favorites.includes(id);

  const toggle = (id: string) => {
    // Было push/splice по тому же массиву: ссылка не менялась, и React пропускал перерисовку.
    // Теперь каждый раз новый массив; функциональная форма берёт актуальное состояние.
    setFavorites((prev) => (prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]));
  };

  return { favorites, isFavorite, toggle };
}
