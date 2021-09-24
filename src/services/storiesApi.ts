import { api } from './api';

const storiesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getStories: builder.query({
      query: ({ filter, populate }) => ({
        url: `stories`,
        params: {
          filter,
          populate,
        },
      }),
    }),
    postStory: builder.mutation({
      query: (body) => ({
        url: `stories`,
        method: 'POST',
        body,
      }),
    }),
    deleteStoryByUuid: builder.mutation({
      query: (uuid) => ({
        url: `stories/${uuid}`,
        method: 'DELETE',
      }),
    }),
    getStoryByUuid: builder.query({
      query: ({ uuid, filter, populate }) => ({
        url: `stories/${uuid}`,
        params: {
          filter,
          populate,
        },
      }),
    }),
    patchStoryByUuid: builder.mutation({
      query: ({ uuid, ...body }) => ({
        url: `stories/${uuid}`,
        method: 'PATCH',
        body,
      }),
    }),
  }),
});

export const {
  useDeleteStoryByUuidMutation,
  useGetStoriesQuery,
  useGetStoryByUuidQuery,
  useLazyGetStoriesQuery,
  useLazyGetStoryByUuidQuery,
  usePatchStoryByUuidMutation,
  usePostStoryMutation,
} = storiesApi;
