import { useState, useEffect } from 'react';

function getSavedValue<T>(key: string, initialValue: T) {
  const savedValue = JSON.parse(localStorage.getItem(key) ?? '');
  if (savedValue) return savedValue;

  if (initialValue instanceof Function) return initialValue();
  return initialValue ?? '';
}

export function useLocalStorage<T>(storageKey: string, initialValue?: T) {
  const [value, setValue] = useState<T>(() =>
    getSavedValue(storageKey, initialValue)
  );

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(value));
  }, [value, storageKey]);

  return [value, setValue];
}
