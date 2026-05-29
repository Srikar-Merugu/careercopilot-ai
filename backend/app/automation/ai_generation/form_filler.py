import logging
import random
from typing import List, Dict, Any, Optional

logger = logging.getLogger(__name__)


class FormFillingAI:

    def generate_response(self, field: Dict[str, Any], context: Dict[str, Any]) -> str:
        field_name = (field.get("name") or "").lower()
        field_label = (field.get("label") or "").lower()
        field_placeholder = (field.get("placeholder") or "").lower()
        field_type = field.get("type", "text")

        combined = f"{field_name} {field_label} {field_placeholder}"

        if "name" in combined and ("full" in combined or "first" in combined or "last" in combined):
            return context.get("name", "John Doe")

        if "email" in combined:
            return context.get("email", "candidate@example.com")

        if "phone" in combined or "tel" in combined:
            return context.get("phone", "+91-9876543210")

        if "linkedin" in combined:
            return context.get("linkedin", "https://linkedin.com/in/profile")

        if "github" in combined or "portfolio" in combined:
            return context.get("portfolio", "https://github.com/profile")

        if "resume" in combined or "cv" in combined or "file" in combined:
            return ""

        if "cover" in combined and "letter" in combined:
            return context.get("cover_letter", "")

        if "year" in combined or "experience" in combined:
            if "grad" in combined:
                return "2022"
            return context.get("experience_years", "5")

        if "salary" in combined or "compensation" in combined or "ctc" in combined:
            return context.get("expected_salary", "25")

        if "location" in combined or "city" in combined or "state" in combined:
            return context.get("location", "Bangalore")

        if "school" in combined or "university" in combined or "college" in combined:
            return context.get("education", "Bachelor's in Computer Science")

        if "degree" in combined:
            return "Bachelor's"

        if "major" in combined or "field" in combined:
            return "Computer Science"

        if "skill" in combined:
            skills = context.get("skills", [])
            return ", ".join(skills[:5]) if skills else "Python, JavaScript, React"

        if "work" in combined or "company" in combined or "employer" in combined:
            return context.get("current_company", "Previous Company")

        if "role" in combined or "title" in combined or "position" in combined:
            return context.get("current_role", "Software Engineer")

        if "notice" in combined or "join" in combined:
            return context.get("notice_period", "30 days")

        if "referral" in combined or "source" in combined:
            return "LinkedIn"

        if "heard" in combined or "find" in combined:
            return "LinkedIn"

        if "start" in combined and "date" in combined:
            return "Immediately"

        if "available" in combined:
            return "Yes, immediately available"

        if "authorized" in combined or "visa" in combined or "sponsorship" in combined:
            return "Yes"

        if "gender" in combined:
            return "Prefer not to say"

        if "disability" in combined:
            return "No"

        if "race" in combined or "ethnicity" in combined:
            return "Prefer not to say"

        if "veteran" in combined:
            return "No"

        if "agree" in combined or "confirm" in combined or "certify" in combined:
            return "Yes"

        if "text" in field_type or "textarea" in field_type:
            role = context.get("current_role", "the role")
            company = context.get("current_company", "Company")
            return f"I have {context.get('experience_years', '5')} years of experience in {role} at {company}. I'm passionate about building scalable solutions and driving meaningful impact."

        return "N/A"


form_filling_ai = FormFillingAI()
