export async function register() {
  if (
    process.env.NEXT_RUNTIME === "nodejs" &&
    process.env.NEXT_PUBLIC_API_MOCKING === "true"
  ) {
    const { server } = await import("../mocks/server");
    server.listen({ onUnhandledRequest: "bypass" });
    console.log("🔶 MSW server started");
  }
}
