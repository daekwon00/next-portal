export async function initMsw() {
  if (
    typeof window !== "undefined" &&
    process.env.NEXT_PUBLIC_API_MOCKING === "true"
  ) {
    const { worker } = await import("../../mocks/browser");
    await worker.start({ onUnhandledRequest: "bypass" });
    console.log("🔶 MSW browser worker started");
  }
}
