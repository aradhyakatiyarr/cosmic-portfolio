export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  technologies: string[];
  bullets: string[];
  github?: string;
  live?: string;
  coordinates: [number, number, number];
}

export interface SkillGroup {
  category: string;
  skills: { name: string; level: number }[];
}

export interface TimelineEvent {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  description: string[];
  type: 'experience' | 'education';
}

export interface Hobbies {
  title: string;
  description: string;
  youtube: string;
  instagram: string;
  personalInsta: string;
}

export const resumeData = {
  name: "Aradhya Katiyar",
  title: "AI/ML Engineer",
  subtitle: "Product-Oriented AI Architect",
  location: "Kanpur / Delhi-NCR (Open to Relocation)",
  email: "aradhya.katiyarr@gmail.com",
  phone: "+91 83187 23585",
  linkedin: "https://www.linkedin.com/in/aradhya-katiyar-9648313b2?utm_source=share_via&utm_content=profile&utm_medium=member_android",
  githubProfile: "https://github.com/aradhyakatiyarr",
  
  summary: "AI/ML Engineer combining deep technical execution with a Product Manager mindset. Takes self-conceived AI products from initial problem definition to end-to-end deployed solutions. Deployed five custom products live, scaling LLM agents, vector retrieval, and predictive analytics models using Python and Next.js.",
  
  skills: [
    {
      category: "Languages",
      skills: [
        { name: "Python", level: 9 },
        { name: "SQL", level: 8 }
      ]
    },
    {
      category: "AI / ML",
      skills: [
        { name: "LLMs", level: 9 },
        { name: "Prompt Engineering", level: 9 },
        { name: "RAG Systems", level: 9 },
        { name: "LangChain", level: 8 },
        { name: "LangGraph", level: 8 },
        { name: "Fallback Design", level: 8 },
        { name: "Predictive Modeling", level: 8 },
        { name: "EDA", level: 8 }
      ]
    },
    {
      category: "AI APIs & Tooling",
      skills: [
        { name: "Claude API", level: 9 },
        { name: "Groq API", level: 9 },
        { name: "OpenRouter", level: 8 },
        { name: "FAISS", level: 8 },
        { name: "REST APIs", level: 9 }
      ]
    },
    {
      category: "Data Science",
      skills: [
        { name: "Scikit-Learn", level: 8 },
        { name: "NumPy", level: 8 },
        { name: "Pandas", level: 8 },
        { name: "Matplotlib", level: 7 }
      ]
    },
    {
      category: "Web & Tools",
      skills: [
        { name: "Next.js 14", level: 9 },
        { name: "React", level: 9 },
        { name: "Tailwind CSS", level: 9 },
        { name: "Node.js", level: 8 },
        { name: "Zod", level: 8 },
        { name: "Git & GitHub", level: 8 },
        { name: "Vercel", level: 9 },
        { name: "Figma", level: 7 }
      ]
    },
    {
      category: "Fundamentals",
      skills: [
        { name: "DSA", level: 8 },
        { name: "DBMS", level: 8 },
        { name: "OS", level: 7 },
        { name: "Software Eng", level: 8 },
        { name: "OOP", level: 8 }
      ]
    }
  ] as SkillGroup[],

  projects: [
    {
      id: "hookly",
      title: "Hookly Studio",
      subtitle: "Problem: Social media scriptwriter burnout | Solution: Structured script & hook generator",
      description: "Designed and built Hook & Script Studio, a workflow platform for content creators, coaches, and founders to convert raw ideas into high-converting short-form scripts (Reels, TikToks, Shorts). Deploys structured hook templates and dynamic calls to action.",
      technologies: ["Next.js 14", "Tailwind CSS", "Zod", "Claude API", "Vercel"],
      bullets: [
        "Owned the product vision and full-stack implementation from concept to Vercel deployment.",
        "Built dynamic script template engines generating high-converting hook types and body variants.",
        "Developed clean creator interface facilitating rapid edits and personal brand voice calibration."
      ],
      github: "https://github.com/aradhyakatiyarr/hookly-studio",
      live: "https://hookly-studio.vercel.app/",
      coordinates: [-3.0, 3.0, -5.0]
    },
    {
      id: "job-fit",
      title: "Job-Fit Signal Scanner",
      subtitle: "Problem: Inefficient manual resume screening | Solution: Weighted AI scorer & resume customizer",
      description: "Identified the gap in manual job-fit alignment. Designed and built an end-to-end platform that scores resume-to-posting fit and generates a tailored, fact-grounded resume. Built multi-format extraction (PDF, DOCX, screenshots) and returned structured, auditable JSON.",
      technologies: ["Next.js 14", "OpenRouter", "mammoth", "pdf-parse", "docx", "jsPDF", "Vercel"],
      bullets: [
        "Owned product vision from identifying screening inefficiencies to end-to-end deployment.",
        "Built multi-format parser extracting text from PDF, DOCX, and screenshots.",
        "Developed a 4-category weighted scoring rubric returning auditable JSON."
      ],
      github: "https://github.com/aradhyakatiyarr/job-fit-signal-scanner",
      live: "https://job-fit-signal-scanner.vercel.app/",
      coordinates: [-2.5, 0.8, 1.2]
    },
    {
      id: "ticket-triage",
      title: "AI Support Ticket Triage Agent",
      subtitle: "Problem: Slow customer service response | Solution: Structured LLM classifier with fallback",
      description: "Designed a real-time ticketing solution to streamline support routing. Classifies support tickets by priority and category in real time via a live console UI, featuring a Kanban priority board and evaluation dashboard.",
      technologies: ["Next.js 14", "Zod", "Groq API", "Qwen 3.6-27B", "GPT-OSS-120B"],
      bullets: [
        "Conceived and executed the triage workflow to minimize ticketing bottlenecks.",
        "Designed structured Zod schemas ensuring reliable database writes.",
        "Implemented multi-model fallback (Qwen to GPT) ensuring 99.9% uptime."
      ],
      github: "https://github.com/aradhyakatiyarr/Support-Ticket-Triage-Agent",
      live: "https://support-ticket-triage-agent-69aerbwgl-aradhyakatiyarrs-projects.vercel.app/",
      coordinates: [0, 2.5, -1]
    },
    {
      id: "roadguard",
      title: "RoadGuard AI",
      subtitle: "Problem: Unpredictable traffic hazard zones | Solution: Machine Learning predictive risk index",
      description: "Recognized public safety hazards and directed a 4-member team to construct a risk prediction platform. Processes historical accident data to flag high-risk traffic zones, owning architecture and feature selection.",
      technologies: ["Python", "Scikit-Learn", "Pandas", "NumPy", "Vercel"],
      bullets: [
        "Led project from conceptual hazard indexing to a deployed ML platform.",
        "Owned clean architecture, data scrubbing pipelines, and feature selection.",
        "Constructed predictive risk models to support municipal routing safety."
      ],
      github: "https://github.com/aradhyakatiyarr/roadguard-ai",
      live: "https://roadguard-1wrxl4ew5-aradhyakatiyarrs-projects.vercel.app/",
      coordinates: [2.5, -0.8, 1.2]
    },
    {
      id: "smartchat",
      title: "SmartChat AI",
      subtitle: "Problem: Loss of multi-turn user context | Solution: Persistent session memory chatbot",
      description: "Solved the chatbot statelessness issue by designing a persistent memory system. Built a full-stack streaming chat UI deployed on Vercel utilizing the Claude API and Anthropic SDK.",
      technologies: ["Python", "Claude API", "Anthropic SDK", "Vercel"],
      bullets: [
        "Defined product specs for context preservation in multi-turn pings.",
        "Deployed a streaming chat layout on Vercel with clean responsive styling.",
        "Created efficient context serialization to retain memory across chat sessions."
      ],
      github: "https://github.com/aradhyakatiyarr/smartchat-ai",
      live: "https://smartchat-lw4qjqqdo-aradhyakatiyarrs-projects.vercel.app/",
      coordinates: [-1.8, -1.8, -1.8]
    },
    {
      id: "documind",
      title: "DocuMind",
      subtitle: "Problem: Hard-to-search corporate documents | Solution: FAISS-driven semantic RAG system",
      description: "Conceived a document Q&A workflow to solve unstructured search. Deployed a RAG pipeline utilizing document chunking, vector embedding, and semantic retrieval via FAISS with the Claude API.",
      technologies: ["Python", "Claude API", "FAISS", "Vercel"],
      bullets: [
        "Designed the RAG architecture from ingestion to response synthesis.",
        "Implemented document chunking and semantic indexing via FAISS.",
        "Integrated the Claude API to formulate contextual answers from document vector queries."
      ],
      github: "https://github.com/aradhyakatiyarr/documind-ai",
      live: "https://documind-u9dhz0glh-aradhyakatiyarrs-projects.vercel.app/",
      coordinates: [1.8, 1.8, 1.8]
    }
  ] as Project[],

  experience: [
    {
      id: "internship-1",
      title: "SDE Intern, AI/ML",
      subtitle: "Prashasvi Autotech Solutions (CAR C.I.D.)",
      date: "Jul 2025 - Aug 2025",
      description: [
        "Analyzed customer support pain points and built automation workflows to streamline ticketing.",
        "Engineered an AI used-car valuation system analyzing 100,000+ data points for market-backed pricing.",
        "Awarded the Outstanding Completion Certificate for product ownership and execution."
      ],
      type: "experience"
    }
  ] as TimelineEvent[],

  education: [
    {
      id: "education-1",
      title: "B.Tech in Computer Science & Engineering",
      subtitle: "Focus on AI/ML Applications & Product Architecture",
      date: "2022 - 2026",
      description: [
        "Acquired deep foundations in DSA, DBMS, Operating Systems, and OOP.",
        "Conceived and led RoadGuard AI road accident hazard prediction project."
      ],
      type: "education"
    },
    {
      id: "education-2",
      title: "Secondary & Senior Secondary (CBSE)",
      subtitle: "Escorts World School",
      date: "Graduated 2021",
      description: [
        "XII (CBSE): 79.6% | X (CBSE): 86.2%"
      ],
      type: "education"
    }
  ] as TimelineEvent[],

  hobbies: {
    title: "Traveling & Vlogging",
    description: "Outside of engineering AI systems, I explore the globe, capturing the chaos and beauty of different cultures. I share travel logs, adventures, and insights across my content channels.",
    youtube: "https://youtube.com/@gowithchaos?si=UlMW16BrfO8XBrTm",
    instagram: "https://www.instagram.com/gowithchaos?igsh=ZDUwZDlpb2R2aWZy",
    personalInsta: "https://www.instagram.com/aradhyaakatiyar?igsh=amo0enZqd2RraXhx"
  } as Hobbies
};
