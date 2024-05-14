import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Box } from '@mui/material';

function Register() {
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
            <Button type="submit" variant="contained">Submit</Button>
        </Box>
    );
}
export default Register;