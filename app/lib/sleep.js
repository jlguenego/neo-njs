module.exports = function sleep(duration) {
    return new Promise((resolve, reject) => {
        setTimeout(() => { 
            resolve();
        }, duration);
    });
}