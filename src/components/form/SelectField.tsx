import { useField } from 'formik';
import React, { ReactElement } from 'react';
import Select from 'react-select';

export default function SelectField(props: any): ReactElement {
  const { name, options } = props;
  const [field, , helpers] = useField<string>(name);
  return (
    <Select
      options={options}
      name={field.name}
      value={options ? options.find((option: any) => option.value === field.value) : ''}
      onChange={(option): void => helpers.setValue(option.value)}
      onBlur={field.onBlur}
    />
  );
}
