new TypeIt("#lyfzyx", {
        loop: true,
        cursorSpeed: 1000,
        speed: 100
    })
    .type("Yifan && Yixin")
    .pause(2000)
    .delete(null, {
        delay: 500
    })
    .type("Ready to brave the odds toward the bright future together...")
    .pause(3000)
    .go();

new TypeIt('#talkTo', {
    lifeLike: true,
    cursorSpeed: 1000,
    waitUntilVisible: true,
    speed: 100
}).go();