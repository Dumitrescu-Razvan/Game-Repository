import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles({
    header: {
        color: 'red',
        fontSize: 32,
        fontFamily: 'Arial',
        textAlign: 'center',
        },
    table: {
        margin: '0 auto',
        maxWidth: '1000px',
    },
    cell: {
        backgroundColor: 'white',
        
    },
    titleCell: {
        backgroundColor: 'lightgray',
        fontSize: 32,
        color: 'blue',
        textAlign: 'center',
        fontFamily: 'Arial',
        align: 'right',

    },
    clickable: {
        cursor: 'pointer',
    },
    AddButton: {
        cursor: 'pointer',
        
    },
    ViewButton: {
        cursor: 'pointer',
    },
    EditButton: {
        cursor: 'pointer',
    },
    DeleteButton: {
        cursor: 'pointer',
    },
});