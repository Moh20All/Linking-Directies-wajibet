import { Router } from "express";
import fetch from "node-fetch";
import { TELEGRAM_CHAT_ID, TELEGRAM_BOT_TOKEN } from "../config/env.js";

;

const tgbot = Router();

tgbot.get("/test", async(req,res)=>{
  return res.status(200).json("Success");
})

tgbot.post("/signup", async (req, res) => {
  try {
    const { email, phone, plan, schoolName, fullName } = req.body;

    const botToken = TELEGRAM_BOT_TOKEN;
    const chatId = TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.error("Telegram environment variables not set");
      return res.status(500).json({ error: "Telegram configuration missing" });
    }

    const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const message = `
🎓 *New Directis 360 Signup Request*

👤 *Contact Information:*
• Name: ${fullName}
• School: ${schoolName}
• Email: ${email}
• Phone: ${phone}

📋 *Selected Plan:* ${plan.charAt(0).toUpperCase() + plan.slice(1)}

⏰ *Submitted:* ${new Date().toLocaleString("en-US", {
      timeZone: "Africa/Algiers",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })} (Algeria Time)

Please follow up within 24 hours! 🚀
    `.trim();

    const telegramResponse = await fetch(telegramApiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown",
      }),
    });

    if (!telegramResponse.ok) {
      console.error("Failed to send to Telegram:", await telegramResponse.text());
      return res.status(500).json({ error: "Failed to send notification" });
    }

    return res.json({ success: true });
  } catch (error) {
    console.error("Signup API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default tgbot;
