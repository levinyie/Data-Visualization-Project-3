// Your dataset
const dataset = [
    { lang: 'Afrikaans', revenue: 120580943.0 },
    { lang: 'Albanian', revenue: 145000989.0 },
    { lang: 'American Sign', revenue: 125734058.0 },
    { lang: 'Ancient (to 1453)', revenue: 250731958.0 },
    { lang: 'Apache languages', revenue: 100240551.0 },
    { lang: 'Japanese', revenue: 10162141.0 },
    { lang: 'Korean', revenue: 1573230.0 },
    { lang: 'Mandarin', revenue: 83278896.0 },
    { lang: 'Maya', revenue: 50866635.0 },
    { lang: 'Telugu', revenue: 10947026.0 }
];

// Extracting labels and data from the dataset
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
