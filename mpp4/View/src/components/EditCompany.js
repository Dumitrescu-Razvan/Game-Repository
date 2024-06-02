import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCompany, editCompany } from "../Service/Service";
import { TextField, Button, Typography, Container } from "@mui/material";

function EditCompany() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [name, setName] = React.useState("");
    const [location, setLocation] = React.useState("");


    React.useEffect(() => {
        getCompany(id).then((company) => {
            setName(company.name);
            setLocation(company.location);
        });
    }, [id]);

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
            id: id,
            name: name,
            location: location,
        };
        editCompany(newCompany);
        navigate("/companies");
    };

    return (
        <Container sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}>
            <Typography variant="h2" sx={{ fontSize: 20, color: "darkblue" }}>
                Edit Company
            </Typography>
            <Typography variant="body1">Company ID: {id}</Typography>
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
                marginTop: 20,

            }} variant="contained" color="primary">Save</Button>
        </Container>
    );
}

export default EditCompany;
