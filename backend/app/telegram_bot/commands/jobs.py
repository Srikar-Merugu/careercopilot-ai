from telegram import Update
from telegram.ext import ContextTypes
from backend.app.telegram_bot.keyboards.inline import job_action_keyboard, pagination_keyboard
from backend.app.telegram_bot.services.job_service import telegram_job_service
from backend.app.telegram_bot.utils.formatting import build_job_card


async def my_jobs_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_id = str(update.effective_user.id)
    page = 0

    result = telegram_job_service.search_jobs(page=page)
    await _send_jobs_page(update, user_id, result, page)


async def recommendations_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_id = str(update.effective_user.id)
    jobs = telegram_job_service.get_recommended_jobs(user_id, limit=5)

    if not jobs:
        await update.message.reply_text(
            "No recommendations yet\\. Upload your resume with /uploadresume to get personalized matches\\!",
            parse_mode="MarkdownV2",
        )
        return

    lines = ["🎯 *AI Recommended Jobs*\n"]
    for job in jobs:
        lines.append(build_job_card(job))
        lines.append("")

    await update.message.reply_text("\n".join(lines), parse_mode="MarkdownV2")


async def saved_jobs_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_id = str(update.effective_user.id)
    jobs = telegram_job_service.get_saved_jobs(user_id)

    if not jobs:
        await update.message.reply_text(
            "📭 *No Saved Jobs*\n\nBrowse jobs and save them with the button below each listing\\.",
            parse_mode="MarkdownV2",
        )
        return

    lines = ["📋 *Saved Jobs*\n"]
    for job in jobs:
        lines.append(build_job_card(job))
        lines.append("")

    await update.message.reply_text("\n".join(lines), parse_mode="MarkdownV2")


async def _send_jobs_page(update: Update, user_id: str, result: dict, page: int):
    jobs = result["jobs"]
    total = result["total"]
    total_pages = result["total_pages"]

    if not jobs:
        await update.message.reply_text(
            "No jobs found\\. Try a different search\\.",
            parse_mode="MarkdownV2",
        )
        return

    lines = [f"🔍 *Job Matches* \\(Page {page + 1}/{total_pages}\\) \\- {total} total\n"]
    for job in jobs:
        lines.append(build_job_card(job))
        lines.append("")

    keyboard = pagination_keyboard(page, total_pages, prefix="jobs")
    await update.message.reply_text("\n".join(lines), parse_mode="MarkdownV2", reply_markup=keyboard)
