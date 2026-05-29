from backend.app.db.session import Base
from backend.app.models.resume import Resume, ResumeAnalysis
from backend.app.models.job import Job, SavedJob, JobMatch
from backend.app.models.ai import Embedding, CareerInsight, Recommendation
from backend.app.models.dashboard import Application, Notification, Subscription, ActivityLog
from backend.app.models.interview import Interview, InterviewQuestion, InterviewFeedback
from backend.app.models.telegram import TelegramUser, TelegramAlert, BotActivity
from backend.app.models.automation import AutoApplication, CoverLetter, AutomationQueue, AutomationSession
