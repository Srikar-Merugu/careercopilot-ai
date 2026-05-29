import logging
from telegram import Update
from telegram.ext import ContextTypes
from backend.app.telegram_bot.services.auth_service import telegram_auth_service
from backend.app.telegram_bot.services.ai_chat_service import ai_chat_service
from backend.app.telegram_bot.keyboards.inline import main_menu_keyboard

logger = logging.getLogger(__name__)


async def message_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_id = str(update.effective_user.id)
    text = update.message.text

    await telegram_auth_service.get_or_create_user(
        telegram_id=user_id,
        username=update.effective_user.username,
        first_name=update.effective_user.first_name,
    )

    user = await telegram_auth_service.get_user_by_telegram_id(user_id)
    from backend.app.telegram_bot.services.resume_service import telegram_resume_service
    user_context = {
        "has_resume": telegram_resume_service.has_resume(user_id),
    }
    if telegram_resume_service.has_resume(user_id):
        analysis = telegram_resume_service.get_analysis(user_id)
        if analysis:
            user_context["ats_score"] = analysis.get("ats_score")

    await telegram_auth_service.log_activity(user_id, "ai_chat_message", {"message_length": len(text)})

    async with context.application.create_task():
        response = await ai_chat_service.generate_response(text, user_context)

    await update.message.reply_text(
        response,
        parse_mode="MarkdownV2",
        reply_markup=main_menu_keyboard(),
    )


async def error_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    logger.error(f"Update {update} caused error {context.error}")
    if update and update.effective_message:
        await update.effective_message.reply_text(
            "❌ Something went wrong\\. Please try again or use /help\\.",
        )
