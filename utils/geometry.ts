
/**
 * Calculates the angle in degrees (0-360) from the center of a box to a pointer position.
 * 0 degrees is at the 12 o'clock position.
 */
export const getAngleFromPoint = (
  x: number,
  y: number,
  centerX: number,
  centerY: number
): number => {
  const dx = x - centerX;
  const dy = y - centerY;
  
  // atan2 returns angle in radians from positive x-axis.
  // We want 0 at top (y-axis) and clockwise increase.
  let theta = Math.atan2(dy, dx); 
  let degrees = (theta * 180) / Math.PI + 90;
  
  if (degrees < 0) degrees += 360;
  return degrees;
};

/**
 * Converts a duration in minutes (0-60) to SVG arc path data.
 */
export const getArcPath = (minutes: number, radius: number): string => {
  if (minutes <= 0) return "";
  if (minutes >= 60) {
    // Return a full circle if 60 minutes
    return `M 0,${-radius} A ${radius},${radius} 0 1,1 -0.01,${-radius} Z`;
  }

  const degrees = (minutes / 60) * 360;
  const radians = ((degrees - 90) * Math.PI) / 180.0;
  
  const x = radius * Math.cos(radians);
  const y = radius * Math.sin(radians);
  
  const largeArcFlag = degrees > 180 ? 1 : 0;
  
  // Start at top (0, -radius), arc to (x, y), then line to center (0, 0), then close.
  return `M 0,0 L 0,${-radius} A ${radius},${radius} 0 ${largeArcFlag},1 ${x},${y} Z`;
};
