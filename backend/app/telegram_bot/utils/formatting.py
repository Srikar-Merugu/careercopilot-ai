from typing import Optional, Dict, Any, List


def escape_markdown(text: str) -> str:
    special = ["_", "*", "[", "]", "(", ")", "~", "`", ">", "#", "+", "-", "=", "|", "{", "}", ".", "!"]
    for ch in special:
        text = text.replace(ch, f"\\{ch}")
    return text


def format_score(score: float) -> str:
    score_int = int(round(score * 100))
    if score_int >= 90:
        return f"🟢 {score_int}%"
    elif score_int >= 70:
        return f"🟡 {score_int}%"
    elif score_int >= 50:
        return f"🟠 {score_int}%"
    return f"🔴 {score_int}%"


def format_ats_score(score: float) -> str:
    bars = "▓" * int(round(score / 10)) + "░" * (10 - int(round(score / 10)))
    return f"{bars} {score:.0f}/100"


def build_job_card(job: Dict[str, Any]) -> str:
    title = job.get("title", "Unknown Position")
    company = job.get("company", "Unknown Company")
    location = job.get("location", "Remote")
    salary = job.get("salary", "Not disclosed")
    match_score = job.get("match_score", 0)
    missing_skills = job.get("missing_skills", [])

    parts = [
        f"*{escape_markdown(title)}*",
        f"🏢 {escape_markdown(company)}",
        f"📍 {escape_markdown(location)}",
        f"💰 {escape_markdown(salary)}",
        f"🎯 Match: {format_score(match_score)}",
    ]
    if missing_skills:
        skills_str = ", ".join(escape_markdown(s) for s in missing_skills[:3])
        parts.append(f"⚠️ Missing: {skills_str}")
    return "\n".join(parts)


def build_career_tip() -> str:
    import random
    tips = [
        "💡 *Pro Tip:* Tailor your resume with keywords from the job description to beat ATS filters.",
        "💡 *Pro Tip:* Update your LinkedIn profile to match your resume — recruiters check both.",
        "💡 *Pro Tip:* Practice the STAR method (Situation, Task, Action, Result) for behavioral interviews.",
        "💡 *Pro Tip:* Network with at least 3 people at a target company before applying.",
        "💡 *Pro Tip:* Use numbers and metrics in your resume — 'Increased sales by 30%' beats 'Responsible for sales'.",
        "💡 *Pro Tip:* Set daily 15-minute job alert checks to apply early — first applicants get 3x more interviews.",
        "💡 *Pro Tip:* Learn one in-demand skill per quarter. AI/ML, cloud, and data skills top the 2026 market.",
        "💡 *Pro Tip:* Send a thank-you email within 24 hours of every interview — it increases callback odds by 22%.",
    ]
    return random.choice(tips)


def build_interview_question() -> str:
    import random
    questions = [
        "*Behavioral:* Tell me about a time you handled a difficult teammate.",
        "*Technical:* What's the difference between REST and GraphQL? When would you choose one over the other?",
        "*System Design:* Design a URL shortening service like TinyURL.",
        "*HR:* Where do you see yourself in 5 years?",
        "*Coding:* Implement a function to check if a binary tree is balanced.",
        "*Frontend:* How would you optimize a React app that re-renders too often?",
        "*Backend:* Explain how you'd design a rate limiter for a public API.",
        "*Data:* How do you handle missing values in a large dataset?",
    ]
    return random.choice(questions)


def paginate_jobs(jobs: List[Dict[str, Any]], page: int = 0, per_page: int = 5) -> Dict[str, Any]:
    start = page * per_page
    end = start + per_page
    page_jobs = jobs[start:end]
    total_pages = max(1, (len(jobs) + per_page - 1) // per_page)
    return {
        "jobs": page_jobs,
        "page": page,
        "total_pages": total_pages,
        "total": len(jobs),
        "has_next": end < len(jobs),
        "has_prev": page > 0,
    }
