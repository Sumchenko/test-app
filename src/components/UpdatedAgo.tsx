import { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';

type Props = {
  // Момент последней успешной загрузки данных.
  since: Date;
};

// Подпись «Обновлено N сек назад».
export function UpdatedAgo({ since }: Props) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    // Интервал только «тикает» и не читает состояние из замыкания.
    const id = setInterval(() => setNow(Date.now()), 1000);
    // Без очистки интервал продолжал бы работать после размонтирования.
    return () => clearInterval(id);
  }, []);

  // Секунды считаем от since, поэтому после обновления данных подпись сбрасывается сама.
  // max(0) — на случай, если since новее, чем последний тик.
  const seconds = Math.max(0, Math.floor((now - since.getTime()) / 1000));

  return <Text style={styles.text}>Обновлено {seconds} сек назад</Text>;
}

const styles = StyleSheet.create({
  text: {
    fontSize: 13,
    color: '#6b7280',
  },
});
