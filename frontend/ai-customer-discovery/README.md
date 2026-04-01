#AI Customer Discovery → Prototype Generator#

Transform raw customer discovery notes into structured requirements, technical architecture, and a working prototype—all powered by AI.

<!-- TODO add screenshot -->

##Project Overview##

This full-stack application simulates how consultants quickly validate ideas with customers. It takes messy inputs from customer interviews—notes, transcripts, or problem descriptions—and generates a problem summary, requirements, proposed features, and success metrics.

Built to demonstrate rapid concept validation workflows.

Features:
Input Layer
Text input or file upload for customer problems.

Example:

Customer wants to automate support tickets using AI.
AI-Powered Processing
Extracts problem summary, key requirements, and success metrics.

Generates prototype plan, including backend tech stack and suggested endpoints.

<ins>Stack</ins>
Backend: Python FastAPI
Frontend: React/Next.js dashboard
API Endpoints: /analyze

Example Input:

Customer wants to automate support ticket triage using AI.

Example Output:

{
"problem_summary": "Automate support ticket triage using AI.",
"key_requirements": ["Auto-classify tickets", "Prioritize urgent requests"],
"success_metrics": ["Reduce triage time by 50%"]
}
