import type { ColorAPIResponse } from "../types/colors";

export const getDistinctColors = async ({
  saturation,
  lightness,
  step = 5,
  maxConsecutiveRepeats = 10,
}: {
  saturation: number;
  lightness: number;
  step?: number;
  maxConsecutiveRepeats?: number;
}) => {
  const seenNames = new Set<string>();
  const distinctColors: ColorAPIResponse[] = [];
  let duplicateCount = 0;

  for (let hue = 0; hue < 360; hue += step) {
    const url = `https://www.thecolorapi.com/id?hsl=${hue},${saturation}%,${lightness}%`;
    const res = await fetch(url);
    const color = await res.json();
    const name = color.name.value;

    if (!seenNames.has(name)) {
      seenNames.add(name);
      distinctColors.push(color);
      duplicateCount = 0;
    } else {
      duplicateCount += 1;
    }

    if (duplicateCount >= maxConsecutiveRepeats) break;
  }

  return distinctColors;
};
