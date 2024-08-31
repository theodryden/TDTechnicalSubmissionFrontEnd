import React, { useEffect, useRef, useState } from 'react';
import { Chart, LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale, TimeScale } from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';

// Register Chart.js components
Chart.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale, TimeScale);

const PressureChart = () => {
    const chartRef = useRef(null);
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Pressure (bars)',
                data: [],
                fill: false,
                borderColor: 'rgba(65, 105, 225)', // RoyalBlue color for pressure
                tension: 0.1,
                pointBackgroundColor: 'rgba(75,192,192,1)',
                yAxisID: 'y-pressure',
            },
            {
                label: 'Aperture (%)',
                data: [],
                fill: false,
                borderColor: 'rgba(255, 99, 132)', // Red color for aperture
                tension: 0.1,
                pointBackgroundColor: 'rgba(255,99,132,1)',
                yAxisID: 'y-aperture',
            },
        ],
    });

    useEffect(() => {
        const fetchPressure = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/pressure');
                const data = await response.json();
                
                setChartData((prevData) => ({
                    labels: [...prevData.labels, new Date()], // Add current time as a label
                    datasets: prevData.datasets.map((dataset) => {
                        if (dataset.label === 'Pressure (bars)') {
                            return {
                                ...dataset,
                                data: [...dataset.data, data.pressure], // Add pressure data
                            };
                        }
                        return dataset;
                    }),
                }));
            } catch (error) {
                console.error('Error fetching pressure data:', error);
            }
        };

        const fetchAperture = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/aperture');
                const data = await response.json();

                setChartData((prevData) => ({
                    labels: [...prevData.labels, new Date()], // Add current time as a label
                    datasets: prevData.datasets.map((dataset) => {
                        if (dataset.label === 'Aperture (%)') {
                            return {
                                ...dataset,
                                data: [...dataset.data, data.aperture], // Add aperture data
                            };
                        }
                        return dataset;
                    }),
                }));
            } catch (error) {
                console.error('Error fetching aperture data:', error);
            }
        };

        const intervalId = setInterval(() => {
            fetchPressure();
            fetchAperture();
        }, 1000); // Fetch data every second

        return () => clearInterval(intervalId); // Cleanup on component unmount
    }, []);

    const options = {
        scales: {
            x: {
                type: 'time', // Use time scale for x-axis
                time: {
                    unit: 'second', // Display time labels in seconds
                    tooltipFormat: 'HH:mm:ss', // Tooltip format
                },
                title: {
                    display: true,
                    text: 'Time',
                },
            },
            'y-pressure': {
                type: 'linear',
                position: 'left',
                title: {
                    display: true,
                    text: 'Pressure (bars)',
                },
                beginAtZero: true,
            },
            'y-aperture': {
                type: 'linear',
                position: 'right',
                title: {
                    display: true,
                    text: 'Aperture (%)',
                },
                beginAtZero: true,
                grid: {
                    drawOnChartArea: false, // Don't draw grid lines for the aperture axis
                },
            },
        },
        plugins: {
            legend: {
                display: true,
            },
        },
    };

    return <Line ref={chartRef} data={chartData} options={options} />;
};

export default PressureChart;
