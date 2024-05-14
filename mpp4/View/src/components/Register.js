import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../Service/Service';
import { Button, TextField, Box, ButtonGroup } from '@mui/material';

function Register() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = async (event) => {
        if(password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        if(password.length < 8) {
            alert("Password must be at least 8 characters");
            return;
        }

        if(username === '' || password === '' || email === '') {
            alert("All fields are required");
            return;
        }

        const user = {
            username: username,
            password: password,
            email: email,
        };

        console.log(user);
        register(user);
        navigate('/login');


        

       
    };

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off" sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            alignItems: 'center',
        }}
        >
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
            <TextField
                label="Confirm Password"
                type="password"
                variant="outlined"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <TextField
                label="Email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <ButtonGroup sx={{ display: 'flex', justifyContent: 'centre', align: 'center' }}>
            <Button variant="contained" onClick={handleSubmit}>Submit</Button>
            <Button variant="contained" onClick={() => navigate('/login')}>Login</Button>
            </ButtonGroup>
        </Box>
    );
}
export default Register;