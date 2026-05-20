// hooks/useDebounce.ts
import { useState, useEffect } from "react";

export function useDebounce<T>(value: T, delay: number): T {
  // State to store the debounced value
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set a timer to update the debounced value after the delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function: clear the timer if the value changes before the delay is over
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Re-run effect only if value or delay changes

  return debouncedValue;
}
