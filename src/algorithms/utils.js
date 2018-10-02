/**
 * Intersects the domains of two sets. Outputing a new set of the intersection.
 * @param {Set<*>} set1
 * @param {Set<*>} set2
 * @returns {Set<*>} new set of the intersect of set1 and set2
 */
export const intersect = (set1, set2) => new Set([...set1].filter(value => set2.has(value)));
