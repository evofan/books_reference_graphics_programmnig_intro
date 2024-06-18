/**
 * Returns a random value.
 * @param min
 * @param max
 * @returns Above the minimum value and below the maximum value.
 */
export const randomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
