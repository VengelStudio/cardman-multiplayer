//todo card objects
//usage: useCard(player, EXAMPLE_CARD)

const EXAMPLE_CARD = {
    title: 'title',
    description: 'description',
    image: 'path_to_image',
    use: (field, keyboardA, keyboardB) => {
        cardAction()
        return field, keyboardA, keyboardB
    }
}
