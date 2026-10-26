import { useFocusEffect } from 'expo-router';
import { useCallback, useRef } from 'react';

/** Runs `fn` each time the page is opened again (not on the first open, where the page loads anyway). */
export function useRefocus(fn: () => void) {
  const seen = useRef(false);
  useFocusEffect(
    useCallback(() => {
      if (seen.current) fn();
      seen.current = true;
    }, [fn]),
  );
}