import logging
from telegram import Update
from telegram.ext import ContextTypes
from backend.app.telegram_bot.keyboards.inline import resume_actions_keyboard
from backend.app.telegram_bot.utils.formatting import format_ats_score
from backend.app.telegram_bot.services.auth_service import telegram_auth_service

logger = logging.getLogger(__name__)


async def upload_resume_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    text = (
        "📤 *Upload Your Resume*\n\n"
        "Send me your resume file \\(PDF or DOCX\\) and I'll analyze it with AI\\.\n\n"
        "I'll give you:\n"
        "✅ ATS Score\n"
        "✅ Strengths & Weaknesses\n"
        "✅ Missing Skills\n"
        "✅ Recommended Roles\n"
        "✅ Improvement Tips\n\n"
        "Ready when you are\\!"
    )
    await update.message.reply_text(text, parse_mode="MarkdownV2")


async def handle_resume_file(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_id = str(update.effective_user.id)
    from backend.app.telegram_bot.services.resume_service import telegram_resume_service

    processing_msg = await update.message.reply_text(
        "⏳ *Analyzing your resume\\.\\.\\.*",
        parse_mode="MarkdownV2",
    )

    document = update.message.document
    file_name = document.file_name or "resume.pdf"

    if document.file_size > 10 * 1024 * 1024:
        await processing_msg.edit_text("❌ File too large\\. Maximum size is 10MB\\.", parse_mode="MarkdownV2")
        return

    file_ext = file_name.split(".")[-1].lower() if "." in file_name else ""
    if file_ext not in ("pdf", "docx", "doc"):
        await processing_msg.edit_text(
            "❌ Unsupported format\\. Please upload a PDF or DOCX\\.",
            parse_mode="MarkdownV2"
        )
        return

    try:
        file = await document.get_file()
        file_bytes = await file.download_as_bytearray()

        result = await telegram_resume_service.process_resume(user_id, file_name, bytes(file_bytes))

        if "error" in result:
            await processing_msg.edit_text(f"❌ {result['error']}", parse_mode="MarkdownV2")
            return

        ats_bar = format_ats_score(result["ats_score"])
        lines = [
            f"📊 *Resume Analysis Complete\\!*\n\n{ats_bar}\n",
            f"*📄 File:* {file_name}",
            f"*📝 Words:* {result.get('word_count', 'N/A')}",
            f"*📖 Readability:* {result.get('readability_score', 'N/A')}/10\n",
            "*✅ Strengths:*",
        ]
        for s in result["strengths"]:
            lines.append(f"• {s}")

        lines.append("\n*⚠️ Missing Skills:*")
        for s in result["missing_skills"]:
            lines.append(f"• {s}")

        lines.append("\n*🎯 Recommended Roles:*")
        for r in result["recommended_roles"]:
            lines.append(f"• {r}")

        lines.append("\n*💡 Quick Tips:*")
        for t in result["improvement_tips"][:3]:
            lines.append(f"• {t}")

        await processing_msg.edit_text(
            "\n".join(lines),
            parse_mode="MarkdownV2",
            reply_markup=resume_actions_keyboard(),
        )

        await telegram_auth_service.log_activity(
            user_id, "resume_analyzed", {"ats_score": result["ats_score"], "file_name": file_name}
        )

    except Exception as e:
        logger = logging.getLogger(__name__)
        logger.error(f"Resume processing failed: {e}")
        await processing_msg.edit_text(
            "❌ Sorry, I couldn't process your resume\\. Please try again or upload a different file\\.",
            parse_mode="MarkdownV2",
        )
