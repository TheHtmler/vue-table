export const sortItem = (key, isAsc) => {
    return function(x, y) {
        if (isNaN(x[key])) {
            if (x[key] && y[key]) {
                if (x[key].toLowerCase() > y[key].toLowerCase()) return 1 * (isAsc ? 1 : -1);
                if (x[key].toLowerCase() < y[key].toLowerCase()) return -1 * (isAsc ? 1 : -1);
                return 0;
            }
        } else {
            return (x[key] - y[key]) * (isAsc ? 1 : -1);
        }
    }
}