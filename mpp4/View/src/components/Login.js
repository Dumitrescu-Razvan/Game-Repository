import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Box } from '@mui/material';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event) => {
        if(username === '' || password === '') {
            alert("All fields are required");
            return;
        }

        const user = {
            username: username,
            password: password,
        };

        
    }

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off" sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            alignItems: 'center',
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
            <Button type="submit" variant="contained">Submit</Button>
        </Box>
    );
}

export default Login;