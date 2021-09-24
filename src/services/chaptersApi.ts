import { api } from './api';

const chaptersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getChapters: builder.query({
      query: ({ filter, populate }) => ({
        url: `chapters`,
        params: {
          filter,
          populate,
        },
      }),
    }),
    postChapter: builder.mutation({
      query: (body) => ({
        url: `chapters`,
        method: 'POST',
        body,
      }),
    }),
    deleteChapterByUuid: builder.mutation({
      query: (uuid) => ({
        url: `chapters/${uuid}`,
        method: 'DELETE',
      }),
    }),
    getChapterByUuid: builder.query({
      query: ({ uuid, filter, populate }) => ({
        url: `chapters/${uuid}`,
        params: {
          filter,
          populate,
        },
      }),
    }),
    patchChapterByUuid: builder.mutation({
      query: ({ uuid, ...body }) => ({
        url: `chapters/${uuid}`,
        method: 'PATCH',
        body,
      }),
    }),
  }),
});

export const {
  useDeleteChapterByUuidMutation,
  useGetChaptersQuery,
  useGetChapterByUuidQuery,
  useLazyGetChaptersQuery,
  useLazyGetChapterByUuidQuery,
  usePatchChapterByUuidMutation,
  usePostChapterMutation,
} = chaptersApi;
