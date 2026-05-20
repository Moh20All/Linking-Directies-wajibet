import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, phone, plan, schoolName, fullName } = body;

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.error("Telegram environment variables not set");
      return NextResponse.json(
        { error: "Telegram configuration missing" },
        { status: 500 }
      );
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
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown",
      }),
    });

    if (!telegramResponse.ok) {
      console.error(
        "Failed to send to Telegram:",
        await telegramResponse.text()
      );
      return NextResponse.json(
        { error: "Failed to send notification" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Signup API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
