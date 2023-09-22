import { Image } from "../../types";
import { apiSlice } from "../apiSlice";

export const imagesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getImages: builder.query<Image[], void>({
      query: () => "/fetch-images",
    }),
    getImage: builder.query<Image, string | void>({
      query: (id) => `/show/image/${id}`,
    }),
    getCategory: builder.query<Image[], string | void>({
      query: (category) => `/categories/${category}`,
    }),
  }),
});

export const { useGetImagesQuery, useGetCategoryQuery, useGetImageQuery } =
  imagesApiSlice;
