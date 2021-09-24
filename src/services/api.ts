// Or from '@reduxjs/toolkit/query/react'
import { createApi } from '@reduxjs/toolkit/query/react';
import { fetchQuery } from './fetchQuery';

export const api = createApi({
  reducerPath: 'imageApi',
  baseQuery: fetchQuery({ baseUrl: 'http://192.168.2.14:3000/image/' }),
  endpoints: () => ({}),
});
