import { useState } from "react";
 
const V = '#7D3F98', VD = '#5C2E72', VL = '#F3EBF8';
const TL = '#49A7A0', TLB = '#E5F5F3';
const IN = '#568EC7', INB = '#EBF3FB';
const FO = '#6FA055', FOB = '#EAF3DE';
const AM = '#DFAD24', AMB = '#FBF0D8';
const CO = '#E37A24', COB = '#FDF0E6';
const RO = '#C77A95', ROB = '#FBEAF0';
const TX = '#262626', TM = '#575757', TL2 = '#767676';
const WH = '#FFFFFF', G1 = '#F7F7F7', G2 = '#F2F2F2', G3 = '#E9E9E9', G4 = '#CCCCCC';
 
const phases = [
  { num:'01', id:'intake', name:'Intake & Capture', color:TL, bg:TLB, duration:'1–3 days', owner:'Product Manager',
    tagline:'Request received, classified, and routed into Jira',
    steps:['Submit intake form via Jira Service Desk portal','System auto-generates Epic with all intake metadata','PM triages within 3 business days: Planned / Unplanned / Regulatory','Auto-notifications sent to Portfolio Manager and relevant stakeholders','Initial stakeholder matrix populated'],
    artifacts:['Jira Epic (auto-generated)','Stakeholder Matrix','Classification Tag in Jira'],
    rituals:['Intake Queue Review — weekly, 30 min, PM-led'],
    exit:'Form 100% complete, Epic created in Jira, stakeholders identified, work classification confirmed',
    jira:'Epic created with labels: intake-[month-year], [planned|unplanned|regulatory], health-plan-[name]',
    improvement:'Replaces fragmented Asana + email submissions with a single Jira Service Desk portal and auto-Epic creation' },
  { num:'02', id:'define', name:'Define & Research', color:IN, bg:INB, duration:'1–2 weeks', owner:'UX Researcher + PM',
    tagline:'Problem validated, Product Brief authored and approved',
    steps:['Problem statement validation session with business owner','User research: interviews, analytics, competitive analysis','Technical feasibility assessment with engineering lead','Product Brief authored and reviewed in Confluence','KPIs, success metrics, and baseline data formally defined'],
    artifacts:['Product Brief (Confluence)','User Research Summary','Technical Feasibility Assessment','KPI Definition Doc'],
    rituals:['Discovery Workshop — 1 full day','Tech Feasibility Sync — 1 hr','Brief Review Sign-off Meeting — 1 hr'],
    exit:'Product Brief approved by Business Owner, OKR alignment confirmed, KPIs defined with measurable baseline',
    jira:'Epic updated: label brief-linked, research-complete. Discovery Stories created and tracked.',
    improvement:'New gate that did not exist in the current flow — ensures no request advances without a validated problem and documented brief' },
  { num:'03', id:'prioritize', name:'Prioritize & Align', color:V, bg:VL, duration:'1–2 weeks', owner:'Portfolio Manager',
    tagline:'WSJF scored, roadmap-placed, or waitlisted with rationale',
    steps:['Portfolio Manager runs WSJF or RICE scoring','Business Owner presents Product Brief at Portfolio Review','Roadmap slot confirmed — or request formally waitlisted with rationale','High-level budget estimate attached to Epic','Threshold check: does budget require Medicaid Exec review?'],
    artifacts:['WSJF/RICE Scorecard','Roadmap Placement Record','Budget Estimate','Waitlist Rationale (if parked)'],
    rituals:['Portfolio Review — bi-weekly, 1 hr','Roadmap Sync — monthly, 1 hr'],
    exit:'Priority rank assigned, roadmap quarter confirmed or waitlisted with next review date, budget estimate on Epic',
    jira:'Epic fields updated: WSJF Score, PI Quarter, status → Pending Prioritization. Label: funded or waitlisted.',
    improvement:'Introduces objective WSJF/RICE scoring and formal waitlist (vs. opaque reprioritization loops in current flow)' },
  { num:'04', id:'approve', name:'Approve & Fund', color:RO, bg:ROB, duration:'1–3 weeks', owner:'Business Owner + Portfolio Manager',
    tagline:'Single MIRAB gate — one clear approval and funding path',
    steps:['Business Case finalized with full cost/benefit analysis','Medicaid Exec Review if budget exceeds defined threshold','Single consolidated MIRAB presentation and vote','Funding confirmation and budget allocation received','COMET project created; OKRs submitted for PI period'],
    artifacts:['Business Case Doc','MIRAB Presentation Deck','Funding Confirmation Letter','OKR Submission','COMET Project ID'],
    rituals:['Exec Review Session — as needed, 1 hr','MIRAB Meeting — quarterly','COMET Onboarding — 1 hr'],
    exit:'MIRAB vote passed, funding letter received, COMET project ID assigned, OKRs on record',
    jira:'Epic status → Approved — Planning. Labels: funded, mirab-approved-[quarter]. COMET ID added.',
    improvement:'Consolidates the two MIRAB review loops in the current CVS flow into a single approval gate with clear escalation criteria' },
  { num:'05', id:'plan', name:'Plan & Kick Off', color:FO, bg:FOB, duration:'1–2 weeks', owner:'Scrum Master + PM + UX',
    tagline:'Team aligned, board live, Sprint 0 complete',
    steps:['PI Planning: Epic decomposed into Features → Stories in Jira','UX kickoff: UX Brief, wireframes, prototype sprint begins','Engineering kickoff: architecture review, technical spike stories','Sprint 0: environments set up, dependencies cleared','DACI matrix and team charter published to Confluence'],
    artifacts:['PI Planning Objectives','UX Brief (Confluence)','Active Jira Sprint Board','DACI Matrix','Team Charter'],
    rituals:['PI Planning — 2 days (quarterly)','Sprint 0 Kickoff — 2 hr','Design Kickoff — 2 hr','DACI Workshop — 1 hr'],
    exit:'Sprint 1 backlog groomed and committed, DACI published, all team environments active, UX Brief approved',
    jira:'All Features and Stories created, estimated, Sprint 1 active. Board configured with swim lanes by team.',
    improvement:'Adds explicit Sprint 0 and DACI workshop that are absent from the current CVS delivery entry point' },
  { num:'06', id:'deliver', name:'Deliver & Monitor', color:AM, bg:AMB, duration:'Per PI (10–12 weeks)', owner:'Scrum Master + Engineering Lead',
    tagline:'2-week sprint cycles with full agile ceremony cadence',
    steps:['2-week sprints with daily standups (15 min, time-boxed)','Sprint Reviews with stakeholder demos every 2 weeks','Sprint Retrospectives — team-level and cross-functional quarterly','Bi-weekly stakeholder status updates published to Confluence','UAT cycles with formal Business Owner sign-off per release'],
    artifacts:['Sprint Velocity Reports','UAT Sign-off Document','Bi-weekly Status Updates (Confluence)','Release Notes'],
    rituals:['Daily Standup — 15 min, every day','Sprint Review — 1 hr, bi-weekly','Sprint Retrospective — 1 hr, bi-weekly','Backlog Grooming — 1 hr, weekly'],
    exit:'All acceptance criteria met, UAT signed off by Business Owner, release notes published, COMET monitoring active',
    jira:'Stories closed per sprint. Velocity chart tracked. Release version tagged. Bugs triaged within 48 hr SLA.',
    improvement:'Adds bi-weekly stakeholder Confluence updates and 48hr bug triage SLA as explicit process standards' },
  { num:'07', id:'measure', name:'Measure & Close', color:CO, bg:COB, duration:'1–2 weeks', owner:'PM + UX Researcher',
    tagline:'Outcomes measured against KPIs, knowledge fully preserved',
    steps:['30/60/90-day KPI measurement against defined baseline','Post-launch UX research: usability testing, CSAT, NPS surveys','Full project retrospective documented in Confluence','Knowledge transfer and operational runbook published','Epic formally closed in Jira; OKR results reported to MIRAB'],
    artifacts:['KPI Impact Report (30/60/90 day)','Post-Launch Research Summary','Lessons Learned Doc','Operational Runbook'],
    rituals:['Project Retrospective — 2 hr post-launch','Stakeholder Closeout — 1 hr','OKR Quarterly Check-in'],
    exit:'KPIs measured and reported, retrospective published, runbook live, Epic closed in Jira, OKR results to MIRAB',
    jira:'Epic status → Done. All Stories closed. Retrospective + KPI Report Confluence pages linked to Epic.',
    improvement:'Entirely new phase — the current CVS flow ends at "Project Complete" with no structured post-launch measurement' },
];
 
const rituals = [
  { name:'Intake Queue Review', freq:'Weekly', dur:'30 min', fac:'Product Manager', att:['PM Team','Portfolio Manager'], purpose:'Triage new submissions, classify by type, assign PM ownership', phase:'01', color:TL, bg:TLB },
  { name:'Discovery Workshop', freq:'Per Request', dur:'1 day', fac:'UX Researcher', att:['PM','UX Researcher','Business Owner','Engineering Lead'], purpose:'Validate problem space, align on solution approach, define measurable success', phase:'02', color:IN, bg:INB },
  { name:'Tech Feasibility Sync', freq:'Per Request', dur:'1 hr', fac:'Engineering Lead', att:['Engineering Lead','PM','Solution Architect'], purpose:'Assess technical complexity, identify dependencies, estimate T-shirt sizing', phase:'02', color:IN, bg:INB },
  { name:'Product Brief Review', freq:'Per Request', dur:'1 hr', fac:'PM', att:['PM','UX Lead','Business Owner','Engineering Lead'], purpose:'Review and approve Product Brief before prioritization — formal gate', phase:'02', color:IN, bg:INB },
  { name:'Portfolio Review', freq:'Bi-weekly', dur:'1 hr', fac:'Portfolio Manager', att:['Portfolio Managers','Business Owners','PM Team'], purpose:'Score and rank requests using WSJF, assign roadmap placement or waitlist', phase:'03', color:V, bg:VL },
  { name:'Roadmap Sync', freq:'Monthly', dur:'1 hr', fac:'Portfolio Manager', att:['Portfolio Managers','Exec Sponsors','PM Leads'], purpose:'Assess overall roadmap health, surface blockers, adjust quarterly priorities', phase:'03', color:V, bg:VL },
  { name:'Medicaid Exec Review', freq:'As needed', dur:'1 hr', fac:'Business Owner', att:['C-Suite','Division Leaders','Business Owner','Portfolio Manager'], purpose:'Executive sign-off for initiatives exceeding budget threshold before MIRAB', phase:'04', color:RO, bg:ROB },
  { name:'MIRAB Meeting', freq:'Quarterly', dur:'2 hr', fac:'MIRAB Chair', att:['MIRAB Voting Members','Business Owners','Portfolio Managers'], purpose:'Final funding approval and budget allocation — the single go/no-go gate', phase:'04', color:RO, bg:ROB },
  { name:'PI Planning', freq:'Quarterly', dur:'2 days', fac:'Release Train Engineer', att:['All Delivery Teams','Business Owners','PMs','UX Team'], purpose:'Decompose funded Epics into PI objectives, Features, and Sprint Stories', phase:'05', color:FO, bg:FOB },
  { name:'Sprint 0 Kickoff', freq:'Per Epic', dur:'2 hr', fac:'Scrum Master', att:['Full Delivery Team','PM','UX Lead'], purpose:'Environment setup, dependency resolution, team norms, and tooling confirmation', phase:'05', color:FO, bg:FOB },
  { name:'DACI Workshop', freq:'Per Epic', dur:'1 hr', fac:'PM', att:['PM','Engineering Lead','UX Lead','Business Owner'], purpose:'Define who is a Driver, Approver, Contributor, and Informed for each decision', phase:'05', color:FO, bg:FOB },
  { name:'Daily Standup', freq:'Daily', dur:'15 min', fac:'Scrum Master', att:['Delivery Team'], purpose:'Sync on daily progress, surface blockers, maintain team alignment', phase:'06', color:AM, bg:AMB },
  { name:'Sprint Review', freq:'Bi-weekly', dur:'1 hr', fac:'Scrum Master', att:['Delivery Team','Business Owner','PM','Stakeholders'], purpose:'Demo completed stories, collect feedback, update backlog priorities', phase:'06', color:AM, bg:AMB },
  { name:'Sprint Retrospective', freq:'Bi-weekly', dur:'1 hr', fac:'Scrum Master', att:['Delivery Team','PM','UX Lead'], purpose:'Inspect team process, identify improvements, commit to changes next sprint', phase:'06', color:AM, bg:AMB },
  { name:'Backlog Grooming', freq:'Weekly', dur:'1 hr', fac:'PM', att:['PM','Engineering Lead','UX Lead','Scrum Master'], purpose:'Refine, estimate, and prioritize upcoming sprint stories for readiness', phase:'06', color:AM, bg:AMB },
  { name:'Project Retrospective', freq:'Post-launch', dur:'2 hr', fac:'PM + UX Researcher', att:['Full Team','Business Owner','Portfolio Manager'], purpose:'Full project review: outcomes vs goals, team learnings, process improvements', phase:'07', color:CO, bg:COB },
  { name:'OKR Quarterly Check-in', freq:'Quarterly', dur:'1 hr', fac:'PM', att:['PM','Business Owner','Portfolio Manager','Exec Sponsor'], purpose:'Measure OKR progress vs baseline, report results to MIRAB, adjust if needed', phase:'07', color:CO, bg:COB },
];
 
