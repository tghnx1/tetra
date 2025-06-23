// playButton.js
document.addEventListener('DOMContentLoaded', () => {
    const iframe = document.getElementById('vimeo-player');
    const player = new Vimeo.Player(iframe);
    const playButton = document.getElementById('play-button');

    // Debugging: Log the player instance
    console.log(player);
    // Listen for the play event
    player.on('play', () => {
        // Hide the play button when the video starts playing
        playButton.style.display = 'none';
    });


    // Play video on button click
    playButton.addEventListener('click', () => {
        player.play().then(() => {
            player.setVolume(1);
        }).catch(error => {
            console.warn('Autoplay blocked, retrying with muted video:', error);
        });
    });
});