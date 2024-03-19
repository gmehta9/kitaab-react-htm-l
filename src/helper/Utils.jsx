export const MEDIA_URL = 'https://tinytyni.com/KbAPI/API_URL/public/storage/'

// REACT_APP_MEDIA_API_URL="https://knowledgecapita.com/API_URL/public/storage/"

export const replaceLogo = (e) => {
    e.target.src = './assets/images/placeholder.jpg'
}

export const debounce = (fn, ms = 300) => {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), ms);
    };
};