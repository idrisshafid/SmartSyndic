import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Trash2, Upload, X, ImageOff } from "lucide-react";

import {
  useResidencePhotos,
  useUploadResidencePhoto,
  useDeleteResidencePhoto,
} from "../hooks/useResidencePhotos";

export default function ResidencePhotosPage() {
  const { id } = useParams();

  const { data, isLoading, isError } = useResidencePhotos(id ?? "");
  const uploadMutation = useUploadResidencePhoto();
  const deleteMutation = useDeleteResidencePhoto();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  if (!id) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="font-medium">Residence not found.</p>
      </div>
    );
  }

  const photos = data?.data ?? [];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreview(null);
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("photo", selectedFile);

    uploadMutation.mutate(
      { id, formData },
      { onSuccess: clearSelection }
    );
  };

  const handleDelete = (photoId: string) => {
    if (!window.confirm("Remove this photo?")) return;
    deleteMutation.mutate({ id, photoId });
  };

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-4xl px-6">
        <Link
          to={`/syndic/residences/${id}/detail`}
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium transition"
        >
          <ArrowLeft size={16} />
          Back to residence
        </Link>

        <div className="rounded-3xl p-8 shadow-sm border">
          <h1 className="text-2xl font-bold">Residence Photos</h1>
          <p className="mt-1 text-sm">
            Add clear, well-lit photos to help residents recognize the property.
          </p>

          {/* UPLOAD */}
          <div className="mt-8 rounded-2xl border border-dashed p-6">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between">
              <label className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition sm:w-auto">
                <Upload size={16} />
                Choose file
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {preview && (
                <div className="relative">
                  <img
                    src={preview}
                    alt="Preview"
                    className="h-20 w-28 rounded-xl object-cover"
                  />
                  <button
                    onClick={clearSelection}
                    className="absolute -right-2 -top-2 rounded-full p-1"
                    aria-label="Remove selected file"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}

              <button
                onClick={handleUpload}
                disabled={!selectedFile || uploadMutation.isPending}
                className="w-full rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-50 sm:w-auto"
              >
                {uploadMutation.isPending ? "Uploading..." : "Upload Photo"}
              </button>
            </div>

            {uploadMutation.isError && (
              <p className="mt-3 text-sm">
                Upload failed. Please try again.
              </p>
            )}
          </div>

          {/* GALLERY */}
          <div className="mt-8">
            {isLoading && (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="h-40 animate-pulse rounded-2xl"
                  />
                ))}
              </div>
            )}

            {isError && (
              <p className="rounded-xl p-4 text-sm">
                Couldn&apos;t load photos. Please try again.
              </p>
            )}

            {!isLoading && !isError && photos.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-12 text-center">
                <ImageOff size={28} />
                <p className="mt-3 text-sm">
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

        <Link
          to={`/syndic/residences/${id}/detail`}
          className="mt-3 inline-flex items-center gap-1.5 rounded-3xl bg-orange-500 px-4 py-3 font-medium text-white transition hover:bg-orange-600"
        >
          <ArrowLeft size={22} />
          Complete setup
        </Link>
      </div>
    </div>
  );
}