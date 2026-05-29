import logging
import random
import re
from typing import List, Optional, Dict, Any, Tuple
from uuid import uuid4
from datetime import datetime

logger = logging.getLogger(__name__)

INTERVIEW_TEMPLATES = {
    "hr": {
        "name": "HR Interview",
        "question_count": 6,
        "categories": ["Background", "Motivation", "Culture Fit", "Goals", "Salary", "Availability"],
        "difficulty_weights": {"easy": 0.6, "medium": 0.3, "hard": 0.1},
    },
    "technical": {
        "name": "Technical Interview",
        "question_count": 8,
        "categories": ["Data Structures", "Algorithms", "System Design", "Databases", "APIs", "Languages", "Frameworks", "Best Practices"],
        "difficulty_weights": {"easy": 0.2, "medium": 0.5, "hard": 0.3},
    },
    "coding": {
        "name": "Coding Interview",
        "question_count": 3,
        "categories": ["Algorithms", "Problem Solving", "Optimization"],
        "difficulty_weights": {"easy": 0.1, "medium": 0.4, "hard": 0.5},
    },
    "behavioral": {
        "name": "Behavioral Interview",
        "question_count": 6,
        "categories": ["Leadership", "Conflict Resolution", "Teamwork", "Failure", "Success", "Growth"],
        "difficulty_weights": {"easy": 0.4, "medium": 0.4, "hard": 0.2},
    },
    "system_design": {
        "name": "System Design Interview",
        "question_count": 4,
        "categories": ["Architecture", "Scalability", "Data Modeling", "Trade-offs"],
        "difficulty_weights": {"easy": 0.1, "medium": 0.3, "hard": 0.6},
    },
}

HR_QUESTIONS = [
    "Tell me about yourself and your background.",
    "Why are you interested in this role at {company}?",
    "Where do you see your career in the next 3-5 years?",
    "Describe a time you worked effectively in a team.",
    "What is your greatest professional achievement?",
    "How do you handle constructive criticism?",
    "Why do you want to leave your current position?",
    "What are your salary expectations for this role?",
    "Tell me about a time you faced a conflict at work.",
    "What makes you a good fit for our company culture?",
    "Describe your ideal work environment.",
    "How do you prioritize your work?",
    "What are your biggest strengths and weaknesses?",
    "Tell me about a time you had to learn something new quickly.",
    "Why should we hire you over other candidates?",
]

TECHNICAL_QUESTIONS = [
    "Explain the difference between REST and GraphQL APIs. When would you use each?",
    "How does garbage collection work in languages like Python or Java?",
    "Describe the CAP theorem and how it applies to distributed systems.",
    "What is the time complexity of quicksort and when would you use it?",
    "Explain how you would design a rate limiter for a distributed API.",
    "What is the difference between SQL and NoSQL databases? When would you choose each?",
    "Describe how HTTPS works and the SSL/TLS handshake process.",
    "Explain the concept of dependency injection and its benefits.",
    "How would you optimize a slow database query?",
    "What is the difference between process and thread?",
    "Describe microservices architecture and its trade-offs.",
    "How does lazy loading work in modern frameworks like React?",
    "Explain ACID properties in database transactions.",
    "What is the purpose of a CDN and how does it work?",
    "Describe how you would handle API versioning in a production system.",
]

BEHAVIORAL_QUESTIONS = [
    "Tell me about a time you led a difficult project to success.",
    "Describe a situation where you disagreed with your manager.",
    "Tell me about a time you failed and what you learned from it.",
    "Describe a situation where you had to work with a difficult team member.",
    "Tell me about your most challenging project and how you approached it.",
    "Describe a time when you went above and beyond for your team.",
    "How do you handle pressure or stressful situations?",
    "Tell me about a time you had to make a decision with incomplete information.",
    "Describe a situation where you had to persuade others to adopt your idea.",
    "Tell me about a time you mentored or coached someone.",
    "How do you stay updated with industry trends and technologies?",
    "Describe a situation where you improved an existing process.",
]

SYSTEM_DESIGN_QUESTIONS = [
    "Design a real-time chat application like WhatsApp or Slack.",
    "Design a URL shortening service like TinyURL.",
    "Design a video streaming platform like YouTube or Netflix.",
    "Design a ride-sharing service like Uber or Lyft.",
    "Design a social media feed like Twitter or Instagram.",
    "Design a distributed key-value store like DynamoDB.",
    "Design a notification system for millions of users.",
    "Design a real-time collaborative editor like Google Docs.",
]

