const chart = new Chart(document.getElementById('myChart'), {
    type: 'line',
    options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 0,
        scales: {
            x: {
                display: true,
                title: {
                    display: true,
                    text: 'Date'
                },
                type: "time",
                time: {
                    parser: 'DD/MM/YYYY',
                    tooltipFormat: 'll',
                    minUnit : 'day',
                    displayFormats: {
                        quarter: 'MMM YYYY'
                    }
                },
                ticks: {
                    align: 'center',
                    crossAlign: 'center',
                    padding: 10
                }
            },
            y: {
                display: true,
                title: {
                    display: true,
                    text: 'Price'
                },
                ticks: {
                    align: 'center',
                    crossAlign: 'center',
                    padding: 10
                },
                beginAtZero: true
            },
        },
        plugins: {
            title: {
                display: true,
                text: 'Current stocks'
            },
            legend: {
                labels: {
                    font: {
                        size: 20
                    }
                }
            }
        }
    },
    data: {
        datasets: []
    },
});

export {chart};