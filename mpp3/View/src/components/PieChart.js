// src/components/GameYearPieChart.js
import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, CategoryScale, DoughnutController, Tooltip, Legend} from 'chart.js';

const GameYearPieChart = ({ data }) => {
    // Prepare the data for the pie chart
    
    Chart.register(ArcElement, CategoryScale, DoughnutController, Tooltip,Legend);

    const chartData = {
        labels: Object.keys(data),
        datasets: [
            {
                data: Object.values(data),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                ],
            },
        ],
    };
    const options = {
        plugins: {
            tooltip: {
                enabled: true,
                callbacks: {
                    label: function(context) {
                        let index = context.dataIndex;
                        let year = context.chart.data.labels[index];
                        let count = context.chart.data.datasets[0].data[index];
                        return `Year: ${year}, Number of Games: ${count}`;
                    }
                }

            },
            legend: {
                display: true,
                position: 'right',
            },
        },
        onClick: function(evt, elements) {
            if (elements.length > 0) {
                let index = elements[0].index;
                let year = this.data.labels[index];
                let count = this.data.datasets[0].data[index];
                alert(`Year: ${year}, Number of Games: ${count}`);
            }
        }
    };

    return (
        <div >
            <Pie data={chartData} options={options} />
        </div>
    );}

export default GameYearPieChart;