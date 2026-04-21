from dataclasses import dataclass


@dataclass
class AgentDecision:
    intent: str
    style_instruction: str
    follow_up: str


HR_KEYWORDS = {
    "team",
    "leadership",
    "culture",
    "company",
    "collaboration",
    "communication",
    "salary",
    "resume",
    "cv",
    "strength",
    "weakness",
    "experience",
    "why",
    "hire",
}

TECHNICAL_KEYWORDS = {
    "api",
    "backend",
    "fastapi",
    "python",
    "sql",
    "architecture",
    "system",
    "design",
    "jwt",
    "redis",
    "performance",
    "database",
    "bug",
    "code",
    "scaling",
    "microservice",
}


def detect_intent(user_message: str) -> str:
    normalized_message = user_message.lower()

    technical_score = sum(1 for keyword in TECHNICAL_KEYWORDS if keyword in normalized_message)
    hr_score = sum(1 for keyword in HR_KEYWORDS if keyword in normalized_message)

    if technical_score > hr_score:
        return "technical"
    if hr_score > technical_score:
        return "hr"
    return "general"


def build_agent_decision(user_message: str) -> AgentDecision:
    intent = detect_intent(user_message)
    return _decision_from_intent(intent)


def build_agent_decision_from_intent(intent: str) -> AgentDecision:
    return _decision_from_intent(intent)


def _decision_from_intent(intent: str) -> AgentDecision:
    if intent == "technical":
        return AgentDecision(
            intent="technical",
            style_instruction=(
                "Answer like a strong backend engineer. Be concrete, mention architecture "
                "tradeoffs, and use technical examples from the profile when relevant. "
                "Keep responses concise (2–3 sentences max). Avoid long explanations"
            ),
            follow_up="Would you like me to also explain the technical tradeoffs or challenges behind that project?",
        )

    if intent == "hr":
        return AgentDecision(
            intent="hr",
            style_instruction=(
                "Answer like a candidate speaking to a recruiter or hiring manager. "
                "Be clear, confident, persuasive, and connect the answer to business value. "
                "Keep responses concise (2–3 sentences max). Avoid long explanations"

            ),
            follow_up="Would you like a shorter recruiter-style version or a deeper interview-style answer?",
        )

    return AgentDecision(
        intent="general",
        style_instruction=(
            "Answer clearly and keep the tone balanced between professional and friendly. "
            "If useful, guide the conversation toward projects, strengths, or technical depth."
        ),
        follow_up="Would you like me to expand on projects, backend skills, or how I work in a team?",
    )