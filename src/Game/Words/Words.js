module.exports = {
  displayWord: ({ word = null, guessed = [] }) => {
    //todo force uppercase
    let result = ''
    console.log('[DEBUG]: ' + word)
    let wordArray = word.toUpperCase().split('')
    for (let i = 0; i < wordArray.length; i++) {
      if (guessed.includes(wordArray[i])) {
        result += wordArray[i] + ' '
      } else {
        result += '_ '
      }
    }
    return result.charAt(0).toUpperCase() + result.slice(1, result.length - 1)
  },

  words: [
    { word: 'Bicycle', definition: 'Rowerek' },
    { word: 'Banana', definition: 'Mmm smaczny owocek' },
    { word: 'Steam', definition: 'Wylatuje z e-szluga' },
    { word: 'Rope', definition: 'No się możesz powiesić na tym' }
  ]
}
