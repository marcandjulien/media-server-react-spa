import { range } from 'lodash';
import { useState } from 'react';

export default function useSelection() {
  const [lastSelected, setLastSelected] = useState<number>(-1);
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const select = (index: number) => {
    setSelected(new Set([index]));
    setLastSelected(index);
  };

  const add = (index: number) => {
    const newSelected = new Set(selected);

    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }

    setSelected(newSelected);
    setLastSelected(index);
  };

  const addRangeFromLast = (index: number) => {
    const last = lastSelected === -1 ? 0 : lastSelected;
    const indexRange = last < index ? range(last, index + 1) : range(index, last);
    setSelected(new Set([...selected, ...indexRange]));
    setLastSelected(index);
  };

  return {
    selected,
    lastSelected,
    add,
    select,
    addRangeFromLast,
  };
}
