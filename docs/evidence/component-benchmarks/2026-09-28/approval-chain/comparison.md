# ApprovalChain comparison — 2026-09-28

## Scope and identity

The `compositions-approvalchain` Storybook stories show a vertical sequence of approval steps with approver chips, a quorum count, optional SLA copy, comments, and caller-provided Approve/Reject/Delegate actions. This is an approval history and action summary, not a task wizard. The source describes the component as an “approval engine” and the callbacks as “authorization action dispatchers”; L1 presentation code must not be represented as the owner of workflow state, authorization, or durable decisions.

Local default: `http://localhost:6006/iframe.html?id=compositions-approvalchain--default&viewMode=story`. At the browser’s 1280×720 viewport the visual showed three vertical cards, status nodes, the current finance step’s action buttons, and the SLA string “Due in 4 hours.” The live accessibility tree exposed the step titles as headings, quorum strings, descriptions, names/roles/comments, and three buttons. It did not expose a named timeline or the individual pending approver states. Local/reference viewports were not normalized and screenshots were inspected in-session but not retained.

## References and benchmark decision

No first-party shadcn approval-history component was found in the focused search. The closest shadcn-community visual inspected was the [21st.dev Nyxb UI Stepper](https://21st.dev/community/components/nyxbui/stepper/default); it is a three-step navigation wizard, not an approval record. Its structure is useful only as a restrained navigation/spacing comparison. The primary task benchmark is [Ant Design Steps](https://ant.design/components/steps/), whose live page presents process, finished, waiting, and error states along with vertical, clickable, panel, inline, and compact styles. [MUI Stepper](https://mui.com/material-ui/react-stepper/) is supplemental for linear/non-linear and vertical step behavior and its accessibility guidance for actionable steps. They guide visual states and step structure, not business approval policy.

Workflow meaning is checked separately against [SAP Fiori My Inbox standard actions](https://help.sap.com/docs/SAP_FIORI/d2c296c4f32d4f2a9e3752f58d5ef222/ca39ef400efe4820826a108153a30b38.html): approval/rejection, forwarding, claiming/releasing, suspension, and chronological task history are workflow actions with state consequences. This is domain behavior evidence, not a pixel benchmark. These references were opened and inspected 2026-09-28.

Scores below use the protocol’s eight dimensions (0–3 each), with task fit and semantics/keyboard weighted twice, maximum 30. They are comparative research scores, not readiness results.

| Reference | Task fit | Interaction | States | Density/reflow | Semantics/keyboard | Visual | Portability | Maintenance | Score / 30 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Ant Design Steps (primary structure benchmark) | 2 | 3 | 3 | 3 | 2 | 3 | 1 | 2 | 24 |
| MUI Stepper (supplemental) | 1 | 3 | 3 | 3 | 3 | 2 | 1 | 2 | 22 |
| 21st.dev Nyxb UI Stepper (community visual supplement) | 1 | 2 | 1 | 2 | 1 | 2 | 3 | 2 | 16 |
| SAP Fiori My Inbox (workflow semantics only) | 3 | 3 | 3 | 2 | 2 | 1 | 1 | 2 | 22 |

The local cards are appropriate for displaying rich approval participants and comments; Ant’s clearly differentiated finished/current/error/waiting states are more informative than Strata’s generic pending treatment for delegated/skipped steps. Do not replace the timeline with a wizard, adopt external packages, or infer that a component callback is an authorization boundary.

## Findings

- **Status mapping is incomplete:** step CSS styles only approved/rejected distinctly; pending, delegated, and skipped all receive the pending class, although the icon changes. Approver chips only show icons for approved/rejected. This leaves distinct states visually and semantically under-specified.
- **Quorum copy can be misleading:** the displayed numerator counts approved approvers while denominator is quorum (or total approvers). Rejected/skipped/delegated states, empty approver lists, unmet impossible quorum, and quorum already satisfied are not explained. The badge is presentational and cannot decide whether the workflow may advance.
- **Presentation props are not authorization:** `canApprove` comes from the caller and only controls button visibility; `loading` disables all actions. Callbacks receive a step ID and have no component-level pending-result, conflict, rejection, or success state. The consuming service must independently enforce tenant/user authorization, allowed transition, stale-state conflict handling, atomic state/audit/outbox behavior, and return the durable result.
- **Audit details are partly discarded:** `decidedAt` and `avatarUrl` are not rendered; only the first available comment is shown even when multiple approvers have comments. `slaDeadline` is unparsed string content, with no explicit locale/time-zone, breached/paused state, or accessible time description.
- **Semantics and keyboard:** a generic container holds a `div` list rather than an ordered list or named timeline. Step titles are headings and buttons are native controls, but the accessibility tree lacks approver status, named context for identical actions across steps, current-step state, and status announcements. No screen-reader or keyboard audit was performed.
- **Layout and density:** the default is a clear vertical card timeline. Ultra-compact approver chips explicitly use the `--text-2xs` fallback of 10px; this needs token/legibility review. At the inspected width headers wrap, but narrow screens, long labels, zoom, RTL alignment, and theme contrast remain unverified.
- **Data shape:** no explicit empty-chain treatment or handling is demonstrated for duplicate keys, malformed dates, absent approvers, or an inconsistent step status versus its approvers. Define which validations belong to L0 presentation and which remain service/domain responsibility.
- **Consumer evidence:** repository search found the workflow controller’s tenant-scoped `GET /workflow/approvals` and `PUT /workflow/approvals/:id` endpoints, plus a Deal Desk route and server workflow services. These establish a workflow capability, not a Business Suite component integration. No `ApprovalChain` JSX import or route rendering was found in `business-suite`; marketing copy is not adoption evidence. Map endpoint response and action contract to an owned Business Suite journey before integration.
- **Evidence limits:** Ant, MUI, 21st.dev, SAP guidance, local Storybook, and local AX trees were inspected live. Local/reference viewport matching, screenshots, full step-state interaction, themes, responsive widths, direction, zoom, assistive technology, and consumer journey were not captured.

## Required follow-up before elevation

1. Map the tenant-scoped approval API’s published contract to an actual Business Suite route and owner; determine whether this timeline is a suitable component or whether approval history belongs in a richer record detail composition.
2. Rename the conceptual boundary and API documentation so the component is clearly presentational; retain server authorization, tenant scope, state transition, audit/outbox, and conflict control in the workflow owner.
3. Define explicit per-step and per-approver status vocabulary, quorum copy for all outcome combinations, impossible/zero quorum behavior, and task-authored SLA display contract.
4. Agree the amount of audit history rendered, including all relevant comments and decision timestamps, and distinguish event history from current summary.
5. Add semantic ordered/timeline structure, expose each approver’s status and action context, and provide pending/result/conflict announcements through consumer-confirmed mutation states.
6. Inspect all state stories at matched viewports; verify 320px and desktop, 200% zoom, themes, four densities, LTR/RTL, keyboard, screen reader, contrast, and actual tenant-scoped approval journey.
7. Do not implement this packet while the Input/DataTable/Breadcrumb calibration freeze is active.

## Readiness

**Overall: NOT VERIFIED.** Comparison and source review only. Business Suite adoption, full accessibility/layout/state matrix, package/consumer validation, and release evidence are absent. The calibration freeze remains active; no implementation, tests, integration, publication, deployment, or release claim is made.
