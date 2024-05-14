import axios from 'axios';

const API_URL = 'http://localhost:3001';

export const addGame = async (game) => {
    const response = await axios.post(`${API_URL}/games`, game);
    return response.data;
}

export const editGame = async (game) => {
    const response = await axios.put(`${API_URL}/games/${game.id}`, game);
    return response.data;
}

export const deleteGame = async (id) => {
    const response = await axios.delete(`${API_URL}/games/${id}`);
    return response.data;
}

export const getGames = async () => {
        const response = await axios.get(`${API_URL}/games`);
        return response.data;
}
export const getGame = async (id) => {
    const response = await axios.get(`${API_URL}/games/${id}`);
    console.log(response.data);
    return response.data;
}

export const getCompanies = async () => {
    const response = await axios.get(`${API_URL}/companies`);
    return response.data;
}

export const getCompany = async (id) => {
    const response = await axios.get(`${API_URL}/companies/${id}`);
    return response.data;
}

export const addCompany = async (company) => {
    const response = await axios.post(`${API_URL}/companies`, company);
    return response.data;
}

export const editCompany = async (company) => {
    const response = await axios.put(`${API_URL}/companies/${company.id}`, company);
    return response.data;
}

export const deleteCompany = async (id) => {
    const response = await axios.delete(`${API_URL}/companies/${id}`);
    return response.data;
}

export const login = async (user) => {

        const response = await axios.post(`${API_URL}/login`, user);
        console.log(response.data);

        if(response.data === 'Wrong username' || response.data === 'Wrong password'){
            return {succes: false, error: response.data};
        }

        const token = response.data;
        localStorage.setItem('token', token);
        return {succes: true, token: token};

}

export const register = async (user) => {
    const response = await axios.post(`${API_URL}/register`, user)
    return response.data;
}

// export const setGames = async (games) => {
//     const response = await axios.post(`${API_URL}/setgames`, games);
//     return response.data;
// }
