import logging
from typing import Optional
from uuid import UUID
from fastapi import APIRouter, HTTPException, Query, Body

from backend.app.schemas.interview import (
    InterviewStartRequest, InterviewResponse, QuestionResponse, AnswerSubmit,
    AnswerFeedback, InterviewFeedbackResponse, InterviewDetail,
    InterviewHistoryResponse, CodingChallenge, CodingSubmission, CodingResult,
    GenerateQuestionRequest, GenerateQuestionResponse,
)
from backend.app.services.interview_service import interview_service

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/start", response_model=dict)
async def start_interview(request: InterviewStartRequest):
    try:
        result = interview_service.start_interview(
            role=request.role,
            company=request.company,
            interview_type=request.interview_type,
            skills=request.skills,
        )
        return result
    except Exception as e:
        logger.error(f"Start interview failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/answer", response_model=dict)
async def submit_answer(request: AnswerSubmit):
    try:
        result = interview_service.submit_answer(
            interview_id=str(request.interview_id),
            question_id=str(request.question_id),
            answer=request.answer,
        )
        if "error" in result:
            raise HTTPException(status_code=404, detail=result["error"])
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Submit answer failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/{interview_id}/complete", response_model=InterviewFeedbackResponse)
async def complete_interview(interview_id: UUID):
    try:
        result = interview_service.complete_interview(str(interview_id))
        if "error" in result:
            raise HTTPException(status_code=404, detail=result["error"])
        return InterviewFeedbackResponse(**result)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Complete interview failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/history", response_model=dict)
async def get_interview_history(limit: int = Query(20, ge=1, le=100)):
    try:
        history = interview_service.get_history(limit)
        scores = [h.get("overall_score", 0) or 0 for h in history if h.get("overall_score")]
        avg = sum(scores) / len(scores) if scores else 0

        type_counts = {}
        for h in history:
            t = h["interview_type"]
            type_counts[t] = type_counts.get(t, 0) + 1

        return {
            "interviews": history,
            "total": len(history),
            "average_score": round(avg, 1),
            "interviews_by_type": type_counts,
        }
    except Exception as e:
        logger.error(f"Interview history failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{interview_id}", response_model=dict)
async def get_interview_detail(interview_id: UUID):
    try:
        session = interview_service.get_session(str(interview_id))
        if not session:
            raise HTTPException(status_code=404, detail="Interview not found")
        return {
            "interview": {
                "id": session["id"],
                "role": session["role"],
                "company": session["company"],
                "interview_type": session["interview_type"],
                "status": session["status"],
                "question_count": len(session["questions"]),
                "created_at": session["started_at"],
                "completed_at": session.get("completed_at"),
            },
            "questions": [
                {
                    "id": q["id"],
                    "question": q["question"],
                    "category": q.get("category"),
                    "order_num": q["order_num"],
                    "answer": next(
                        (a["answer"] for a in session.get("answers", []) if a["question_id"] == q["id"]),
                        None,
                    ),
                    "score": next(
                        (a["score"] for a in session.get("answers", []) if a["question_id"] == q["id"]),
                        None,
                    ),
                    "feedback": next(
                        (a["feedback"] for a in session.get("answers", []) if a["question_id"] == q["id"]),
                        None,
                    ),
                }
                for q in session["questions"]
            ],
            "feedback": session.get("result"),
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get interview detail failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/coding/challenge", response_model=CodingChallenge)
async def get_coding_challenge(language: str = Query("python")):
    try:
        challenge = interview_service.generate_coding_challenge(language)
        return CodingChallenge(**challenge)
    except Exception as e:
        logger.error(f"Coding challenge failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/coding/evaluate", response_model=CodingResult)
async def evaluate_coding(submission: CodingSubmission):
    try:
        result = interview_service.evaluate_coding(
            code=submission.code,
            challenge_title=submission.question,
            language=submission.language,
        )
        return CodingResult(**result)
    except Exception as e:
        logger.error(f"Coding evaluation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate-question", response_model=GenerateQuestionResponse)
async def generate_question(request: GenerateQuestionRequest):
    try:
        service_result = interview_service.start_interview(
            role=request.role,
            company=request.company or "",
            interview_type=request.interview_type,
            skills=request.skills,
        )
        questions = service_result.get("questions", [])
        if not questions:
            raise HTTPException(status_code=500, detail="Failed to generate question")
        q = questions[0]
        return GenerateQuestionResponse(
            question=q["question"],
            category=q.get("category", "general"),
            difficulty=q.get("difficulty", "medium"),
            expected_points=[q["question"]],
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Generate question failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))
