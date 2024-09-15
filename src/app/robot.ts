import { BASE_URL } from "@/constants";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
      },
    ],
    host: BASE_URL,
  };
}
