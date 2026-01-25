import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  image: string;
}

interface CharactersResponse {
  results: Character[];
}

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://rickandmortyapi.com/api/' }),
  endpoints: (builder) => ({
    getCharacters: builder.query<CharactersResponse, void>({
      query: () => 'character',
    }),
  }),
});

export const { useGetCharactersQuery } = apiSlice;
