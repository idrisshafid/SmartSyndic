import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getApartmentPhotos,
  createApartmentPhoto,
  deleteApartmentPhoto,
  setPrimaryApartmentPhoto,
} from "../services/apartments.service";

import type {
  ApiResponse, ApartmentPhoto, DeleteResponse,
} from "../types/apartments.types"

// =====================================
// GET PHOTOS
// =====================================
export const useApartmentPhotos = (apartmentId: string) => {
  return useQuery<ApiResponse<ApartmentPhoto[]>>({
    queryKey: ["apartment-photos", apartmentId],
    queryFn: () => getApartmentPhotos(apartmentId),
    enabled: !!apartmentId,
  });
};

// =====================================
// UPLOAD PHOTO
// =====================================
export const useCreateApartmentPhoto = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<ApartmentPhoto>,
    Error,
    { apartmentId: string; formData: FormData }
  >({
    mutationFn: ({ apartmentId, formData }) =>
      createApartmentPhoto(apartmentId, formData),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["apartment-photos", variables.apartmentId],
      });
    },
  });
};

// =====================================
// DELETE PHOTO
// =====================================
export const useDeleteApartmentPhoto = () => {
  const queryClient = useQueryClient();

  return useMutation<
    DeleteResponse,
    Error,
    { apartmentId: string; photoId: string }
  >({
    mutationFn: ({ photoId }) =>
      deleteApartmentPhoto( photoId),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["apartment-photos", variables.apartmentId],
      });
    },
  });
};

// =====================================
// SET PRIMARY PHOTO
// The API only takes a photoId (no apartment id in that route) — we
// still require `apartmentId` here purely so we know which cache to
// invalidate afterward, same pattern used for residence photos earlier.
// =====================================
export const useSetPrimaryApartmentPhoto = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<ApartmentPhoto>,
    Error,
    { apartmentId: string; photoId: string }
  >({
    mutationFn: ({ photoId }) => setPrimaryApartmentPhoto(photoId),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["apartment-photos", variables.apartmentId],
      });
    },
  });
};