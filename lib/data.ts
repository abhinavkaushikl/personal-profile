const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const asset = (path: string) => `${BASE}${path}`;

export const profile = {
  name: 'Abhinav Kaushik',
  role: 'Senior Applied Scientist',
  location: 'Bengaluru, India',
  coords: '12.97°N · 77.59°E',
  email: 'aabhinav.kaushik@gmail.com',
  github: 'https://github.com/abhinavkaushikl',
  linkedin: 'https://www.linkedin.com/in/abhinav-kaushik10/',
  resume: asset('/Abhinav_Kaushik_Resume.pdf'),
  photo: asset('/abhinav.jpg'),
};

export const companies = [
  { name: 'UnitedHealth Group', years: '2025 — now', logo: asset('/logos/unitedhealth-group.svg'), h: 20 },
  { name: 'VIAVI Solutions', years: '2021 — 2025', logo: asset('/logos/viavi.svg'), h: 25 },
  { name: 'Optum', years: '2021', logo: asset('/logos/optum.svg'), h: 34 },
  { name: 'Nippon Life', years: '2019 — 2021', logo: asset('/logos/nippon-life.png'), h: 46 },
  { name: 'Colt', years: '2017 — 2019', logo: asset('/logos/colt.png'), h: 38 },
];

export type Highlight = { metric: string; text: string };
export type Mission = {
  code: string;
  role: string;
  company: string;
  location: string;
  period: string;
  active?: boolean;
  logo: string;
  logoH: number;
  summary: string;
  highlights: Highlight[];
  stack: string[];
};

