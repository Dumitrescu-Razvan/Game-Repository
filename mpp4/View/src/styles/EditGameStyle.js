import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
    },
    cell: {
        backgroundColor: 'lightgray',
        fontSize: 20,
        color: 'darkblue',
        textAlign: 'center',
    },
    titleCell: {
        fontSize: 18,
        color: 'green',
        textAlign: 'center',
    },
    clickable: {
        cursor: 'pointer',
    },
    button: {
        color: 'green',
        cursor: 'pointer',
    },
});