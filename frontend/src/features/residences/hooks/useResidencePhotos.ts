import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getResidencePhotos,
  uploadResidencePhoto,
  deleteResidencePhoto,
} from "../services/residence.service";

import type { ApiResponse, ResidencePhoto } from "../types/residence.types";

// =====================================
// GET PHOTOS
// =====================================
export const useResidencePhotos = (id: string) => {
  return useQuery<ApiResponse<ResidencePhoto[]>>({
    queryKey: ["residence-photos", id],
    queryFn: () => getResidencePhotos(id),
    enabled: !!id,
  });
};

// =====================================
// UPLOAD PHOTO
// =====================================
export const useUploadResidencePhoto = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<ResidencePhoto>,
    Error,
    { id: string; formData: FormData }
  >({
    mutationFn: ({ id, formData }) => uploadResidencePhoto(id, formData),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["residence-photos", variables.id],
      });
    },
  });
};

// =====================================
// DELETE PHOTO
// =====================================
export const useDeleteResidencePhoto = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<null>,
    Error,
    { id: string; photoId: string }
  >({
    mutationFn: ({  photoId }) => deleteResidencePhoto( photoId),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["residence-photos", variables.id],
      });
    },
  });
};