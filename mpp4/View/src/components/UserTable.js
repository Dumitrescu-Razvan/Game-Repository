import React, { useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, ButtonGroup, Typography, TableSortLabel, Container, TablePagination } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { deleteUser, getUsers } from '../Service/Service'; // Import the necessary functions from the service file

function UserTable() {
    const navigate = useNavigate();
    const columns = [
        { id: 'id', label: 'ID' },
        { id: 'username', label: 'Username' },
        { id: 'email', label: 'Email' },
        { id: 'password', label: 'Password'},
        { id: 'type_', label: 'Role' },

    ];
    const [order, setOrder] = React.useState('asc');
    const [sortedData, setSortedData] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [selectedRow, setSelectedRow] = React.useState(null);
    const [serverStatus, setServerStatus] = React.useState(false);
    const [userType, setUserType] = React.useState('user'); 

    // src/components/VideoGameTable.js

    useEffect(() => {
        setUserType(parseInt(localStorage.getItem('role')));
        getUsers()
            .then((data) => {
                setSortedData(data);
            })
            .catch((error) => {
                console.error('Network error:', error);
            });
    }, []);

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:3002');

        ws.onopen = () => {
            console.log('Websocket connected');
            setServerStatus(true);
        };
        ws.onerror = (event) => {
            console.error('Websocket error:', event);
        }
        ws.onclose = (event) => {
            console.log('Websocket closed:', event);
            setServerStatus(false);
        }


        return () => ws.close();
    }, []);


    const createSortHandler = (property) => {
        const isAsc = order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        const sorted = [...sortedData].sort((a, b) => (a[property] > b[property] ? 1 : -1) * (isAsc ? 1 : -1));
        setSortedData(sorted);
        setPage(0); // Reset page to the first page after sorting
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleRowClick = (id) => {
        setSelectedRow(selectedRow === id ? null : id);
    };


    const handleViewClick = (id) => {
        navigate(`/user/${id}`);
    };

    const handleEditClick = (id) => {
        navigate(`/edituser/${id}`);
    };

    const handleDeleteClick = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            await deleteUser(id); // Call the new deleteCompany function from the service
            const data = await getUsers(); // Fetch updated data after deletion
            setSortedData([...data]);
        }
        selectedRow === id && setSelectedRow(null);
    };

    const handleRowNumberChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeTable = async () => {
        navigate('/games');
    };


    return (
        <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <header sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',  color: 'red' }}>
                <h1>Users</h1>
                {!serverStatus && <h2>Server is offline</h2>}

            </header>

            <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', position: 'relative', top: '50px' }}>
                <TableContainer sx={{
                    width: '80%',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '20px',

                }}
                    component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        sx={{ fontSize: 20, color: "darkblue" }}

                                        align='center'
                                    >
                                        <TableSortLabel
                                            active={true}
                                            direction={order}
                                            onClick={() => createSortHandler(column.id)}
                                        >
                                            <Typography sx={{ fontSize: 20, color: "darkblue" }}
                                            >{column.label}</Typography>
                                        </TableSortLabel>
                                    </TableCell>
                                ))

                                }
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                                <>
                                    <TableRow
                                        key={row.id}
                                        onClick={() => handleRowClick(row.id)}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        {columns.map((column) => (
                                            <TableCell
                                                key={column.id}
                                                align='center'
                                            >
                                                {row[column.id]}
                                            </TableCell>
                                        ))}

                                    </TableRow>
                                    {selectedRow === row.id && (
                                        <TableRow style={{ backgroundColor: 'darkgrey' }}>
                                            <TableCell
                                                colSpan={5}
                                                align='center'
                                                display='flex'
                                                justifyContent='center'
                                                alignItems='center'
                                            >
                                                <ButtonGroup
                                                    sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '20px' }}
                                                    variant='text'>
                                                    <Button
                                                        style={{ backgroundColor: 'lightblue' }}
                                                        onClick={() => handleViewClick(row.id)}
                                                    >
                                                        View Details
                                                    </Button>
                                                    <Button
                                                        style={{ backgroundColor: 'lightgreen' }}
                                                        onClick={() => handleEditClick(row.id)}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        style={{ backgroundColor: 'pink' }}
                                                        onClick={() => handleDeleteClick(row.id)}
                                                    >
                                                        Delete
                                                    </Button>
                                                </ButtonGroup>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </>
                            ))}
                        </TableBody>
                        <TablePagination
                            component='div'
                            count={sortedData.length}
                            page={page}
                            onPageChange={handlePageChange}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={handleRowNumberChange}
                            align='center'
                        />
                        <ButtonGroup
                            variant='text'
                            align='center'
                            display='flex'
                            justifyContent='center'
                            alignItems='center'
                        >
                            <Button
                                sx={{ backgroundColor: 'lightgreen' }}
                                onClick={handleChangeTable}
                                align='center'
                            >
                                Change Table
                            </Button>
                        </ButtonGroup>
                    </Table>
                </TableContainer>
            </Container>
        </Container>
    );
}

export default UserTable;
