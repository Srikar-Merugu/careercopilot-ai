from backend.app.models.user import UserModel
from backend.app.models.resume import Resume, ResumeAnalysis
from backend.app.models.job import Job, SavedJob, JobMatch
from backend.app.models.ai import Embedding, CareerInsight, Recommendation, EmbeddingType
from backend.app.models.dashboard import Application, Notification, Subscription, ActivityLog, ApplicationStatus, NotificationType, SubscriptionPlan, SubscriptionStatus
from backend.app.models.interview import Interview, InterviewQuestion, InterviewFeedback, InterviewType, InterviewStatus
from backend.app.models.telegram import TelegramUser, TelegramAlert, BotActivity, AlertType
from backend.app.models.automation import AutoApplication, CoverLetter, AutomationQueueItem, AutomationSession, AutomationPipeline, ApplicationStatus as AutoAppStatus, AutomationQueueStatus

__all__ = [
    "UserModel",
    "Resume", "ResumeAnalysis",
    "Job", "SavedJob", "JobMatch",
    "Embedding", "CareerInsight", "Recommendation", "EmbeddingType",
    "Application", "Notification", "Subscription", "ActivityLog",
    "ApplicationStatus", "NotificationType", "SubscriptionPlan", "SubscriptionStatus",
    "Interview", "InterviewQuestion", "InterviewFeedback", "InterviewType", "InterviewStatus",
    "TelegramUser", "TelegramAlert", "BotActivity", "AlertType",
    "AutoApplication", "CoverLetter", "AutomationQueueItem", "AutomationSession", "AutomationPipeline",
    "AutoAppStatus", "AutomationQueueStatus",
]
