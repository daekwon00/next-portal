import ky from "ky";
import { getSession, signOut } from "next-auth/react";

export const apiClient = ky.create({
  prefixUrl: "/api/v1",
  hooks: {
    beforeRequest: [
      async (request) => {
        const session = await getSession();
        if (session?.accessToken) {
          request.headers.set(
            "Authorization",
            `Bearer ${session.accessToken}`
          );
        }
      },
    ],
    afterResponse: [
      async (_request, _options, response) => {
        if (response.status === 401) {
          await signOut({ redirectTo: "/login" });
        }
      },
    ],
  },
});