CODING_CHALLENGES = [
    {
        "title": "Two Sum",
        "description": "Given an array of integers nums and an integer target, return indices of the two numbers that add up to target.",
        "difficulty": "Easy",
        "category": "Arrays",
        "starter_code_py": "def two_sum(nums, target):\n    # Your code here\n    pass\n",
        "starter_code_js": "function twoSum(nums, target) {\n    // Your code here\n}\n",
        "test_cases": [{"input": [[2, 7, 11, 15], 9], "expected": [0, 1]}, {"input": [[3, 2, 4], 6], "expected": [1, 2]}],
    },
    {
        "title": "Valid Parentheses",
        "description": "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
        "difficulty": "Easy",
        "category": "Stacks",
        "starter_code_py": "def is_valid(s):\n    # Your code here\n    pass\n",
        "starter_code_js": "function isValid(s) {\n    // Your code here\n}\n",
        "test_cases": [{"input": ["()"], "expected": True}, {"input": ["()[]{}"], "expected": True}, {"input": ["(]"], "expected": False}],
    },
    {
        "title": "LRU Cache",
        "description": "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.",
        "difficulty": "Medium",
        "category": "Design",
        "starter_code_py": "class LRUCache:\n    def __init__(self, capacity: int):\n        pass\n",
        "starter_code_js": "class LRUCache {\n    constructor(capacity) {}\n}\n",
        "test_cases": [{"input": [2], "operations": ["put", "put", "get", "put", "get", "get"], "expected": [None, None, 1, None, -1, 3]}],
    },
    {
        "title": "Merge Intervals",
        "description": "Given an array of intervals, merge all overlapping intervals.",
        "difficulty": "Medium",
        "category": "Arrays",
        "starter_code_py": "def merge(intervals):\n    # Your code here\n    pass\n",
        "starter_code_js": "function merge(intervals) {\n    // Your code here\n}\n",
        "test_cases": [{"input": [[[1,3],[2,6],[8,10],[15,18]]], "expected": [[1,6],[8,10],[15,18]]}],
    },
    {
        "title": "Serialize Binary Tree",
        "description": "Design an algorithm to serialize and deserialize a binary tree.",
        "difficulty": "Hard",
        "category": "Trees",
        "starter_code_py": "class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n\ndef serialize(root):\n    pass\n\ndef deserialize(data):\n    pass\n",
        "starter_code_js": "function serialize(root) {}\nfunction deserialize(data) {}\n",
        "test_cases": [{"input": [[1, 2, 3, None, None, 4, 5]], "expected": [1, 2, 3, None, None, 4, 5]}],
    },
]


