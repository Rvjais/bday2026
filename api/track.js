export default async function handler(req, res) {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const rawIp = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.socket?.remoteAddress || 'Unknown IP';
    const clientIp = rawIp.split(',')[0].trim();
    
    // Geo information provided by Vercel Edge Headers
    const city = req.headers['x-vercel-ip-city'] ? decodeURIComponent(req.headers['x-vercel-ip-city']) : 'Unknown City';
    const region = req.headers['x-vercel-ip-country-region'] || '';
    const country = req.headers['x-vercel-ip-country'] || 'Unknown Country';
    const userAgent = req.headers['user-agent'] || 'Unknown Browser';

    // Parse body payload
    let body = {};
    if (typeof req.body === 'string') {
      try { body = JSON.parse(req.body); } catch(e) {}
    } else if (req.body) {
      body = req.body;
    }

    const page = body.page || 'Home';
    const pageTitle = body.title || 'Birthday Celebration';
    const visitCount = body.visitCount || 1;
    const totalSiteVisits = body.totalVisits || 1;
    const screen = body.screen || 'Unknown';
    const nowIst = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    // 1. Log to Vercel Function Logs (Visible in Vercel Dashboard -> Functions)
    console.log(`[VISIT LOG] IP: ${clientIp} | Location: ${city}, ${region}, ${country} | Page: ${page} (Visit #${visitCount}, Total: #${totalSiteVisits}) | Device: ${userAgent} | Time: ${nowIst}`);

    // 2. Optional: Send to Discord Webhook if configured
    const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (discordWebhookUrl) {
      const embedPayload = {
        username: "Swastika B'day Tracker 🌸",
        avatar_url: "https://raw.githubusercontent.com/Rvjais/bday2026/main/happybday/file/heart.png",
        embeds: [{
          title: `🌸 New Page Opened: ${page}`,
          description: `**Page Title:** ${pageTitle}\n**IP Address:** ``${clientIp}``\n**Location:** ${city}, ${region} (${country})\n**Visits to this page:** `#${visitCount}` (Total site visits: `#${totalSiteVisits}`)\n**Device:** ${userAgent}\n**Screen Size:** ${screen}`,
          color: 0xff1493,
          timestamp: new Date().toISOString(),
          footer: { text: `Visited at: ${nowIst} IST` }
        }]
      };

      await fetch(discordWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(embedPayload)
      }).catch(err => console.error('Discord Webhook Error:', err));
    }

    // 3. Optional: Send to Telegram if configured
    const tgToken = process.env.TELEGRAM_BOT_TOKEN;
    const tgChatId = process.env.TELEGRAM_CHAT_ID;
    if (tgToken && tgChatId) {
      const tgMsg = `🌸 *New Visit Alert!*\n\n*Page:* ${page}\n*IP:* `${clientIp}`\n*Location:* ${city}, ${country}\n*Page Views:* #${visitCount}\n*Total Views:* #${totalSiteVisits}\n*Time:* ${nowIst} IST`;
      await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: tgChatId, text: tgMsg, parse_mode: 'Markdown' })
      }).catch(err => console.error('Telegram Error:', err));
    }

    return res.status(200).json({ status: 'ok', ip: clientIp, city, country, visitCount });
  } catch (error) {
    console.error('Tracking Handler Error:', error);
    return res.status(200).json({ status: 'error', message: error.message });
  }
}
