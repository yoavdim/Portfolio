/* ============================================================
   EDIT THIS FILE TO MANAGE YOUR PORTFOLIO
   ------------------------------------------------------------
   1. PROFILE holds your links.
   2. FEATURED = big cards (mockup + features + lessons).
   3. GRID = smaller project cards.
   To add a screenshot: put an image path in "image", e.g.
      image: "assets/stock-analyzer.png"
   Leave image as "" to show a placeholder.
   For a project with no public repo, set gh: "" and add a
   badge, e.g. badge: "Coming soon".
   ============================================================ */

const PROFILE = {
  github: "https://github.com/yoavdim",
  linkedin: "https://www.linkedin.com/in/yoav-dim/",
};

const FEATURED = [
  {
    title: "Stock Analyzer",
    gh: "https://github.com/yoavdim/stocks_analyzer",
    tech: "python / numpy / finance / scaiene / multiprocessing / curve fitting",
    image: "", // e.g. "assets/stock-analyzer.png"
    blurb: "A quantitative stock analysis and portfolio optimization tool.",
    features: [
      "Screen thousands of stocks by financial ratios",
      "Build individual DCF models",
      "See cross correlation & optimize entire portfolios",
    ],
    lessons: [
      "Portfolio theory",
      "Performance profiling (Scaiene)",
      "Exception handling in Process Pool",
    ],
  },
  {
    title: "Optimizing VABA-based SMR",
    gh: "", // private for now
    badge: "Coming soon",
    paper: "https://tinyurl.com/paper-asmr",
    tech: "rust / distributed systems / byzantine fault tolerance / discrete-event simulation",
    image: "",
    blurb:
      "A Rust implementation of my paper \"Leader-Aware Asynchronous State Machine Replication\" (2023), built on the VABA agreement protocol (Abraham–Malkhi–Spiegelman 2018), with a simulator that benchmarks it against classic VABA.",
    features: [
      "Signer-filtered leader election — elect only parties that signed the last committed block, so crashed/slow leaders drop out on their own",
      "Reuses VABA's Proposal-Promotion & View-Change phases verbatim; election is a single start-up switch for clean A/B comparison",
      "Deterministic discrete-event network simulator modeling delays, crashes, and partitions",
    ],
    lessons: [
      "Asynchronous BFT consensus",
      "Utilization as a causal-chain metric",
      "Building reproducible protocol simulators in Rust",
    ],
  },
  {
    title: "Agentic Job Finder",
    gh: "", // private for now
    badge: "Coming soon",
    tech: "kiro agent / python / selenium / browser automation / single-file HTML app",
    image: "",
    blurb:
      "An agent-driven job-search workflow plus a browser UI for reviewing and triaging roles. You drive it by talking to Kiro, which follows steering files to search, filter, verify, and maintain the tracker.",
    features: [
      "Harvests and reads full LinkedIn listings (parallel, paginated) for triage",
      "Auto-filters, tiers, and dedups roles into markdown trackers",
      "Single-file HTML app with a live split-pane job preview and surgical edit-back to the .md files",
    ],
    lessons: [
      "Designing agent steering/playbooks",
      "File System Access API",
      "Browser automation via a native-messaging host",
    ],
  },
  {
    title: "RL Project: I Did It My Way",
    gh: "https://github.com/yoavdim/i-did-it-my-way",
    tech: "python / reinforcement learning / robotics / simulation",
    image: "",
    blurb:
      "Testing different methods of adapting the Reinforcement Learning training environment for a 4-legged robot to learn to walk successfully with a malfunctioning leg.",
    features: [
      "Adapt the RL training environment to a damaged-leg scenario",
      "Compare training strategies for robust quadruped locomotion",
      "Sim-to-real oriented workflow for the Unitree Go1",
    ],
    lessons: [
      "Reinforcement learning training dynamics",
      "Reward/environment shaping",
      "Sim-to-real transfer",
    ],
  },
  {
    title: "Physics Lab Tools",
    gh: "https://github.com/yoavdim/labmaster",
    tech: "matlab / data analysis / statistics",
    image: "",
    blurb:
      "A MATLAB toolkit for physics lab report calculations, built to speed up the experiments during university (Technion).",
    features: [
      "Error propagation and measurement comparison",
      "Linear regression and chi-squared tests",
      "Plotting with error bars for lab reports",
    ],
    lessons: [
      "Experimental error analysis",
      "Curve fitting & regression",
      "Reusable scientific tooling in MATLAB",
    ],
  },
];

const GRID = [
  {
    title: "Exam Practice Timer",
    gh: "", // add repo/live URL here if you have one
    description:
      "A small timer web app that also shows the time in the tab title, so you can focus on the PDF and not the timer. Mainly a web-dev exercise, with extras like URL parsing and acting as a Chrome omnibox search engine — all while staying a static page.",
    tags: ["JavaScript", "Web"],
  },
  {
    title: "Panopto Video Scraper",
    gh: "https://github.com/yoavdim/panopto_crawler",
    description:
      "Uses Selenium and browser automation to bypass restrictions on downloading videos from the university server, while automating the process for entire courses.",
    tags: ["Python", "Selenium", "Automation"],
  },
  {
    title: "Branch Predictor",
    gh: "https://github.com/yoavdim/branch_predictor",
    description: "CPU branch prediction simulator exploring local/global history schemes.",
    tags: ["C++", "Computer Architecture"],
  },
  {
    title: "Kong",
    gh: "https://github.com/yoavdim/Kong",
    description: "University hardware lab project written in SystemVerilog.",
    tags: ["SystemVerilog", "Chip Design"],
  },
  {
    title: "smash",
    gh: "https://github.com/yoavdim/smash",
    description: "A small Unix shell — command parsing, job control, and built-ins.",
    tags: ["C++", "OS", "Shell"],
  },
  {
    title: "ttftp",
    gh: "https://github.com/yoavdim/ttftp",
    description: "A TFTP client/server implementation over UDP.",
    tags: ["C", "Networking"],
  },
  {
    title: "CUDA Experiments",
    gh: "https://github.com/yoavdim/cuda2",
    description: "GPU compute kernels and parallel algorithm experiments in CUDA.",
    tags: ["CUDA", "GPU", "Parallel"],
  },
];
