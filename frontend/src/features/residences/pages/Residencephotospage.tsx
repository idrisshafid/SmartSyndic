import { useState, useRef, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, Upload, X, ImageOff, Loader2 } from "lucide-react";

import {
  useResidencePhotos,
  useUploadResidencePhoto,
  useDeleteResidencePhoto,
} from "../hooks/useResidencePhotos";

export default function ResidencePhotosPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError, refetch } = useResidencePhotos(id ?? "");
  const uploadMutation = useUploadResidencePhoto();
  const deleteMutation = useDeleteResidencePhoto();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clean up object URL when component unmounts or preview changes
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  if (!id) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="font-medium">Residence not found.</p>
      </div>
    );
  }

  const photos = data?.data ?? [];

  // ─── Upload the selected file ──────────────────────────────────────────
  const uploadSelectedFile = async (file: File) => {
    setUploadError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("photo", file);
      await uploadMutation.mutateAsync({ id, formData });
      await refetch(); // refresh gallery
      clearSelection(); // clear preview and file input
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadError("Upload failed. Please try again.");
      // Keep preview so user can retry by selecting again (or use a retry button)
    } finally {
      setIsUploading(false);
    }
  };

  // ─── File selection handler ────────────────────────────────────────────
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Revoke previous preview URL to free memory
    if (preview) URL.revokeObjectURL(preview);

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setUploadError(null);

    // Reset the input so the same file can be selected again later
    if (fileInputRef.current) fileInputRef.current.value = "";

    // Auto‑upload
    uploadSelectedFile(file);
  };

  // ─── Clear selection (cancel upload) ──────────────────────────────────
  const clearSelection = () => {
    if (preview) URL.revokeObjectURL(preview);
    setSelectedFile(null);
    setPreview(null);
    setUploadError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ─── Delete a photo ────────────────────────────────────────────────────
  const handleDelete = (photoId: string) => {
    if (!window.confirm("Remove this photo?")) return;
    deleteMutation.mutate({ id, photoId });
  };

  // ─── Navigation ────────────────────────────────────────────────────────
  const handleFinish = () => {
    // If there is a pending upload, you may want to warn, but we clear on success.
    navigate(`/syndic/residences/${id}/detail`);
  };

  return (
    <div className="min-h-screen py-3">
      <div className="mx-auto max-w-4xl px-6">
        <Link
          to={`/syndic/residences/${id}/detail`}
          className="mb-4 inline-flex items-center gap-1.5 text-xm font-medium transition"
        >
          <ArrowLeft size={22} />
          Back to residence
        </Link>

        <div className="rounded-3xl p-8 shadow-sm border">
          <h1 className="text-2xl font-bold">Residence Photos</h1>
          <p className="mt-1 text-sm">
            Add clear, well‑lit photos to help residents recognise the property.
          </p>

          {/* ─── UPLOAD ZONE ────────────────────────────────────────────── */}
          <div className="mt-8 rounded-2xl border border-dashed border-orange-500 p-6">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between">
              <label className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-orange-500 px-4 py-1 text-sm font-medium transition hover:bg-orange-50 sm:w-auto">
                <Upload size={16} />
                Choose file
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {isUploading && (
                <div className="flex items-center gap-2 text-sm text-orange-600">
                  <Loader2 size={16} className="animate-spin" />
                  Uploading...
                </div>
              )}

              {preview && !isUploading && (
                <div className="relative">
                  <img
                    src={preview}
                    alt="Preview"
                    className="h-20 w-28 rounded-xl object-cover"
                  />
                  <button
                    onClick={clearSelection}
                    className="absolute -right-2 -top-2 rounded-full bg-white p-1 shadow-md hover:bg-slate-100"
                    aria-label="Remove selected file"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              {uploadError && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <span>{uploadError}</span>
                  <button
                    onClick={() => {
                      if (selectedFile) uploadSelectedFile(selectedFile);
                    }}
                    className="underline hover:no-underline"
                  >
                    Retry
                  </button>
                </div>
              )}

              {!isUploading && !preview && !uploadError && (
                <span className="text-sm text-slate-400">
                  Select a file to upload instantly
                </span>
              )}
            </div>
          </div>

          {/* ─── GALLERY ────────────────────────────────────────────────── */}
          <div className="mt-6">
            {isLoading && (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="h-40 animate-pulse rounded-2xl bg-slate-200"
                  />
                ))}
              </div>
            )}

            {isError && (
              <p className="rounded-xl p-4 text-sm text-red-600">
                Couldn&apos;t load photos. Please try again.
              </p>
            )}

            {!isLoading && !isError && photos.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-8 text-center">
                <ImageOff size={28} className="text-slate-300" />
                <p className="mt-3 text-sm text-slate-500">
                  No photos yet. Upload your first one above.
                </p>
              </div>
            )}

            {!isLoading && !isError && photos.length > 0 && (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="group relative overflow-hidden rounded-2xl"
                  >
                    <img
                      src={photo.photo_url}
                      alt="Residence"
                      className="h-40 w-full object-cover transition group-hover:brightness-75"
                    />
                    <button
                      onClick={() => handleDelete(photo.id)}
                      disabled={deleteMutation.isPending}
                      className="absolute bottom-3 right-3 rounded-xl bg-red-500 p-2 text-white opacity-0 shadow-sm transition hover:bg-red-600 group-hover:opacity-100 disabled:opacity-50"
                      aria-label="Delete photo"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ─── COMPLETE SETUP ──────────────────────────────────────────────── */}
        <button
          onClick={handleFinish}
          disabled={isUploading}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-3xl bg-orange-500 px-4 py-3 font-medium text-white transition hover:bg-orange-600 disabled:opacity-50"
        >
          <ArrowLeft size={22} className="rotate-180" />
          Complete setup
        </button>
      </div>
    </div>
  );
}