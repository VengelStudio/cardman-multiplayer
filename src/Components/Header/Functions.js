const roundAndConvertVolume = volume => {
    return Math.round((10 * parseInt(volume)) / 100) / 10
}

module.exports = { roundAndConvertVolume }
