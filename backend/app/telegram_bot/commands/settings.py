from telegram import Update
from telegram.ext import ContextTypes
from backend.app.telegram_bot.keyboards.inline import settings_keyboard
from backend.app.telegram_bot.services.auth_service import telegram_auth_service


async def settings_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    text = "⚙️ *Bot Settings*\n\nConfigure your notification preferences and account settings\\."
    await update.message.reply_text(text, parse_mode="MarkdownV2", reply_markup=settings_keyboard())


async def alerts_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_id = str(update.effective_user.id)
    user = await telegram_auth_service.get_user_by_telegram_id(user_id)

    if user:
        prefs = user.get("preferences", {})
        lines = [
            "⏰ *Job Alert Settings*\n",
            f"🔹 Daily Job Alerts: {'✅ ON' if prefs.get('daily_alerts', True) else '❌ OFF'}",
            f"🔹 Instant Matches: {'✅ ON' if prefs.get('instant_matches', True) else '❌ OFF'}",
            f"🔹 Trending Jobs: {'✅ ON' if prefs.get('trending_alerts', True) else '❌ OFF'}",
            f"🔹 Interview Reminders: {'✅ ON' if prefs.get('interview_reminders', True) else '❌ OFF'}",
            "",
            "Use /settings to change these anytime\\.",
        ]
        await update.message.reply_text("\n".join(lines), parse_mode="MarkdownV2")
    else:
        await update.message.reply_text("Register with /start first\\!", parse_mode="MarkdownV2")
