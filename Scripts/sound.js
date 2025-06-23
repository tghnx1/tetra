window.addEventListener('DOMContentLoaded', () => {
    const iframe = document.getElementById('vimeo-player');
    const player = new Vimeo.Player(iframe);
    const soundToggle = document.getElementById('sound-toggle');

    let userPaused = false; // Track if the user intentionally paused the video
    // Function to attempt video playback
    const attemptPlay = (volume) => {
        console.log(`Attempting to play video with volume: ${volume}`);
        player.setVolume(volume).then(() => {
            return player.play();
        }).then(() => {
            console.log(`Video is playing with volume: ${volume}`);
        }).catch(error => {
            console.error(`Failed to play video with volume ${volume}:`, error);
            if (volume > 0) {
                console.warn('Retrying autoplay muted...');
                attemptPlay(0); // Retry with muted playback
            }
        });
    };

    attemptPlay(1);

    // Log when the video is paused
    player.on('pause', () => {
        if (!userPaused) {
            console.warn('Video was paused unexpectedly. Retrying playback...');
            attemptPlay(0); // Retry muted playback
        } else {
            console.log('The video was paused by the user.');
        }
        userPaused = true; // Set when the user pauses the video
    });

    // Log when the video has ended
    player.on('ended', () => {
        console.log('The video has stopped (ended).');
    });

    // Track user-initiated pause
    player.on('play', () => {
        userPaused = false; // Reset when playback starts
    });

    // Sound toggle button
    soundToggle.addEventListener('click', () => {
        player.getVolume().then(currentVolume => {
            if (currentVolume === 0) {
                // Just unmute
                player.setVolume(1).then(() => {
                    soundToggle.textContent = '🔊';
                }).catch(error => {
                    console.error('Error unmuting the video:', error);
                });
            } else {
                // Mute
                player.setVolume(0).then(() => {
                    soundToggle.textContent = '🔇';
                }).catch(error => {
                    console.error('Error muting the video:', error);
                    attemptPlay(0);
                });
            }
        }).catch(error => {
            console.error('Error getting volume:', error);
        });
    });
});
