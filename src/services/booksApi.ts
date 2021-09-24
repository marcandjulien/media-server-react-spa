import { api } from './api';

const booksApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getBooks: builder.query({
      query: ({ filter, populate }) => ({
        url: `books`,
        params: {
          filter,
          populate,
        },
      }),
    }),
    postBook: builder.mutation({
      query: (body) => ({
        url: `books`,
        method: 'POST',
        body,
      }),
    }),
    deleteBookByUuid: builder.mutation({
      query: (uuid) => ({
        url: `books/${uuid}`,
        method: 'DELETE',
      }),
    }),
    getBookByUuid: builder.query({
      query: ({ uuid, filter, populate }) => ({
        url: `books/${uuid}`,
        params: {
          filter,
          populate,
        },
      }),
    }),
    patchBookByUuid: builder.mutation({
      query: ({ uuid, ...body }) => ({
        url: `books/${uuid}`,
        method: 'PATCH',
        body,
      }),
    }),
  }),
});

export const {
  useDeleteBookByUuidMutation,
  useGetBooksQuery,
  useGetBookByUuidQuery,
  useLazyGetBooksQuery,
  useLazyGetBookByUuidQuery,
  usePatchBookByUuidMutation,
  usePostBookMutation,
} = booksApi;
