import { useCallback } from 'react';

export function isTouchEvent(e: Event): e is TouchEvent {
  return e && 'touches' in e;
}

interface PressHandlers<T> {
  onClick?: (e: React.MouseEvent<T> | React.TouchEvent<T>) => void;
  onShiftClick: (e: React.MouseEvent<T> | React.TouchEvent<T>) => void;
}

interface Options {
  shouldPreventDefault?: boolean;
}

export default function useShiftClick<T>(
  {
    onClick = (e: React.MouseEvent<T> | React.TouchEvent<T>) => {},
    onShiftClick,
  }: PressHandlers<T>,
  { shouldPreventDefault = true }: Options = {},
) {
  const click = useCallback(
    (e: React.MouseEvent<T> | React.TouchEvent<T>) => {
      e.persist();
      const clonedEvent = { ...e };

      if (clonedEvent.shiftKey) {
        onShiftClick(clonedEvent);
      } else {
        onClick(clonedEvent);
      }
    },
    [onClick, onShiftClick],
  );

  return {
    onClick: (e: React.MouseEvent<T> | React.TouchEvent<T>) => click(e),
  };
}
