import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

// This function is called by entity automation on Work create/update
// It triggers oracle generation only for research-category works without a summary

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const payload = await req.json();

        const { event, data } = payload;
        const work = data;

        if (!work) {
            return Response.json({ skipped: true, reason: 'no data' });
        }

        // Only process research entries without an existing complete oracle summary
        const isResearch = work.category === 'research';
        const needsOracle = !work.oracle_status || work.oracle_status === 'pending';
        const notAlreadyRunning = work.oracle_status !== 'generating' && work.oracle_status !== 'complete';

        if (!isResearch || !notAlreadyRunning) {
            return Response.json({ skipped: true, reason: 'not research or already processed' });
        }

        // Fire the oracle generation
        await base44.asServiceRole.functions.invoke('generateOracleSummary', {
            work_id: work.id
        });

        return Response.json({ triggered: true, work_id: work.id });

    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});