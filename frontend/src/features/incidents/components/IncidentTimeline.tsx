import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowRight, Clock } from "lucide-react";
import type { IncidentHistory } from "../types/incident.types";
import IncidentStatusBadge from "./IncidentStatusBadge";

interface IncidentTimelineProps {
  history: IncidentHistory[];
  className?: string;
}

export default function IncidentTimeline({
  history,
  className = "",
}: IncidentTimelineProps) {
  if (!history || history.length === 0) {
    return (
      <div className={`text-center py-8 text-sm text-slate-400 ${className}`}>
        <Clock size={20} className="mx-auto mb-2 text-slate-300" />
        Aucune activité enregistrée.
      </div>
    );
  }

  return (
    <div className={`flow-root ${className}`}>
      <ul className="-mb-8">
        {history.map((entry, index) => (
          <li key={entry.id || index}>
            <div className="relative pb-8">
              {index < history.length - 1 && (
                <span
                  className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-slate-200"
                  aria-hidden="true"
                />
              )}
              <div className="relative flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                  <ArrowRight size={16} />
                </div>
                <div className="min-w-0 flex-1 pt-0.5">
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="font-medium text-slate-900">
                      Statut mis à jour
                    </span>
                    <span className="text-slate-400">•</span>
                    <time
                      dateTime={new Date(entry.created_at).toISOString()}
                      className="text-slate-400"
                    >
                      {format(new Date(entry.created_at), "dd/MM/yyyy 'à' HH:mm", {
                        locale: fr,
                      })}
                    </time>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-sm">
                    <IncidentStatusBadge status={entry.old_status} />
                    <ArrowRight size={14} className="text-slate-400" />
                    <IncidentStatusBadge status={entry.new_status} />
                  </div>
                  {entry.notes && (
                    <p className="mt-1 text-sm text-slate-600">
                      {entry.notes}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}