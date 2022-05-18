import bcrypt from 'bcrypt'

/**
 * It hashes a string
 *
 * @param {String} string
 *
 * @returns {Promise<String>}
 */
export const hashString = async ({ str, rounds = 3 }) => {
  const hashedString = await bcrypt.hash(str, rounds)

  return hashedString
}
