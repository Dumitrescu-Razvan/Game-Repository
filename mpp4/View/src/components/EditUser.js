import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUser, editUser } from "../Service/Service";
import { TextField, Button, Typography, Container, Select, MenuItem } from "@mui/material";

function EditUser() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [username, setUsername] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [type_, setType_] = React.useState("");


    React.useEffect(() => {
        getUser(id).then((user) => {
            setUsername(user.username);
            setEmail(user.email);
            setPassword(user.password);
            setType_(user.type_);
        });
    }, [id]);

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    }
    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    }
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    }
    const handleType_Change = (event) => {
        setType_(event.target.value);
    }




    const handleSave = () => {
        if (username === "" || email === "" || password === "" || type_ === "") {
            alert("All fields are required");
            return;
        }
        const newUser = {
            id: id,
            username: username,
            email: email,
            password: password,
            type_: type_,
        };
        editUser(newUser);
        navigate("/users");

    };

    return (
        <Container sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", gap: '20px' }}>
            <Typography variant="h2" sx={{ fontSize: 40, color: "darkblue" }}>
                Edit User
            </Typography>
            <Typography variant="body1">User ID: {id}</Typography>
            <TextField
                label="Username"
                value={username}
                onChange={handleUsernameChange}
                variant="outlined"
                sx={{ fontSize: 20, color: "darkblue" }}
            />
            <TextField
                label="Email"
                value={email}
                onChange={handleEmailChange}
                variant="outlined"
                sx={{ fontSize: 20, color: "darkblue" }}
            />
            <TextField
                label="Password"
                value={password}
                onChange={handlePasswordChange}
                variant="outlined"
                sx={{ fontSize: 20, color: "darkblue" }}
            />
            <Select
                label="Type"
                value={type_}
                onChange={handleType_Change}
                variant="outlined"
                sx={{ fontSize: 20, color: "darkblue" }}
            >
                <MenuItem value={2}>Admin</MenuItem>
                <MenuItem value={0}>User</MenuItem>
                <MenuItem value={1}>Moderator</MenuItem>
            </Select>



            <Button onClick={handleSave} sx={{
                fontSize: 20,
                color: "darkblue",
                backgroundColor: "red",
                marginTop: 20,

            }} variant="contained" color="primary">Save</Button>
        </Container>
    );
}

export default EditUser;
