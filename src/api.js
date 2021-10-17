import * as constants from './constants';

export const getItems = async (offset = 0, limit = 5, name) => {
		let response;
    try {
        let url = `${constants.URL_GET_ITEMS}?limit=${limit}&offset=${offset}`;
        if (name) {
            url+= `&name=${name.trim().replace(/\s+/g, '+')}`;
        }

        response = await fetch(url);
    } catch (error) {
        throw new Error(error.message);
    }
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    return response.json();
};

export const getItemByID= async (id) => {
		let response;
    try {
        response = await fetch(`${constants.URL_GET_ITEMS}/${id}`);
    } catch (error) {
        throw new Error(error.message);
    }
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    return response.json();
};
