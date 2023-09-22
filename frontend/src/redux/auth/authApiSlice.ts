import { FormData } from "../../types";
import { apiSlice } from "../apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    loginUser: builder.mutation<FormData, FormData>({
      query: (credentials) => ({
        url: "login",
        method: "POST",
        body: {
          ...credentials.data,
        },
      }),
    }),
  }),
});

export const { useLoginUserMutation } = authApiSlice;
