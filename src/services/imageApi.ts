// Or from '@reduxjs/toolkit/query/react'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const imageApi = createApi({
  reducerPath: 'imageApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/image/' }),
  endpoints: (builder) => ({
    getStories: builder.query({
      query: () => `stories`,
    }),
    getStoryByUuid: builder.query({
      query: (uuid) => `stories/${uuid}`,
    }),
    getChapters: builder.query({
      query: () => `chapters`,
    }),
    getChapterByUuid: builder.query({
      query: (uuid) => `chapters/${uuid}?onlyTags=Test`,
    }),
    getPages: builder.query({
      query: () => `pages`,
    }),
    getPageByUuid: builder.query({
      query: (uuid) => `pages/${uuid}`,
    }),
    patchPage: builder.mutation({
      query: ({ uuid, ...patch }) => ({
        url: `pages/${uuid}`,
        method: 'PATCH',
        body: patch,
      }),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetStoryByUuidQuery,
  useGetStoriesQuery,
  useGetChapterByUuidQuery,
  useGetChaptersQuery,
  useGetPageByUuidQuery,
  useGetPagesQuery,
  usePatchPageMutation,
} = imageApi;
