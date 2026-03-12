import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, History, LogOut, FileText,
  Mic, Loader2, PlayCircle, Square,
  Download, Copy, DownloadCloud,
  ChevronDown, User, Plus, Lightbulb, Target,
  MoreHorizontal, Check, Zap, BookOpen,
  ArrowUpRight, Save
} from "lucide-react";
import { KanbanBoard } from "@/components/kanban-board";
import { TaskCard } from "@/components/task-card";
import { Task, TaskStatus, Decision, TranscriptLine } from "@/types";
import { useToast } from "@/hooks/use-toast";

// ─── Sample data ─────────────────────────────────────────────────────────────

const MOCK_TASKS: Task[] = [
  {
    id: "1", title: "Fix Login Bug", team: "Backend", priority: "HIGH", assignee: "Rahul",
    dependentOn: "Database Update", status: "TODO",
    recommendation: "Add retry logic with exponential backoff and write a regression test to prevent recurrence. Prioritise patching the session token validation flow."
  },
  {
    id: "2", title: "Redesign Dashboard Widget", team: "UI/UX", priority: "MEDIUM", assignee: "Priya",
    status: "BACKLOG",
    recommendation: "Use a card-based layout with skeleton loaders for perceived performance. Reference the new Design System tokens to keep it consistent with the upcoming rebrand."
  },
  {
    id: "3", title: "Implement API Rate Limiting", team: "API", priority: "LOW", assignee: "Arjun",
    status: "IN_PROGRESS",
    recommendation: "Use a token bucket algorithm backed by Redis for distributed accuracy. Set burst limits per endpoint and return 429 with a Retry-After header."
  },
];

const MOCK_DECISIONS: Decision[] = [
  { id: "1", text: "Deploy the update next week" },
  { id: "2", text: "Migrate to MongoDB for the new feature" },
  { id: "3", text: "Enable API rate limiting for security" },
];

const MOCK_TRANSCRIPT: TranscriptLine[] = [
  { id: "1", speaker: "Rahul",    text: "I will fix the login bug before release.",          time: "10:02", isDecision: false },
  { id: "2", speaker: "Priya",    text: "The UI team will redesign the dashboard widget.",    time: "10:03", isDecision: false },
  { id: "3", speaker: "Arjun",    text: "We need to implement rate limiting on the API.",     time: "10:05", isDecision: false },
  { id: "4", speaker: "Decision", text: "Deploy the update next week",                        time: "10:06", isDecision: true  },
];

const SPEAKER_COLORS: Record<string, string> = {
  Rahul: "bg-indigo-500", Priya: "bg-purple-500", Arjun: "bg-emerald-500", Decision: "bg-orange-500",
};

// ─── Types ────────────────────────────────────────────────────────────────────

type Phase = "idle" | "recording" | "results";
type Mode  = "transcript" | "live";

// ─── Component ───────────────────────────────────────────────────────────────

