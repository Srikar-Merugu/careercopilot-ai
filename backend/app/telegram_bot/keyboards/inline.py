from telegram import InlineKeyboardButton, InlineKeyboardMarkup


def main_menu_keyboard() -> InlineKeyboardMarkup:
    buttons = [
        [InlineKeyboardButton("🔍 Find Jobs", callback_data="find_jobs"),
         InlineKeyboardButton("📤 Upload Resume", callback_data="upload_resume")],
        [InlineKeyboardButton("🎯 AI Recommendations", callback_data="recommendations"),
         InlineKeyboardButton("🎙️ Interview Prep", callback_data="interview_prep")],
        [InlineKeyboardButton("📋 Saved Jobs", callback_data="saved_jobs"),
         InlineKeyboardButton("📊 My ATS Score", callback_data="ats_score")],
        [InlineKeyboardButton("⚙️ Settings", callback_data="settings"),
         InlineKeyboardButton("💬 AI Chat", callback_data="ai_chat")],
    ]
    return InlineKeyboardMarkup(buttons)


def job_action_keyboard(job_id: str, saved: bool = False) -> InlineKeyboardMarkup:
    buttons = []
    if saved:
        buttons.append(InlineKeyboardButton("💾 Saved ✓", callback_data=f"saved_{job_id}"))
    else:
        buttons.append(InlineKeyboardButton("💾 Save Job", callback_data=f"save_{job_id}"))
    buttons.append(InlineKeyboardButton("📄 View Details", callback_data=f"details_{job_id}"))
    buttons.append(InlineKeyboardButton("🔗 Apply Now", url=f"https://careercopilot.ai/jobs/{job_id}"))
    return InlineKeyboardMarkup([buttons, [InlineKeyboardButton("⬅️ Back", callback_data="more_jobs")]])


def pagination_keyboard(page: int, total_pages: int, prefix: str = "jobs") -> InlineKeyboardMarkup:
    buttons = []
    row = []
    if page > 0:
        row.append(InlineKeyboardButton("⬅️ Prev", callback_data=f"{prefix}_page_{page - 1}"))
    if page < total_pages - 1:
        row.append(InlineKeyboardButton("Next ➡️", callback_data=f"{prefix}_page_{page + 1}"))
    if row:
        buttons.append(row)
    return InlineKeyboardMarkup(buttons)


def resume_actions_keyboard() -> InlineKeyboardMarkup:
    buttons = [
        [InlineKeyboardButton("📤 Upload New Resume", callback_data="upload_resume"),
         InlineKeyboardButton("📊 View Analysis", callback_data="view_analysis")],
        [InlineKeyboardButton("🎯 Get Recommendations", callback_data="recommendations"),
         InlineKeyboardButton("⬅️ Main Menu", callback_data="main_menu")],
    ]
    return InlineKeyboardMarkup(buttons)


def interview_types_keyboard() -> InlineKeyboardMarkup:
    buttons = [
        [InlineKeyboardButton("👔 HR Interview", callback_data="interview_hr"),
         InlineKeyboardButton("💻 Technical", callback_data="interview_technical")],
        [InlineKeyboardButton("🧠 Behavioral", callback_data="interview_behavioral"),
         InlineKeyboardButton("🏗️ System Design", callback_data="interview_system_design")],
        [InlineKeyboardButton("⬅️ Back", callback_data="main_menu")],
    ]
    return InlineKeyboardMarkup(buttons)


def settings_keyboard() -> InlineKeyboardMarkup:
    buttons = [
        [InlineKeyboardButton("🔔 Toggle Notifications", callback_data="toggle_notifications"),
         InlineKeyboardButton("⏰ Alert Preferences", callback_data="alert_prefs")],
        [InlineKeyboardButton("🌐 Language", callback_data="language"),
         InlineKeyboardButton("🔗 Sync Dashboard", callback_data="sync_dashboard")],
        [InlineKeyboardButton("⬅️ Back", callback_data="main_menu")],
    ]
    return InlineKeyboardMarkup(buttons)


def confirmation_keyboard(action: str) -> InlineKeyboardMarkup:
    buttons = [
        [InlineKeyboardButton("✅ Yes", callback_data=f"confirm_{action}"),
         InlineKeyboardButton("❌ No", callback_data="cancel")],
    ]
    return InlineKeyboardMarkup(buttons)


def back_keyboard(callback: str = "main_menu") -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup([[InlineKeyboardButton("⬅️ Back", callback_data=callback)]])
