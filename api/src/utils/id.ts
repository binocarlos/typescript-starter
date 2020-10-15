import randomstring from 'randomstring'

export const getRandomId = ():string => randomstring.generate({
  length: 16,
  charset: 'alphabetic',
  capitalization: 'lowercase',
})

export default {
  getRandomId,
}