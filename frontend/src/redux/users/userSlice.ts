import { apiSlice } from "../apiSlice";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: ({ credentials }) => ({
        url: "login",
        method: "POST",
        body: {
          ...credentials,
        },
      }),
    }),
  }),
});

export const { useLoginUserMutation } = usersApiSlice;
