import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const ORACLE_PROMPT = (work) => `
You are the Global Tech Oracle. Analyze the following research work and produce a structured 7-step report. Every step must be addressed before proceeding to the next — no step may be skipped.

Work Title: "${work.title}"
Category: ${work.category || 'research'}
Description: ${work.description || 'No description provided.'}
Tags: ${(work.tags || []).join(', ') || 'none'}
Content Preview: ${work.content_preview || 'None provided.'}

Produce the analysis in EXACTLY this 7-step format:

**1. Brief Summary**
A concise 3-sentence introduction outlining the technology/concept and its core function.

**2. Technological Breakdown**
How it works, its components, technical limitations.

**3. Societal & Economic Impact**
Effects on industries, consumers, and economies. Regulatory challenges.

**4. Statistical & Market Analysis**
Reference data trends, adoption rates, or case studies. Flag where real-world data insertion is needed.

**5. Competing Viewpoints**
- Tech Optimist: Why this is transformative and should be widely adopted.
- Tech Skeptic: Flaws, risks, or economic concerns.
- Investor Perspective: Financial viability, projected growth, scalability.
- Ethical Watchdog: Privacy, ethics, or misuse risks.

**6. Geopolitical & Ethical Considerations**
How different countries might react, global challenges, ethical dilemmas.

**7. Final Evaluation**
Summarize viability, scalability, and ethical standing based on all factors above.

Do NOT use markdown code blocks. Use plain bold headers as shown. Be specific, analytical, and structured.
`;

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const { work_id } = await req.json();

        if (!work_id) {
            return Response.json({ error: 'work_id is required' }, { status: 400 });
        }

        // Mark as generating
        await base44.asServiceRole.entities.Work.update(work_id, {
            oracle_status: 'generating'
        });

        // Fetch the work item
        const works = await base44.asServiceRole.entities.Work.list();
        const work = works.find(w => w.id === work_id);

        if (!work) {
            return Response.json({ error: 'Work not found' }, { status: 404 });
        }

        // Generate oracle summary
        const summary = await base44.asServiceRole.integrations.Core.InvokeLLM({
            prompt: ORACLE_PROMPT(work),
            model: 'claude_sonnet_4_6'
        });

        // Save back to the entity
        await base44.asServiceRole.entities.Work.update(work_id, {
            oracle_summary: summary,
            oracle_status: 'complete'
        });

        return Response.json({ success: true, work_id, oracle_summary: summary });

    } catch (error) {
        // Try to mark as error if we have work_id
        try {
            const base44 = createClientFromRequest(req);
            const { work_id } = await req.json().catch(() => ({}));
            if (work_id) {
                await base44.asServiceRole.entities.Work.update(work_id, { oracle_status: 'error' });
            }
        } catch {}

        return Response.json({ error: error.message }, { status: 500 });
    }
});