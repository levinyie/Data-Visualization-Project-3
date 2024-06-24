// dataset
const dataset = [
    { lang: 'Nama', revenue: 700426566.0 },
    { lang: 'Xhosa', revenue: 507271842.0 },
    { lang: 'Maya', revenue: 453829060.0 },
    { lang: 'Haitian', revenue: 453829060.0 },
    { lang: 'Flemish', revenue: 412845172.0 },
    { lang: 'Swahili', revenue: 388824332.0 },
    { lang: 'Quenya', revenue: 381201096.0 },
    { lang: 'Maltese', revenue: 376851080.0 },
    { lang: 'Sindarin', revenue: 347575257.0 },
    { lang: 'Maori', revenue: 335104314.0 }
];

// labels and data from the dataset
const labels = dataset.map(item => item.lang);
const data = dataset.map(item => item.revenue);

// Chart.js configuration
const ctx = document.getElementById('myBarChart').getContext('2d');
const myBarChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: labels,
        datasets: [{
            label: 'Revenue',
            data: data,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});
