import React from "react";
import { Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { addCompany } from "../Service/Service";
import { useStyles } from "../styles/AddGameStyle";



function AddCompany() {
    const navigate = useNavigate();
    const classes = useStyles();
    const [name, setName] = React.useState("");
    const [location, setLocation] = React.useState("");

    const handleNameChange = (event) => {
        setName(event.target.value);
    }
    const handleLocationChange = (event) => {
        setLocation(event.target.value);
    }

    const handleSave = () => {
        console.log("Save clicked");
        if (name === "" || location === "") {
            alert("All fields are required");
            return;
        }
        const newCompany = {
            name: name,
            location: location,
        };
        console.log(newCompany);
        addCompany(newCompany);
        navigate("/companies");
    };

    return (
        <div className={classes.root}>
            <h2 className={classes.titleCell}>Add Game</h2>
            <TextField
                label="Name"
                value={name}
                onChange={handleNameChange}
                variant="outlined"
                className={classes.cell}
            />
            <TextField
                label="Location"
                value={location}
                onChange={handleLocationChange}
                variant="outlined"
                className={classes.cell}
            />
            <Button onClick={handleSave} className={classes.button}>Save</Button>
        </div>
    );
}
export default AddCompany;