import { useState } from "react";

import { useResidencePhotos, useUploadResidencePhoto } from "../hooks/useResidencePhotos";

interface PhotoGalleryProps {
  residenceId: string;
}

// NOTE: the backend only exposes `/residence/:id/photos` for
// GET/POST, with no :photoId segment — so there's no way to target
// or replace a single photo from the gallery. This component only
// supports adding new photos. If you need per-photo replace/delete,
// the API needs a route like `/residence/:id/photos/:photoId`.
export default function PhotoGallery({ residenceId }: PhotoGalleryProps) {
  const { data, isLoading, isError } = useResidencePhotos(residenceId);
  const uploadMutation = useUploadResidencePhoto();

  const [isAdding, setIsAdding] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const resetForm = () => {
    setIsAdding(false);
    setSelectedFile(null);
    setPreview(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("photo", selectedFile);

    uploadMutation.mutate(
      { id: residenceId, formData },
      { onSuccess: resetForm }
    );
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-44 animate-pulse rounded-2xl bg-slate-200"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <p className="rounded-xl bg-red-50 p-4 text-sm text-red-600">
        Couldn&apos;t load photos. Please try again.
      </p>
    );
  }

  const photos = data?.data ?? [];

  return (
    <div className="space-y-6">
      {photos.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-12 text-center">
          <p className="text-sm text-slate-500">No photos yet.</p>
          <p className="mt-1 text-xs text-slate-400">
            Add your first photo to showcase this residence.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {photos.map((photo) => (
            <img
              key={photo.id}
              src={photo.url}
              alt="Residence"
              className="h-44 w-full rounded-2xl object-cover"
            />
          ))}
        </div>
      )}

      {!isAdding && (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full rounded-xl border border-dashed border-slate-300 py-3 text-sm font-medium text-slate-500 transition hover:border-orange-400 hover:text-orange-600"
        >
          + Add Photo
        </button>
      )}

      {isAdding && (
        <div className="space-y-5 rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">
              Add Photo
            </h3>
            <button
              onClick={resetForm}
              className="text-sm text-slate-400 hover:text-slate-600"
            >
              Cancel
            </button>
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-slate-500 file:mr-4 file:rounded-xl file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-slate-700 hover:file:bg-slate-200"
          />

          {preview && (
            <div>
              <p className="mb-2 text-sm text-slate-500">Preview</p>
              <img
                src={preview}
                alt="Selected preview"
                className="h-40 w-60 rounded-xl object-cover"
              />
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploadMutation.isPending}
            className="w-full rounded-xl bg-orange-500 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:opacity-50"
          >
            {uploadMutation.isPending ? "Uploading..." : "Add Photo"}
          </button>
        </div>
      )}
    </div>
  );
}