const jiraSetup = [
  { category:'Epic Fields (Required)', items:[
    { f:'Summary', t:'Text', d:'Product request title — becomes the Epic name in all reports and dashboards' },
    { f:'Description', t:'Rich Text', d:'Problem statement, proposed solution, target users, and initial scope' },
    { f:'Priority', t:'Select', d:'Critical / High / Medium / Low — set by PM at intake triage' },
    { f:'Health Plan', t:'Custom Select', d:'Medicaid / Medicare / Commercial / Enterprise / All Plans' },
    { f:'Request Type', t:'Custom Select', d:'New Product / Enhancement / Regulatory / Tech Debt / Innovation / Emergency' },
    { f:'Work Classification', t:'Custom Select', d:'Planned / Unplanned / Regulatory — determines intake path and urgency' },
    { f:'Business Owner', t:'User Picker', d:'Single named owner — accountable for decisions and sign-offs throughout' },
    { f:'Target Launch Date', t:'Date', d:'Aspirational or hard date (label accordingly in description)' },
    { f:'Confluence Brief Link', t:'URL', d:'Link to Product Brief once created — required before Phase 03' },
    { f:'WSJF Score', t:'Number', d:'Populated by Portfolio Manager at Phase 03 prioritization' },
    { f:'PI Quarter', t:'Custom Select', d:'Q1 / Q2 / Q3 / Q4 + Year — roadmap placement' },
    { f:'OKR Alignment', t:'Multi-select', d:'Links to current-year OKR list maintained by Portfolio team' },
    { f:'Budget Estimate', t:'Number (USD)', d:'High-level estimate — attached at Phase 03, finalized at Phase 04' },
    { f:'COMET Project ID', t:'Text', d:'Populated at Phase 04 after MIRAB approval and COMET onboarding' },
  ]},
  { category:'Workflow Statuses', items:[
    { f:'Intake Queue', t:'Status', d:'Newly submitted — awaiting PM triage within 3 business days' },
    { f:'In Research', t:'Status', d:'Discovery / Define phase active — Product Brief being authored' },
    { f:'Pending Prioritization', t:'Status', d:'Brief complete — awaiting next Portfolio Review cycle' },
    { f:'Pending Approval', t:'Status', d:'In Medicaid Exec or MIRAB review cycle' },
    { f:'Approved — Planning', t:'Status', d:'Funded and entering PI Planning / Sprint 0' },
    { f:'In Progress', t:'Status', d:'Active delivery sprint cycle underway' },
    { f:'In UAT', t:'Status', d:'User acceptance testing active with Business Owner' },
    { f:'Released — Monitoring', t:'Status', d:'Deployed to production; 30/60/90-day measurement period' },
    { f:'Done', t:'Status', d:'KPIs measured, retrospective published, Epic formally closed' },
    { f:'Parked', t:'Status', d:'Deprioritized — not rejected; flagged for reassessment next PI cycle' },
  ]},
  { category:'Labels & Tags', items:[
    { f:'intake-[month-year]', t:'Label', d:'Submission cohort tracking — enables performance analytics' },
    { f:'planned / unplanned / regulatory', t:'Label', d:'Work classification for portfolio reporting and filtering' },
    { f:'health-plan-[name]', t:'Label', d:'Health plan impacted — enables plan-specific portfolio views' },
    { f:'mirab-[quarter-year]', t:'Label', d:'Funding cycle tracking — links Epic to MIRAB submission' },
    { f:'pi-[quarter-year]', t:'Label', d:'PI Planning period — for quarterly velocity and throughput reporting' },
    { f:'funded / waitlisted / parked', t:'Label', d:'Funding status — drives portfolio dashboard filters' },
    { f:'ux-research-needed', t:'Label', d:'Flags the Epic for UX research queue assignment' },
    { f:'compliance-review-needed', t:'Label', d:'Triggers routing to Compliance/Legal stakeholder notification' },
  ]},
  { category:'Dashboards & Filters', items:[
    { f:'Intake Queue Dashboard', t:'Dashboard', d:'All Epics in "Intake Queue" status — PM daily queue management view' },
    { f:'Active Delivery Board', t:'Board', d:'"In Progress" Epics + sprint burndown + sprint velocity charts' },
    { f:'Quarterly Pipeline', t:'Dashboard', d:'All Epics by PI Quarter — roadmap visualization across health plans' },
    { f:'Portfolio Health', t:'Dashboard', d:'Request volume by type, health plan, classification, and phase age' },
    { f:'MIRAB Prep Filter', t:'Filter', d:'"Pending Approval" Epics with Budget Estimate populated — executive view' },
    { f:'Time-to-Approval Metric', t:'Report', d:'Days from Epic creation to "Approved" status — intake performance KPI' },
    { f:'Sprint Velocity Tracker', t:'Report', d:'Sprint-over-sprint story points — team throughput and predictability' },
  ]},
];
 
const confluenceSections = [
  { title:'📋 Intake & Requests', pages:['Active Intake Queue (Jira macro)','Intake Form Guide & Portal Link','Stakeholder Matrix Template','Work Classification Guide','Intake Performance Metrics'] },
  { title:'📝 Product Briefs', pages:['[YEAR] Product Briefs Index','Product Brief Template','Research Summary Template','Technical Feasibility Template','UX Brief Template'] },
  { title:'🗺️ Roadmap & Planning', pages:['Current Product Roadmap','PI Planning — [Quarter Year]','WSJF Scoring Guide & Scorecard','Portfolio Backlog — Waitlisted Items','Budget Estimation Guide'] },
  { title:'✅ Approved & Funded Projects', pages:['Funded Projects Index','Business Case Template','MIRAB Submission History','OKR Tracker — [Year]','COMET Project Registry'] },
  { title:'🚀 Active Delivery', pages:['Sprint Status Dashboard','DACI Matrix Template','Team Charter Template','Release Calendar','Bi-weekly Stakeholder Updates'] },
  { title:'📊 Outcomes & Learnings', pages:['KPI Reports Index — Post-Launch','Lessons Learned Library','Post-Launch Research Archive','Retrospective Archive','OKR Results History'] },
];
 
const FORM_STEPS = [
  { label:'Requester', icon:'ti-user' },
  { label:'Product', icon:'ti-bulb' },
  { label:'Business', icon:'ti-building' },
  { label:'Scope', icon:'ti-ruler' },
  { label:'Stakeholders', icon:'ti-users' },
  { label:'Metrics', icon:'ti-chart-bar' },
  { label:'Review', icon:'ti-check' },
];
 
export default function App() {
  const [tab, setTab] = useState(-1);
  const [expanded, setExpanded] = useState(null);
  const [formStep, setFormStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [jiraCat, setJiraCat] = useState(0);
  const [confOpen, setConfOpen] = useState(null);
 
  return (
    <div style={{ fontFamily:"'Segoe UI',system-ui,sans-serif", color:TX, background:WH, minHeight:'100vh' }}>
      {/* Logo Bar */}
      <div style={{ background:WH, padding:'20px 48px' }}>
        <img src={`${import.meta.env.BASE_URL}aetna-logo.svg`} alt="Aetna" style={{ height:21 }} />
      </div>
      {/* Header */}
      <div style={{ background:`linear-gradient(135deg, ${VD} 0%, ${V} 100%)`, padding:'56px 48px 0' }}>
        <p style={{ margin:'0 0 16px', fontSize:12, color:'rgba(255,255,255,0.6)', letterSpacing:'0.15em', textTransform:'uppercase', fontWeight:400 }}>Aetna Medicaid Tech Team — Internal</p>
        <h1 style={{ margin:'0 0 20px', fontSize:40, fontWeight:300, color:WH, lineHeight:1.15 }}>Product Intake & Delivery Framework</h1>
        <p style={{ margin:'0 0 40px', fontSize:15, color:'rgba(255,255,255,0.75)', lineHeight:1.6, maxWidth:700 }}>7-phase end-to-end process · Jira + Confluence as source of truth · Agile SAFe delivery model</p>
        <div style={{ borderTop:'1px solid rgba(255,255,255,0.2)', paddingTop:24, marginBottom:0, display:'flex', flexWrap:'wrap' }}>
          {['Home','Process Flow','Intake Form','Atlassian Playbook','Agile Rituals','Process Comparison','Product Services'].map((t,i) => {
            const idx = i - 1;
            return <button key={i} onClick={() => setTab(idx)} style={{
              padding:'12px 20px', fontSize:13, fontWeight: tab===idx ? 700 : 400,
              color: tab===idx ? V : 'rgba(255,255,255,0.8)', background: tab===idx ? WH : 'transparent',
              border:'none', borderRadius:'8px 8px 0 0', cursor:'pointer', transition:'all 0.15s',
            }}>{t}</button>;
          })}
        </div>
      </div>
 
      <div style={{ padding:'32px 48px' }}>
        {tab===-1 && <Landing onNavigate={setTab} />}
        {tab===0 && <ProcessFlow phases={phases} expanded={expanded} setExpanded={setExpanded} />}
        {tab===1 && <IntakeForm formStep={formStep} setFormStep={setFormStep} submitted={submitted} setSubmitted={setSubmitted} />}
        {tab===2 && <AtlassianPlaybook jiraCat={jiraCat} setJiraCat={setJiraCat} confOpen={confOpen} setConfOpen={setConfOpen} />}
        {tab===3 && <RitualsView />}
        {tab===4 && <ProcessComparison />}
        {tab===5 && <ProductServices />}
      </div>
    </div>
  );
}

function Landing({ onNavigate }) {
  const benefits = [
    { title:'Enterprise Value', icon:'building-skyscraper',
      text:'Leveraging enterprise-wide applications allows Medicaid to benefit from economies of scale, access to improved digital & analytics capabilities, and standardized experiences and technical processes.' },
    { title:'Efficiency', icon:'gauge',
      text:'Implementing standardized processes and systems enables teams to leverage cross-LoB synergies when updating and maintaining enterprise applications, reducing the need for creating new onboarding and training materials.' },
    { title:'Growth', icon:'growth',
      text:'Investing in innovative technology and streamlining operations will provide Aetna with a competitive advantage by enabling plans to improve provider experience and coordinated member care, as well as increasing membership through RFP wins and contract retention.' },
    { title:'Cost Reduction', icon:'coins',
      text:'Moving Aetna Medicaid on to shared operational platforms provides the opportunity to reduce the overall operational run rate, and implementing improved digital & analytics capabilities will increase efficiency and reduce business and IT costs.' },
  ];
  return <div>
    {/* Welcome + CTA row */}
    <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:32, marginBottom:40, alignItems:'start' }}>
      <div>
        <h2 style={{ fontSize:28, fontWeight:300, color:TX, margin:'0 0 16px' }}>Welcome</h2>
        <p style={{ fontSize:15, lineHeight:1.7, color:TM, margin:0 }}>
          The <strong>Product Intake & Delivery Framework</strong> is Aetna Medicaid's standardized approach to managing product work from initial request through delivery. It supports our broader <strong>product transformation strategy</strong> — migrating to strategic enterprise platforms that unlock value across all Aetna lines of business. This framework ensures every initiative is properly scoped, prioritized, and delivered with full traceability.
        </p>
      </div>
      <div style={{ background:WH, border:`1px solid ${G3}`, borderRadius:10, padding:'28px 24px' }}>
        <div style={{ width:40, height:40, borderRadius:'50%', background:VL, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:16 }}>
          <svg style={{ width:20, height:20, color:V }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><use href="https://cdn.jsdelivr.net/npm/@tabler/icons-sprite@latest/dist/tabler-sprite.svg#tabler-send"/></svg>
        </div>
        <h3 style={{ fontSize:16, fontWeight:600, color:TX, margin:'0 0 8px' }}>Ready to get started?</h3>
        <p style={{ fontSize:13, lineHeight:1.6, color:TM, margin:'0 0 20px' }}>Submit a product intake request to kick off your project. Our team will triage and route it within 3 business days.</p>
        <button onClick={() => onNavigate(1)} style={{ background:V, color:WH, border:'none', borderRadius:6, padding:'10px 20px', fontSize:13, fontWeight:600, cursor:'pointer' }}>Open Intake Form</button>
      </div>
    </div>

    {/* Strategic Benefits */}
    <h3 style={{ fontSize:13, fontWeight:600, color:TL2, letterSpacing:'0.1em', textTransform:'uppercase', margin:'0 0 20px' }}>Strategic Benefits</h3>
    <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:20 }}>
      {benefits.map((b,i) => <div key={i} style={{ background:WH, border:`1px solid ${G3}`, borderRadius:8, overflow:'hidden' }}>
        <div style={{ background:'#2B6CB0', padding:'14px 20px' }}>
          <span style={{ fontSize:15, fontWeight:700, color:WH }}>{b.title}</span>
        </div>
        <div style={{ padding:'24px 20px' }}>
          <div style={{ width:56, height:56, borderRadius:'50%', background:G1, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:16 }}>
            <svg style={{ width:28, height:28, color:TX }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><use href={`https://cdn.jsdelivr.net/npm/@tabler/icons-sprite@latest/dist/tabler-sprite.svg#tabler-${b.icon}`}/></svg>
          </div>
          <p style={{ fontSize:13, lineHeight:1.7, color:TM, margin:0 }}>{b.text}</p>
        </div>
      </div>)}
    </div>

    {/* Contact section */}
    <div style={{ marginTop:48, padding:'28px 32px', background:G1, borderRadius:10, display:'flex', alignItems:'center', gap:20 }}>
      <img src={`${import.meta.env.BASE_URL}jeff-krasner.jpg`} alt="Jeffrey Krasner" style={{ width:48, height:48, borderRadius:'50%', objectFit:'cover', flexShrink:0 }} />
      <div>
        <p style={{ fontSize:13, color:TL2, margin:'0 0 4px' }}>Questions or want to connect with our team?</p>
        <p style={{ fontSize:15, fontWeight:600, color:TX, margin:'0 0 2px' }}>Jeffrey Krasner</p>
        <p style={{ fontSize:13, color:TM, margin:0 }}>Lead Director of Digital Product | AT Medicaid Technology</p>
      </div>
    </div>
  </div>;
}

