import { apiGet } from "./client";

export type Language = {
  id: number;
  language: string;
};

export type Poem = {
  id: number;
  title: string;
  description: string;
  text: string;
  time_create: string;
  language: number; // id языка
};

export function fetchPoems() {
  return apiGet<Poem[]>("/api/v1/poetrylist/");
}

export function fetchLanguages() {
  return apiGet<Language[]>("/api/v1/languages/");
}
