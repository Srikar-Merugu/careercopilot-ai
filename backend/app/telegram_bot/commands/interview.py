from telegram import Update
from telegram.ext import ContextTypes
from backend.app.telegram_bot.keyboards.inline import interview_types_keyboard
from backend.app.telegram_bot.utils.formatting import build_interview_question, escape_markdown


async def interview_prep_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    text = (
        "🎙️ *AI Interview Preparation*\n\n"
        "Practice with AI\\-generated interview questions tailored to your target role\\!\n\n"
        "Choose an interview type:"
    )
    await update.message.reply_text(text, parse_mode="MarkdownV2", reply_markup=interview_types_keyboard())


async def profile_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    from backend.app.telegram_bot.services.auth_service import telegram_auth_service

    user_data = await telegram_auth_service.get_user_by_telegram_id(str(user.id))
    if user_data:
        prefs = user_data.get("preferences", {})
        notifications = "✅ Enabled" if user_data.get("notifications_enabled") else "❌ Disabled"
        text = (
            f"👤 *Your Profile*\n\n"
            f"Name: {escape_markdown(user.first_name or '')} {escape_markdown(user.last_name or '')}\n"
            f"Username: @{escape_markdown(user.username or 'N/A')}\n"
            f"Notifications: {notifications}\n"
            f"Daily Alerts: {'✅' if prefs.get('daily_alerts') else '❌'}\n"
            f"Instant Matches: {'✅' if prefs.get('instant_matches') else '❌'}\n"
            f"Trending Alerts: {'✅' if prefs.get('trending_alerts') else '❌'}\n\n"
            f"Use /settings to update your preferences\\."
        )
        await update.message.reply_text(text, parse_mode="MarkdownV2")
    else:
        await update.message.reply_text("Profile not found\\. Use /start to register\\!", parse_mode="MarkdownV2")
