from telegram import Update, InlineKeyboardMarkup
from telegram.ext import ContextTypes
from backend.app.telegram_bot.keyboards.inline import main_menu_keyboard
from backend.app.telegram_bot.services.auth_service import telegram_auth_service
from backend.app.telegram_bot.utils.formatting import escape_markdown


async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    telegram_id = str(user.id)

    await telegram_auth_service.get_or_create_user(
        telegram_id=telegram_id,
        username=user.username,
        first_name=user.first_name,
        last_name=user.last_name,
    )

    first_name = escape_markdown(user.first_name or "there")
    welcome = (
        f"🚀 *Welcome to CareerCopilot AI, {first_name}\\!*\n\n"
        f"I'm your intelligent career assistant\\. I help you:\n\n"
        f"🔍 Find AI\\-matched jobs\n"
        f"📄 Analyze your resume\n"
        f"🎙️ Practice interviews\n"
        f"📊 Track your ATS score\n"
        f"💡 Get personalized career advice\n\n"
        f"Let's accelerate your career\\!"
    )

    await update.message.reply_text(
        welcome,
        parse_mode="MarkdownV2",
        reply_markup=main_menu_keyboard(),
    )


async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    text = (
        "🤖 *CareerCopilot Commands*\n\n"
        "/start \\- Restart the bot\n"
        "/help \\- Show this help\n"
        "/uploadresume \\- Upload your resume for AI analysis\n"
        "/myjobs \\- View your matched jobs\n"
        "/recommendations \\- Get AI recommendations\n"
        "/interviewprep \\- Start interview practice\n"
        "/savedjobs \\- View saved jobs\n"
        "/settings \\- Bot settings\n"
        "/alerts \\- Configure job alerts\n"
        "/profile \\- View your profile\n"
        "/atsscore \\- Check your ATS score\n\n"
        "Or just chat with me naturally\\!"
    )
    await update.message.reply_text(text, parse_mode="MarkdownV2")


async def ats_score_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_id = str(update.effective_user.id)
    from backend.app.telegram_bot.services.resume_service import telegram_resume_service
    from backend.app.telegram_bot.utils.formatting import format_ats_score

    analysis = telegram_resume_service.get_analysis(user_id)

    if analysis:
        score = analysis["ats_score"]
        bar = format_ats_score(score)
        lines = [
            f"📊 *Your ATS Score*\n\n{bar}\n\n",
            f"*Strengths:*\n" + "\n".join(f"✅ {s}" for s in analysis["strengths"]),
            f"\n*Missing Skills:*\n" + "\n".join(f"⚠️ {s}" for s in analysis["missing_skills"]),
            f"\n*Recommended Roles:*\n" + "\n".join(f"🎯 {r}" for r in analysis["recommended_roles"]),
        ]
        await update.message.reply_text("\n".join(lines), parse_mode="MarkdownV2")
    else:
        await update.message.reply_text(
            "📄 *No Resume Found*\n\nUpload your resume with /uploadresume to get your ATS score\\!",
            parse_mode="MarkdownV2",
        )
