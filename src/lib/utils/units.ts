const POUNDS_PER_KG = 2.20462;
const FEET_PER_CM = 0.0328084;
const INCHES_PER_FOOT = 12;

// convert height in CM to feet and inches
export function convertToImperialHeight(height: number) {
  const feet = Math.floor(height * FEET_PER_CM);
  const inches = Math.round((height * FEET_PER_CM - feet) * INCHES_PER_FOOT);
  return `${feet}'${inches}''`;
}

export function convertToImperialWeight(weight: number) {
  return Math.round(weight * POUNDS_PER_KG);
}
