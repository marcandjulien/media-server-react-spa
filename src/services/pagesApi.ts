import { api } from './api';

const pagesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPages: builder.query({
      query: ({ filter, populate }) => ({
        url: `pages`,
        params: {
          filter,
          populate,
        },
      }),
    }),
    postPage: builder.mutation({
      query: (body) => ({
        url: `pages`,
        method: 'POST',
        body,
      }),
    }),
    deletePageByUuid: builder.mutation({
      query: (uuid) => ({
        url: `pages/${uuid}`,
        method: 'DELETE',
      }),
    }),
    getPageByUuid: builder.query({
      query: ({ uuid, filter, populate }) => ({
        url: `pages/${uuid}`,
        params: {
          filter,
          populate,
        },
      }),
    }),
    patchPageByUuid: builder.mutation({
      query: ({ uuid, ...body }) => ({
        url: `pages/${uuid}`,
        method: 'PATCH',
        body,
      }),
    }),
  }),
});

export const {
  useDeletePageByUuidMutation,
  useGetPagesQuery,
  useGetPageByUuidQuery,
  useLazyGetPagesQuery,
  useLazyGetPageByUuidQuery,
  usePatchPageByUuidMutation,
  usePostPageMutation,
} = pagesApi;
