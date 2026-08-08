import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Loader2,
  Send,
  User,
  MessageSquare,
  AlertCircle,
} from "lucide-react";
import type { IncidentComment } from "../types/incident.types";
import { useAddIncidentComment } from "../hooks/useIncidentComments";

interface CommentThreadProps {
  comments: IncidentComment[];
  incidentId: string;
  currentUserId: string;
  getAuthorName?: (authorId: string) => string;
  className?: string;
}

const commentSchema = z.object({
  comment: z.string().min(1, "Le commentaire ne peut pas être vide").max(1000),
});

type CommentFormData = z.infer<typeof commentSchema>;

export default function CommentThread({
  comments,
  incidentId,
  getAuthorName,
  className = "",
}: CommentThreadProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const addComment = useAddIncidentComment();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
  });

  const onSubmit = async (data: CommentFormData) => {
    setSubmitError(null);
    try {
      await addComment.mutateAsync({ incidentId, comment: data.comment });
      reset();
    } catch (error) {
  setSubmitError(
    error instanceof Error
      ? error.message
      : "Erreur lors de l'ajout du commentaire."
    );
    }
  };

  const getDisplayName = (comment: IncidentComment): string => {
    if (getAuthorName) {
      const name = getAuthorName(comment.author_id);
      if (name) return name;
    }
    return `Utilisateur ${comment.author_id.slice(0, 6)}`;
  };

  const getAvatarInitial = (comment: IncidentComment): string => {
    if (getAuthorName) {
      const name = getAuthorName(comment.author_id);
      if (name) return name.charAt(0).toUpperCase();
    }
    return comment.author_id.charAt(0).toUpperCase();
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* ─── Comments list ─── */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-8 text-center">
            <MessageSquare size={24} />
            <p className="mt-2 text-sm">Aucun commentaire pour l'instant.</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold">
                {getAvatarInitial(comment)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                  <span className="text-sm font-medium">
                    {getDisplayName(comment)}
                  </span>
                  <span className="text-xs">
                    {format(new Date(comment.created_at), "dd/MM/yyyy 'à' HH:mm", {
                      locale: fr,
                    })}
                  </span>
                </div>
                <p className="mt-0.5 text-sm break-words">
                  {comment.comment}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ─── Add comment form ─── */}
      <div className="sticky bottom-0 pt-4 border-t">
        <form onSubmit={handleSubmit(onSubmit)} className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold">
            <User size={16} />
          </div>
          <div className="flex-1">
            <div className="relative">
              <textarea
                {...register("comment")}
                rows={3}
                placeholder="Écrire un commentaire..."
                className="w-full rounded-xl border px-4 py-2.5 pr-12 text-sm outline-none transition focus:ring-2 disabled:opacity-50"
                disabled={isSubmitting}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="absolute bottom-2.5 right-2.5 rounded-full bg-orange-500 p-1.5 text-white transition hover:bg-orange-600 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Send size={16} />
                )}
              </button>
            </div>
            {errors.comment && (
              <p className="mt-1 text-xs">{errors.comment.message}</p>
            )}
            {submitError && (
              <div className="mt-2 flex items-center gap-1.5 text-xs">
                <AlertCircle size={14} />
                {submitError}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}