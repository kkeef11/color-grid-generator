import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { getDistinctColors } from "../api/colors";
import type { ColorAPIResponse } from "../types/colors";

export function useColors(
  options?: UseMutationOptions<
    ColorAPIResponse[],
    Error,
    { saturation: number; lightness: number }
  >
) {
  return useMutation({
    mutationFn: ({ saturation, lightness }) =>
      getDistinctColors({ saturation, lightness }),
    ...options,
  });
}
