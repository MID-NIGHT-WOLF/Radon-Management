import dashboard from "../private/dashboard.html";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Login redirect
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


    // Discord callback
    if (url.pathname === "/callback") {
      return new Response(null, {
        status: 302,
        headers: {
          "Location": "/dashboard",
          "Set-Cookie":
            "logged_in=true; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=86400",
        },
      });
    }


    // Dashboard protection
    if (url.pathname === "/dashboard") {
      const cookies = request.headers.get("Cookie") || "";

      if (!cookies.includes("logged_in=true")) {
        return Response.redirect(
          new URL("/login", request.url),
          302
        );
      }

      return new Response(dashboard, {
        headers: {
          "Content-Type": "text/html",
        },
      });
    }


    // Logout
    if (url.pathname === "/logout") {
      return new Response(null, {
        status: 302,
        headers: {
          "Location": "/login",
          "Set-Cookie":
            "logged_in=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0",
        },
      });
    }


    // Everything else
    return env.ASSETS.fetch(request);
  },
};