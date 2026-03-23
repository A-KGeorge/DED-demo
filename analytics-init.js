(async function initVercelAnalytics() {
  try {
    const { inject } = await import("@vercel/analytics");
    inject();
  } catch (primaryError) {
    // Fallback for plain static hosting where bare module imports are unavailable.
    try {
      const { inject } = await import("https://esm.sh/@vercel/analytics");
      inject();
    } catch (fallbackError) {
      console.warn("Vercel Analytics initialization failed.", {
        primaryError,
        fallbackError,
      });
    }
  }
})();