export default function Dashboard() {
  const { toast } = useToast();

  const [phase,       setPhase]       = useState<Phase>("idle");
  const [mode,        setMode]        = useState<Mode>("live");
  const [isGenerating,setIsGenerating]= useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [tasks,       setTasks]       = useState<Task[]>([]);
  const [decisions,   setDecisions]   = useState<Decision[]>([]);
  const [transcript,  setTranscript]  = useState<TranscriptLine[]>([]);
  const transcriptRef = useRef<HTMLDivElement>(null);

  // timer
  useEffect(() => {
    let id: ReturnType<typeof setInterval>;
    if (phase === "recording") id = setInterval(() => setRecordingTime(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [phase]);

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  // ── actions ────────────────────────────────────────────────────────────────

  const startRecording = () => {
    setRecordingTime(0);
    setTranscript([]);
    setPhase("recording");
    // stream mock transcript lines one by one
    MOCK_TRANSCRIPT.forEach((line, i) => {
      setTimeout(() => setTranscript(prev => [...prev, line]), (i + 1) * 1400);
    });
  };

  const stopRecording = () => {
    // stay on recording phase but freeze — user can now generate
    setPhase("recording");
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setTasks(MOCK_TASKS);
      setDecisions(MOCK_DECISIONS);
      if (transcript.length === 0) setTranscript(MOCK_TRANSCRIPT);
      setIsGenerating(false);
      setPhase("results");
      toast({ title: "Analysis Complete ✓", description: "Extracted 3 tasks and 3 key decisions." });
    }, 2000);
  };

  const handleTaskMove    = (id: string, s: TaskStatus) => setTasks(p => p.map(t => t.id === id ? { ...t, status: s } : t));
  const handleGitHub      = () => toast({ title: "GitHub Issues Created", description: "3 issues created in your repository." });
  const handleSaveHistory = () => toast({ title: "Saved to History", description: "Meeting saved." });

  const handleExportCSV   = () => {
    const csv = ["Title,Team,Priority,Assignee,Status", ...tasks.map(t => `${t.title},${t.team},${t.priority},${t.assignee},${t.status}`)].join("\n");
    dl(csv, "meeting-tasks.csv", "text/csv");
  };
  const handleExportJSON  = () => dl(JSON.stringify({ tasks, decisions, transcript }, null, 2), "meeting-data.json", "application/json");
  const handleCopyTasks   = () => {
    navigator.clipboard.writeText(tasks.map(t => `• ${t.title} [${t.priority}] — ${t.assignee}`).join("\n"));
    toast({ title: "Copied!", description: "Tasks copied to clipboard." });
  };

  const dl = (content: string, name: string, type: string) => {
    const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(new Blob([content], { type })), download: name });
    a.click(); URL.revokeObjectURL(a.href);
  };

  const resetToIdle = () => { setPhase("idle"); setTasks([]); setDecisions([]); setTranscript([]); setRecordingTime(0); };

  // ── Navbar (shared) ───────────────────────────────────────────────────────

  const Navbar = () => (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center shadow-md shadow-indigo-200">
            <Sparkles className="text-white w-4 h-4" />
          </div>
          <span className="font-bold text-base tracking-tight text-slate-900">AI Meeting Assistant</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="hidden sm:flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            <History className="w-4 h-4" /> Meeting History <ChevronDown className="w-3 h-3 opacity-60" />
          </button>
          <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow-sm">
            <img src={`${import.meta.env.BASE_URL}images/avatar.png`} alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <Link href="/">
            <button className="text-sm text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors">Logout</button>
          </Link>
          <button className="flex items-center gap-1.5 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg transition-colors">
            <User className="w-3.5 h-3.5" /> Account <ChevronDown className="w-3 h-3 opacity-80" />
          </button>
        </div>
      </div>
    </header>
  );

  // ══════════════════════════════════════════════════════════════════════════
  // PHASE 1 — IDLE  (mode picker)
  // ══════════════════════════════════════════════════════════════════════════
  if (phase === "idle") return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-xl space-y-6"
        >
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-2">
              <Sparkles className="w-3.5 h-3.5" /> AI-Powered
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Process your meeting</h2>
            <p className="text-slate-500">Choose an input method and generate actionable insights.</p>
          </div>

          {/* Mode tabs */}
          <div className="flex p-1 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <button
              onClick={() => setMode("transcript")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${mode === "transcript" ? "bg-indigo-600 text-white shadow-md" : "text-slate-500 hover:text-slate-800"}`}
            >
              <FileText className="w-4 h-4" /> Transcript Mode
            </button>
            <button
              onClick={() => setMode("live")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${mode === "live" ? "bg-indigo-600 text-white shadow-md" : "text-slate-500 hover:text-slate-800"}`}
            >
              <Mic className="w-4 h-4" /> Live Meeting Mode
            </button>
          </div>

          {/* Panel */}
          <AnimatePresence mode="wait">
            {mode === "transcript" ? (
              <motion.div key="transcript" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4"
              >
                <textarea
                  className="w-full h-48 bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all resize-none"
                  placeholder="Paste your meeting transcript here…&#10;e.g. Rahul: I will fix the login bug before release.&#10;Priya: The UI team will redesign the dashboard widget."
                />
                <div className="flex justify-between items-center">
                  <button className="flex items-center gap-2 text-sm text-slate-600 border border-slate-200 hover:border-slate-300 px-4 py-2 rounded-xl transition-colors">
                    <DownloadCloud className="w-4 h-4" /> Upload .txt File
                  </button>
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-6 py-2.5 rounded-xl shadow-md shadow-indigo-200 transition-all disabled:opacity-60"
                  >
                    {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    {isGenerating ? "Analyzing…" : "Generate Insights"}
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="live" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 flex flex-col items-center gap-6"
              >
                {/* Animated mic */}
                <div className="relative flex items-center justify-center">
                  <motion.div
                    animate={{ scale: [1, 1.35, 1], opacity: [0.25, 0, 0.25] }}
                    transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                    className="absolute w-28 h-28 rounded-full bg-indigo-400"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
                    transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut", delay: 0.3 }}
                    className="absolute w-20 h-20 rounded-full bg-indigo-500"
                  />
                  <div className="relative w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-300">
                    <Mic className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="text-center space-y-1">
                  <p className="text-slate-800 font-semibold text-lg">Ready to record</p>
                  <p className="text-slate-400 text-sm">Press Start Recording to begin capturing your meeting</p>
                </div>
                <button
                  onClick={startRecording}
                  className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg shadow-orange-200 transition-all text-sm"
                >
                  <PlayCircle className="w-5 h-5" /> Start Recording
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );

  // ══════════════════════════════════════════════════════════════════════════
  // PHASE 2 — RECORDING
  // ══════════════════════════════════════════════════════════════════════════
  if (phase === "recording") return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 max-w-screen-xl mx-auto w-full px-4 sm:px-6 py-6 space-y-5">

        {/* Recording bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl shadow-lg"
          style={{ background: "linear-gradient(135deg, #F97316 0%, #7C3AED 50%, #4338CA 100%)" }}
        >
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
          <div className="relative px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ scale: [1, 1.35, 1], opacity: [1, 0.5, 1] }}
                transition={{ repeat: Infinity, duration: 1.2 }}
                className="w-3 h-3 bg-white rounded-full shadow-md"
              />
              <span className="text-white font-semibold text-sm sm:text-base">Recording Live Meeting</span>
              <span className="font-mono text-white/80 text-sm bg-black/20 px-2 py-0.5 rounded-md">{fmt(recordingTime)}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={resetToIdle}
                className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
              >
                <Square className="w-3.5 h-3.5" /> End Recording
              </button>
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="flex items-center gap-1.5 bg-white text-indigo-700 hover:bg-indigo-50 text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors shadow-md disabled:opacity-60"
              >
                {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                {isGenerating ? "Analyzing…" : "Generate Tasks"}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Live transcript panel (full width during recording) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl shadow-xl overflow-hidden flex flex-col"
          style={{ minHeight: 420 }}
        >
          <div className="px-5 py-4 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-300" />
              <h3 className="font-semibold text-white text-sm">Live Transcript</h3>
            </div>
            <span className="text-slate-400 text-xs font-mono">{fmt(recordingTime)}</span>
          </div>
          <div ref={transcriptRef} className="flex-1 overflow-y-auto p-5 space-y-4">
            <AnimatePresence>
              {transcript.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-40 gap-3"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="w-3 h-3 bg-indigo-400 rounded-full"
                  />
                  <p className="text-slate-400 text-sm">Listening to conversation…</p>
                </motion.div>
              )}
              {transcript.map(line => (
                <motion.div
                  key={line.id}
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-3"
                >
                  {line.isDecision ? (
                    <div className="mt-0.5 shrink-0 w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center">
                      <Zap className="w-3.5 h-3.5 text-white" />
                    </div>
                  ) : (
                    <div className={`mt-0.5 shrink-0 w-7 h-7 rounded-full ${SPEAKER_COLORS[line.speaker] || "bg-slate-500"} flex items-center justify-center`}>
                      <span className="text-white text-xs font-bold">{line.speaker[0]}</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    {!line.isDecision && (
                      <span className="text-indigo-300 text-xs font-semibold">{line.speaker}: </span>
                    )}
                    {line.isDecision ? (
                      <div className="mt-1 bg-orange-500/20 border border-orange-500/30 rounded-lg px-3 py-2">
                        <span className="text-orange-300 text-xs font-semibold">Decision: </span>
                        <span className="text-orange-200 text-xs">{line.text}</span>
                      </div>
                    ) : (
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {line.text}
                        {line.speaker === "Rahul" && (
                          <span className="ml-2 inline-block bg-red-500/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">HIGH</span>
                        )}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Hint */}
        <p className="text-center text-slate-400 text-xs">
          When done speaking, click <span className="font-semibold text-indigo-500">Generate Tasks</span> to analyse your meeting.
        </p>
      </main>
    </div>
  );

  // ══════════════════════════════════════════════════════════════════════════
  // PHASE 3 — RESULTS
  // ══════════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 max-w-screen-xl mx-auto w-full px-4 sm:px-6 py-6 space-y-5">

        {/* 3-Column Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-4"
        >
          {/* Transcript */}
          <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl shadow-xl overflow-hidden flex flex-col" style={{ minHeight: 420, maxHeight: 520 }}>
            <div className="px-5 py-4 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-300" />
                <h3 className="font-semibold text-white text-sm">Live Transcript</h3>
              </div>
              <button className="text-slate-400 hover:text-white transition-colors"><MoreHorizontal className="w-4 h-4" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {transcript.map(line => (
                <div key={line.id} className="flex items-start gap-2.5">
                  {line.isDecision ? (
                    <div className="mt-0.5 shrink-0 w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center">
                      <Zap className="w-3 h-3 text-white" />
                    </div>
                  ) : (
                    <div className={`mt-0.5 shrink-0 w-6 h-6 rounded-full ${SPEAKER_COLORS[line.speaker] || "bg-slate-500"} flex items-center justify-center`}>
                      <span className="text-white text-xs font-bold">{line.speaker[0]}</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    {!line.isDecision && <span className="text-indigo-300 text-xs font-semibold">{line.speaker}: </span>}
                    {line.isDecision ? (
                      <div className="mt-1 bg-orange-500/20 border border-orange-500/30 rounded-lg px-3 py-2">
                        <span className="text-orange-300 text-xs font-semibold">Decision: </span>
                        <span className="text-orange-200 text-xs">{line.text}</span>
                      </div>
                    ) : (
                      <p className="text-slate-300 text-xs leading-relaxed">
                        {line.text}
                        {line.speaker === "Rahul" && (
                          <span className="ml-2 inline-block bg-red-500/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">HIGH</span>
                        )}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Items */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden" style={{ minHeight: 420, maxHeight: 520 }}>
            <div className="px-5 py-4 flex items-center justify-between border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-orange-500" />
                <h3 className="font-semibold text-slate-900 text-sm">Action Items</h3>
              </div>
              <button className="text-slate-400 hover:text-slate-700 transition-colors"><MoreHorizontal className="w-4 h-4" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {tasks.map(task => <TaskCard key={task.id} task={task} />)}
            </div>
          </div>

          {/* Key Decisions */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden" style={{ minHeight: 420, maxHeight: 520 }}>
            <div className="px-5 py-4 flex items-center justify-between border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-indigo-500" />
                <h3 className="font-semibold text-slate-900 text-sm">Key Decisions</h3>
              </div>
              <button className="text-slate-400 hover:text-slate-700 transition-colors"><MoreHorizontal className="w-4 h-4" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {decisions.map(d => (
                <motion.div
                  key={d.id}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3 p-3 bg-indigo-50 rounded-xl border border-indigo-100 hover:shadow-sm transition-all"
                >
                  <div className="shrink-0 w-5 h-5 rounded-md bg-indigo-600 flex items-center justify-center mt-0.5">
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  </div>
                  <p className="text-slate-800 text-sm font-medium leading-snug">{d.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Meeting Summary bar */}
        <div
          className="rounded-2xl px-5 py-3.5 flex flex-col sm:flex-row items-start sm:items-center gap-2 shadow-lg"
          style={{ background: "linear-gradient(135deg, #4338CA 0%, #6D28D9 60%, #7C3AED 100%)" }}
        >
          <span className="text-white font-bold text-sm shrink-0">Meeting Summary</span>
          <span className="text-indigo-200 text-xs sm:text-sm italic">
            · Summary: Discussed fixing the login bug, redesigning the dashboard, and implementing API rate limiting.
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button onClick={handleGitHub}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-indigo-200 transition-colors">
            <Plus className="w-4 h-4" /> Create GitHub Issues
          </button>
          <button onClick={handleExportCSV}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-indigo-200 transition-colors">
            <Download className="w-4 h-4" /> Export to CSV
          </button>
          <button onClick={handleSaveHistory}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-indigo-200 transition-colors">
            <Save className="w-4 h-4" /> Save to History
          </button>
          <button onClick={handleCopyTasks}
            className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm transition-colors">
            <Copy className="w-4 h-4" /> Copy Tasks
          </button>
          <button onClick={handleExportJSON}
            className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm transition-colors">
            <ArrowUpRight className="w-4 h-4" /> Export JSON
          </button>
          <button onClick={resetToIdle}
            className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-500 text-sm font-medium px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm transition-colors">
            + New Meeting
          </button>
        </div>

        {/* Kanban board */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Trello Storyboard</h2>
            <p className="text-slate-500 text-sm">Drag and drop to update task status</p>
          </div>
          <KanbanBoard tasks={tasks} onTaskMove={handleTaskMove} />
        </div>

      </main>
    </div>
  );
}
