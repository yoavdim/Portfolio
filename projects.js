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
   ghPending note, e.g.
      ghPending: "Repo coming soon"
   which renders a crossed-out GitHub icon with that message as a
   tooltip on hover/tap.
   ============================================================ */

const PROFILE = {
  github: "https://github.com/yoavdim",
  linkedin: "https://www.linkedin.com/in/yoav-dim/",
};

const FEATURED = [
  {
    title: "Stock Analyzer",
    gh: "https://github.com/yoavdim/stocks_analyzer",
    tech: ["python", "numpy", "finance", "scalene", "multiprocessing", "curve fitting", "data analysis"],
    image: "", // e.g. "assets/stock-analyzer.png"
    illustration: "stock-analyzer",
    blurb: "A quantitative stock analysis and portfolio optimization tool.",
    features: [
      "Screen thousands of stocks by financial ratios",
      "Build individual DCF models",
      "See cross correlation & optimize entire portfolios",
    ],
    lessons: [
      "Portfolio theory",
      "Performance profiling (Scalene)",
      "Exception handling in Process Pool",
    ],
  },
  {
    title: "Agentic Job Finder",
    gh: "https://github.com/yoavdim/agentic-job-finder",
    tech: ["kiro LLM agent", "python", "browser automation", "web app", "chrome extension", "AI"],
    image: "",
    illustration: "job-finder",
    blurb:
      "An agent-driven job-search workflow plus a browser UI for reviewing and triaging roles. You drive it by talking to Kiro, which follows steering files to search, filter, verify, and maintain the tracker.",
    features: [
      "Harvests and reads full listings from job websites like LinkedIn (parallel, paginated) for triage",
      "Auto-filters, tiers, and dedups roles into markdown trackers",
      "Single-file HTML app with a live split-pane job preview and surgical edit-back to the .md files",
      "Using a Chrome extension I wrote to both give control of the browser to the agent for the search and to allow the HTML app to control the split tab (avoiding iframe restrictions)"
    ],
    lessons: [
      "Designing agent steering/playbooks",
      "File System Access Web API",
      "Browser automation via a native-messaging host",
    ],
  },
  {
    title: "Optimizing VABA-based SMR",
    gh: "", // no public repo yet
    // Shown as a tooltip on the crossed-out GitHub icon (hover / tap).
    ghPending: "Theoretical paper completed, GH repo of simulations is still wip",
    paper: "https://tinyurl.com/paper-asmr",
    tech: ["rust", "crypto", "distributed systems", "algorithms", "byzantine fault tolerance", "simulation"],
    image: "",
    illustration: "vaba",
    blurb:
      "A Rust implementation of my paper \"Leader-Aware Asynchronous State Machine Replication\" (2023), built on the VABA agreement protocol (Abraham–Malkhi–Spiegelman 2018), with a simulator that benchmarks it against classic VABA.",
    features: [
      "Signer-filtered leader election — elect only parties that signed the last committed block, so crashed/slow leaders drop out on their own",
      "Commits the previous cryptographic signatures as a proof of being alive, without allowing a byzantine adversary to abuse the mechanism",
      "Correctness and worst-case complexity for the byzantine case are proved in the paper, the speedup of the average case in the crash only use case is shown in the simulation repository (a later work)",
      "Reuses VABA's Proposal-Promotion & View-Change phases verbatim",
      "Deterministic discrete-event network simulator modeling delays, crashes, and partitions",
    ],
    lessons: [
      "Academic paper writing standards",
      "Decentralized algorithms proofs",
      "The async model",
      "Reproducible simulators",
      "Rust language"
    ],
  },
  {
    title: "RL Project: I Did It My Way",
    gh: "https://github.com/yoavdim/i-did-it-my-way",
    tech: ["python", "reinforcement learning", "robotics", "simulation", "AI"],
    image: "imgs/Robot.png",
    noFrame: true,
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
    tech: ["matlab", "data analysis", "statistics"],
    image: "",
    illustration: "physics-fit",
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
    image: "imgs/tab timer.png",
    description:
      "A small timer web app that also shows the time in the tab title, so you can focus on the PDF and not the timer. Mainly a web-dev exercise, with extras like URL parsing and acting as a Chrome omnibox search engine — all while staying a static page.",
    tech: ["JavaScript", "web app"],
  },
  {
    title: "Kong",
    gh: "https://github.com/yoavdim/Kong",
    image: "imgs/kong.jpeg",
    description:
      "A Donkey Kong-style arcade game built from scratch on an FPGA in SystemVerilog — VGA graphics, PS/2 keyboard control, audio-codec sound, and a live 7-segment score display.",
    tech: ["SystemVerilog", "FPGA", "Chip Design", "University"],
  },
  {
    title: "Tab Share",
    gh: "https://github.com/yoavdim/tab-share",
    description:
      "A Chrome extension that gives an LLM agent control of the browser and lets a local web app drive a split tab, bypassing iframe restrictions via a native-messaging host. Built for the Agentic Job Finder.",
    tech: ["JavaScript", "Chrome Extension", "browser automation", "native messaging"],
  },
  {
    title: "Panopto Video Scraper",
    gh: "https://github.com/yoavdim/panopto_crawler",
    description:
      "Uses Selenium and browser automation to bypass restrictions on downloading videos from the university server, while automating the process for entire courses.",
    tech: ["Python", "Selenium", "browser automation"],
  },
  {
    title: "Branch Predictor & Cache",
    gh: "https://github.com/yoavdim/Computer-structure",
    description:
      "Computer-architecture coursework: a BTB-based branch-prediction simulator (local/global history, gshare/lshare indexing, 2-bit FSM) and a cache simulator.",
    tech: ["C++", "Computer Architecture", "Cache", "University"],
  },
  {
    title: "smash",
    gh: "https://github.com/yoavdim/smash",
    description: "A small Unix shell — command parsing, job control, and built-ins.",
    tech: ["C++", "OS", "Shell", "University"],
  },
  {
    title: "ttftp",
    gh: "https://github.com/yoavdim/ttftp",
    description: "A TFTP client/server implementation over UDP.",
    tech: ["C", "Networking", "University"],
  },
  {
    title: "CUDA Experiments",
    gh: [
      { url: "https://github.com/yoavdim/cuda1", label: "1" },
      { url: "https://github.com/yoavdim/cuda2", label: "2" },
      { url: "https://github.com/yoavdim/gpu3", label: "3" },
    ],
    description:
      "A series of GPU programming exercises in CUDA — writing compute kernels, optimizing memory access, and parallelizing algorithms across three iterations.",
    tech: ["CUDA", "C++", "GPU", "Parallel", "University"],
  },
];
