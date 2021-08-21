import React from 'react';
import Select from 'react-select';
import type { SelectComponentsProps } from 'react-select/src/Select';

/**
 * To style later
 * @param props
 * @returns
 */
export default function StyledSelect(props: SelectComponentsProps) {
  return <Select {...props} />;
}
