# Test Cases — SHAR-1523: Pause Resolution SLA when ticket status is "Waiting Info"

Parent epic: SHAR-661 (Admin & Merchant CRM Ticketing System) — SLA targets reference: SHAR-703

**SLA targets by priority:** Low = 72h, Medium = 48h, High = 24h, Critical = 4h

> [Flagged for PO] Ticket comments note this work is "to be postponed until we separate the registration tickets" and "need[s] to validate this ticket with the new merchant requests flow" — confirm this ticket is still in scope/unblocked before executing these test cases.

## TC-01: SLA timer starts on ticket creation
- Preconditions: New ticket created with a known priority
- Steps: Create a ticket with priority = High; note creation timestamp
- Expected: SLA countdown begins immediately at creation, targeting 24 hours from creation timestamp

## TC-02: SLA target matches priority (all 4 levels)
- Preconditions: Ability to create tickets at each priority level
- Steps: Create one ticket each at Low, Medium, High, Critical
- Expected: SLA due date = creation time + 72h / 48h / 24h / 4h respectively, matching SHAR-703

## TC-03: SLA continues running across active-status transitions
- Preconditions: Ticket exists in an active (non-Waiting Info, non-Resolved/Closed) status
- Steps: Move the ticket between two other active statuses (e.g. "Open" → "In Progress")
- Expected: SLA timer keeps running without pause or reset; elapsed time accumulates continuously

## TC-04: SLA pauses when moved to "Waiting Info"
- Preconditions: Ticket in an active status with SLA timer running
- Steps: Transition ticket status to "Waiting Info"
- Expected: SLA timer pauses immediately at the moment of transition; remaining SLA time is captured/stored

## TC-05: Ticket moves to Waiting tab on pause
- Preconditions: Ticket in an active status
- Steps: Transition ticket to "Waiting Info"
- Expected: Ticket appears in the Waiting tab of the dashboard/queue

## TC-06: No SLA time consumed while in Waiting Info (extended duration)
- Preconditions: Ticket paused in "Waiting Info" with known remaining SLA time
- Steps: Leave ticket in "Waiting Info" for a duration exceeding its original SLA target (e.g. several days)
- Expected: Ticket is NOT marked Overdue/Breached while in Waiting Info, regardless of elapsed wall-clock time; remaining SLA time is unchanged

## TC-07: SLA resumes with remaining time when moved out of Waiting Info
- Preconditions: Ticket paused in "Waiting Info" with a known remaining SLA time (e.g. 10 hours remaining)
- Steps: Transition ticket from "Waiting Info" to any active status
- Expected: SLA timer resumes counting down from the previously captured remaining time (10 hours), not reset to the full target

## TC-08: SLA stops when ticket is Resolved
- Preconditions: Ticket in an active status with SLA timer running
- Steps: Transition ticket status to "Resolved"
- Expected: SLA timer stops permanently; no further elapsed time is counted after this point

## TC-09: SLA stops when ticket is Closed
- Preconditions: Ticket in an active status with SLA timer running
- Steps: Transition ticket status to "Closed"
- Expected: SLA timer stops permanently; no further elapsed time is counted after this point

## TC-10: Ticket marked Overdue/Breached when active SLA time is exceeded
- Preconditions: Ticket with a known SLA target (e.g. High = 24h)
- Steps: Allow ticket to remain in active statuses (excluding Waiting Info) until accumulated active time exceeds 24h without being resolved/closed
- Expected: Ticket is marked Overdue/Breached once total elapsed *active* SLA time exceeds the target

## TC-11: Overdue ticket moves to Overdue tab
- Preconditions: Ticket has breached its SLA per TC-10
- Steps: Observe ticket queue/dashboard after breach
- Expected: Ticket appears in the Overdue tab

## TC-12: Priority change recalculates SLA due date
- Preconditions: Ticket created with priority = Medium (48h target), some time has elapsed
- Steps: Change ticket priority to Critical (4h target)
- Expected: SLA due date is recalculated based on the new priority (4h), starting from the priority-change timestamp — not from original creation time

## TC-13: Priority change while ticket is paused in Waiting Info (edge case)
- Preconditions: Ticket is paused in "Waiting Info" with remaining SLA time tracked
- Steps: Change ticket priority while still in "Waiting Info"
- Expected: [Flagged for PO] Spec does not explicitly define this case — confirm whether the recalculation applies immediately (while still paused) or only takes effect once the ticket resumes to an active status

## TC-14: Multiple pause/resume cycles
- Preconditions: Ticket in an active status
- Steps: Transition ticket Waiting Info → active → Waiting Info → active, multiple times, tracking remaining SLA time at each step
- Expected: Each pause preserves remaining time accurately; each resume continues counting down from that preserved value; no cumulative drift or double-counting across cycles

## TC-15: Ticket resolved/closed directly from Waiting Info (edge case)
- Preconditions: Ticket is paused in "Waiting Info"
- Steps: Transition ticket directly from "Waiting Info" to "Resolved" or "Closed" (skipping an intermediate active status)
- Expected: [Flagged for PO] Confirm expected behavior — SLA timer should stop with the remaining time unchanged (no implicit "resume" tick counted before stopping)

## TC-16: Boundary — ticket resolved exactly at SLA target
- Preconditions: Ticket with known SLA target (e.g. High = 24h)
- Steps: Resolve/close the ticket at exactly the 24h active-time mark
- Expected: [Flagged for PO] Confirm whether exactly-at-target counts as met or breached (boundary inclusive/exclusive behavior not specified)

## TC-17: New merchant registration flow compatibility (regression)
- Preconditions: A ticket originating from the new merchant registration flow (per PO comment on this ticket)
- Steps: Apply full SLA pause/resume/stop lifecycle (TC-04, TC-07, TC-08) to a registration-flow-originated ticket
- Expected: [Flagged for PO] Ticket comments indicate this needs explicit validation against the new merchant requests flow — confirm SLA behavior is unaffected by ticket origin/type before treating this as passing
