import logging
import random
from typing import Optional, Dict, Any

from backend.app.core.config import settings

logger = logging.getLogger(__name__)


class AIChatService:

    def __init__(self):
        self._use_openai = bool(settings.OPENAI_API_KEY)

    async def generate_response(self, user_message: str, user_context: Optional[Dict[str, Any]] = None) -> str:
        if self._use_openai:
            return await self._openai_chat(user_message, user_context)
        return self._mock_chat(user_message, user_context)

    async def _openai_chat(self, message: str, context: Optional[Dict] = None) -> str:
        try:
            import openai
            openai.api_key = settings.OPENAI_API_KEY
            system_prompt = self._build_system_prompt(context)
            response = await openai.ChatCompletion.acreate(
                model=settings.AI_CHAT_MODEL,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": message},
                ],
                temperature=settings.AI_CHAT_TEMPERATURE,
                max_tokens=settings.AI_CHAT_MAX_TOKENS,
            )
            return response.choices[0].message.content
        except Exception as e:
            logger.error(f"OpenAI chat failed: {e}")
            return self._mock_chat(message, context)

    def _build_system_prompt(self, context: Optional[Dict] = None) -> str:
        base = (
            "You are CareerCopilot AI, a world-class career assistant integrated with Telegram. "
            "You help users find jobs, improve resumes, prepare for interviews, and grow their careers. "
            "Be concise, encouraging, and data-driven. Use emojis sparingly. "
            "Provide specific, actionable advice. Never make up facts about the user."
        )
        if context:
            if context.get("has_resume"):
                base += f"\nThe user has uploaded their resume. ATS Score: {context.get('ats_score', 'N/A')}."
            if context.get("target_role"):
                base += f"\nThe user is looking for: {context['target_role']}."
            if context.get("recent_activity"):
                base += f"\nRecent activity: {context['recent_activity']}."
        return base

    def _mock_chat(self, message: str, context: Optional[Dict] = None) -> str:
        message_lower = message.lower()
        responses = []

        if "remote" in message_lower and ("job" in message_lower or "react" in message_lower or "find" in message_lower):
            responses.append(
                "🎯 I found several remote React opportunities for you!\n\n"
                "1. *React Native Developer* at CRED — ₹18LPA (Remote)\n"
                "2. *Full Stack Developer* at Razorpay — ₹20LPA (Remote)\n\n"
                "Use /find_jobs to see the full list or /save to bookmark any."
            )

        elif "resume" in message_lower or "improve" in message_lower:
            responses.append(
                "📄 *Resume Improvement Tips:*\n\n"
                "1. *Quantify achievements* — Use numbers: \"Improved load time by 40%\"\n"
                "2. *ATS keywords* — Include terms from job descriptions you're targeting\n"
                "3. *One page max* — Recruiters spend 6 seconds scanning\n"
                "4. *Action verbs* — Start bullets with \"Built\", \"Designed\", \"Led\"\n\n"
                "Upload your resume with /uploadresume and I'll give you a detailed ATS analysis!"
            )

        elif "skill" in message_lower and ("missing" in message_lower or "gap" in message_lower):
            responses.append(
                "🧠 *Your Skill Gap Analysis:*\n\n"
                "Based on your profile, these skills would boost your market value:\n\n"
                "🔹 *Docker* — Learn in 2 weeks (10+ hours of free content)\n"
                "🔹 *Kubernetes* — High demand for DevOps and backend roles\n"
                "🔹 *TypeScript* — Required for 80% of frontend roles in 2026\n"
                "🔹 *AWS/Azure* — Cloud skills increase salary by 25% on average\n\n"
                "Want me to find courses for any of these?"
            )

        elif "google" in message_lower or "interview" in message_lower or "prepare" in message_lower:
            responses.append(
                "🎙️ *Google Interview Prep Guide:*\n\n"
                "Google interviews typically include:\n\n"
                "1. *Coding* (2-3 rounds) — Focus on data structures & algorithms\n"
                "2. *System Design* (1 round) — For senior roles\n"
                "3. *Behavioral* (1 round) — Leadership & Googleyness\n"
                "4. *Googleyness* — Culture fit, collaboration, ambiguity handling\n\n"
                "Use /interviewprep to start a practice session now!"
            )

        elif "salary" in message_lower or "negotiate" in message_lower:
            responses.append(
                "💰 *Salary Negotiation Tips:*\n\n"
                "1. *Never share your current salary first* — Let them name a range\n"
                "2. *Research market rates* — Use Glassdoor, Levels.fyi, AmbitionBox\n"
                "3. *Negotiate beyond base* — Stock, bonus, sign-on, remote flexibility\n"
                "4. *Time it right* — After offer, before signing\n\n"
                "Average 10-20% increase for skilled negotiators!"
            )

        elif "linkedin" in message_lower or "profile" in message_lower:
            responses.append(
                "🔗 *LinkedIn Optimization Checklist:*\n\n"
                "✅ Professional headshot (profiles with photos get 14x more views)\n"
                "✅ Keyword-rich headline (not just \"Software Engineer\")\n"
                "✅ Detailed \"About\" section with your impact metrics\n"
                "✅ Skills endorsed by at least 5 connections\n"
                "✅ Active posting — 3x/week minimum\n"
                "✅ Custom URL (linkedin.com/in/yourname)\n\n"
                "Want me to review your LinkedIn summary?"
            )

        elif "hello" in message_lower or "hi" in message_lower or "hey" in message_lower:
            responses.append(
                "👋 Hello! I'm your CareerCopilot AI assistant.\n\n"
                "I can help you with:\n"
                "🔍 Finding jobs · 📄 Resume analysis · 🎙️ Interview prep\n"
                "📊 ATS scoring · 💡 Career tips · 🎯 Recommendations\n\n"
                "What would you like to work on today?"
            )

        if not responses:
            responses.append(
                "🤔 I understand you're asking about \"" + message[:50] + "\".\n\n"
                "Here's what I can help with:\n\n"
                "• *Find jobs* — Search by role, company, or skills\n"
                "• *Resume analysis* — Upload and get ATS score + improvement tips\n"
                "• *Interview prep* — Practice with AI-generated questions\n"
                "• *Career advice* — Skills, salary, LinkedIn, and more\n\n"
                "Try /help to see all commands, or just ask me anything!"
            )

        return random.choice(responses)


ai_chat_service = AIChatService()
