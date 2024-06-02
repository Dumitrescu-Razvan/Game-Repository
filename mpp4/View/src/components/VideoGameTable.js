import React, { useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, ButtonGroup, Typography, TableSortLabel, Container, TablePagination } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { deleteGame, getGames, getCompanies } from '../Service/Service'; // Import the necessary functions from the service file
import GameYearPieChart from './PieChart';

function VideoGameTable() {

    const navigate = useNavigate();
    const columns = [
        { id: 'name', label: 'Title' },
        { id: 'rating', label: 'Rating' },
        { id: 'release_year', label: 'Year' },
        { id: 'company_id', label: 'Company' },
    ];
    const [order, setOrder] = React.useState('asc');
    const [sortedData, setSortedData] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [selectedRow, setSelectedRow] = React.useState(null);
    const [serverStatus, setServerStatus] = React.useState(false);
    const [_, setCompanies] = React.useState([]);
    const [userType, setUserType] = React.useState(0);

    useEffect(() => {
        setUserType(parseInt(localStorage.getItem('role')));
        console.log(userType);
        getGames()
            .then((data) => {
                setSortedData(data);
            })
            .catch((error) => {
                console.error('Network error:', error);
            });
        getCompanies()
            .then((data) => {
                setCompanies(data);
            })
            .catch((error) => {
                console.error('Network error:', error);
            });
    }, []);

    let attempts = 0;
    const maxAttempts = 5;

    useEffect(() => {
        let ws = null;

        const connect = () => {
            if (attempts >= maxAttempts) {
                console.log('Max reconnection attempts reached');
                return;
            }

            ws = new WebSocket('ws://localhost:3002');

            ws.onopen = () => {
                console.log('Websocket connected');
                setServerStatus(true);
                attempts = 0; // reset attempts count on successful connection
            };
            ws.onerror = (event) => {
                console.error('Websocket error:', event);
            }
            ws.onclose = (event) => {
                console.log('Websocket closed:', event);
                setServerStatus(false);
                attempts++;
                // Try to reconnect after a second
                setTimeout(connect, 1000);
            }
        }

        connect();

        return () => ws && ws.close();
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

    const handleAddClick = () => {
        navigate('/add');
        setSortedData([...sortedData]);
    };

    const handleViewClick = (id) => {
        navigate(`/game/${id}`);
    };

    const handleEditClick = (id) => {
        navigate(`/edit/${id}`);
    };

    const handleDeleteClick = async (id) => {
        if (window.confirm('Are you sure you want to delete this game?')) {
            await deleteGame(id); // Call the new deleteGame function from the service
            const data = await getGames(); // Fetch updated data after deletion
            setSortedData([...data]);
        }
        selectedRow === id && setSelectedRow(null);
    };

    const handleRowNumberChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeTable = async () => {
        navigate('/companies');
    };

    const handleViewCompany = (id) => {
        navigate(`/company/${id}`);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
    };

    // useEffect(() => {
    //     if (serverStatus) {
    //         syncGames();
    //     }
    // }, [serverStatus]);

    const gameYearData = sortedData.reduce((acc, game) => {
        const year = game.release_year;
        if (acc[year]) {
            acc[year]++;
        } else {
            acc[year] = 1;
        }
        return acc;
    }
        , {});

    return (
        <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <header sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'red' }}>
                <h1>Video Game Table</h1>
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
                                                colSpan={4}
                                                align='center'
                                                display='flex'
                                                justifyContent='center'
                                                alignItems='center'
                                            >
                                                <ButtonGroup
                                                    sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
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
                                                    <Button
                                                        style={{ backgroundColor: 'lightcoral' }}
                                                        onClick={() => handleViewCompany(row.company_id)}
                                                    >
                                                        View Company

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
                            <Button
                                sx={{ backgroundColor: 'lightblue' }}
                                onClick={handleAddClick}
                                align='center'
                                //make this visible only if the userType >= 1
                                style={{ visibility: userType >= 1 ? 'visible' : 'hidden' }}
                            >
                                Add Game
                            </Button>
                            <Button
                                sx={{ backgroundColor: 'lightcoral' }}
                                onClick={() => navigate('/users')}
                                align='center'
                                style={{ visibility: userType >= 2 ? 'visible' : 'hidden' }}

                            >
                                All Users
                            </Button>
                        </ButtonGroup>
                        <Button
                            sx={{ backgroundColor: 'lightcoral', alignContent: 'right', position: 'relative', left: '94%'}}
                            onClick={handleLogout}
                            align='center'
                        >
                            Logout

                        </Button>
                    </Table>
                </TableContainer>
                <GameYearPieChart data={gameYearData} options={gameYearData} />
            </Container>
        </Container>
    );
}

export default VideoGameTable;
