import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

/**
 * It hashes a string
 *
 * @param {Object} args
 * @param {String} args.str
 * @param {Number} [args.rounds = 3]
 *
 * @returns {Promise<String>}
 */
export const hashString = async ({ str, rounds = 3 }) => {
  const hashedString = await bcrypt.hash(str, rounds)

  return hashedString
}

/**
 * It generates a jwt with the provided data
 *
 * @param {Object} args
 * @param {Object} args.data
 * @param {Object} args.jwtOptions
 *
 * @returns {String}
 */
export const generateJwt = ({ data, jwtOptions = {} }) => {
  const token = jwt.sign(data, process.env.JWT_SECRET, { ...jwtOptions, expiresIn: '2 days' })

  return token
}
