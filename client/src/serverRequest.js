const PORT = 3000;
const PROTOCOL = "http://";
const HOST = "localhost";
const URL = `${PROTOCOL}${HOST}:${PORT}`;

export const fetchDefault = async (route, method, body) => {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
    };

    if (body !== null) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(`${URL}/${route}`, options);
    const data = await response.json();

    return {
        "response": response,
        "data": data
    };
};


export const fetchWithAuth = async (route, method, token, body) => {
    const options = {
        method: method,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
    };

    if (body !== null) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(`${URL}/${route}`, options);
    const data = await response.json();

    return {
        "response": response,
        "data": data
    };
};




