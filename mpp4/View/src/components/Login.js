import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Box, ButtonGroup } from '@mui/material';
import { login } from '../Service/Service';

function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event) => {
        if (username === '' || password === '') {
            alert("All fields are required");
            return;
        }

        const user = {
            username: username,
            password: password,
        };
        console.log(user);
        login(user).then((response) => {
           if(response.succes){
               navigate('/games');
           }else{
            alert(response.error);
              }
        }).catch((error) => {
            console.log(error);
            alert("An error occurred");
        });

        // const token = jwt.sign({username: username}, 'secret', {expiresIn: '1h'});
        // return token;



    }

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off" sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <TextField
                label="Username"
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
                label="Password"
                type="password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <ButtonGroup sx={{ display: 'flex', justifyContent: 'centre', align: 'center' }}>
                <Button variant="contained" onClick={handleSubmit}>Submit</Button>
                <Button variant="contained" onClick={() => navigate('/register')}>Register</Button>
            </ButtonGroup>
        </Box>
    );
}

export default Login;