export const missions: Mission[] = [
  {
    code: '06',
    role: 'Senior Applied Scientist',
    company: 'UnitedHealth Group',
    logo: asset('/logos/unitedhealth-group.svg'),
    logoH: 30,
    location: 'Bengaluru',
    period: 'Nov 2025 — Present',
    active: true,
    summary:
      'Leading engineers on production agentic systems for healthcare — frontier-model extraction, multi-agent analytics, and the evals that keep them honest.',
    highlights: [
      { metric: '−98%', text: 'manual analysis — production multi-agent analytics chatbot with Pydantic-validated tools, PySpark and multi-turn reasoning' },
      { metric: '1,800', text: 'documents through a lab-extraction agent on Claude Opus 4.7 + Textract on ECS, leading a team of 3' },
      { metric: '−60%', text: 'token cost by benchmarking model choice per step and routing extraction to smaller models' },
      { metric: '−43%', text: 'human review via standardized LLM-judge evals, tracing and failure detection' },
    ],
    stack: ['Claude', 'AWS Bedrock', 'Textract', 'ECS', 'PySpark', 'Pydantic', 'Databricks', 'pgvector'],
  },
  {
    code: '05',
    role: 'Senior Machine Learning Engineer',
    company: 'Viavi Solutions',
    logo: asset('/logos/viavi.svg'),
    logoH: 36,
    location: 'Chennai',
    period: 'Sep 2024 — Nov 2025',
    summary:
      'Led a team of four building AIOps intelligence for global telecom operators — from alarm floods to root cause, in real time.',
    highlights: [
      { metric: '+83%', text: 'semantic alarm classification — event-correlation engine with Sentence-BERT + DBSCAN' },
      { metric: '−67%', text: 'downtime — SLA-breach prediction with LightGBM, FastAPI, MLflow and LLM root-cause analysis' },
      { metric: '90%', text: 'match rate on a RAG Project Discovery Assistant with PII redaction for sales & presales' },
      { metric: '7 / 15', text: 'research prototypes promoted to production or paid work across NAM, EMEA and LATAM' },
      { metric: '3-stage', text: 'Grounded Support Agent — PydanticAI tool calling, RAG re-ranked by a PyTorch cross-encoder, and a grounding check that blocks hallucinated answers; judged by LLMs, tracked in MLflow' },
    ],
    stack: ['Sentence-BERT', 'DBSCAN', 'LightGBM', 'PydanticAI', 'PyTorch', 'FastAPI', 'MLflow', 'Docker'],
  },
  {
    code: '04',
    role: 'Data Scientist',
    company: 'Viavi Solutions',
    logo: asset('/logos/viavi.svg'),
    logoH: 36,
    location: 'Bengaluru',
    period: 'Nov 2021 — Sep 2024',
    summary: 'Forecasting and anomaly detection for telecom networks — so planners see problems before customers do.',
    highlights: [
      { metric: '500+', text: 'telecom network devices monitored by anomaly detection and demand forecasting' },
      { metric: '80+', text: 'device SKUs in inventory demand forecasting, targeting a 10% cut in excess and at-risk stock' },
      { metric: '15+', text: 'KPIs per device modelled with Isolation Forest and Holt-Winters, validated against historical baselines' },
      { metric: '3', text: 'network metrics — call quality, SMS delivery and efficiency — forecast in production with LSTM + XGBoost' },
    ],
    stack: ['Isolation Forest', 'Holt-Winters', 'LSTM', 'XGBoost', 'SQL', 'Python'],
  },
  {
    code: '03',
    role: 'Data Analyst',
    company: 'Optum',
    logo: asset('/logos/optum.svg'),
    logoH: 48,
    location: 'Gurugram',
    period: 'Jun 2021 — Nov 2021',
    summary: 'Customer-centric analytics for the Renew Rewards programme — turning member data into marketing wins.',
    highlights: [
      { metric: '83%', text: 'of targeted premium clients converted month over month, powered by a Renew Rewards analytics engine, NLP on member feedback and a marketing dashboard' },
      { metric: 'Python', text: 'automation of Renew Rewards data processing and reporting on Databricks, handling highly volatile member data' },
    ],
    stack: ['Python', 'NLP', 'Databricks', 'Dashboards'],
  },
  {
    code: '02',
    role: 'Data Engineer',
    company: 'Nippon Data Systems',
    logo: asset('/logos/nippon-life.png'),
    logoH: 64,
    location: 'Gurugram',
    period: 'Nov 2019 — May 2021',
    summary: 'Automated the reporting nobody wanted to do by hand, on large healthcare datasets.',
    highlights: [
      { metric: '−95%', text: 'manual effort — SQL, PySpark and Airflow pipelines for medical-audit reporting' },
      { metric: '+80%', text: 'traceability — real-time log observability for the COVID QRT team' },
    ],
    stack: ['PySpark', 'Airflow', 'SQL', 'Elasticsearch', 'Kibana'],
  },
  {
    code: '01',
    role: 'Associate Consultant',
    company: 'Saksoft',
    logo: asset('/logos/colt.png'),
    logoH: 44,
    location: 'Gurugram',
    period: 'Dec 2017 — Nov 2019',
    summary: 'Where it started: financial data, dashboards, and a first production model.',
    highlights: [
      { metric: '+40%', text: 'dashboard engagement with QlikSense, SQL and SAP HANA' },
      { metric: '7-day', text: 'XGBoost propensity model predicting personal-loan applications' },
    ],
    stack: ['QlikSense', 'SAP HANA', 'SQL', 'XGBoost'],
  },
];

export type Project = {
  name: string;
  kind: string;
  status: string;
  desc: string;
  metric?: { v: string; l: string };
  tags: string[];
  feature?: boolean;
};

