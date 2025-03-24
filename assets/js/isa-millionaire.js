document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const contributionInput = document.getElementById('contribution');
    const returnInput = document.getElementById('return');
    const inflationInput = document.getElementById('inflation');
    const calculateButton = document.getElementById('calculate');
    const yearsResult = document.getElementById('years-result');
    const yearsRealResult = document.getElementById('years-real-result');
    const chartCanvas = document.getElementById('investment-chart');
    
    // Get current year
    const currentYear = 2025;
    
    // Chart instance
    let investmentChart = null;
    
    // Add event listener for calculate button
    calculateButton.addEventListener('click', calculateInvestment);
    
    function calculateInvestment() {
        // Get input values
        const annualContribution = parseFloat(contributionInput.value);
        const nominalReturnRate = parseFloat(returnInput.value) / 100;
        const inflationRate = parseFloat(inflationInput.value) / 100;
        
        // Calculate real return rate (Fisher equation)
        const realReturnRate = ((1 + nominalReturnRate) / (1 + inflationRate)) - 1;
        
        // Validate inputs
        if (isNaN(annualContribution) || isNaN(nominalReturnRate) || isNaN(inflationRate)) {
            alert('Please enter valid numbers for all fields');
            return;
        }
        
        // Calculate years to reach £1,000,000 nominal value
        const targetAmount = 1000000;
        let currentBalance = 0;
        let years = 0;
        
        const nominalBalances = [currentBalance];
        const realBalances = [currentBalance];
        
        while (currentBalance < targetAmount) {
            // Apply return to current balance
            currentBalance = currentBalance * (1 + nominalReturnRate);
            
            // Add annual contribution
            currentBalance += annualContribution;
            
            // Increment year counter
            years++;
            
            // Store the balances for charting
            nominalBalances.push(currentBalance);
            
            // Calculate real value (adjusted for inflation)
            const realValue = currentBalance / Math.pow(1 + inflationRate, years);
            realBalances.push(realValue);
            
            // Safety limit to prevent infinite loops
            if (years > 100) {
                break;
            }
        }
        
        // Display result for nominal million
        yearsResult.textContent = years;
        
        // Calculate years to reach £1,000,000 in today's buying power
        // For this calculation, we need to find when real balance reaches 1M
        let yearsToRealMillion = 0;
        let nominalBalance = 0;
        
        // Extended arrays to store values for both calculations
        const extendedNominalBalances = [...nominalBalances];
        const extendedRealBalances = [...realBalances];
        
        // Keep calculating until we reach a real balance of 1M
        let reachedRealMillion = false;
        
        // Continue from wherever the previous calculation left off
        yearsToRealMillion = years;
        nominalBalance = currentBalance;
        
        while (!reachedRealMillion) {
            // Only continue calculation if we haven't already reached 1M in real terms
            if (extendedRealBalances[extendedRealBalances.length - 1] >= targetAmount) {
                // Find when we first crossed the 1M real value threshold
                for (let i = 1; i < extendedRealBalances.length; i++) {
                    if (extendedRealBalances[i] >= targetAmount) {
                        yearsToRealMillion = i;
                        reachedRealMillion = true;
                        break;
                    }
                }
            } else {
                // Calculate the next year's values
                nominalBalance = nominalBalance * (1 + nominalReturnRate);
                nominalBalance += annualContribution;
                yearsToRealMillion++;
                
                // Calculate real value
                const realValue = nominalBalance / Math.pow(1 + inflationRate, yearsToRealMillion);
                
                // Store values
                extendedNominalBalances.push(nominalBalance);
                extendedRealBalances.push(realValue);
                
                // Check if we've reached target
                if (realValue >= targetAmount) {
                    reachedRealMillion = true;
                }
                
                // Safety limit to prevent infinite loops
                if (yearsToRealMillion > 100) {
                    yearsRealResult.textContent = "100+ years";
                    reachedRealMillion = true;
                }
            }
        }
        
        // Display result for real million
        if (yearsToRealMillion <= 100) {
            yearsRealResult.textContent = yearsToRealMillion;
        }
        
        // Use the extended balances for chart display
        createChart(yearsToRealMillion, extendedNominalBalances, extendedRealBalances);
    }
    
    function createChart(years, nominalBalances, realBalances) {
        // Create labels for years with actual calendar years
        const labels = Array.from({length: years + 1}, (_, i) => `${currentYear + i}`);
        
        // Prepare chart data
        const chartData = {
            labels: labels,
            datasets: [
                {
                    label: 'Nominal Balance',
                    data: nominalBalances.slice(0, years + 1),
                    borderColor: 'rgb(27, 47, 93)', // Navy color from Zapwiser palette
                    backgroundColor: 'rgba(27, 47, 93, 0.1)',
                    tension: 0.3,
                    fill: true
                },
                {
                    label: 'Real Balance (Inflation-Adjusted)',
                    data: realBalances.slice(0, years + 1),
                    borderColor: 'rgb(58, 95, 160)', // Medium blue from Zapwiser palette
                    backgroundColor: 'rgba(58, 95, 160, 0.1)',
                    tension: 0.3,
                    fill: true
                }
            ]
        };
        
        // Add reference line for £1,000,000
        const millionLine = {
            type: 'line',
            label: '£1 Million Target',
            data: Array(years + 1).fill(1000000),
            borderColor: 'rgba(255, 122, 0, 0.8)', // Accent color from Zapwiser palette
            borderWidth: 2,
            borderDash: [6, 4],
            pointRadius: 0,
            fill: false
        };
        
        chartData.datasets.push(millionLine);
        
        // Chart configuration
        const config = {
            type: 'line',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Year',
                            font: {
                                family: "'Montserrat', sans-serif",
                                weight: 600
                            }
                        },
                        ticks: {
                            font: {
                                family: "'Open Sans', sans-serif"
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '£' + formatNumber(value);
                            },
                            font: {
                                family: "'Open Sans', sans-serif"
                            }
                        },
                        title: {
                            display: true,
                            text: 'Balance (£)',
                            font: {
                                family: "'Montserrat', sans-serif",
                                weight: 600
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: £${formatNumber(context.raw)}`;
                            }
                        },
                        titleFont: {
                            family: "'Montserrat', sans-serif",
                            weight: 600
                        },
                        bodyFont: {
                            family: "'Open Sans', sans-serif"
                        }
                    },
                    legend: {
                        labels: {
                            font: {
                                family: "'Montserrat', sans-serif",
                                weight: 500
                            }
                        }
                    }
                }
            }
        };
        
        // Destroy previous chart if it exists
        if (investmentChart) {
            investmentChart.destroy();
        }
        
        // Create new chart
        investmentChart = new Chart(chartCanvas, config);
    }
    
    // Helper function to format numbers with commas
    function formatNumber(num) {
        return num.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }
    
    // Run calculation on page load with default values
    calculateButton.click();
});
