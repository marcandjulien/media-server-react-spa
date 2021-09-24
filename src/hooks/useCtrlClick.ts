import { useCallback } from 'react';

export function isTouchEvent(e: Event): e is TouchEvent {
  return e && 'touches' in e;
}

interface PressHandlers<T> {
  onClick?: (e: React.MouseEvent<T> | React.TouchEvent<T>) => void;
  onCtrlClick: (e: React.MouseEvent<T> | React.TouchEvent<T>) => void;
}

interface Options {
  shouldPreventDefault?: boolean;
}

export default function useCtrlClick<T>(
  { onClick = (e: React.MouseEvent<T> | React.TouchEvent<T>) => {}, onCtrlClick }: PressHandlers<T>,
  { shouldPreventDefault = true }: Options = {},
) {
  const click = useCallback(
    (e: React.MouseEvent<T> | React.TouchEvent<T>) => {
      e.persist();
      const clonedEvent = { ...e };

      if (clonedEvent.ctrlKey) {
        onCtrlClick(clonedEvent);
      } else {
        onClick(clonedEvent);
      }
    },
    [onClick, onCtrlClick],
  );

  return {
    onClick: (e: React.MouseEvent<T> | React.TouchEvent<T>) => click(e),
  };
}
