export async function onRequest(context) {
  const clientId = context.env.DISCORD_CLIENT_ID;
  const redirect = encodeURIComponent(context.env.DISCORD_REDIRECT_URI);

  const url =
    `https://discord.com/oauth2/authorize` +
    `?client_id=${clientId}` +
    `&response_type=code` +
    `&redirect_uri=${redirect}` +
    `&scope=identify guilds`;

  return Response.redirect(url, 302);
}