export const projects: Project[] = [
  {
    name: 'ThinkTree.AI',
    kind: 'Non-profit · EdTech',
    status: 'In flight',
    feature: true,
    desc: 'An AI-powered ML study platform for learners with ADHD and context-switching challenges. NGO teachers use it to help students organise learning and keep their study context between sessions.',
    tags: ['AI tutoring', 'ADHD-first UX', 'Non-profit'],
  },
  {
    name: 'Post-Deployment Security Agent',
    kind: 'Agentic security',
    status: 'Validated',
    desc: 'Drives a real browser through live e-commerce sites against a rule pack; an LLM interprets the evidence and classifies threats into reproducible reports.',
    metric: { v: '144', l: 'controls · 20+ storefronts' },
    tags: ['Playwright', 'LLM agents', 'Security'],
  },
  {
    name: 'Auto Evals Bot',
    kind: 'LLM evaluation',
    status: 'Live',
    desc: 'Writes Pydantic-typed eval cases on demand — turning sample inputs and expected behaviour into regression suites with traced runs.',
    tags: ['Pydantic', 'LLM evals', 'Tracing'],
  },
  {
    name: 'RFP Multi-Agent Platform',
    kind: 'Multi-agent systems',
    status: 'Live',
    desc: 'An LLM supervisor orchestrates intent detection, retrieval, proposal generation and document matching — RAG over past proposals, with RBAC.',
    tags: ['Multi-agent', 'RAG', 'RBAC'],
  },
];

export const skillGroups = [
  { name: 'AI / GenAI', items: ['Generative AI', 'LLMs', 'RAG', 'Agentic RAG', 'Agentic AI', 'LangGraph', 'LangChain', 'Claude', 'OpenAI', 'Embeddings', 'Cross-Encoders', 'Fine-Tuning', 'Hugging Face', 'NLP', 'Tool Orchestration', 'Amazon Textract'] },
  { name: 'Machine Learning', items: ['PyTorch', 'Scikit-learn', 'XGBoost', 'LightGBM', 'Random Forest', 'Isolation Forest', 'LSTM', 'SBERT', 'DBSCAN', 'Time-Series Forecasting', 'Anomaly Detection', 'Statistical Modeling', 'Deep Learning', 'A/B Testing'] },
  { name: 'Evals & Observability', items: ['LLM Evals', 'LLM-as-Judge', 'Agent Tracing', 'Observability', 'Elasticsearch', 'Kibana', 'Log Analysis'] },
  { name: 'Programming & Data', items: ['Python', 'SQL', 'PySpark', 'Pandas', 'NumPy', 'FastAPI', 'Flask', 'Hive', 'Spark SQL', 'REST APIs', 'Pydantic', 'Unix'] },
  { name: 'MLOps & Cloud', items: ['MLflow', 'Docker', 'Kubernetes', 'Airflow', 'DVC', 'Terraform', 'Jenkins', 'Bitbucket', 'CI/CD', 'AWS Bedrock', 'GCP', 'Azure', 'Vercel'] },
  { name: 'Data Platforms', items: ['Databricks', 'Databricks SQL', 'Databricks Vector Search', 'BigQuery', 'Apache Spark', 'Supabase'] },
  { name: 'Databases', items: ['TimescaleDB', 'MySQL', 'Vector DBs', 'pgvector', 'ArangoDB', 'Cosmos DB'] },
  { name: 'Search & IR', items: ['Apache Solr', 'Lucene Indexing', 'Information Retrieval', 'BM25', 'Hybrid Search'] },
  { name: 'BI', items: ['Power BI', 'QlikSense', 'SAP HANA'] },
];

export const skillLinks: [number, number][] = [
  [0, 1], [0, 2], [0, 7], [0, 4], [1, 3], [1, 5], [2, 4], [3, 6], [4, 5], [5, 6], [6, 7], [8, 3],
];

export const education = [
  { degree: 'M.Sc. Machine Learning & AI', school: 'Liverpool John Moores University', period: '2021 — 2023', logo: asset('/logos/ljmu.png'), logoH: 56 },
  { degree: 'B.Tech. Information Technology', school: 'Jamia Hamdard', period: '2013 — 2017', logo: asset('/logos/jamia.png'), logoH: 76 },
];

export const internships = ['Network Intern · Airport Authority of India', 'Hadoop Intern · Ducat Technologies'];

export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
