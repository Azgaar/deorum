const boxMullerTransform = () => {
  const u1 = Math.random();
  const u2 = Math.random();

  const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  return z;
};

const getRandomNormal = (mean: number, deviation: number) => {
  const z = boxMullerTransform();

  return z * deviation + mean;
};

export const getRandomNumber = ({
  mean,
  deviation,
  min,
  max
}: {
  mean: number;
  deviation: number;
  min?: number;
  max?: number;
}) => {
  const value = Math.round(getRandomNormal(mean, deviation));
  if (min && value < min) return min;
  if (max && value > max) return max;
  return value;
};
