import { Task } from "@/types";
import { Github, MapPin, Users, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TaskCardProps {
  task: Task;
}

const PRIORITY_BADGE: Record<string, string> = {
  HIGH:   "bg-red-500 text-white",
  MEDIUM: "bg-amber-400 text-white",
  LOW:    "bg-green-500 text-white",
};

const TEAM_ICONS: Record<string, string> = {
  Backend:       "🔧",
  "UI/UX":       "🎨",
  API:           "⚡",
  Frontend:      "💻",
  Infrastructure:"🏗️",
};

export function TaskCard({ task }: TaskCardProps) {
  const { toast } = useToast();
  const badge = PRIORITY_BADGE[task.priority] || PRIORITY_BADGE.LOW;

  const handleCreateIssue = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast({
      title: "✓ GitHub Issue Created",
      description: `"${task.title}" has been added to your repository.`,
    });
  };

  return (
    <div className="group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden">

      {/* Header row */}
      <div className="px-4 pt-3.5 pb-2">
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-base shrink-0">{TEAM_ICONS[task.team] || "📋"}</span>
            <h4 className="font-semibold text-slate-900 text-sm leading-snug">{task.title}</h4>
          </div>
          <span className={`shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wide ${badge}`}>
            {task.priority}
          </span>
        </div>

        {/* Meta */}
        <div className="space-y-1 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 shrink-0 text-slate-400" />
            Assigned To: <span className="text-slate-700 font-medium ml-0.5">{task.assignee}</span>
          </div>
          {task.dependentOn && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
              <span>Priority</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${badge}`}>{task.priority}</span>
              <span>Dependent on</span>
              <span className="bg-indigo-100 text-indigo-700 font-medium px-1.5 py-0.5 rounded-md">{task.dependentOn}</span>
            </div>
          )}
        </div>
      </div>

      {/* AI Recommendation */}
      {task.recommendation && (
        <div className="mx-4 mb-3 rounded-xl overflow-hidden border border-indigo-100 bg-gradient-to-br from-indigo-50 to-purple-50">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white">
            <Sparkles className="w-3 h-3 shrink-0" />
            <span className="text-[10px] font-bold tracking-wide uppercase">AI Recommendation</span>
          </div>
          <p className="px-3 py-2.5 text-xs text-indigo-900 leading-relaxed">
            {task.recommendation}
          </p>
        </div>
      )}

      {/* GitHub button */}
      <div className="border-t border-slate-100 px-4 py-2">
        <button
          onClick={handleCreateIssue}
          className="w-full flex items-center justify-center gap-1.5 text-xs font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 py-1 rounded-lg transition-colors"
        >
          <Github className="w-3.5 h-3.5" />
          Create GitHub Issue
        </button>
      </div>
    </div>
  );
}
