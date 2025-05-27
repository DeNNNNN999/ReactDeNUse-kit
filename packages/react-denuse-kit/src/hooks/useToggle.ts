import { useState, useCallback, Dispatch, SetStateAction } from 'react';

/**
 * Toggles a boolean value
 * @param initialValue - initial boolean value
 * @returns [value, toggle, setValue]
 */
export function useToggle(
  initialValue: boolean = false
): [boolean, () => void, Dispatch<SetStateAction<boolean>>] {
  const [value, setValue] = useState<boolean>(initialValue);

  const toggle = useCallback(() => {
    setValue(v => !v);
  }, []);

  return [value, toggle, setValue];
}
