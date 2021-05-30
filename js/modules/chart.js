const chart = new Chart(document.getElementById('myChart'), {
    type: 'line',
    options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 0,
        title: {
            display: true,
            text: "Chart.js Time Scale"
        },
        scales: {
            x: {
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
                ticks: {
                    align: 'center',
                    crossAlign: 'center',
                    padding: 10
                },
                beginAtZero: true
            },
        },
        plugins: {
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