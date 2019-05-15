function startGame() {
    let elem = document.querySelector('.pulse');
    let animation = elem.animate({
        opacity: [0.5, 1],
        transform: ['scale(0.5)', 'scale(1)'],
    }, {
            direction: 'alternate',
            duration: 500,
            iterations: Infinity,
        });
}