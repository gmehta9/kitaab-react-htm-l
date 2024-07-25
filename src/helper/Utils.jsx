export const MEDIA_URL = process.env.REACT_APP_MEDIA_URL

export const replaceLogo = (e) => {
    e.target.src = process.env.REACT_APP_MEDIA_LOCAL_URL + `placeholder.jpg'`
}

export const debounce = (fn, ms = 300) => {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), ms);
    };
};