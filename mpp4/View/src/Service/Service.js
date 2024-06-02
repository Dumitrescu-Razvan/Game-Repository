import axios from 'axios';

const API_URL = 'http://localhost:3001';

export const addGame = async (game) => {
    const response = await axios.post(`${API_URL}/games`, game, {withCredentials: true});
    return response.data;
}

export const editGame = async (game) => {
    const response = await axios.put(`${API_URL}/games/${game.id}`, game, {withCredentials: true});
    return response.data;
}

export const deleteGame = async (id) => {
    const response = await axios.delete(`${API_URL}/games/${id}`, {withCredentials: true});
    return response.data;
}

export const getGames = async () => {
        const response = await axios.get(`${API_URL}/games`, {withCredentials: true});
        return response.data;
}
export const getGame = async (id) => {
    const response = await axios.get(`${API_URL}/games/${id}`, {withCredentials: true});
    console.log(response.data);
    return response.data;
}

export const getCompanies = async () => {
    const response = await axios.get(`${API_URL}/companies`, {withCredentials: true});
    return response.data;
}

export const getCompany = async (id) => {
    const response = await axios.get(`${API_URL}/companies/${id}`, {withCredentials: true});
    return response.data;
}

export const addCompany = async (company) => {
    const response = await axios.post(`${API_URL}/companies`, company, {withCredentials: true});
    return response.data;
}

export const editCompany = async (company) => {
    const response = await axios.put(`${API_URL}/companies/${company.id}`, company, {withCredentials: true});
    return response.data;
}

export const getUsers = async () => {
    const response = await axios.get(`${API_URL}/users`, {withCredentials: true});
    return response.data;
}

export const getUser = async (id) => {
    const response = await axios.get(`${API_URL}/users/${id}`, {withCredentials: true});
    return response.data;
}

export const editUser = async (user) => {
    const response = await axios.put(`${API_URL}/users/${user.id}`, user, {withCredentials: true});
    return response.data;
}

export const deleteUser = async (id) => {
    const response = await axios.delete(`${API_URL}/users/${id}`, {withCredentials: true});
    return response.data;
}


export const deleteCompany = async (id) => {
    const response = await axios.delete(`${API_URL}/companies/${id}`, {withCredentials: true});
    return response.data;
}

export const login = async (user) => {

        const response = await axios.post(`${API_URL}/login`, user, {withCredentials: true});
        if(response.data === 'Wrong username' || response.data === 'Wrong password'){
            return {succes: false, error: response.data};
        }
        const token = response.data[0];
        localStorage.setItem('token', token);
        localStorage.setItem('role', response.data[1]);
        localStorage.setItem('username', user.username);
        localStorage.setItem('userId', response.data.userId);
        return {succes: true, token: token};

}

export const register = async (user) => {
    const response = await axios.post(`${API_URL}/register`, user)
    return response.data;
}

export const authToken = async () => {
    let token = localStorage.getItem('token');
    let username = localStorage.getItem('username');
    const response = await axios.post(`${API_URL}/authorize`, {token, username});
    if(response.data === 'Authorized'){
            return 'Authorized';
        }
    else{
        return 'Unauthorized';
    }
}
// export const setGames = async (games) => {
//     const response = await axios.post(`${API_URL}/setgames`, games);
//     return response.data;
// }