function ProcessComparison() {
  const rows = [
    { dim:'Entry paths', old:'2 parallel tracks (Planned / Unplanned) that converge mid-process at different stages', oldTag:'Creates inconsistency', nw:'Single entry point with a 3-way classification step (Planned / Unplanned / Regulatory) at intake', nwTag:'Consistent routing', oldBad:true },
    { dim:'Research & discovery', old:'No dedicated phase. Requests move straight from intake to Business Case with no user validation.', oldTag:'Critical gap', nw:'Phase 02 — Define & Research: Discovery Workshop, user research, feasibility assessment, Product Brief gate.', nwTag:'New phase', oldBad:true },
    { dim:'Required artifacts before prioritization', old:'Business Case with cost estimates only. No validated problem statement or user research required.', oldTag:'No quality gate', nw:'Product Brief (approved by Business Owner) is a mandatory exit gate before any prioritization meeting.', nwTag:'Enforced gate', oldBad:true },
    { dim:'MIRAB approval gate', old:'Appears twice — once for Unplanned work, once for Planned — different paths, different timing, no unified criteria.', oldTag:'Confusing duplication', nw:'One consolidated MIRAB gate (Phase 04) for all request types, with a clear Exec Review escalation trigger.', nwTag:'Single gate', oldBad:true },
    { dim:'Prioritization method', old:"Portfolio Managers meet with owners to 'prioritize request' — no scoring methodology defined.", oldTag:'Subjective', nw:'WSJF (Weighted Shortest Job First) or RICE scoring. Objective score attached to every Epic in Jira.', nwTag:'Data-driven', oldBad:true },
    { dim:'Deprioritized requests', old:'"Submit & Reprioritize" loop — requests cycle back indefinitely with no formal parking, rationale, or review date.', oldTag:'No resolution path', nw:'Formal Waitlist status in Jira with written rationale and a committed next portfolio review date assigned.', nwTag:'Transparent process', oldBad:true },
    { dim:'Exit criteria per phase', old:'No phase gates defined. Work moves forward based on meeting attendance, not documented completion criteria.', oldTag:'No accountability', nw:'Explicit written exit criteria at every phase. Nothing advances without all criteria being met and confirmed.', nwTag:'Every phase gated', oldBad:true },
    { dim:'UX / design involvement', old:'Not defined at any stage. UX is not mentioned anywhere in the current process flow.', oldTag:'No UX touchpoint', nw:'UX Researcher co-owns Phase 02. UX Brief required in Phase 05. Post-launch UX research in Phase 07.', nwTag:'3 defined touchpoints', oldBad:true },
    { dim:'Team onboarding / Sprint 0', old:'PI Planning moves directly into delivery. No Sprint 0, no DACI, no team charter defined.', oldTag:'No formal kickoff', nw:'Phase 05 includes Sprint 0, DACI Workshop, team charter, and environment setup before Sprint 1 begins.', nwTag:'Structured kickoff', oldBad:true },
    { dim:'Post-launch measurement', old:'Process ends at "Project Complete." No KPI measurement, no post-launch research, no outcomes tracking defined.', oldTag:'No outcomes tracking', nw:'Phase 07 — Measure & Close: 30/60/90-day KPI review, post-launch UX research, OKR results reported to MIRAB.', nwTag:'New phase', oldBad:true },
    { dim:'Documentation standard', old:'Asana for planned intake. Email and meetings for unplanned. No single source of truth for either track.', oldTag:'Fragmented tools', nw:'Jira Service Desk for all intake. Confluence for all artifacts. Jira ↔ Confluence linked throughout every phase.', nwTag:'Unified toolchain', oldBad:true },
    { dim:'Stakeholder mapping', old:'Requester and Health Plan roles shown visually but no formal DACI or accountability matrix defined.', oldTag:'Implicit only', nw:'Stakeholder Matrix captured at intake. DACI Matrix published to Confluence and reviewed before Sprint 1.', nwTag:'Formal DACI', oldBad:true },
    { dim:'Agile ceremony cadence', old:'"Monitoring via Scaled Agile ceremonies" mentioned but no ceremonies named, timed, owned, or structured.', oldTag:'Referenced, not defined', nw:'17 ceremonies defined across 7 phases — each with frequency, duration, facilitator, and required attendees.', nwTag:'Fully specified', oldBad:true },
  ];
 
  const cvsSteps = [
    { n:'1', label:'Project Intake', note:'Unplanned track only', problem:true },
    { n:'—', label:'Strat Plan Submission', note:'Planned track only', problem:true },
    { n:'2', label:'Business Case', note:'No research gate', problem:true },
    { n:'3', label:'Prioritization', note:'No scoring method', problem:true },
    { n:'4', label:'MIRAB Review', note:'Appears twice across tracks', problem:true },
    { n:'5', label:'Approval & Funding + Reprioritize loop', note:'Loop with no exit', problem:true },
    { n:'6', label:'Medicaid Exec Review', note:'Planned track only', problem:true },
    { n:'7', label:'COMET Onboard + PI Planning', note:'No Sprint 0 or DACI', problem:true },
    { n:'8', label:'Monitoring', note:'Ceremonies undefined', problem:true },
    { n:'9', label:'Funding Forecast → OKRs → Project Complete', note:'No measurement phase', problem:true },
  ];
 
  const newSteps = [
    { n:'01', label:'Intake & Capture', note:'Jira Service Desk, auto-Epic, 3-way classification', isNew:false, color:TL },
    { n:'02', label:'Define & Research', note:'Discovery Workshop, user research, Product Brief gate', isNew:true, color:IN },
    { n:'03', label:'Prioritize & Align', note:'WSJF scoring, formal roadmap placement or waitlist', isNew:false, color:V },
    { n:'04', label:'Approve & Fund', note:'Single MIRAB gate, Exec Review threshold', isNew:false, color:RO },
    { n:'05', label:'Plan & Kick Off', note:'PI Planning, Sprint 0, DACI Workshop, UX Brief', isNew:false, color:FO },
    { n:'06', label:'Deliver & Monitor', note:'17 defined ceremonies, UAT sign-off, Confluence updates', isNew:false, color:AM },
    { n:'07', label:'Measure & Close', note:'30/60/90-day KPIs, post-launch research, OKR reporting', isNew:true, color:CO },
  ];
 
  const tagStyle = (variant) => ({
    display:'inline-block', padding:'2px 7px', borderRadius:10, fontSize:10, fontWeight:600, marginTop:4,
    ...(variant==='gap' ? { background:'#FCEBEB', color:'#7A1F1F' } : {}),
    ...(variant==='new' ? { background:FOB, color:'#2A5210' } : {}),
    ...(variant==='warn' ? { background:AMB, color:'#5C3A06' } : {}),
  });
 
  return (
    <div>
      {/* Summary stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:24 }}>
        {[
          { val:'2', lbl:'MIRAB reviews in CVS flow', valColor:'#A32D2D' },
          { val:'1', lbl:'Consolidated gate in new flow', valColor:FO },
          { val:'3', lbl:'Phases missing from CVS process', valColor:'#A32D2D' },
          { val:'7', lbl:'Phases with defined exit criteria', valColor:FO },
        ].map(({ val, lbl, valColor }) => (
          <div key={lbl} style={{ background:G1, borderRadius:8, padding:'12px 14px', textAlign:'center', border:`1px solid ${G3}` }}>
            <p style={{ margin:'0 0 3px', fontSize:28, fontWeight:700, color:valColor }}>{val}</p>
            <p style={{ margin:0, fontSize:11, color:TM, lineHeight:1.3 }}>{lbl}</p>
          </div>
        ))}
      </div>
 
      {/* Phase mapping side by side */}
      <p style={{ margin:'0 0 10px', fontSize:11, fontWeight:600, color:TL2, textTransform:'uppercase', letterSpacing:'0.07em' }}>Phase mapping — old vs. new</p>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:24 }}>
        {/* CVS */}
        <div style={{ border:`1px solid ${G3}`, borderRadius:10, overflow:'hidden' }}>
          <div style={{ background:'#FCEBEB', padding:'9px 14px' }}>
            <p style={{ margin:0, fontSize:12, fontWeight:700, color:'#7A1F1F' }}>Current CVS process — 9 steps, 2 parallel tracks</p>
          </div>
          {cvsSteps.map((s, i) => (
            <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:10, padding:'8px 14px', borderBottom: i < cvsSteps.length-1 ? `1px solid ${G2}` : 'none' }}>
              <div style={{ width:20, height:20, borderRadius:'50%', background:'#F7C1C1', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, color:'#7A1F1F', flexShrink:0, marginTop:1 }}>{s.n}</div>
              <div>
                <p style={{ margin:0, fontSize:13, fontWeight:500, color:TX }}>{s.label}</p>
                <span style={tagStyle('gap')}>{s.note}</span>
              </div>
            </div>
          ))}
        </div>
        {/* New */}
        <div style={{ border:`1px solid ${G3}`, borderRadius:10, overflow:'hidden' }}>
          <div style={{ background:FOB, padding:'9px 14px' }}>
            <p style={{ margin:0, fontSize:12, fontWeight:700, color:'#2A5210' }}>New Aetna Medicaid framework — 7 phases, single track</p>
          </div>
          {newSteps.map((s, i) => (
            <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:10, padding:'8px 14px', borderBottom: i < newSteps.length-1 ? `1px solid ${G2}` : 'none', background: s.isNew ? `${s.color}0D` : WH }}>
              <div style={{ width:20, height:20, borderRadius:'50%', background:s.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, color:WH, flexShrink:0, marginTop:1 }}>{s.n}</div>
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <p style={{ margin:0, fontSize:13, fontWeight:500, color:TX }}>{s.label}</p>
                  {s.isNew && <span style={{ padding:'1px 6px', background:s.color, color:WH, borderRadius:8, fontSize:9, fontWeight:700 }}>NEW</span>}
                </div>
                <span style={tagStyle('new')}>{s.note}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
 
      {/* Dimension comparison table */}
      <p style={{ margin:'0 0 10px', fontSize:11, fontWeight:600, color:TL2, textTransform:'uppercase', letterSpacing:'0.07em' }}>Dimension-by-dimension comparison</p>
      <div style={{ border:`1px solid ${G3}`, borderRadius:10, overflow:'hidden', marginBottom:24 }}>
        {/* Header */}
        <div style={{ display:'grid', gridTemplateColumns:'170px 1fr 1fr', background:G2, borderBottom:`1px solid ${G3}` }}>
          <div style={{ padding:'8px 12px', fontSize:11, fontWeight:700, color:TM, textTransform:'uppercase', letterSpacing:'0.06em' }}>Dimension</div>
          <div style={{ padding:'8px 12px', fontSize:11, fontWeight:700, color:'#7A1F1F', textTransform:'uppercase', letterSpacing:'0.06em', borderLeft:`1px solid ${G3}`, background:'#FEF2F2' }}>Current CVS process</div>
          <div style={{ padding:'8px 12px', fontSize:11, fontWeight:700, color:'#2A5210', textTransform:'uppercase', letterSpacing:'0.06em', borderLeft:`1px solid ${G3}`, background:'#F0FBE8' }}>New Aetna framework</div>
        </div>
        {rows.map((r, i) => (
          <div key={i} style={{ display:'grid', gridTemplateColumns:'170px 1fr 1fr', borderBottom: i < rows.length-1 ? `1px solid ${G2}` : 'none' }}>
            <div style={{ padding:'10px 12px', fontSize:12, fontWeight:600, color:TM, background:G1, borderRight:`1px solid ${G3}`, lineHeight:1.4 }}>{r.dim}</div>
            <div style={{ padding:'10px 12px', fontSize:12, color:TX, lineHeight:1.5, borderRight:`1px solid ${G3}`, background:WH }}>
              {r.old}<br /><span style={tagStyle('gap')}>{r.oldTag}</span>
            </div>
            <div style={{ padding:'10px 12px', fontSize:12, color:TX, lineHeight:1.5, background:WH }}>
              {r.nw}<br /><span style={tagStyle('new')}>{r.nwTag}</span>
            </div>
          </div>
        ))}
      </div>
 
      {/* What's entirely new */}
      <p style={{ margin:'0 0 10px', fontSize:11, fontWeight:600, color:TL2, textTransform:'uppercase', letterSpacing:'0.07em' }}>What's completely absent in the CVS flow — added new</p>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
        <div style={{ background:WH, border:`1px solid ${G3}`, borderRadius:10, padding:'14px 16px' }}>
          <p style={{ margin:'0 0 10px', fontSize:12, fontWeight:700, color:TX }}>Entirely new phases (zero CVS equivalent)</p>
          {[
            { title:'Phase 02 — Define & Research', body:'Discovery Workshop, user research, technical feasibility assessment, and the Product Brief as a mandatory gate artifact before any prioritization can occur.', color:IN },
            { title:'Phase 07 — Measure & Close', body:'30/60/90-day KPI measurement against the baseline defined at intake, post-launch UX research, a structured lessons-learned retrospective, and OKR results reported back to MIRAB.', color:CO },
            { title:'Sprint 0 within Phase 05', body:'Formal team onboarding, DACI workshop, environment setup, and UX Brief approval — all required before Sprint 1 begins delivery.', color:FO },
          ].map(({ title, body, color }) => (
            <div key={title} style={{ display:'flex', gap:10, marginBottom:10 }}>
              <div style={{ width:4, borderRadius:2, background:color, flexShrink:0, alignSelf:'stretch' }} />
              <div>
                <p style={{ margin:'0 0 2px', fontSize:12, fontWeight:600, color:TX }}>{title}</p>
                <p style={{ margin:0, fontSize:12, color:TM, lineHeight:1.5 }}>{body}</p>
              </div>
            </div>
          ))}
        </div>
        <div style={{ background:WH, border:`1px solid ${G3}`, borderRadius:10, padding:'14px 16px' }}>
          <p style={{ margin:'0 0 10px', fontSize:12, fontWeight:700, color:TX }}>New standards with no CVS equivalent</p>
          {[
            { title:'WSJF/RICE scoring', body:'Objective prioritization scorecard every Portfolio Manager uses — eliminates subjective "whoever asked loudest" ranking.' },
            { title:'Phase exit criteria', body:'Explicit written conditions at every gate. Nothing advances until all criteria are confirmed and documented in Jira.' },
            { title:'DACI matrix', body:'Driver / Approver / Contributor / Informed assignment per Epic — published in Confluence before Sprint 1.' },
            { title:'Formal Waitlist with rationale', body:'Replaces the ambiguous "Submit & Reprioritize" loop with a Jira status, written reason, and next-review date.' },
            { title:'Intake performance metrics', body:'Time-to-approval, backlog age, MIRAB pass rate, and intake volume tracked in Jira dashboards — measures the team itself.' },
          ].map(({ title, body }) => (
            <div key={title} style={{ display:'flex', gap:8, marginBottom:8 }}>
              <div style={{ width:7, height:7, borderRadius:'50%', background:V, flexShrink:0, marginTop:4 }} />
              <div>
                <p style={{ margin:'0 0 1px', fontSize:12, fontWeight:600, color:TX }}>{title}</p>
                <p style={{ margin:0, fontSize:12, color:TM, lineHeight:1.5 }}>{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
 
function ProcessFlow({ phases, expanded, setExpanded }) {
  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginBottom:24 }}>
        {[
          { label:'Planned Work', desc:'Annual strat plan submissions — routed via Asana intake and standard PI cycle', color:TL, bg:TLB },
          { label:'Unplanned Work', desc:'Ad hoc requests from Enterprise, Health Plan, or Shared Services teams', color:V, bg:VL },
          { label:'Regulatory / Compliance', desc:'Mandate-driven with hard legal or contractual deadlines — expedited path', color:RO, bg:ROB },
        ].map((e,i) => (
          <div key={i} style={{ background:e.bg, borderRadius:8, padding:'12px 14px', borderLeft:`4px solid ${e.color}`, border:`1px solid ${e.color}30`, borderLeftWidth:4 }}>
            <p style={{ margin:'0 0 3px', fontWeight:700, fontSize:13, color:e.color }}>{e.label}</p>
            <p style={{ margin:0, fontSize:12, color:TM }}>{e.desc}</p>
          </div>
        ))}
      </div>
      <p style={{ margin:'0 0 12px', fontSize:12, color:TL2 }}>All three entry paths converge at Phase 01 → 07. Click any phase row to expand details, artifacts, and Jira field guidance.</p>
 
      {phases.map((p) => (
        <div key={p.id} style={{ marginBottom:6 }}>
          <div onClick={() => setExpanded(expanded===p.id ? null : p.id)} style={{
            display:'flex', alignItems:'center', gap:14, padding:'13px 16px',
            background: expanded===p.id ? p.bg : WH,
            border:`1px solid ${expanded===p.id ? p.color : G3}`,
            borderLeft:`5px solid ${p.color}`, borderRadius: expanded===p.id ? '8px 8px 0 0' : 8,
            cursor:'pointer', transition:'all 0.15s',
          }}>
            <div style={{ width:38, height:38, borderRadius:'50%', background:p.color, display:'flex', alignItems:'center', justifyContent:'center', color:WH, fontWeight:800, fontSize:12, flexShrink:0 }}>{p.num}</div>
            <div style={{ flex:1 }}>
              <p style={{ margin:0, fontWeight:700, fontSize:15, color:TX }}>{p.name}</p>
              <p style={{ margin:'2px 0 0', fontSize:12, color:TL2 }}>{p.tagline}</p>
            </div>
            <div style={{ display:'flex', gap:20, alignItems:'center', flexShrink:0 }}>
              <div style={{ textAlign:'right' }}>
                <p style={{ margin:0, fontSize:10, color:TL2, textTransform:'uppercase', letterSpacing:'0.05em' }}>Duration</p>
                <p style={{ margin:0, fontSize:12, fontWeight:600, color:p.color }}>{p.duration}</p>
              </div>
              <div style={{ textAlign:'right' }}>
                <p style={{ margin:0, fontSize:10, color:TL2, textTransform:'uppercase', letterSpacing:'0.05em' }}>Owner</p>
                <p style={{ margin:0, fontSize:12, fontWeight:600, color:TX }}>{p.owner}</p>
              </div>
              <i className={`ti ti-chevron-${expanded===p.id ? 'up' : 'down'}`} style={{ fontSize:18, color:TL2 }} aria-hidden="true" />
            </div>
          </div>
 
          {expanded===p.id && (
            <div style={{ background:p.bg, border:`1px solid ${p.color}30`, borderTop:'none', borderRadius:'0 0 8px 8px', padding:'16px 20px' }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:14 }}>
                <div>
                  <p style={{ margin:'0 0 8px', fontSize:11, fontWeight:700, color:p.color, textTransform:'uppercase', letterSpacing:'0.07em' }}>Key Steps</p>
                  {p.steps.map((s,i) => (
                    <div key={i} style={{ display:'flex', gap:8, marginBottom:6 }}>
                      <span style={{ color:p.color, fontWeight:800, fontSize:12, flexShrink:0, marginTop:1 }}>{i+1}.</span>
                      <p style={{ margin:0, fontSize:13, color:TX, lineHeight:1.5 }}>{s}</p>
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ marginBottom:14 }}>
                    <p style={{ margin:'0 0 6px', fontSize:11, fontWeight:700, color:p.color, textTransform:'uppercase', letterSpacing:'0.07em' }}>Artifacts Produced</p>
                    {p.artifacts.map((a,i) => <p key={i} style={{ margin:'0 0 3px', fontSize:13, color:TX }}>→ {a}</p>)}
                  </div>
                  <div style={{ marginBottom:14 }}>
                    <p style={{ margin:'0 0 6px', fontSize:11, fontWeight:700, color:p.color, textTransform:'uppercase', letterSpacing:'0.07em' }}>Ceremonies / Rituals</p>
                    {p.rituals.map((r,i) => <p key={i} style={{ margin:'0 0 3px', fontSize:13, color:TX }}>→ {r}</p>)}
                  </div>
                  <div style={{ background:WH, borderRadius:6, padding:'10px 12px', border:`1px solid ${p.color}40` }}>
                    <p style={{ margin:'0 0 4px', fontSize:10, fontWeight:700, color:p.color, textTransform:'uppercase', letterSpacing:'0.07em' }}>Exit Criteria — Phase Gate</p>
                    <p style={{ margin:0, fontSize:12, color:TX, lineHeight:1.5 }}>{p.exit}</p>
                  </div>
                </div>
              </div>
              <div style={{ background:`${p.color}18`, borderRadius:6, padding:'8px 12px', borderLeft:`3px solid ${p.color}` }}>
                <span style={{ fontSize:11, fontWeight:700, color:p.color }}>JIRA: </span>
                <span style={{ fontSize:12, color:TM, fontFamily:'monospace' }}>{p.jira}</span>
              </div>
              <div style={{ marginTop:8, background:`${p.color}10`, borderRadius:6, padding:'7px 12px', borderLeft:`3px solid ${p.color}80` }}>
                <span style={{ fontSize:11, fontWeight:700, color:TM }}>Improvement over current CVS flow: </span>
                <span style={{ fontSize:12, color:TM }}>{p.improvement}</span>
              </div>
            </div>
          )}
        </div>
      ))}
 
      <div style={{ marginTop:20, padding:'14px 18px', background:G1, borderRadius:8, border:`1px solid ${G3}` }}>
        <p style={{ margin:'0 0 10px', fontSize:11, fontWeight:700, color:TL2, textTransform:'uppercase', letterSpacing:'0.07em' }}>Key Improvements vs. Current CVS Process Flow</p>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'5px 32px' }}>
          {['Single consolidated MIRAB gate (eliminates the duplicated review loops)','New Define & Research phase with explicit UX research gate','Product Brief as a mandatory artifact before prioritization is permitted','Explicit exit criteria at every phase — no ambiguous handoffs','WSJF/RICE scoring standardizes prioritization (replaces subjective ranking)','Post-launch measurement phase with 30/60/90-day KPI tracking','Formal waitlist process with rationale (vs. opaque reprioritization)','Jira + Confluence as the single source of truth — no Asana/email silos'].map((item,i) => (
            <p key={i} style={{ margin:'2px 0', fontSize:12, color:TM }}><span style={{ color:FO, fontWeight:700 }}>✓</span> {item}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
 
function IntakeForm({ formStep, setFormStep, submitted, setSubmitted }) {
  const [d, setD] = useState({
    submitterName:'', role:'', dept:'', email:'', healthPlan:'',
    title:'', reqType:'', problem:'', solution:'', users:'', population:'',
    okr:'', priority:'', isReg:'No', mandate:'', deadline:'', workType:'Planned',
    effort:'', launchDate:'', launchType:'Aspirational', dependencies:'', risks:'', systems:'',
    bizOwner:'', techLead:'', uxLead:'', data:'', compliance:'', others:'',
    kpi1:'', kpi2:'', baseline:'', target:'', method:'', dataLink:'',
    docs:'', notes:'', confirmed:false,
  });
  const u = (k,v) => setD(prev => ({...prev, [k]:v}));
 
  const F = { width:'100%', padding:'8px 12px', border:`1px solid ${G3}`, borderRadius:6, fontSize:13, color:TX, boxSizing:'border-box', background:WH, outline:'none' };
  const L = { display:'block', fontSize:12, fontWeight:600, color:TM, marginBottom:4 };
  const GRP = { marginBottom:14 };
  const R2 = { display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 };
  const TA = { ...F, minHeight:72, resize:'vertical' };
 
  const content = [
    // 0: Requester
    <div>
      <p style={{ margin:'0 0 16px', fontSize:13, color:TM }}>Help us route your request correctly and keep you informed throughout the process.</p>
      <div style={R2}>
        <div style={GRP}><label style={L}>Full Name *</label><input style={F} value={d.submitterName} onChange={e=>u('submitterName',e.target.value)} placeholder="Your full name" /></div>
        <div style={GRP}><label style={L}>Role / Title *</label><input style={F} value={d.role} onChange={e=>u('role',e.target.value)} placeholder="e.g. Product Owner, Business Analyst" /></div>
      </div>
      <div style={R2}>
        <div style={GRP}><label style={L}>Department / Team *</label><input style={F} value={d.dept} onChange={e=>u('dept',e.target.value)} placeholder="e.g. Medicaid Operations, IT Strategy" /></div>
        <div style={GRP}><label style={L}>Email Address *</label><input style={{...F}} type="email" value={d.email} onChange={e=>u('email',e.target.value)} placeholder="name@aetna.com" /></div>
      </div>
      <div style={GRP}>
        <label style={L}>Health Plan / Line of Business *</label>
        <select style={F} value={d.healthPlan} onChange={e=>u('healthPlan',e.target.value)}>
          <option value="">Select...</option>
          <option>Medicaid</option><option>Medicare</option><option>Commercial</option>
          <option>Enterprise / All Plans</option><option>Shared Services</option>
        </select>
      </div>
    </div>,
 
    // 1: Product
    <div>
      <p style={{ margin:'0 0 16px', fontSize:13, color:TM }}>Describe the product or feature you're requesting and the problem it solves.</p>
      <div style={GRP}><label style={L}>Request Title * <span style={{ fontWeight:400, color:TL2 }}>(becomes your Jira Epic title)</span></label><input style={F} value={d.title} onChange={e=>u('title',e.target.value)} placeholder="Brief, descriptive title" /></div>
      <div style={GRP}>
        <label style={L}>Request Type *</label>
        <select style={F} value={d.reqType} onChange={e=>u('reqType',e.target.value)}>
          <option value="">Select...</option>
          <option>New Product / Platform</option><option>Feature Enhancement</option>
          <option>Regulatory / Compliance</option><option>Tech Debt / Modernization</option>
          <option>Innovation / R&D</option><option>Unplanned / Emergency</option>
        </select>
      </div>
      <div style={GRP}><label style={L}>Problem Statement * <span style={{ fontWeight:400, color:TL2 }}>(What pain, gap, or opportunity? Who is affected?)</span></label><textarea style={TA} value={d.problem} onChange={e=>u('problem',e.target.value)} placeholder="Describe the current problem in as much detail as you can. Include who is impacted, what they currently experience, and what the business cost is..." /></div>
      <div style={GRP}><label style={L}>Proposed Solution / Idea <span style={{ fontWeight:400, color:TL2 }}>(the team will refine this)</span></label><textarea style={{...TA, minHeight:56}} value={d.solution} onChange={e=>u('solution',e.target.value)} placeholder="Share your initial idea or approach. This is a starting point, not a commitment." /></div>
      <div style={R2}>
        <div style={GRP}><label style={L}>Target Users / Personas *</label><input style={F} value={d.users} onChange={e=>u('users',e.target.value)} placeholder="e.g. Medicaid members, Care coordinators" /></div>
        <div style={GRP}><label style={L}>Estimated User Population</label><input style={F} value={d.population} onChange={e=>u('population',e.target.value)} placeholder="e.g. ~50,000 Ohio Medicaid members" /></div>
      </div>
    </div>,
 
    // 2: Business Context
    <div>
      <p style={{ margin:'0 0 16px', fontSize:13, color:TM }}>Connect this request to strategic priorities and flag any compliance drivers.</p>
      <div style={GRP}>
        <label style={L}>OKR / Strategic Alignment *</label>
        <select style={F} value={d.okr} onChange={e=>u('okr',e.target.value)}>
          <option value="">Select primary OKR...</option>
          <option>Improve member health outcomes</option><option>Enhance member digital experience</option>
          <option>Operational efficiency & cost reduction</option><option>Regulatory compliance & risk mitigation</option>
          <option>Provider engagement & network quality</option><option>Data & analytics modernization</option>
          <option>Market growth & enrollment</option>
        </select>
      </div>
      <div style={R2}>
        <div style={GRP}>
          <label style={L}>Business Priority *</label>
          <select style={F} value={d.priority} onChange={e=>u('priority',e.target.value)}>
            <option value="">Select...</option>
            <option>Critical — business-blocking</option><option>High — significant impact</option>
            <option>Medium — meaningful improvement</option><option>Low — nice to have</option>
          </select>
        </div>
        <div style={GRP}>
          <label style={L}>Work Classification *</label>
          <select style={F} value={d.workType} onChange={e=>u('workType',e.target.value)}>
            <option>Planned — part of annual strat plan</option>
            <option>Unplanned — ad hoc request</option>
            <option>Regulatory — hard mandate deadline</option>
          </select>
        </div>
      </div>
      <div style={GRP}>
        <label style={L}>Is this driven by a regulatory or compliance mandate? *</label>
        <div style={{ display:'flex', gap:20 }}>
          {['Yes','No'].map(o => (
            <label key={o} style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, cursor:'pointer' }}>
              <input type="radio" name="isReg" value={o} checked={d.isReg===o} onChange={()=>u('isReg',o)} /> {o}
            </label>
          ))}
        </div>
      </div>
      {d.isReg==='Yes' && <div style={GRP}><label style={L}>Regulatory Mandate / Citation</label><input style={F} value={d.mandate} onChange={e=>u('mandate',e.target.value)} placeholder="e.g. CMS FHIR mandate, State DHS contract requirement, CMS Star Rating..." /></div>}
      <div style={GRP}><label style={L}>Hard Deadline <span style={{ fontWeight:400, color:TL2 }}>(if applicable)</span></label><input style={F} type="date" value={d.deadline} onChange={e=>u('deadline',e.target.value)} /></div>
    </div>,
 
    // 3: Scope & Timeline
    <div>
      <p style={{ margin:'0 0 16px', fontSize:13, color:TM }}>Your best estimate of effort and timing — the team will refine this during the Define phase.</p>
      <div style={R2}>
        <div style={GRP}>
          <label style={L}>Effort Estimate (T-shirt) *</label>
          <select style={F} value={d.effort} onChange={e=>u('effort',e.target.value)}>
            <option value="">Select...</option>
            <option>XS — days (minor config)</option><option>S — 1–2 sprints</option>
            <option>M — 1 quarter (1 PI)</option><option>L — 2–3 quarters</option>
            <option>XL — full program (4+ quarters)</option><option>Unknown — needs discovery</option>
          </select>
        </div>
        <div style={GRP}><label style={L}>Target Launch Date</label><input style={F} type="date" value={d.launchDate} onChange={e=>u('launchDate',e.target.value)} /></div>
      </div>
      <div style={GRP}>
        <label style={L}>Launch Date Type</label>
        <div style={{ display:'flex', gap:20 }}>
          {['Hard — contractual/regulatory','Aspirational — business preference'].map(o => (
            <label key={o} style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, cursor:'pointer' }}>
              <input type="radio" name="launchType" value={o} checked={d.launchType===o} onChange={()=>u('launchType',o)} /> {o}
            </label>
          ))}
        </div>
      </div>
      <div style={GRP}><label style={L}>Known Dependencies <span style={{ fontWeight:400, color:TL2 }}>(other teams, systems, external vendors, contracts)</span></label><textarea style={{...TA, minHeight:60}} value={d.dependencies} onChange={e=>u('dependencies',e.target.value)} placeholder="e.g. Depends on COMET API v3, requires Legal review, vendor contract renewal, state system availability..." /></div>
      <div style={GRP}><label style={L}>Known Risks or Constraints</label><textarea style={{...TA, minHeight:60}} value={d.risks} onChange={e=>u('risks',e.target.value)} placeholder="e.g. Limited engineering bandwidth in Q3, HIPAA PHI handling complexity, state-specific regulatory variation..." /></div>
      <div style={GRP}><label style={L}>Systems / Platforms Impacted</label><input style={F} value={d.systems} onChange={e=>u('systems',e.target.value)} placeholder="e.g. Member portal, Provider portal, COMET, Claims system, MDM, State EDI feeds..." /></div>
    </div>,
 
    // 4: Stakeholders
    <div>
      <p style={{ margin:'0 0 16px', fontSize:13, color:TM }}>Identify the key people who need to be involved, informed, and accountable. This becomes your DACI matrix in Confluence.</p>
      {[
        { k:'bizOwner', l:'Business Owner *', h:'Decision maker and budget holder — single named owner required', p:'Full name, email, team' },
        { k:'techLead', l:'Technical Lead', h:'Primary engineering contact for feasibility and delivery', p:'Full name, email, team' },
        { k:'uxLead', l:'UX / Design Lead', h:'Product design representative from the UX team', p:'Full name, email, team' },
        { k:'data', l:'Data / Analytics Contact', h:'Owns reporting, measurement, and data access for this request', p:'Full name, email, team' },
        { k:'compliance', l:'Compliance / Legal Contact', h:'Required if regulatory, data-sensitive, or involves member PHI', p:'Full name, email, team' },
        { k:'others', l:'Additional Stakeholders', h:'Others who need to be kept informed (consultees)', p:'Names, roles, emails — comma separated' },
      ].map(({ k, l, h, p }) => (
        <div key={k} style={GRP}>
          <label style={L}>{l} <span style={{ fontWeight:400, color:TL2 }}>{h}</span></label>
          <input style={F} value={d[k]} onChange={e=>u(k,e.target.value)} placeholder={p} />
        </div>
      ))}
    </div>,
 
    // 5: Metrics
    <div>
      <p style={{ margin:'0 0 16px', fontSize:13, color:TM }}>Define success before the team begins work. These become the KPIs in your Product Brief and MIRAB submission.</p>
      <div style={GRP}><label style={L}>Primary KPI * <span style={{ fontWeight:400, color:TL2 }}>(the single most important measure of success)</span></label><input style={F} value={d.kpi1} onChange={e=>u('kpi1',e.target.value)} placeholder="e.g. Member portal login success rate, Care gap closure %, 30-day readmission rate" /></div>
      <div style={GRP}><label style={L}>Secondary KPIs <span style={{ fontWeight:400, color:TL2 }}>(2–3 supporting metrics)</span></label><textarea style={{...TA, minHeight:60}} value={d.kpi2} onChange={e=>u('kpi2',e.target.value)} placeholder="List supporting metrics that indicate the initiative is working as intended..." /></div>
      <div style={R2}>
        <div style={GRP}><label style={L}>Current Baseline Metric *</label><input style={F} value={d.baseline} onChange={e=>u('baseline',e.target.value)} placeholder="e.g. Current login success = 72%" /></div>
        <div style={GRP}><label style={L}>Target State Metric *</label><input style={F} value={d.target} onChange={e=>u('target',e.target.value)} placeholder="e.g. Target login success ≥ 90% by Q3" /></div>
      </div>
      <div style={GRP}><label style={L}>How will success be measured? <span style={{ fontWeight:400, color:TL2 }}>(methodology, timing, owner)</span></label><textarea style={{...TA, minHeight:60}} value={d.method} onChange={e=>u('method',e.target.value)} placeholder="Describe the measurement approach, data sources, timing (e.g. 30/60/90 days post-launch), and who owns measurement..." /></div>
      <div style={GRP}><label style={L}>Link to Existing Data / Reporting Dashboard</label><input style={F} value={d.dataLink} onChange={e=>u('dataLink',e.target.value)} placeholder="https://... (Tableau, Power BI, Confluence data page, etc.)" /></div>
    </div>,
 
    // 6: Review
    <div>
      <p style={{ margin:'0 0 14px', fontSize:13, color:TM }}>Review your submission. Submitting will auto-create a Jira Epic and notify your Portfolio Manager within 1 business day.</p>
      <div style={{ background:G1, borderRadius:8, padding:16, border:`1px solid ${G3}`, marginBottom:16 }}>
        {[
          { s:'Requester', items:[`${d.submitterName || '—'}`, `${d.role || '—'} · ${d.dept || '—'}`, `${d.email || '—'}`, `Health Plan: ${d.healthPlan || '—'}`] },
          { s:'Request', items:[`"${d.title || '—'}"`, `Type: ${d.reqType || '—'}`, `Classification: ${d.workType}`] },
          { s:'Business Context', items:[`OKR: ${d.okr || '—'}`, `Priority: ${d.priority || '—'}`, `Regulatory: ${d.isReg}${d.deadline ? ' · Deadline: '+d.deadline : ''}`] },
          { s:'Scope', items:[`Effort: ${d.effort || '—'}`, `Target Launch: ${d.launchDate || '—'} (${d.launchType.split('—')[0].trim()})`] },
          { s:'Key Stakeholders', items:[`Business Owner: ${d.bizOwner || '—'}`, `Tech Lead: ${d.techLead || '—'}`, `UX Lead: ${d.uxLead || '—'}`] },
          { s:'Success Metric', items:[`Primary KPI: ${d.kpi1 || '—'}`, `Baseline: ${d.baseline || '—'} → Target: ${d.target || '—'}`] },
        ].map(({ s, items }) => (
          <div key={s} style={{ marginBottom:10 }}>
            <p style={{ margin:'0 0 3px', fontSize:10, fontWeight:700, color:V, textTransform:'uppercase', letterSpacing:'0.08em' }}>{s}</p>
            {items.map((item,i) => <p key={i} style={{ margin:'0 0 2px', fontSize:12, color:TX }}>{item}</p>)}
          </div>
        ))}
      </div>
      <div style={GRP}><label style={L}>Supporting Documents / Links</label><input style={F} value={d.docs} onChange={e=>u('docs',e.target.value)} placeholder="Links to research, data, wireframes, contracts, or existing documentation..." /></div>
      <div style={GRP}><label style={L}>Additional Notes</label><textarea style={{...TA, minHeight:56}} value={d.notes} onChange={e=>u('notes',e.target.value)} placeholder="Anything else the team should know before triaging this request..." /></div>
      <label style={{ display:'flex', alignItems:'flex-start', gap:8, cursor:'pointer' }}>
        <input type="checkbox" style={{ marginTop:2 }} checked={d.confirmed} onChange={e=>u('confirmed',e.target.checked)} />
        <span style={{ fontSize:13, color:TX }}>I confirm this information is accurate, I have identified the correct Business Owner, and I understand that the team will follow up within 3 business days.</span>
      </label>
    </div>,
  ];
 
  if (submitted) {
    return (
      <div style={{ textAlign:'center', padding:'36px 24px' }}>
        <div style={{ width:64, height:64, borderRadius:'50%', background:FOB, border:`3px solid ${FO}`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
          <i className="ti ti-check" style={{ fontSize:28, color:FO }} aria-hidden="true" />
        </div>
        <h2 style={{ margin:'0 0 6px', fontSize:20, color:FO }}>Request Submitted — Jira Epic Created</h2>
        <p style={{ margin:'0 0 24px', color:TM, fontSize:13 }}>Your Portfolio Manager has been notified and will triage within 3 business days. You'll receive an email with your Epic link.</p>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, maxWidth:620, margin:'0 auto 24px' }}>
          {[
            { l:'What Happens Next', items:['PM triages and classifies within 3 days','You are added as Reporter to the Epic','Named stakeholders are notified','Epic appears in Intake Queue dashboard'] },
            { l:'Your Jira Epic', items:[`Title: "${d.title || 'Your Request'}"`, 'Status: Intake Queue', 'Labels auto-applied from form data','Confluence Brief link will be added in Phase 02'] },
            { l:'Track Your Request', items:['Check Jira for Epic status updates','Confluence Product Hub has the roadmap','Portfolio Manager is your primary contact','Portfolio Review is bi-weekly'] },
          ].map(({ l, items }) => (
            <div key={l} style={{ background:G1, borderRadius:8, padding:'12px 14px', border:`1px solid ${G3}`, textAlign:'left' }}>
              <p style={{ margin:'0 0 8px', fontSize:10, fontWeight:700, color:V, textTransform:'uppercase', letterSpacing:'0.07em' }}>{l}</p>
              {items.map((item,i) => <p key={i} style={{ margin:'0 0 3px', fontSize:11, color:TX }}>• {item}</p>)}
            </div>
          ))}
        </div>
        <button onClick={() => { setSubmitted(false); }} style={{ padding:'10px 24px', background:V, color:WH, border:'none', borderRadius:20, cursor:'pointer', fontSize:13, fontWeight:700 }}>Submit Another Request</button>
      </div>
    );
  }
 
  return (
    <div>
      {/* Step indicator */}
      <div style={{ display:'flex', marginBottom:24, overflowX:'auto', gap:0 }}>
        {FORM_STEPS.map((step,i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', flexShrink:0 }}>
            <div onClick={() => i < formStep && setFormStep(i)} style={{
              display:'flex', alignItems:'center', gap:5, padding:'7px 12px', borderRadius:20,
              cursor: i < formStep ? 'pointer' : 'default',
              background: formStep===i ? V : i < formStep ? TLB : G1,
              color: formStep===i ? WH : i < formStep ? TL : TL2,
              fontWeight: formStep===i ? 700 : 400, fontSize:12,
              border:`1px solid ${formStep===i ? V : i < formStep ? TL : G3}`,
              transition:'all 0.15s', whiteSpace:'nowrap',
            }}>
              {i < formStep ? <i className="ti ti-check" style={{ fontSize:13 }} aria-hidden="true" /> : <i className={`ti ${step.icon}`} style={{ fontSize:13 }} aria-hidden="true" />}
              {step.label}
            </div>
            {i < FORM_STEPS.length-1 && <div style={{ width:12, height:1, background: i < formStep ? TL : G3 }} />}
          </div>
        ))}
      </div>
 
      <div style={{ background:WH, border:`1px solid ${G3}`, borderRadius:10, padding:24 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
          <i className={`ti ${FORM_STEPS[formStep].icon}`} style={{ fontSize:18, color:V }} aria-hidden="true" />
          <h3 style={{ margin:0, fontSize:16, fontWeight:700, color:TX }}>{FORM_STEPS[formStep].label}</h3>
          <span style={{ marginLeft:'auto', fontSize:11, color:TL2 }}>Step {formStep+1} of {FORM_STEPS.length}</span>
        </div>
        <div style={{ height:1, background:G3, marginBottom:18 }} />
        {content[formStep]}
      </div>
 
      <div style={{ display:'flex', justifyContent:'space-between', marginTop:14 }}>
        <button onClick={() => setFormStep(Math.max(0,formStep-1))} disabled={formStep===0} style={{
          padding:'9px 20px', background:'none', border:`1px solid ${G3}`, borderRadius:20,
          cursor: formStep===0 ? 'not-allowed' : 'pointer', fontSize:13,
          color: formStep===0 ? G4 : TX,
        }}>← Back</button>
        {formStep < FORM_STEPS.length-1
          ? <button onClick={() => setFormStep(formStep+1)} style={{ padding:'9px 22px', background:V, color:WH, border:'none', borderRadius:20, cursor:'pointer', fontSize:13, fontWeight:700 }}>Continue →</button>
          : <button onClick={() => d.confirmed && setSubmitted(true)} style={{ padding:'9px 24px', background: d.confirmed ? FO : G4, color:WH, border:'none', borderRadius:20, cursor: d.confirmed ? 'pointer' : 'not-allowed', fontSize:13, fontWeight:700 }}>Submit Intake Request</button>
        }
      </div>
    </div>
  );
}
 
function AtlassianPlaybook({ jiraCat, setJiraCat, confOpen, setConfOpen }) {
  return (
    <div>
      <p style={{ margin:'0 0 20px', fontSize:13, color:TM }}>Jira and Confluence are the single source of truth. Every phase of the intake process has a corresponding Jira action and Confluence artifact. Here's the complete setup guide.</p>
 
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}>
        {/* Confluence */}
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
            <div style={{ width:34, height:34, borderRadius:8, background:'#0052CC', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <span style={{ color:WH, fontSize:15, fontWeight:800 }}>C</span>
            </div>
            <div><h3 style={{ margin:0, fontSize:15, fontWeight:700 }}>Confluence Space Architecture</h3>
            <p style={{ margin:0, fontSize:11, color:TL2 }}>Space key: AMTP — Aetna Medicaid Tech Product</p></div>
          </div>
 
          <div style={{ background:INB, borderRadius:8, padding:'10px 14px', marginBottom:14, border:`1px solid ${IN}30` }}>
            <p style={{ margin:'0 0 4px', fontSize:11, fontWeight:700, color:IN }}>SPACE STRUCTURE PRINCIPLE</p>
            <p style={{ margin:0, fontSize:12, color:TX }}>One space, six sections. Every artifact from every phase lives here. Pages are templated — no one starts from scratch. Jira Epics link directly to their Confluence Product Brief.</p>
          </div>
 
          {confluenceSections.map((sec,i) => (
            <div key={i} style={{ marginBottom:6 }}>
              <div onClick={() => setConfOpen(confOpen===i ? null : i)} style={{
                display:'flex', justifyContent:'space-between', alignItems:'center',
                padding:'9px 14px', background:WH, border:`1px solid ${G3}`,
                borderRadius: confOpen===i ? '7px 7px 0 0' : 7,
                borderLeft:'4px solid #0052CC', cursor:'pointer',
              }}>
                <span style={{ fontSize:13, fontWeight:600, color:TX }}>{sec.title}</span>
                <i className={`ti ti-chevron-${confOpen===i ? 'up' : 'down'}`} style={{ fontSize:14, color:TL2 }} aria-hidden="true" />
              </div>
              {confOpen===i && (
                <div style={{ background:G1, border:`1px solid ${G3}`, borderTop:'none', borderRadius:'0 0 7px 7px', padding:'8px 14px' }}>
                  {sec.pages.map((pg,j) => (
                    <div key={j} style={{ display:'flex', alignItems:'center', gap:6, marginBottom:3 }}>
                      <i className="ti ti-file-text" style={{ fontSize:12, color:'#0052CC' }} aria-hidden="true" />
                      <p style={{ margin:0, fontSize:12, color:TX }}>{pg}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
 
          <div style={{ background:FOB, borderRadius:8, padding:'12px 14px', marginTop:14, border:`1px solid ${FO}30` }}>
            <p style={{ margin:'0 0 6px', fontSize:11, fontWeight:700, color:FO }}>JIRA ↔ CONFLUENCE INTEGRATION RULES</p>
            {[
              'Every Epic links to its Confluence Product Brief (URL custom field)',
              'Intake Queue page uses Jira Issues macro filtered by label: intake-queue',
              'Sprint Status pages embed the active Jira board via macro',
              'Retrospective docs link back to the closed Jira Epic',
              'OKR Tracker table in Confluence links to respective Jira Epics',
              'Business Case approval is recorded as a Jira Epic comment with date',
            ].map((r,i) => <p key={i} style={{ margin:'0 0 3px', fontSize:12, color:TX }}>→ {r}</p>)}
          </div>
        </div>
 
        {/* Jira */}
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
            <div style={{ width:34, height:34, borderRadius:8, background:'#0052CC', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <span style={{ color:WH, fontSize:15, fontWeight:800 }}>J</span>
            </div>
            <div><h3 style={{ margin:0, fontSize:15, fontWeight:700 }}>Jira Project Configuration</h3>
            <p style={{ margin:0, fontSize:11, color:TL2 }}>Project type: Scrum · SAFe hierarchy: Epic → Feature → Story → Task</p></div>
          </div>
 
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:4, marginBottom:14 }}>
            {jiraSetup.map((cat,i) => (
              <button key={i} onClick={() => setJiraCat(i)} style={{
                padding:'7px 6px', fontSize:11, fontWeight: jiraCat===i ? 700 : 400,
                background: jiraCat===i ? V : G1, color: jiraCat===i ? WH : TM,
                border:`1px solid ${jiraCat===i ? V : G3}`, borderRadius:6, cursor:'pointer',
                lineHeight:1.3,
              }}>{cat.category}</button>
            ))}
          </div>
 
          <div style={{ background:WH, border:`1px solid ${G3}`, borderRadius:8, overflow:'hidden' }}>
            <div style={{ background:V, padding:'8px 14px' }}>
              <p style={{ margin:0, fontSize:12, fontWeight:700, color:WH }}>{jiraSetup[jiraCat].category}</p>
            </div>
            {jiraSetup[jiraCat].items.map((item,i) => (
              <div key={i} style={{ padding:'8px 14px', borderBottom:`1px solid ${G2}`, display:'grid', gridTemplateColumns:'2.2fr 0.9fr 3fr', gap:8, alignItems:'start' }}>
                <p style={{ margin:0, fontSize:11, fontWeight:700, color:TX, fontFamily:'monospace', lineHeight:1.4 }}>{item.f}</p>
                <span style={{ display:'inline-block', padding:'2px 6px', background:VL, color:V, borderRadius:4, fontSize:10, fontWeight:700, alignSelf:'flex-start', whiteSpace:'nowrap' }}>{item.t}</span>
                <p style={{ margin:0, fontSize:11, color:TM, lineHeight:1.4 }}>{item.d}</p>
              </div>
            ))}
          </div>
 
          <div style={{ background:AMB, borderRadius:8, padding:'12px 14px', marginTop:14, border:`1px solid ${AM}30` }}>
            <p style={{ margin:'0 0 6px', fontSize:11, fontWeight:700, color:AM }}>PERFORMANCE METRICS TO TRACK IN JIRA</p>
            {[
              'Time-to-Approval — days from Epic creation to "Approved" status',
              'Time-to-Launch — days from "Approved" to "Released — Monitoring"',
              'Intake Volume — Epics created per month by classification type',
              'Sprint Velocity — story points per sprint per team',
              'Backlog Age — Epics in "Intake Queue" > 10 days without triage',
              'MIRAB Pass Rate — % of submitted requests receiving funding',
            ].map((m,i) => <p key={i} style={{ margin:'0 0 3px', fontSize:12, color:TX }}>→ {m}</p>)}
          </div>
        </div>
      </div>
    </div>
  );
}
 
function RitualsView() {
  const phaseMap = Object.fromEntries(phases.map(p => [p.num, { color:p.color, bg:p.bg }]));
  const freqOrder = { 'Daily':0, 'Weekly':1, 'Bi-weekly':2, 'Monthly':3, 'Quarterly':4, 'Per Request':5, 'Per Epic':6, 'As needed':7, 'Post-launch':8 };
  const sorted = [...rituals].sort((a,b) => freqOrder[a.freq] - freqOrder[b.freq]);
 
  return (
    <div>
      <p style={{ margin:'0 0 16px', fontSize:13, color:TM }}>All ceremonies, their cadence, facilitators, attendees, and purpose. These rituals are the operational heartbeat of the intake-to-delivery cycle.</p>
 
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:10, marginBottom:22 }}>
        {[
          { l:'Total Ceremonies', v:rituals.length, c:V, bg:VL },
          { l:'Daily Recurring', v:rituals.filter(r=>r.freq==='Daily').length, c:TL, bg:TLB },
          { l:'Weekly / Bi-weekly', v:rituals.filter(r=>['Weekly','Bi-weekly'].includes(r.freq)).length, c:IN, bg:INB },
          { l:'Event-based', v:rituals.filter(r=>!['Daily','Weekly','Bi-weekly','Monthly'].includes(r.freq)).length, c:FO, bg:FOB },
        ].map(({ l, v, c, bg }) => (
          <div key={l} style={{ background:bg, borderRadius:8, padding:'12px 14px', border:`1px solid ${c}30`, textAlign:'center' }}>
            <p style={{ margin:'0 0 3px', fontSize:26, fontWeight:800, color:c }}>{v}</p>
            <p style={{ margin:0, fontSize:11, color:TM }}>{l}</p>
          </div>
        ))}
      </div>
 
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
        {sorted.map((ritual,i) => {
          const pc = phaseMap[ritual.phase] || { color:V, bg:VL };
          return (
            <div key={i} style={{ background:WH, border:`1px solid ${G3}`, borderRadius:8, overflow:'hidden', borderTop:`4px solid ${pc.color}` }}>
              <div style={{ padding:'11px 14px 10px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:5 }}>
                  <p style={{ margin:0, fontSize:14, fontWeight:700, color:TX }}>{ritual.name}</p>
                  <span style={{ padding:'2px 8px', background:pc.bg, color:pc.color, borderRadius:10, fontSize:10, fontWeight:700, flexShrink:0, marginLeft:8 }}>Phase {ritual.phase}</span>
                </div>
                <p style={{ margin:'0 0 10px', fontSize:12, color:TM, lineHeight:1.5 }}>{ritual.purpose}</p>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, borderTop:`1px solid ${G2}`, paddingTop:8, marginBottom:8 }}>
                  {[
                    { l:'Frequency', v:ritual.freq, c:pc.color },
                    { l:'Duration', v:ritual.dur, c:TX },
                    { l:'Facilitator', v:ritual.fac, c:TX },
                  ].map(({ l, v, c }) => (
                    <div key={l}>
                      <p style={{ margin:'0 0 1px', fontSize:9, color:TL2, textTransform:'uppercase', letterSpacing:'0.07em' }}>{l}</p>
                      <p style={{ margin:0, fontSize:11, fontWeight:600, color:c, lineHeight:1.3 }}>{v}</p>
                    </div>
                  ))}
                </div>
                <div style={{ borderTop:`1px solid ${G2}`, paddingTop:7 }}>
                  <p style={{ margin:'0 0 2px', fontSize:9, color:TL2, textTransform:'uppercase', letterSpacing:'0.07em' }}>Attendees</p>
                  <p style={{ margin:0, fontSize:11, color:TM }}>{ritual.att.join(' · ')}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   PRODUCT SERVICES
═══════════════════════════════════════════════════════ */
const PS_SERVICES = [
  { id:'interviews',  phase:'discovery',      icon:'ti-users',           name:'User interviews',             effort:2, def:'One-on-one structured conversations to surface mental models, pain points, and unmet needs.', example:'Interviewing Medicaid members navigating prior authorization to map where confusion occurs.' },
  { id:'contextual',  phase:'discovery',      icon:'ti-eye',             name:'Contextual inquiry',          effort:3, def:'Observing users in their natural environment while completing real tasks.', example:'Shadowing care coordinators to document workarounds built into daily workflows.' },
  { id:'surveys',     phase:'discovery',      icon:'ti-list-check',      name:'Surveys & screeners',         effort:1, def:'Quantitative data collection at scale to validate hypotheses and segment audiences.', example:'Recruiting Aetna members across plan types for a benefits comprehension study.' },
  { id:'analytics',   phase:'discovery',      icon:'ti-chart-bar',       name:'Analytics review',            effort:1, def:'Interpreting behavioral data to identify drop-off points and usage anomalies.', example:'Pinpointing where members abandon the claims status flow in the portal.' },
  { id:'desk',        phase:'discovery',      icon:'ti-book',            name:'Desk research',               effort:1, def:'Synthesizing existing research, competitive landscapes, and industry benchmarks.', example:'Benchmarking digital health onboarding flows across major payers.' },
  { id:'stakeholder', phase:'discovery',      icon:'ti-id-badge-2',      name:'Stakeholder interviews',      effort:1, def:'Structured conversations to surface business goals, constraints, and org context.', example:'Interviewing product and compliance teams before redesigning a regulated benefits page.' },
  { id:'affinity',    phase:'synthesis',      icon:'ti-layout-columns',  name:'Affinity mapping',            effort:1, def:'Collaborative clustering of research observations into themes to reveal patterns.', example:'Sorting 15 member interview findings into themes around trust and navigation confidence.' },
  { id:'journey',     phase:'synthesis',      icon:'ti-route',           name:'Journey mapping',             effort:2, def:'Visualizing the end-to-end experience across touchpoints — actions, emotions, and pain points.', example:"Mapping a patient's journey from diagnosis through insurance approval, pharmacy, and follow-up care." },
  { id:'personas',    phase:'synthesis',      icon:'ti-user-circle',     name:'Persona development',         effort:2, def:'Composite portraits of user archetypes capturing goals, behaviors, and frustrations.', example:'Three member personas (caregiver, chronic condition manager, first-time enrollee) for portal redesign.' },
  { id:'hmw',         phase:'synthesis',      icon:'ti-target',          name:'HMW framing',                 effort:1, def:'Translating insights into "How might we…" design challenge statements.', example:'How might we help members understand deductible status without calling customer support?' },
  { id:'blueprint',   phase:'synthesis',      icon:'ti-sitemap',         name:'Service blueprinting',        effort:2, def:'Mapping the full service system — frontstage actions, backstage processes, and gaps.', example:'Blueprinting prior auth workflow to expose disconnects between member, provider, and ops.' },
  { id:'readout',     phase:'synthesis',      icon:'ti-presentation',    name:'Research readout',            effort:1, def:'Structured presentation of findings and recommendations for executive stakeholders.', example:'20-slide readout translating member research into three priorities for the redesign roadmap.' },
  { id:'ia',          phase:'design',         icon:'ti-topology-star-3', name:'Information architecture',    effort:2, def:'Structuring content and navigation grounded in user mental models.', example:'Restructuring member portal navigation based on card sort data across 40 members.' },
  { id:'wireframes',  phase:'design',         icon:'ti-layout',          name:'Wireframing',                 effort:2, def:'Low-to-mid fidelity structural blueprints defining layout and interaction flow.', example:'Wireframes for a 6-step enrollment flow annotated with logic and error states.' },
  { id:'prototype',   phase:'design',         icon:'ti-device-mobile',   name:'Prototyping',                 effort:3, def:'Interactive simulations used to test with users and communicate intent to developers.', example:'High-fidelity Figma prototype of the redesigned claims tracker, tested with 8 members.' },
  { id:'visual',      phase:'design',         icon:'ti-palette',         name:'Visual design',               effort:3, def:'Applying brand guidelines and accessibility standards to create polished, trust-building UI.', example:'Final comps for a benefits page following Aetna MLP design system and WCAG 2.1 AA.' },
  { id:'uxwriting',   phase:'design',         icon:'ti-pencil',          name:'UX writing',                  effort:1, def:'Crafting interface copy — labels, errors, tooltips, CTAs — at appropriate reading level.', example:'Rewriting prior auth status messages to plain language at a 6th-grade reading level.' },
  { id:'designsys',   phase:'design',         icon:'ti-components',      name:'Design system contribution',  effort:2, def:'Creating or extending reusable components and patterns for scalability and consistency.', example:'Documenting a new "coverage alert" pattern for the Aetna MLP library with all states.' },
  { id:'modtest',     phase:'testing',        icon:'ti-users-group',     name:'Moderated usability testing', effort:3, def:'Live facilitated sessions where participants complete tasks on prototypes or live products.', example:'8 sessions testing a pharmacy benefits search tool with Medicare members aged 65+.' },
  { id:'unmod',       phase:'testing',        icon:'ti-player-play',     name:'Unmoderated testing',         effort:2, def:'Remote task-based studies at scale for validating interactions or comparing design variations.', example:'50-participant study comparing two benefits card layouts for comprehension and accuracy.' },
  { id:'concept',     phase:'testing',        icon:'ti-bulb',            name:'Concept testing',             effort:2, def:'Presenting early ideas to users for feedback before significant design investment.', example:'Testing three approaches to displaying out-of-pocket costs to find the right mental model.' },
  { id:'a11y',        phase:'testing',        icon:'ti-accessible',      name:'Accessibility audit',         effort:2, def:'Evaluating designs against WCAG 2.1 AA — keyboard nav, screen readers, contrast, errors.', example:'Full A11Y audit of the enrollment flow producing a prioritized remediation list.' },
  { id:'heuristic',   phase:'testing',        icon:'ti-compass',         name:'Heuristic evaluation',        effort:1, def:'Expert review against established UX principles to rapidly identify usability issues.', example:'Heuristic review of a legacy provider tool ahead of a modernization initiative.' },
  { id:'cardsort',    phase:'testing',        icon:'ti-cards',           name:'Card sorting & tree testing',  effort:2, def:'IA research methods revealing how users group content and navigate proposed structures.', example:'Tree test of proposed Aetna.com navigation with 80 participants to validate labeling.' },
  { id:'handoff',     phase:'implementation', icon:'ti-file-text',       name:'Design handoff & specs',      effort:1, def:'Annotated design files and dev-ready documentation that eliminate ambiguity for engineering.', example:'Full Figma handoff package covering all states, breakpoints, and animation specs.' },
  { id:'dqa',         phase:'implementation', icon:'ti-shield-check',    name:'Design QA',                   effort:2, def:'Reviewing built product against approved designs to catch deviations before production.', example:'Sprint-by-sprint QA across three engineering squads building member onboarding.' },
  { id:'iterative',   phase:'implementation', icon:'ti-refresh',         name:'Iterative design support',    effort:3, def:'Ongoing design partnership through agile cycles — handling edge cases and design debt.', example:'Embedded design support across a 6-sprint release cycle with a product squad.' },
  { id:'docs',        phase:'implementation', icon:'ti-book-2',          name:'Documentation & guidelines',  effort:1, def:'Pattern libraries, usage guidelines, and design rationale for team autonomy.', example:'Guidelines for how and when to use the Aetna MLP "alert" component.' },
  { id:'metrics',     phase:'implementation', icon:'ti-chart-line',      name:'Post-launch measurement',     effort:1, def:'Defining success metrics and reviewing analytics to assess outcomes and guide iteration.', example:'Tracking task completion and CSAT for 90 days post-launch on a redesigned EOB experience.' },
  { id:'workshops',   phase:'implementation', icon:'ti-users-group',     name:'Design workshops',            effort:1, def:'Facilitated co-creation sessions aligning product, engineering, and business stakeholders.', example:'3-hour design sprint with 12 stakeholders on a cost transparency challenge.' },
];

const PS_PHASES = ['discovery','synthesis','design','testing','implementation'];
const PS_PHASE_ICONS = { discovery:'ti-search', synthesis:'ti-chart-dots-3', design:'ti-pencil', testing:'ti-clipboard-check', implementation:'ti-rocket' };
const PS_PHASE_LABELS = { discovery:'Discovery', synthesis:'Synthesis', design:'Design', testing:'Testing', implementation:'Implementation' };
const PS_EFFORT_LBL = ['','Low','Medium','High'];
const PS_PHASE_DESCS = {
  discovery:'Understand who your users are, what they need, and where the current experience is failing them. We ground every decision in real evidence — not assumptions. This phase defines the problem worth solving.',
  synthesis:'Transform raw research into clear insight and actionable direction. We make sense of complexity, align teams around a shared understanding of users, and define the strategic opportunity that drives design decisions.',
  design:'Translate insight into tangible solutions. We move from rough concepts through validated designs — aligning business requirements, user needs, and technical feasibility into experiences that are clear, accessible, and buildable.',
  testing:'Verify that designs actually work before they ship. We test with real users to surface usability problems, validate design decisions, and give teams the evidence they need to build with confidence.',
  implementation:'Bridge the gap between design intent and built reality. We partner with engineering and product teams to ensure what gets shipped matches what was designed — and that it continues to perform for users over time.',
};
const PS_PHASE_NAMES = { discovery:'Discovery & Research', synthesis:'Synthesis & Strategy', design:'Ideation & Design', testing:'Testing & Validation', implementation:'Implementation Support' };

function psGetDeliverables(id) {
  const map = {
    interviews:['Interview guide','Findings report'], contextual:['Field notes','Observation report'],
    surveys:['Survey instrument','Data summary'], analytics:['Annotated funnel','Insights memo'],
    desk:['Research brief','Competitive audit'], stakeholder:['Stakeholder map','Goals summary'],
    affinity:['Affinity diagram','Theme clusters'], journey:['Journey map','Opportunity areas'],
    personas:['Persona profiles','Need statements'], hmw:['HMW statements','Opportunity brief'],
    blueprint:['Service blueprint','Gap analysis'], readout:['Slide deck','Executive summary'],
    ia:['Site map','Navigation model'], wireframes:['Wireframe deck','Flow annotations'],
    prototype:['Figma prototype','Interaction specs'], visual:['High-fidelity screens','Redlines'],
    uxwriting:['Copy deck','Content model'], designsys:['Component specs','Usage guidelines'],
    modtest:['Test plan','Session findings'], unmod:['Task completion data','Clip highlights'],
    concept:['Concept deck','Preference data'], a11y:['Audit report','Remediation list'],
    heuristic:['Issue log','Severity ratings'], cardsort:['IA analysis','Findability score'],
    handoff:['Annotated Figma','Spec sheet'], dqa:['QA log','Annotated screenshots'],
    iterative:['Updated comps','Decision log'], docs:['Pattern docs','Decision rationale'],
    metrics:['Metrics framework','Post-launch report'], workshops:['Workshop plan','Outcome summary'],
  };
  return map[id] || [];
}

const PS_GUIDE = {
  new: {
    tight: { title:'New feature — tight timeline', tip:'Shortcut strategy: Lead with stakeholder interviews and analytics to rapidly map known terrain. Prototype fast and run a single round of moderated testing before shipping.', phases:{ discovery:[{n:'Stakeholder interviews',c:true,w:'Surface goals and constraints fast.'},{n:'Analytics review',c:true,w:'Use existing data instead of time-consuming field research.'},{n:'Desk research',c:false,w:'Pull in if a benchmark already exists.'}], synthesis:[{n:'HMW framing',c:true,w:'Quickly align the team on the design challenge.'},{n:'Affinity mapping',c:false,w:'Only if enough inputs warrant it.'}], design:[{n:'Wireframing',c:true,w:'Move fast to structure before visual polish.'},{n:'Prototyping',c:true,w:'Essential for any user-facing testing.'},{n:'UX writing',c:false,w:'At minimum, review key CTAs and error states.'}], testing:[{n:'Moderated usability testing',c:true,w:'One focused round — 5 participants — before launch.'},{n:'Heuristic evaluation',c:false,w:'A quick expert pass can catch blockers.'}], implementation:[{n:'Design handoff & specs',c:true,w:'Specs prevent costly engineering rework.'},{n:'Design QA',c:false,w:'At minimum, a single pass at feature-complete.'}] } },
    medium: { title:'New feature — medium timeline', tip:'Balanced approach: Invest upfront in discovery to avoid rework mid-build. Run two rounds of testing — one on wireframes, one on the final prototype.', phases:{ discovery:[{n:'User interviews',c:true,w:'Validate assumptions before designing — talk to at least 6 users.'},{n:'Stakeholder interviews',c:true,w:'Align requirements and constraints from the start.'},{n:'Analytics review',c:true,w:'Identify behavioral patterns in existing data.'},{n:'Surveys & screeners',c:false,w:'Useful for recruiting or quantitative validation.'}], synthesis:[{n:'Affinity mapping',c:true,w:'Cluster interview findings into actionable themes.'},{n:'HMW framing',c:true,w:'Translate themes into design challenge statements.'},{n:'Journey mapping',c:false,w:'Valuable if the feature spans multiple touchpoints.'}], design:[{n:'Wireframing',c:true,w:'Establish structure before visual investment.'},{n:'Prototyping',c:true,w:'Test at mid-fidelity before high-fidelity.'},{n:'Visual design',c:true,w:'Produce production-ready comps.'},{n:'UX writing',c:true,w:'Error states and onboarding copy matter from day one.'}], testing:[{n:'Moderated usability testing',c:true,w:'Two rounds — wireframes and near-final prototype.'},{n:'Accessibility audit',c:true,w:'Catch A11Y issues before engineering builds.'},{n:'Unmoderated testing',c:false,w:'Scale a specific interaction question.'}], implementation:[{n:'Design handoff & specs',c:true,w:'Full annotated Figma with all states and responsive specs.'},{n:'Design QA',c:true,w:'Catch drift between design intent and built output.'},{n:'Post-launch measurement',c:false,w:'Define KPIs now; measure 60–90 days post-launch.'}] } },
    open: { title:'New feature — full-cycle engagement', tip:'Full investment: Run a proper discovery sprint, synthesize into personas and journey maps, design iteratively, and embed through the build. This is the gold standard.', phases:{ discovery:[{n:'User interviews',c:true,w:'Deep qualitative discovery — 8–12 participants.'},{n:'Contextual inquiry',c:true,w:'Observe users in their real environment.'},{n:'Surveys & screeners',c:true,w:'Quantitative validation at scale.'},{n:'Analytics review',c:true,w:'Triangulate behavioral data with qualitative findings.'},{n:'Desk research',c:true,w:'Competitive benchmarking and literature review.'},{n:'Stakeholder interviews',c:true,w:'Full alignment on goals and constraints.'}], synthesis:[{n:'Affinity mapping',c:true,w:'Full synthesis sprint from all inputs.'},{n:'Journey mapping',c:true,w:'Map the complete experience across all touchpoints.'},{n:'Persona development',c:true,w:'Create durable user archetypes.'},{n:'HMW framing',c:true,w:'Frame challenges before ideation begins.'},{n:'Research readout',c:true,w:'Present findings before design begins.'}], design:[{n:'Information architecture',c:true,w:'Define navigation from user mental models.'},{n:'Wireframing',c:true,w:'Iterate quickly on structure.'},{n:'Prototyping',c:true,w:'Test multiple fidelity levels.'},{n:'Visual design',c:true,w:'Polished, production-ready comps.'},{n:'UX writing',c:true,w:'Full content strategy for all UI copy.'},{n:'Design system contribution',c:false,w:'Contribute new patterns back to the system.'}], testing:[{n:'Moderated usability testing',c:true,w:'Multiple rounds — concept, wireframe, high-fidelity.'},{n:'Unmoderated testing',c:true,w:'Validate interactions at scale.'},{n:'Concept testing',c:true,w:'Test multiple directions before committing.'},{n:'Accessibility audit',c:true,w:'Full WCAG 2.1 AA audit.'}], implementation:[{n:'Design handoff & specs',c:true,w:'Comprehensive package with all states.'},{n:'Design QA',c:true,w:'Sprint-by-sprint QA.'},{n:'Iterative design support',c:true,w:'Embedded design through all sprints.'},{n:'Post-launch measurement',c:true,w:'Track KPIs for 90 days post-launch.'}] } },
  },
  redesign: {
    tight: { title:'Redesign — tight timeline', tip:'Audit-first: Start with a heuristic evaluation and analytics review to diagnose the current state. Target the highest-impact fixes and validate with a quick usability test.', phases:{ discovery:[{n:'Analytics review',c:true,w:'Understand current performance before redesigning.'},{n:'Stakeholder interviews',c:true,w:'Align on what "better" means.'}], synthesis:[{n:'HMW framing',c:true,w:'Define redesign scope and success criteria.'}], design:[{n:'Wireframing',c:true,w:'Rapid structural changes before visual redesign.'},{n:'Prototyping',c:true,w:'Needed to test the redesigned state.'},{n:'Visual design',c:false,w:'Update only if brand or A11Y compliance requires it.'}], testing:[{n:'Heuristic evaluation',c:true,w:'Expert pass on current design for clear violations.'},{n:'Moderated usability testing',c:true,w:'Validate the redesign with at least 5 users.'}], implementation:[{n:'Design handoff & specs',c:true,w:'Clean specs for all changed components.'},{n:'Design QA',c:false,w:'At least a single pass at feature-complete.'}] } },
    medium: { title:'Redesign — medium timeline', tip:'Diagnostic before prescriptive: Invest the first week fully understanding what\'s broken and why before touching any design files.', phases:{ discovery:[{n:'User interviews',c:true,w:'Talk to current users about pain points.'},{n:'Analytics review',c:true,w:'Quantify where and how often failures happen.'},{n:'Stakeholder interviews',c:true,w:'Understand redesign goals and constraints.'}], synthesis:[{n:'Affinity mapping',c:true,w:'Synthesize findings into prioritized themes.'},{n:'Journey mapping',c:true,w:'Map the current experience to identify redesign zones.'},{n:'Research readout',c:false,w:'Brief stakeholder readout before redesign begins.'}], design:[{n:'Wireframing',c:true,w:'Redesign structure before visual changes.'},{n:'Prototyping',c:true,w:'Test the redesigned flow before visual production.'},{n:'Visual design',c:true,w:'Align to brand and accessibility requirements.'},{n:'UX writing',c:false,w:'Audit copy if messaging contributed to failures.'}], testing:[{n:'Heuristic evaluation',c:true,w:'Expert audit of existing product before redesign.'},{n:'Moderated usability testing',c:true,w:'Compare redesign to current-state baseline.'},{n:'Accessibility audit',c:true,w:'Use the redesign to achieve WCAG 2.1 AA.'}], implementation:[{n:'Design handoff & specs',c:true,w:'Full specs for all changed components.'},{n:'Design QA',c:true,w:'Redesigns are prone to build drift — QA every sprint.'},{n:'Post-launch measurement',c:false,w:'Validate improvement against baseline after launch.'}] } },
    open: { title:'Redesign — full-cycle engagement', tip:'Full-cycle redesign: A comprehensive redesign warrants its own discovery sprint. Treat it like a new product with user interviews, journey mapping, and concept testing.', phases:{ discovery:[{n:'User interviews',c:true,w:'Full qualitative discovery with current users.'},{n:'Analytics review',c:true,w:'Data-driven diagnosis of current product failures.'},{n:'Stakeholder interviews',c:true,w:'Full alignment on redesign goals and KPIs.'},{n:'Contextual inquiry',c:false,w:'If the current workflow has complex environmental factors.'}], synthesis:[{n:'Affinity mapping',c:true,w:'Full synthesis from all inputs.'},{n:'Journey mapping',c:true,w:'Document current and target-state experience.'},{n:'Research readout',c:true,w:'Stakeholder readout before direction is set.'}], design:[{n:'Information architecture',c:true,w:'Validate or restructure navigation.'},{n:'Wireframing',c:true,w:'Explore multiple structural directions.'},{n:'Prototyping',c:true,w:'Test at multiple fidelity levels.'},{n:'Visual design',c:true,w:'Full visual redesign.'},{n:'UX writing',c:true,w:'End-to-end copy audit and rewrite.'}], testing:[{n:'Concept testing',c:true,w:'Test multiple redesign directions before committing.'},{n:'Moderated usability testing',c:true,w:'Multiple rounds — baseline, mid, and final.'},{n:'Accessibility audit',c:true,w:'Full WCAG 2.1 AA audit.'}], implementation:[{n:'Design handoff & specs',c:true,w:'Full comprehensive Figma package.'},{n:'Design QA',c:true,w:'Sprint-by-sprint quality review.'},{n:'Iterative design support',c:true,w:'Embedded design through build cycle.'},{n:'Post-launch measurement',c:true,w:'Measure impact against baseline for 90 days.'}] } },
  },
  research: {
    tight: { title:'Research only — rapid insights sprint', tip:'Lean research sprint: Prioritize speed-to-insight. Run a stakeholder alignment session first, then 5–6 focused interviews. Deliver findings as a tight 10-slide readout.', phases:{ discovery:[{n:'Stakeholder interviews',c:true,w:'Align on research questions and decision stakes upfront.'},{n:'Surveys & screeners',c:true,w:'Recruit the right participants fast.'},{n:'User interviews',c:true,w:'Primary method — 5–6 focused sessions.'},{n:'Analytics review',c:false,w:'If behavioral data is readily accessible.'}], synthesis:[{n:'Affinity mapping',c:true,w:'Synthesize findings rapidly.'},{n:'HMW framing',c:true,w:'Package findings as design challenges.'},{n:'Research readout',c:true,w:'Tight findings presentation — 10 slides max.'}] } },
    medium: { title:'Research only — full discovery sprint', tip:'Discovery sprint: Mix qualitative and quantitative methods. Weeks one for recruiting, weeks two–three for research, week four for synthesis and readout.', phases:{ discovery:[{n:'Stakeholder interviews',c:true,w:'Define research scope.'},{n:'Surveys & screeners',c:true,w:'Quantitative validation alongside qualitative.'},{n:'User interviews',c:true,w:'Primary method — 8–10 sessions.'},{n:'Analytics review',c:true,w:'Triangulate with behavioral data.'},{n:'Desk research',c:false,w:'Add competitive or academic context.'}], synthesis:[{n:'Affinity mapping',c:true,w:'Full collaborative synthesis.'},{n:'HMW framing',c:true,w:'Convert insights into design challenges.'},{n:'Research readout',c:true,w:'Full stakeholder readout with recommendations.'},{n:'Journey mapping',c:false,w:'If research question maps to an end-to-end experience.'},{n:'Persona development',c:false,w:'If archetypes are needed for future design work.'}] } },
    open: { title:'Research only — strategic research programme', tip:'Multi-method programme: Combine interviews, contextual inquiry, a survey, and analytics. Deliver a comprehensive report plus journey maps and personas.', phases:{ discovery:[{n:'Stakeholder interviews',c:true,w:'Thorough alignment on scope and questions.'},{n:'User interviews',c:true,w:'Deep qualitative — 10–15 sessions.'},{n:'Contextual inquiry',c:true,w:'Observe users in natural context.'},{n:'Surveys & screeners',c:true,w:'Quantitative validation at scale.'},{n:'Analytics review',c:true,w:'Full behavioral data analysis.'},{n:'Desk research',c:true,w:'Comprehensive literature and competitive review.'}], synthesis:[{n:'Affinity mapping',c:true,w:'Full synthesis from all inputs.'},{n:'Journey mapping',c:true,w:'End-to-end map with emotional journey and opportunities.'},{n:'Persona development',c:true,w:'Research-grounded personas for team alignment.'},{n:'HMW framing',c:true,w:'Full opportunity framing.'},{n:'Research readout',c:true,w:'Comprehensive findings report and executive presentation.'},{n:'Service blueprinting',c:false,w:'If research reveals systemic gaps worth documenting.'}] } },
  },
  ds: {
    tight: { title:'Design system — targeted component work', tip:'Component-first: Focus on states, variants, and usage rules for the specific component. Run a heuristic check before building net-new.', phases:{ discovery:[{n:'Desk research',c:true,w:'Audit similar components in the current system.'}], design:[{n:'Wireframing',c:true,w:'Sketch all component states before visual production.'},{n:'Visual design',c:true,w:'Build polished, system-aligned comps.'},{n:'Design system contribution',c:true,w:'The primary deliverable — component spec and guidelines.'},{n:'UX writing',c:false,w:'Document copy guidelines or placeholder patterns.'}], testing:[{n:'Heuristic evaluation',c:true,w:'Expert review before publishing.'}], implementation:[{n:'Design handoff & specs',c:true,w:'All states, tokens, and interaction specs.'},{n:'Documentation & guidelines',c:true,w:'Usage guidelines for designers consuming the component.'}] } },
    medium: { title:'Design system — full component or pattern', tip:'Research-informed components: Even design system work benefits from a brief discovery phase to validate how the pattern fits the existing system.', phases:{ discovery:[{n:'Desk research',c:true,w:'Benchmark against comparable design systems.'},{n:'Stakeholder interviews',c:false,w:'Align with engineering on component requirements.'}], design:[{n:'Wireframing',c:true,w:'Explore structural approaches before visual production.'},{n:'Visual design',c:true,w:'Full visual build with all states and variants.'},{n:'Design system contribution',c:true,w:'Complete pattern documentation and library contribution.'},{n:'UX writing',c:true,w:'Copy guidelines and placeholder content standards.'}], testing:[{n:'Heuristic evaluation',c:true,w:'Expert review before publishing.'},{n:'Accessibility audit',c:true,w:'All new components must meet WCAG 2.1 AA.'}], implementation:[{n:'Design handoff & specs',c:true,w:'Engineering-ready spec with tokens and behavior.'},{n:'Documentation & guidelines',c:true,w:'Usage guidelines, do/don\'ts, and code examples.'}] } },
    open: { title:'Design system — system-wide initiative', tip:'Systemic design investment: A system-wide initiative requires discovery with the designers and engineers who consume the system — they are your users.', phases:{ discovery:[{n:'User interviews',c:true,w:'Interview designers and engineers who use the system.'},{n:'Stakeholder interviews',c:true,w:'Align on governance and contribution model.'}], synthesis:[{n:'Affinity mapping',c:true,w:'Synthesize internal user pain points.'},{n:'Research readout',c:true,w:'Present findings to governance before work begins.'}], design:[{n:'Visual design',c:true,w:'Full visual production for all new/updated components.'},{n:'Design system contribution',c:true,w:'Comprehensive, documented system update.'},{n:'UX writing',c:true,w:'System-wide copy and component guidelines.'}], testing:[{n:'Accessibility audit',c:true,w:'Full WCAG 2.1 AA audit before release.'},{n:'Heuristic evaluation',c:true,w:'Expert evaluation of the system\'s internal UX.'}], implementation:[{n:'Documentation & guidelines',c:true,w:'Comprehensive usage and contribution documentation.'},{n:'Design handoff & specs',c:true,w:'Engineering-ready specs with token references.'},{n:'Design workshops',c:true,w:'Adoption workshops for teams onboarding to the system.'}] } },
  },
  strategy: {
    tight: { title:'Strategy & roadmap input — rapid alignment', tip:'Alignment sprint: Best served by a stakeholder alignment session, synthesis of available research, and a framed set of opportunity areas as a tight presentation.', phases:{ discovery:[{n:'Stakeholder interviews',c:true,w:'Understand the strategic questions and decision context.'},{n:'Desk research',c:true,w:'Pull in existing research and competitive context quickly.'},{n:'Analytics review',c:false,w:'If behavioral data is relevant to the strategic question.'}], synthesis:[{n:'HMW framing',c:true,w:'Frame opportunity areas to anchor the roadmap conversation.'},{n:'Research readout',c:true,w:'Tight insights presentation to inform planning.'},{n:'Affinity mapping',c:false,w:'Only if enough inputs warrant it.'}] } },
    medium: { title:'Strategy & roadmap input — discovery-to-strategy', tip:'Discovery-to-strategy: Run a focused discovery sprint, synthesize into opportunity areas, and deliver a research-backed strategic brief with journey maps and personas.', phases:{ discovery:[{n:'User interviews',c:true,w:'Ground the strategy in actual user needs.'},{n:'Stakeholder interviews',c:true,w:'Surface competing priorities and org constraints.'},{n:'Analytics review',c:true,w:'Quantify opportunity size for prioritization.'},{n:'Desk research',c:false,w:'Competitive landscape and benchmarks.'}], synthesis:[{n:'Affinity mapping',c:true,w:'Cluster insights into strategic themes.'},{n:'Journey mapping',c:true,w:'Map current and target-state to identify roadmap zones.'},{n:'HMW framing',c:true,w:'Frame each opportunity as a design challenge.'},{n:'Research readout',c:true,w:'Strategic findings for planning stakeholders.'},{n:'Persona development',c:false,w:'Anchor roadmap prioritization decisions.'}], design:[{n:'Design workshops',c:false,w:'Facilitate a strategic design sprint if ideation is in scope.'}] } },
    open: { title:'Strategy & roadmap input — full strategic research', tip:'Strategic research programme: A full-cycle strategy engagement combines user research, competitive analysis, service blueprinting, and stakeholder alignment into a comprehensive strategic brief.', phases:{ discovery:[{n:'User interviews',c:true,w:'Deep qualitative discovery across multiple segments.'},{n:'Stakeholder interviews',c:true,w:'Full org alignment on vision and success criteria.'},{n:'Analytics review',c:true,w:'Behavioral data to quantify and prioritize opportunity.'},{n:'Desk research',c:true,w:'Full competitive, market, and landscape review.'},{n:'Surveys & screeners',c:false,w:'Quantitative validation of strategic hypotheses.'},{n:'Contextual inquiry',c:false,w:'If environmental factors are central to the question.'}], synthesis:[{n:'Affinity mapping',c:true,w:'Full synthesis from all inputs.'},{n:'Journey mapping',c:true,w:'Current and target-state experience maps.'},{n:'Persona development',c:true,w:'Durable archetypes for strategic alignment.'},{n:'Service blueprinting',c:true,w:'Map the full service system for strategic opportunities.'},{n:'HMW framing',c:true,w:'Frame strategic opportunity areas.'},{n:'Research readout',c:true,w:'Comprehensive strategic brief for executive stakeholders.'}], design:[{n:'Design workshops',c:true,w:'Facilitate cross-functional ideation and prioritization.'}] } },
  },
};

function ProductServices() {
  const [activePhase, setActivePhase] = useState('discovery');
  const [view, setView] = useState('overview'); // 'overview' | 'guide'
  const [gType, setGType] = useState('');
  const [gTime, setGTime] = useState('');
  const [gResearch, setGResearch] = useState('');

  const guideData = gType && gTime && gResearch && PS_GUIDE[gType] && PS_GUIDE[gType][gTime];

  const phaseServices = PS_SERVICES.filter(s => s.phase === activePhase);

  const F = { border:`1px solid ${G3}`, borderRadius:6, padding:'8px 12px', fontSize:13, color:TX, background:WH, outline:'none', minWidth:175, cursor:'pointer' };

  return (
    <div>
      {/* Sub-nav: overview vs guide */}
      <div style={{ display:'flex', gap:4, marginBottom:20 }}>
        {[{k:'overview',l:'Services overview'},{k:'guide',l:'Decision guide'}].map(({k,l}) => (
          <button key={k} onClick={() => setView(k)} style={{
            padding:'7px 16px', borderRadius:20, fontSize:12.5, fontWeight:500,
            border:`1px solid ${view===k ? V : G3}`,
            background: view===k ? V : WH, color: view===k ? WH : TL2,
            cursor:'pointer', transition:'all 0.15s',
          }}>{l}</button>
        ))}
      </div>

      {view === 'overview' && (
        <div>
          <p style={{ margin:'0 0 6px', fontSize:11, fontWeight:500, letterSpacing:'0.1em', textTransform:'uppercase', color:V }}>What we offer</p>
          <h3 style={{ margin:'0 0 4px', fontSize:18, fontWeight:700, color:TX }}>Product services overview</h3>
          <p style={{ margin:'0 0 20px', fontSize:13, color:TM, maxWidth:680, lineHeight:1.7 }}>
            Our practice spans five phases of the product design process.
            Select a phase below to explore each service, what it delivers, and how it connects to real Aetna Medicaid project contexts.
          </p>

          {/* Phase tabs */}
          <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:20 }}>
            {PS_PHASES.map((p,i) => (
              <button key={p} onClick={() => setActivePhase(p)} style={{
                padding:'7px 16px', borderRadius:20, fontSize:12.5, fontWeight:500,
                border:`1px solid ${activePhase===p ? V : G3}`,
                background: activePhase===p ? V : WH, color: activePhase===p ? WH : TL2,
                cursor:'pointer', transition:'all 0.15s',
              }}>
                <i className={`ti ${PS_PHASE_ICONS[p]}`} style={{ marginRight:4 }} aria-hidden="true" />
                {i+1} · {PS_PHASE_LABELS[p]}
              </button>
            ))}
          </div>

          {/* Phase header */}
          <div style={{ display:'flex', alignItems:'flex-start', gap:16, padding:'16px 20px', background:VL, borderLeft:`3px solid ${V}`, borderRadius:'0 8px 8px 0', marginBottom:16 }}>
            <div style={{ width:38, height:38, borderRadius:'50%', background:V, color:WH, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>
              <i className={`ti ${PS_PHASE_ICONS[activePhase]}`} aria-hidden="true" />
            </div>
            <div>
              <p style={{ margin:'0 0 4px', fontSize:16, fontWeight:600, color:TX }}>{PS_PHASE_NAMES[activePhase]}</p>
              <p style={{ margin:0, fontSize:13, color:TM, lineHeight:1.6 }}>{PS_PHASE_DESCS[activePhase]}</p>
            </div>
          </div>

          {/* Service cards grid */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:14 }}>
            {phaseServices.map(svc => (
              <div key={svc.id} style={{ background:WH, border:`1px solid ${G3}`, borderRadius:10, padding:'14px 16px', transition:'border-color 0.15s' }}>
                <p style={{ margin:'0 0 6px', fontSize:13.5, fontWeight:600, color:TX, display:'flex', alignItems:'center', gap:8 }}>
                  <i className={`ti ${svc.icon}`} style={{ color:V, fontSize:14 }} aria-hidden="true" /> {svc.name}
                </p>
                <p style={{ margin:'0 0 10px', fontSize:12.5, color:TM, lineHeight:1.6 }}>{svc.def}</p>
                <p style={{ margin:'0 0 4px', fontSize:10, fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase', color:TL2 }}>Deliverables</p>
                <div style={{ display:'flex', flexWrap:'wrap', gap:4, marginBottom:8 }}>
                  {psGetDeliverables(svc.id).map(d => (
                    <span key={d} style={{ fontSize:11, padding:'2px 9px', borderRadius:10, background:VL, color:VD, border:`1px solid ${V}40` }}>{d}</span>
                  ))}
                </div>
                <p style={{ margin:'0 0 4px', fontSize:10, fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase', color:TL2 }}>Effort</p>
                <div style={{ display:'flex', gap:4, marginBottom:8 }}>
                  <span style={{ fontSize:11, padding:'2px 9px', borderRadius:10, background:G2, color:TL2, border:`1px solid ${G3}` }}>{PS_EFFORT_LBL[svc.effort]}</span>
                </div>
                <div style={{ background:G1, borderLeft:`2px solid ${V}60`, borderRadius:'0 6px 6px 0', padding:'8px 10px' }}>
                  <p style={{ margin:0, fontSize:12, color:TM, lineHeight:1.55 }}><span style={{ fontWeight:500, color:TX }}>Aetna Medicaid example:</span> {svc.example}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === 'guide' && (
        <div>
          <p style={{ margin:'0 0 6px', fontSize:11, fontWeight:500, letterSpacing:'0.1em', textTransform:'uppercase', color:V }}>Choose your methods</p>
          <h3 style={{ margin:'0 0 4px', fontSize:18, fontWeight:700, color:TX }}>Service decision guide</h3>
          <p style={{ margin:'0 0 20px', fontSize:13, color:TM, maxWidth:680, lineHeight:1.7 }}>
            Select your project scenario to see which product services are recommended — and why.
            Core services are essential to the engagement; optional services strengthen outcomes where capacity allows.
          </p>

          {/* Filters */}
          <div style={{ display:'flex', flexWrap:'wrap', gap:14, marginBottom:24 }}>
            <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
              <label style={{ fontSize:11, fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase', color:TM }}>Project type</label>
              <select style={F} value={gType} onChange={e => setGType(e.target.value)}>
                <option value="">— Select type —</option>
                <option value="new">New feature / product</option>
                <option value="redesign">Redesign / optimization</option>
                <option value="research">Research only</option>
                <option value="ds">Design system / component</option>
                <option value="strategy">Strategy & roadmap input</option>
              </select>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
              <label style={{ fontSize:11, fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase', color:TM }}>Timeline pressure</label>
              <select style={F} value={gTime} onChange={e => setGTime(e.target.value)}>
                <option value="">— Select —</option>
                <option value="tight">Tight (under 4 weeks)</option>
                <option value="medium">Medium (4–10 weeks)</option>
                <option value="open">Open (10+ weeks)</option>
              </select>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
              <label style={{ fontSize:11, fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase', color:TM }}>Prior research?</label>
              <select style={F} value={gResearch} onChange={e => setGResearch(e.target.value)}>
                <option value="">— Select —</option>
                <option value="none">No prior research</option>
                <option value="some">Some existing research</option>
                <option value="full">Full research available</option>
              </select>
            </div>
          </div>

          {!guideData && (
            <div style={{ textAlign:'center', padding:'3rem', color:TL2, fontSize:14, background:G1, borderRadius:10, border:`1px dashed ${G4}` }}>
              Select your project type, timeline, and research status above to see service recommendations.
            </div>
          )}

          {guideData && (
            <div>
              <div style={{ background:VL, borderLeft:`3px solid ${V}`, borderRadius:'0 8px 8px 0', padding:'12px 16px', marginBottom:20 }}>
                <p style={{ margin:'0 0 4px', fontSize:15, fontWeight:600, color:TX }}>{guideData.title}</p>
                <p style={{ margin:0, fontSize:13, color:TM, lineHeight:1.65 }}>{guideData.tip}</p>
              </div>
              <div style={{ display:'flex', gap:16, flexWrap:'wrap', marginBottom:14 }}>
                <span style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:TL2 }}><span style={{ width:10, height:10, borderRadius:3, background:V, flexShrink:0 }} /> Core — essential for this scenario</span>
                <span style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:TL2 }}><span style={{ width:10, height:10, borderRadius:3, background:G2, border:`1px solid ${G4}`, flexShrink:0 }} /> Optional — strengthens if capacity allows</span>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                {PS_PHASES.filter(p => guideData.phases[p] && guideData.phases[p].length).map(phase => {
                  let svcs = guideData.phases[phase];
                  if (phase === 'discovery' && gResearch !== 'none') {
                    svcs = svcs.map(s => ({ ...s, c: false, w: s.w + (gResearch === 'full' ? ' (existing research may cover this)' : ' (check if existing research covers this)') }));
                  }
                  return (
                    <div key={phase}>
                      <p style={{ margin:'0 0 8px', fontSize:11, fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase', color:V, display:'flex', alignItems:'center', gap:6 }}>
                        <i className={`ti ${PS_PHASE_ICONS[phase]}`} aria-hidden="true" /> {PS_PHASE_LABELS[phase]}
                      </p>
                      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))', gap:8 }}>
                        {svcs.map((s, i) => (
                          <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:10, padding:'10px 12px', borderRadius:8, border:`1px solid ${s.c ? V : G3}`, background: s.c ? VL : WH }}>
                            <i className={`ti ${s.c ? 'ti-circle-check-filled' : 'ti-circle'}`} style={{ color:V, fontSize:14, marginTop:1, flexShrink:0 }} aria-hidden="true" />
                            <div>
                              <p style={{ margin:0, fontSize:12.5, fontWeight:600, color:TX, lineHeight:1.3 }}>
                                {s.n}
                                <span style={{ display:'inline-block', fontSize:10, padding:'1px 7px', borderRadius:10, marginLeft:4, verticalAlign:'middle', ...(s.c ? { background:V, color:WH } : { background:G2, color:TL2, border:`1px solid ${G3}` }) }}>{s.c ? 'core' : 'optional'}</span>
                              </p>
                              <p style={{ margin:'3px 0 0', fontSize:11.5, color:TM, lineHeight:1.45 }}>{s.w}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
