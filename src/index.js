export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Redirect /login to Discord
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

    // Placeholder callback
    if (url.pathname === "/callback") {
      return new Response("Discord login is working! 🎉");
    }

    // Serve static files
    return env.ASSETS.fetch(request);
  },
};