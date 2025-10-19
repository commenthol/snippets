/**
 * get class descriptors
 * @param {Class} cls
 * @returns {object} descriptors
 */
export const getClassDescriptors = (cls) =>
  Object.getOwnPropertyDescriptors(cls?.prototype.constructor)

const EXCLUDE = ['length', 'name', 'prototype']
/**
 * get static members of a class
 * @param {Class} cls
 * @returns {string[]}
 */
export const getStaticMembers = (cls) => {
  const desc = Object.getOwnPropertyDescriptors(cls?.prototype.constructor)
  return Object.keys(desc).filter((member) => !EXCLUDE.includes(member))
}
