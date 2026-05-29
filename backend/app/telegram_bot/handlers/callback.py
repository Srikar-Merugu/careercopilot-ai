import logging
from telegram import Update
from telegram.ext import ContextTypes
from backend.app.telegram_bot.keyboards.inline import (
    main_menu_keyboard, job_action_keyboard, pagination_keyboard,
    interview_types_keyboard, settings_keyboard, resume_actions_keyboard,
    back_keyboard,
)
from backend.app.telegram_bot.services.auth_service import telegram_auth_service
from backend.app.telegram_bot.services.job_service import telegram_job_service
from backend.app.telegram_bot.utils.formatting import (
    build_job_card, build_interview_question, build_career_tip, escape_markdown
)

logger = logging.getLogger(__name__)


async def callback_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    data = query.data
    user_id = str(update.effective_user.id)

    if data == "main_menu":
        await query.edit_message_text(
            "🚀 *CareerCopilot AI*\n\nChoose an option below:",
            parse_mode="MarkdownV2",
            reply_markup=main_menu_keyboard(),
        )

    elif data == "find_jobs":
        result = telegram_job_service.search_jobs(page=0)
        await _show_jobs(query, result, 0)

    elif data == "upload_resume":
        await query.edit_message_text(
            "📤 *Upload Your Resume*\n\nSend me a PDF or DOCX file and I'll analyze it with AI\\.",
            parse_mode="MarkdownV2",
            reply_markup=back_keyboard("main_menu"),
        )

    elif data == "recommendations":
        jobs = telegram_job_service.get_recommended_jobs(user_id, limit=5)
        if not jobs:
            await query.edit_message_text(
                "Upload your resume to get personalized recommendations\\!",
                parse_mode="MarkdownV2",
                reply_markup=back_keyboard("main_menu"),
            )
            return
        lines = ["🎯 *AI Recommended Jobs*\n"]
        for job in jobs:
            lines.append(build_job_card(job))
            lines.append("")
        await query.edit_message_text("\n".join(lines), parse_mode="MarkdownV2")

    elif data == "interview_prep":
        await query.edit_message_text(
            "🎙️ *Interview Preparation*\n\nChoose an interview type:",
            parse_mode="MarkdownV2",
            reply_markup=interview_types_keyboard(),
        )

    elif data.startswith("interview_"):
        itype = data.replace("interview_", "")
        question = build_interview_question()
        await query.edit_message_text(
            f"🎙️ *{itype.replace('_', ' ').title()} Interview*\n\n{question}\n\n"
            "Try answering this question\\. Need another? Click /interviewprep",
            parse_mode="MarkdownV2",
            reply_markup=interview_types_keyboard(),
        )

    elif data == "saved_jobs":
        jobs = telegram_job_service.get_saved_jobs(user_id)
        if not jobs:
            await query.edit_message_text(
                "📭 *No Saved Jobs*\n\nBrowse and save jobs from the main menu\\.",
                parse_mode="MarkdownV2",
                reply_markup=back_keyboard("main_menu"),
            )
            return
        lines = ["📋 *Saved Jobs*\n"]
        for job in jobs:
            lines.append(build_job_card(job))
            lines.append("")
        await query.edit_message_text("\n".join(lines), parse_mode="MarkdownV2")

    elif data == "ats_score":
        from backend.app.telegram_bot.services.resume_service import telegram_resume_service
        from backend.app.telegram_bot.utils.formatting import format_ats_score
        analysis = telegram_resume_service.get_analysis(user_id)
        if analysis:
            bars = format_ats_score(analysis["ats_score"])
            lines = [
                f"📊 *Your ATS Score*\n\n{bars}\n",
                "*✅ Strengths:*",
                *[f"• {s}" for s in analysis["strengths"]],
                "\n*⚠️ Missing Skills:*",
                *[f"• {s}" for s in analysis["missing_skills"]],
            ]
            await query.edit_message_text(
                "\n".join(lines), parse_mode="MarkdownV2",
                reply_markup=resume_actions_keyboard(),
            )
        else:
            await query.edit_message_text(
                "Upload your resume with /uploadresume to check\\!",
                parse_mode="MarkdownV2", reply_markup=back_keyboard("main_menu"),
            )

    elif data == "settings":
        await query.edit_message_text(
            "⚙️ *Settings*", parse_mode="MarkdownV2",
            reply_markup=settings_keyboard(),
        )

    elif data.startswith("save_"):
        job_id = data.replace("save_", "")
        if telegram_job_service.save_job(user_id, job_id):
            await query.edit_message_reply_markup(
                reply_markup=job_action_keyboard(job_id, saved=True)
            )
            await query.answer("💾 Job saved!")

    elif data.startswith("details_"):
        job_id = data.replace("details_", "")
        job = telegram_job_service.get_job_by_id(job_id)
        if job:
            saved = telegram_job_service.is_job_saved(user_id, job_id)
            lines = [
                f"*{escape_markdown(job['title'])}*\n",
                f"🏢 {escape_markdown(job['company'])}",
                f"📍 {escape_markdown(job['location'])}",
                f"💰 {escape_markdown(job['salary'])}",
                f"📝 {escape_markdown(job['description'])}",
                f"\n*Skills:* " + ", ".join(escape_markdown(s) for s in job['skills']),
                f"*Posted:* {job['posted']}",
            ]
            await query.edit_message_text(
                "\n".join(lines), parse_mode="MarkdownV2",
                reply_markup=job_action_keyboard(job_id, saved),
            )

    elif data == "more_jobs":
        result = telegram_job_service.search_jobs(page=0)
        await _show_jobs(query, result, 0)

    elif data.startswith("jobs_page_"):
        page = int(data.replace("jobs_page_", ""))
        result = telegram_job_service.search_jobs(page=page)
        await _show_jobs(query, result, page)

    elif data == "toggle_notifications":
        enabled = await telegram_auth_service.toggle_notifications(user_id)
        status = "✅ Enabled" if enabled else "❌ Disabled"
        await query.answer(f"Notifications: {status}")
        await query.edit_message_text(
            f"🔔 Notifications {status}", parse_mode="MarkdownV2",
            reply_markup=settings_keyboard(),
        )

    elif data == "ai_chat":
        await query.edit_message_text(
            "💬 *AI Career Chat*\n\n"
            "Just send me a message and I'll help with anything career\\-related\\!\n\n"
            "Try asking:\n"
            "• \"Find remote React jobs\"\n"
            "• \"What skills am I missing?\"\n"
            "• \"Prepare me for Google interview\"\n"
            "• \"Improve my resume\"",
            parse_mode="MarkdownV2",
            reply_markup=back_keyboard("main_menu"),
        )

    elif data == "sync_dashboard":
        await query.edit_message_text(
            "🔗 *Sync with Dashboard*\n\n"
            "Your Telegram account is linked to CareerCopilot\\. "
            "Saved jobs, ATS scores, and interview history sync automatically\\.\n\n"
            "Visit the dashboard to manage everything: [CareerCopilot AI](https://careercopilot.ai/dashboard/telegram)",
            parse_mode="MarkdownV2",
            reply_markup=back_keyboard("main_menu"),
        )

    elif data == "view_analysis":
        from backend.app.telegram_bot.services.resume_service import telegram_resume_service
        analysis = telegram_resume_service.get_analysis(user_id)
        if analysis:
            from backend.app.telegram_bot.utils.formatting import format_ats_score
            bars = format_ats_score(analysis["ats_score"])
            lines = [
                f"📊 *Resume Analysis*\n\n{bars}\n",
                "*✅ Strengths:*",
                *[f"• {s}" for s in analysis["strengths"]],
                "\n*⚠️ Missing Skills:*",
                *[f"• {s}" for s in analysis["missing_skills"]],
                "\n*🎯 Recommended Roles:*",
                *[f"• {r}" for r in analysis["recommended_roles"]],
                "\n*💡 Tips:*",
                *[f"• {t}" for t in analysis["improvement_tips"][:3]],
            ]
            await query.edit_message_text(
                "\n".join(lines), parse_mode="MarkdownV2",
                reply_markup=resume_actions_keyboard(),
            )
        else:
            await query.edit_message_text(
                "No resume found\\. Upload one with /uploadresume\\!",
                parse_mode="MarkdownV2", reply_markup=back_keyboard("main_menu"),
            )

    else:
        await query.edit_message_text("I didn't understand that\\. Try /help\\!", reply_markup=back_keyboard("main_menu"))


async def _show_jobs(query, result: dict, page: int):
    jobs = result["jobs"]
    total = result["total"]
    total_pages = result["total_pages"]

    if not jobs:
        await query.edit_message_text(
            "No jobs found\\. Try again later\\.",
            parse_mode="MarkdownV2",
            reply_markup=back_keyboard("main_menu"),
        )
        return

    lines = [f"🔍 *Job Matches* \\(Page {page + 1}/{total_pages}\\) \\- {total} total\n"]
    for job in jobs[:5]:
        lines.append(build_job_card(job))
        lines.append("")

    keyboard = pagination_keyboard(page, total_pages, prefix="jobs")
    await query.edit_message_text("\n".join(lines), parse_mode="MarkdownV2", reply_markup=keyboard)
