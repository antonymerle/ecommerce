import { createClient } from "next-sanity";

export const client = createClient({
  projectId: "5rmheqss",
  dataset: "production",
  apiVersion: "2023-04-13",
  useCdn: true,
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
});
