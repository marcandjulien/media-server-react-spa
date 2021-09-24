import { useCallback, useRef, useState } from 'react';

function preventDefault(e: Event) {
  if (!isTouchEvent(e)) return;

  if (e.touches.length < 2 && e.preventDefault) {
    e.preventDefault();
  }
}

export function isTouchEvent(e: Event): e is TouchEvent {
  return e && 'touches' in e;
}

interface PressHandlers<T> {
  onLongPress: (e: React.MouseEvent<T> | React.TouchEvent<T>) => void;
  onClick: (e: React.MouseEvent<T> | React.TouchEvent<T>) => void;
  onCtrlClick: (e: React.MouseEvent<T> | React.TouchEvent<T>) => void;
  onShiftClick: (e: React.MouseEvent<T> | React.TouchEvent<T>) => void;
}

interface Options {
  delay?: number;
  shouldPreventDefault?: boolean;
}

export default function useSmartPress<T>(
  { onLongPress, onClick, onCtrlClick, onShiftClick }: PressHandlers<T>,
  { delay = 300, shouldPreventDefault = true }: Options = {},
) {
  const [longPressTriggered, setLongPressTriggered] = useState(false);
  const timeout = useRef<NodeJS.Timeout>();
  const target = useRef<EventTarget>();

  const start = useCallback(
    (e: React.MouseEvent<T> | React.TouchEvent<T>) => {
      e.persist();
      const clonedEvent = { ...e };

      if (shouldPreventDefault && e.target) {
        e.target.addEventListener('touchend', preventDefault, { passive: false });
        target.current = e.target;
      }

      timeout.current = setTimeout(() => {
        onLongPress(clonedEvent);
        setLongPressTriggered(true);
      }, delay);
    },
    [onLongPress, delay, shouldPreventDefault],
  );

  const clear = useCallback(
    (e: React.MouseEvent<T> | React.TouchEvent<T>, shouldTriggerClick = true) => {
      timeout.current && clearTimeout(timeout.current);

      if (shouldTriggerClick && !longPressTriggered) {
        if (e.ctrlKey) {
          onCtrlClick(e);
        } else if (e.shiftKey) {
          onShiftClick(e);
        } else {
          onClick(e);
        }
      }

      setLongPressTriggered(false);

      if (shouldPreventDefault && target.current) {
        target.current.removeEventListener('touchend', preventDefault);
      }
    },
    [longPressTriggered, shouldPreventDefault, onCtrlClick, onShiftClick, onClick],
  );

  return {
    onMouseDown: (e: React.MouseEvent<T>) => start(e),
    onTouchStart: (e: React.TouchEvent<T>) => start(e),
    onMouseUp: (e: React.MouseEvent<T>) => clear(e),
    onMouseLeave: (e: React.MouseEvent<T>) => clear(e, false),
    onTouchEnd: (e: React.TouchEvent<T>) => clear(e),
  };
}
