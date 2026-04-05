import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const ORACLE_PROMPT = (work) => `
You are the Global Tech Oracle — an analytical engine applying the Structured Technology Analysis Spec (STAS). 
You MUST produce a complete 7-section technical critique. Every section is mandatory. Do not skip or abbreviate any section.

---
SUBJECT DOSSIER
Title: "${work.title}"
Category: ${work.category || 'unspecified'}
Tags: ${(work.tags || []).join(', ') || 'none'}
Description: ${work.description || 'No description provided.'}
${work.content_preview ? `Content Preview: ${work.content_preview}` : ''}
---

PRODUCE THE FULL REPORT IN EXACTLY THIS FORMAT:

**SECTION 1 — EXECUTIVE SUMMARY**
In 3–4 precise sentences: what is this, what problem does it solve, and what is its core technical mechanism? State the innovation claim plainly.

**SECTION 2 — TECHNOLOGICAL BREAKDOWN**
Decompose the underlying architecture, components, and processes. Identify the primary technical assumptions. Describe the mechanism of action in engineering terms. List known technical constraints, failure modes, or boundary conditions.

**SECTION 3 — SOCIETAL & ECONOMIC IMPACT**
Map direct and second-order effects on industries, labor markets, and consumer behavior. Identify which economic actors benefit and which face disruption. Outline likely regulatory responses and jurisdictional challenges.

**SECTION 4 — STATISTICAL & MARKET ANALYSIS**
Estimate or cite relevant market size, adoption trajectory, and growth vectors. Reference analogous technologies for benchmark comparisons. Flag any data gaps where real-world validation is still required. Provide projected timelines where applicable.

**SECTION 5 — COMPETING VIEWPOINTS**
- **Tech Optimist**: Why this is transformative; adoption case; best-case trajectory.
- **Tech Skeptic**: Core technical risks, overreach, or implementation gaps.
- **Investor Perspective**: Financial viability, ROI horizon, scalability economics, exit scenarios.
- **Ethical Watchdog**: Privacy, autonomy, misuse vectors, or equity concerns.

**SECTION 6 — GEOPOLITICAL & ETHICAL DIMENSIONS**
Analyze how major geopolitical blocs (US, EU, China, Global South) would approach this differently. Identify dual-use risks, international IP disputes, or cross-border ethical conflicts. Assess military, surveillance, or sovereignty implications if relevant.

**SECTION 7 — FINAL EVALUATION & VERDICT**
Synthesize all prior sections into a final assessment. Rate the following on a 1–10 scale with one-line justifications:
- Technical Maturity: X/10
- Commercial Viability: X/10
- Ethical Standing: X/10
- Geopolitical Risk: X/10
Conclude with a single VERDICT sentence: Transformative / Promising / Speculative / Premature / Concerning — and why.

---
EVIDENCE CLASSIFICATION: For each claim, mentally tag it as [Evidence-Backed], [Plausible], or [Speculative] — do not print tags, but ensure your language reflects the appropriate confidence level.
Do NOT use markdown code blocks. Use bold headers exactly as shown above. Be dense, analytical, and specific.
`;

Deno.serve(async (req) => {
    let work_id;
    try {
        const base44 = createClientFromRequest(req);
        const body = await req.json();
        work_id = body.work_id;

        if (!work_id) {
            return Response.json({ error: 'work_id is required' }, { status: 400 });
        }

        // Mark as generating immediately
        await base44.asServiceRole.entities.Work.update(work_id, {
            oracle_status: 'generating'
        });

        // Fetch the work item
        const works = await base44.asServiceRole.entities.Work.list();
        const work = works.find(w => w.id === work_id);

        if (!work) {
            await base44.asServiceRole.entities.Work.update(work_id, { oracle_status: 'error' });
            return Response.json({ error: 'Work not found' }, { status: 404 });
        }

        // Generate full 7-section oracle analysis
        const summary = await base44.asServiceRole.integrations.Core.InvokeLLM({
            prompt: ORACLE_PROMPT(work),
            model: 'claude_sonnet_4_6'
        });

        // Persist results
        await base44.asServiceRole.entities.Work.update(work_id, {
            oracle_summary: summary,
            oracle_status: 'complete'
        });

        return Response.json({ success: true, work_id });

    } catch (error) {
        if (work_id) {
            try {
                const base44 = createClientFromRequest(req);
                await base44.asServiceRole.entities.Work.update(work_id, { oracle_status: 'error' });
            } catch (_) {}
        }
        return Response.json({ error: error.message }, { status: 500 });
    }
});