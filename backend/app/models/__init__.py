from backend.app.models.resume import Resume, ResumeAnalysis
from backend.app.models.job import Job, SavedJob, JobMatch
from backend.app.models.ai import Embedding, CareerInsight, Recommendation
from backend.app.models.dashboard import Application, Notification, Subscription, ActivityLog
from backend.app.models.interview import Interview, InterviewQuestion, InterviewFeedback
from backend.app.models.telegram import TelegramUser, TelegramAlert, BotActivity
from backend.app.models.automation import AutoApplication, CoverLetter, AutomationQueue, AutomationSession

__all__ = [
    "Resume", "ResumeAnalysis", "Job", "SavedJob", "JobMatch",
    "Embedding", "CareerInsight", "Recommendation",
    "Application", "Notification", "Subscription", "ActivityLog",
    "Interview", "InterviewQuestion", "InterviewFeedback",
    "TelegramUser", "TelegramAlert", "BotActivity",
    "AutoApplication", "CoverLetter", "AutomationQueue", "AutomationSession",
]
