import logging
from telegram import BotCommand
from telegram.ext import Application, CommandHandler, MessageHandler, CallbackQueryHandler, filters

from backend.app.core.config import settings
from backend.app.telegram_bot.commands.start import start_command, help_command, ats_score_command
from backend.app.telegram_bot.commands.jobs import my_jobs_command, recommendations_command, saved_jobs_command
from backend.app.telegram_bot.commands.interview import interview_prep_command, profile_command
from backend.app.telegram_bot.commands.resume import upload_resume_command, handle_resume_file
from backend.app.telegram_bot.commands.settings import settings_command, alerts_command
from backend.app.telegram_bot.handlers.callback import callback_handler
from backend.app.telegram_bot.handlers.message import message_handler, error_handler
from backend.app.telegram_bot.middlewares.rate_limit import RateLimitMiddleware

logger = logging.getLogger(__name__)


async def post_init(app: Application):
    commands = [
        BotCommand("start", "🚀 Start the bot"),
        BotCommand("help", "❓ Show help and commands"),
        BotCommand("uploadresume", "📤 Upload your resume for AI analysis"),
        BotCommand("myjobs", "🔍 View matched jobs"),
        BotCommand("recommendations", "🎯 Get AI recommendations"),
        BotCommand("interviewprep", "🎙️ Practice interviews"),
        BotCommand("savedjobs", "📋 View saved jobs"),
        BotCommand("settings", "⚙️ Bot settings"),
        BotCommand("alerts", "⏰ Configure alerts"),
        BotCommand("profile", "👤 View your profile"),
        BotCommand("atsscore", "📊 Check ATS score"),
    ]
    await app.bot.set_my_commands(commands)
    logger.info("Telegram bot commands registered.")


def build_application() -> Application:
    if not settings.TELEGRAM_BOT_TOKEN:
        logger.warning("TELEGRAM_BOT_TOKEN not configured. Bot will not start.")
        return None

    app = Application.builder() \
        .token(settings.TELEGRAM_BOT_TOKEN) \
        .post_init(post_init) \
        .build()

    # Middleware
    app.add_handler(RateLimitMiddleware())

    # Command handlers
    app.add_handler(CommandHandler("start", start_command))
    app.add_handler(CommandHandler("help", help_command))
    app.add_handler(CommandHandler("uploadresume", upload_resume_command))
    app.add_handler(CommandHandler("myjobs", my_jobs_command))
    app.add_handler(CommandHandler("recommendations", recommendations_command))
    app.add_handler(CommandHandler("interviewprep", interview_prep_command))
    app.add_handler(CommandHandler("savedjobs", saved_jobs_command))
    app.add_handler(CommandHandler("settings", settings_command))
    app.add_handler(CommandHandler("alerts", alerts_command))
    app.add_handler(CommandHandler("profile", profile_command))
    app.add_handler(CommandHandler("atsscore", ats_score_command))

    # Resume file handler
    app.add_handler(MessageHandler(filters.Document.ALL, handle_resume_file))

    # Callback query handler
    app.add_handler(CallbackQueryHandler(callback_handler))

    # AI chat message handler (must be last)
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, message_handler))

    # Error handler
    app.add_error_handler(error_handler)

    return app


async def set_webhook(app: Application):
    if settings.TELEGRAM_WEBHOOK_URL:
        webhook_url = f"{settings.TELEGRAM_WEBHOOK_URL}/{settings.TELEGRAM_BOT_TOKEN}"
        await app.bot.set_webhook(
            url=webhook_url,
            secret_token=settings.TELEGRAM_WEBHOOK_SECRET_TOKEN or None,
            max_connections=40,
            allowed_updates=["message", "callback_query", "inline_query"],
        )
        logger.info(f"Webhook set to: {webhook_url}")
    else:
        logger.info("TELEGRAM_WEBHOOK_URL not set. Using polling mode.")
        await app.start_polling()


async def run_bot():
    app = build_application()
    if app is None:
        return
    await set_webhook(app)
    return app
