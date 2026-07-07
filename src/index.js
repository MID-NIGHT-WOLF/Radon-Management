export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Send users to Discord login
    if (url.pathname === "/login") {
      const redirect = encodeURIComponent(
        "https://radon-management-test.nightgrid-development.workers.dev/callback"
      );

      return Response.redirect(
        `https://discord.com/oauth2/authorize` +
          `?client_id=${env.DISCORD_CLIENT_ID}` +
          `&response_type=code` +
          `&redirect_uri=${redirect}` +
          `&scope=identify`,
        302
      );
    }

    // Discord sends user back here
    if (url.pathname === "/callback") {
      // TODO: exchange code with Discord API later

      return new Response(null, {
        status: 302,
        headers: {
          "Location": "/dashboard",
          "Set-Cookie":
            "logged_in=true; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=86400",
        },
      });
    }

    // Protect dashboard
   if (url.pathname === "/dashboard") {
  const cookies = request.headers.get("Cookie") || "";

  if (!cookies.includes("logged_in=true")) {
    return Response.redirect(
      new URL("/login", request.url),
      302
    );
  }

  const dashboard = await env.ASSETS.fetch(
    new Request(new URL("/dashboard.html", request.url))
  );

  return dashboard;
}