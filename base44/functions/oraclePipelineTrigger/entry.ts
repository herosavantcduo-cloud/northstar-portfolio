import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

// Triggered on Work create OR update
// Fires oracle generation for ANY category when oracle_status becomes 'pending'

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const payload = await req.json();
        const { event, data, old_data } = payload;
        const work = data;

        if (!work) {
            return Response.json({ skipped: true, reason: 'no data' });
        }

        const isPending = work.oracle_status === 'pending';
        const wasAlreadyPending = old_data && old_data.oracle_status === 'pending';
        const isCreate = event?.type === 'create';
        const isUpdate = event?.type === 'update';

        // On create: fire if pending
        // On update: fire only if status just became pending (avoid re-triggering loops)
        if (!isPending) {
            return Response.json({ skipped: true, reason: 'oracle_status is not pending' });
        }

        if (isUpdate && wasAlreadyPending) {
            return Response.json({ skipped: true, reason: 'already was pending, no state change' });
        }

        // Fire oracle generation asynchronously
        base44.asServiceRole.functions.invoke('generateOracleSummary', {
            work_id: work.id
        }).catch(() => {});

        return Response.json({ triggered: true, work_id: work.id, category: work.category });

    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});