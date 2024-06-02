import React from "react";
import { Button, Container, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { addCompany } from "../Service/Service";



function AddCompany() {
    const navigate = useNavigate();
    const [name, setName] = React.useState("");
    const [location, setLocation] = React.useState("");

    const handleNameChange = (event) => {
        setName(event.target.value);
    }
    const handleLocationChange = (event) => {
        setLocation(event.target.value);
    }

    const handleSave = () => {
        if (name === "" || location === "") {
            alert("All fields are required");
            return;
        }
        const newCompany = {
            name: name,
            location: location,
        };
        addCompany(newCompany);
        navigate("/companies");
    };

    return (
        <Container
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "20px",
                marginTop: "20px"
            }}
        >
            <Typography variant="h2" sx={{ fontSize: 50, color: "darkblue" }}>
                Add Company
            </Typography>
            <TextField
                label="Name"
                value={name}
                onChange={handleNameChange}
                variant="outlined"
                sx={{ fontSize: 20, color: "darkblue" }}
            />
            <TextField
                label="Location"
                value={location}
                onChange={handleLocationChange}
                variant="outlined"
                sx={{ fontSize: 20, color: "darkblue" }}
            />
            <Button onClick={handleSave} sx={{
                fontSize: 20,
                color: "darkblue",
                backgroundColor: "red",
                marginTop: "10px"
            }} >Save</Button>
            <Button onClick={() => navigate("/companies")} sx={{
                fontSize: 20, 
                color: "red",
                backgroundColor: "blue",
                marginTop: "10px"
                }}>Cancel</Button>


        </Container>
    );
}
export default AddCompany;