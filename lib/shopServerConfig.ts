// Server-only origin for production or an isolated staging backend.
export function shopApiOrigin() {
  const url = new URL(
    process.env.SHOP_API_BASE_URL ?? "https://app.nextsole.co.uk",
  );
  if (
    url.protocol !== "https:" &&
    !(
      url.protocol === "http:" &&
      ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)
    )
  )
    throw new Error("Shop API must use HTTPS or local loopback.");
  if (
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  )
    throw new Error("Shop API URL must be an origin.");
  return url.origin;
}
