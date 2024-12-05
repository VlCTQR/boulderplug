export const calculateTimeLeft = (saleDate) => {
    const now = new Date();
    const timeDiff = new Date(saleDate) - now;

    let timeLeft = '';
    let timeClass = '';

    if (timeDiff > 0) {
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
        const seconds = Math.floor((timeDiff / 1000) % 60);

        if (days > 0) {
            timeLeft = `${days} day${days > 1 ? 's' : ''} and ${hours} hour${hours !== 1 ? 's' : ''}`;
            timeClass = 'days';
        } else if (hours > 0) {
            timeLeft = `${hours} hour${hours !== 1 ? 's' : ''} and ${minutes} minute${minutes !== 1 ? 's' : ''}`;
            timeClass = 'hours';
        } else if (minutes > 0) {
            timeLeft = `${minutes} minute${minutes !== 1 ? 's' : ''} and ${seconds} second${seconds !== 1 ? 's' : ''}`;
            timeClass = 'minutes';
        } else {
            timeLeft = `${seconds} second${seconds !== 1 ? 's' : ''}`;
            timeClass = 'seconds';
        }

        return { timeLeft, timeClass, priceLabel: 'Current price' };
    } else {
        return { timeLeft: 'Auction ended', timeClass: 'ended', priceLabel: 'Sold for' };
    }
};
