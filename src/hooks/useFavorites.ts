import { useState } from 'react';

// Избранные матчи (по id). Хранятся только в памяти, пока открыто приложение.
export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  // Было Boolean(indexOf(id)): -1 («нет в списке») давало true, а 0 (первый в списке) — false.
  const isFavorite = (id: string) => favorites.includes(id);

  const toggle = (id: string) => {
    // Было push/splice по тому же массиву: ссылка не менялась, и React пропускал перерисовку.
    // Теперь каждый раз новый массив; функциональная форма берёт актуальное состояние.
    setFavorites((prev) => (prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]));
  };

  return { favorites, isFavorite, toggle };
}
