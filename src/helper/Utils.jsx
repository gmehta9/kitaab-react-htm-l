import axios from "axios";
import { apiUrl } from "../axios/axios-config";
import Auth from "../auth/Auth";

export const MEDIA_URL = process.env.REACT_APP_MEDIA_URL

export const replaceLogo = (e) => {
    e.target.src = process.env.REACT_APP_MEDIA_LOCAL_URL + `placeholder.jpg`
}

export const debounce = (fn, ms = 300) => {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), ms);
    };
};

export const FileUploadhandler = async (file, uploadKeyName) => {
    const formData = new FormData()
    formData.append('type', uploadKeyName)
    formData.append('file', file)

    const token = Auth.token();
    return axios.post(apiUrl + 'upload-image', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
        },
    }).then((res) => {
        return res.data.image
    }).catch((error) => {

    });
}

export const validateFile = (file, newAllowedTypes = []) => {
    const allowedTypes = ["image/jpg", "image/png", "image/jpeg", ...newAllowedTypes];
    const maxSize = 5 * 1024 * 1024; // 1MB

    if (!allowedTypes.includes(file.type)) {
        const msg = newAllowedTypes.length === 0 ? ' and JPEG' : ', JPEG, MS Doc, Txt, PPT and PDF'
        alert(`Invalid file type. Only JPG, PNG${msg} are allowed.`);
        return false;
    }
    if (file.size > maxSize) {
        alert("File size exceeds the maximum limit of 1MB.");
        return false;
    }
    return true;
};

export function getInitials(name) {
    const nameParts = name.split(' ');

    if (nameParts.length === 1) {
        // If only one part, return the first letter
        return nameParts[0][0].toUpperCase();
    } else {
        // If multiple parts, return the first letter of each of the first two parts
        return nameParts[0][0].toUpperCase() + nameParts[1][0].toUpperCase();
    }
}