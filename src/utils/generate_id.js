let id = 0;

/**
 * Generate a new number each time it is called.
 * /!\ Never check for an upper-bound. Please do not use if you can reach
 * `Number.MAX_VALUE`
 * @returns {number}
 */
export default function generateId() {
  return id++;
}