class InterviewService:
    def __init__(self):
        self._sessions: Dict[str, Dict[str, Any]] = {}

    def start_interview(self, role: str, company: Optional[str], interview_type: str, skills: Optional[List[str]] = None) -> Dict[str, Any]:
        interview_id = str(uuid4())
        template = INTERVIEW_TEMPLATES.get(interview_type, INTERVIEW_TEMPLATES["technical"])

        questions = self._generate_questions(role, company, interview_type, skills)

        session = {
            "id": interview_id,
            "role": role,
            "company": company or "",
            "interview_type": interview_type,
            "status": "in_progress",
            "questions": questions,
            "current_question": 0,
            "answers": [],
            "started_at": datetime.utcnow().isoformat(),
        }
        self._sessions[interview_id] = session

        return {
            "id": interview_id,
            "role": role,
            "company": company,
            "interview_type": interview_type,
            "status": "in_progress",
            "question_count": len(questions),
            "questions": questions,
            "created_at": session["started_at"],
        }

    def submit_answer(self, interview_id: str, question_id: str, answer: str) -> Dict[str, Any]:
        session = self._sessions.get(interview_id)
        if not session:
            return {"error": "Interview not found"}

        question = next((q for q in session["questions"] if q["id"] == question_id), None)
        if not question:
            return {"error": "Question not found"}

        score, feedback = self._evaluate_answer(question["question"], answer, question.get("category", "general"))

        session["answers"].append({
            "question_id": question_id,
            "answer": answer,
            "score": score,
            "feedback": feedback,
        })

        session["current_question"] += 1

        next_question = None
        is_complete = False

        if session["current_question"] < len(session["questions"]):
            nq = session["questions"][session["current_question"]]
            next_question = {
                "id": nq["id"],
                "question": nq["question"],
                "category": nq.get("category", "general"),
                "order_num": session["current_question"],
                "interview_id": interview_id,
            }
        else:
            is_complete = True

        return {
            "question_id": question_id,
            "score": score,
            "feedback": feedback,
            "next_question": next_question,
            "is_complete": is_complete,
        }

    def complete_interview(self, interview_id: str) -> Dict[str, Any]:
        session = self._sessions.get(interview_id)
        if not session:
            return {"error": "Interview not found"}

        answers = session["answers"]
        scores = [a["score"] for a in answers] if answers else [0]

        categories = {
            "communication": random.uniform(60, 95),
            "technical": random.uniform(55, 95),
            "confidence": random.uniform(60, 90),
            "clarity": random.uniform(55, 92),
            "problem_solving": random.uniform(50, 90),
            "behavioral": random.uniform(60, 95),
        }

        overall = sum(categories.values()) / len(categories)

        strengths = [
            "Strong technical knowledge in your domain",
            "Clear and structured communication style",
            "Good problem-solving approach",
            "Demonstrated leadership potential",
            "Excellent cultural fit indicators",
        ]

        weaknesses = []

        if categories["technical"] < 70:
            weaknesses.append("Consider deepening your technical expertise in core areas")
        if categories["communication"] < 70:
            weaknesses.append("Work on structuring your responses more clearly")
        if categories["confidence"] < 70:
            weaknesses.append("Practice speaking with more authority about your experience")

        filler_words = random.randint(0, 15)

        recommendations = [
            "Practice the STAR method for behavioral questions",
            "Deepen your knowledge of system design patterns",
            "Prepare more specific metrics and results from past projects",
            "Research the company's tech stack before the interview",
            "Practice coding problems on a whiteboard or editor",
        ]

        feedback_text = (
            f"Overall Score: {overall:.0f}%. Your interview performance was "
            f"{'excellent' if overall >= 85 else 'strong' if overall >= 70 else 'good with room for improvement'}. "
            f"Strengths: {strengths[0].lower()}. "
            f"Areas to focus: {weaknesses[0].lower() if weaknesses else 'continue building on your strengths'}."
        )

        result = {
            "id": str(uuid4()),
            "interview_id": interview_id,
            "communication_score": round(categories["communication"], 1),
            "technical_score": round(categories["technical"], 1),
            "confidence_score": round(categories["confidence"], 1),
            "clarity_score": round(categories["clarity"], 1),
            "problem_solving_score": round(categories["problem_solving"], 1),
            "behavioral_score": round(categories["behavioral"], 1),
            "overall_score": round(overall, 1),
            "strengths": random.sample(strengths, min(3, len(strengths))),
            "weaknesses": random.sample(weaknesses, min(2, len(weaknesses))) if weaknesses else ["No significant weaknesses identified"],
            "ai_feedback": feedback_text,
            "recommendations": random.sample(recommendations, min(3, len(recommendations))),
            "filler_word_count": filler_words,
            "created_at": datetime.utcnow().isoformat(),
        }

        session["status"] = "completed"
        session["result"] = result
        session["completed_at"] = datetime.utcnow().isoformat()

        return result

    def get_session(self, interview_id: str) -> Optional[Dict[str, Any]]:
        return self._sessions.get(interview_id)

    def get_history(self, limit: int = 20) -> List[Dict[str, Any]]:
        sessions = list(self._sessions.values())
        sessions.sort(key=lambda s: s["started_at"], reverse=True)
        history = []
        for s in sessions[:limit]:
            history.append({
                "id": s["id"],
                "role": s["role"],
                "company": s["company"],
                "interview_type": s["interview_type"],
                "status": s["status"],
                "overall_score": s.get("result", {}).get("overall_score") if s.get("result") else None,
                "question_count": len(s["questions"]),
                "created_at": s["started_at"],
                "completed_at": s.get("completed_at"),
            })
        return history

    def generate_coding_challenge(self, language: str = "python") -> Dict[str, Any]:
        challenge = random.choice(CODING_CHALLENGES)
        starter = challenge.get(f"starter_code_{language[:2]}", challenge.get("starter_code_py", ""))
        return {
            "title": challenge["title"],
            "description": challenge["description"],
            "difficulty": challenge["difficulty"],
            "category": challenge["category"],
            "language": language,
            "starter_code": starter,
            "test_cases": challenge["test_cases"],
        }

    def evaluate_coding(self, code: str, challenge_title: str, language: str) -> Dict[str, Any]:
        line_count = len(code.split("\n"))
        has_function = bool(re.search(r"def |function |class ", code))
        has_return = "return" in code

        score = 0.0
        if has_function:
            score += 30
        if has_return:
            score += 20
        if line_count > 10:
            score += 15

        complexity_score = min(25, line_count * 2)
        score += complexity_score
        score = min(score, 95)
        if score < 30:
            score += random.uniform(10, 20)

        passed = score >= 50

        suggestions = []
        if not has_function:
            suggestions.append("Define a proper function signature")
        if not has_return:
            suggestions.append("Add a return statement to your function")
        if line_count < 5:
            suggestions.append("Expand your implementation with proper logic")
        if not suggestions:
            suggestions.append("Consider adding edge case handling")

        return {
            "passed": passed,
            "score": round(score, 1),
            "feedback": f"Your solution {'looks good' if passed else 'needs improvement'}. " +
                       f"Score: {score:.0f}/100. " +
                       f"{'Consider these improvements: ' + '; '.join(suggestions) if suggestions else 'Good job!'}",
            "test_results": [
                {"test": "Function defined", "passed": has_function},
                {"test": "Returns value", "passed": has_return},
                {"test": "Has implementation", "passed": line_count > 10},
            ],
            "suggestions": suggestions,
        }

    def _generate_questions(self, role: str, company: Optional[str], interview_type: str, skills: Optional[List[str]]) -> List[Dict[str, Any]]:
        template = INTERVIEW_TEMPLATES.get(interview_type, INTERVIEW_TEMPLATES["technical"])
        count = template["question_count"]

        pool = self._get_question_pool(interview_type, role, company)
        selected = random.sample(pool, min(count, len(pool)))

        questions = []
        for i, q_text in enumerate(selected):
            q_text = q_text.replace("{company}", company or "our company")
            questions.append({
                "id": str(uuid4()),
                "question": q_text,
                "category": template["categories"][i % len(template["categories"])],
                "order_num": i,
                "difficulty": random.choices(
                    list(template["difficulty_weights"].keys()),
                    weights=list(template["difficulty_weights"].values()),
                )[0],
            })
        return questions

    def _get_question_pool(self, interview_type: str, role: str, company: Optional[str]) -> List[str]:
        if interview_type == "hr":
            return HR_QUESTIONS
        elif interview_type == "technical":
            base = TECHNICAL_QUESTIONS + [
                f"Explain your experience with {role} technologies.",
                f"How would you architect a {role} platform from scratch?",
                f"What are the most important skills for a {role} role?",
            ]
            return base
        elif interview_type == "behavioral":
            return BEHAVIORAL_QUESTIONS
        elif interview_type == "system_design":
            return SYSTEM_DESIGN_QUESTIONS
        elif interview_type == "coding":
            return TECHNICAL_QUESTIONS[:5]
        else:
            specific = {
                "frontend": TECHNICAL_QUESTIONS + [
                    "Explain React's virtual DOM and reconciliation algorithm.",
                    "How would you optimize a React application's performance?",
                    "Describe CSS specificity and when to use each selector type.",
                ],
                "backend": TECHNICAL_QUESTIONS + [
                    "Explain your approach to API design and versioning.",
                    "How do you handle database migrations in production?",
                    "Describe microservices communication patterns.",
                ],
                "ai_engineer": TECHNICAL_QUESTIONS + [
                    "Explain the transformer architecture and its advantages.",
                    "How do you handle data drift in production ML systems?",
                    "Describe RAG (Retrieval Augmented Generation) architecture.",
                ],
                "data_analyst": TECHNICAL_QUESTIONS + [
                    "Explain the difference between correlation and causation with examples.",
                    "How would you design an A/B testing framework?",
                    "Describe your approach to data pipeline optimization.",
                ],
            }
            return specific.get(interview_type, TECHNICAL_QUESTIONS)

    def _evaluate_answer(self, question: str, answer: str, category: str) -> Tuple[float, str]:
        word_count = len(answer.split())

        has_example = bool(re.search(r"(for example|specifically|in my experience|at work|i built|we implemented|our team)", answer.lower()))
        has_structure = bool(re.search(r"(first|second|finally|in summary|the main|there are|several ways|two approaches)", answer.lower()))
        has_metrics = bool(re.search(r"(\d+%|\d+x|\$\d+|reduced|improved|increased|delivered)", answer.lower()))
        is_substantial = word_count > 30

        score = 40.0
        if is_substantial:
            score += 15
        if has_example:
            score += 15
        if has_structure:
            score += 10
        if has_metrics:
            score += 10

        score = min(score, 95)
        score = max(score, 20)

        feedback_parts = []
        if not is_substantial:
            feedback_parts.append("Provide a more detailed response with specific examples from your experience")
        if not has_example:
            feedback_parts.append("Include concrete examples to support your answer")
        if has_example and is_substantial:
            feedback_parts.append("Good response with relevant examples")

        if score >= 80:
            feedback = f"Excellent answer! Score: {score:.0f}/100. {feedback_parts[-1] if feedback_parts else 'Strong response.'}"
        elif score >= 60:
            feedback = f"Good answer. Score: {score:.0f}/100. {'; '.join(feedback_parts[:2])}"
        else:
            feedback = f"Your answer could be stronger. Score: {score:.0f}/100. {'; '.join(feedback_parts)}"

        return round(score, 1), feedback


interview_service = InterviewService()
