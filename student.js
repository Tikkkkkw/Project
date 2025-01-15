function parseCSV(csvData) {
    const lines = csvData.split('\n').filter(line => line.trim() !== ''); 
    const headers = lines[0].split(',');
    const studyIndex = headers.indexOf('Study_Hours');
    const stressIndex = headers.indexOf('Stress_Level_Biosensor');
    const selfIndex = headers.indexOf('Stress_Level_Self_Report')
    const heartIndex = headers.indexOf('Heart_Rate')

    const studyHours = [];
    const studyHours1 = [];
    const stressLevels = [];
    const selfLevels = [];
    const heartRates = [];
   

    for (let i = 1; i < lines.length; i++) {
        const cells = lines[i].split(',');
        if (cells[studyIndex] && cells[stressIndex]) {
            studyHours.push(cells[studyIndex].trim());
            stressLevels.push(parseFloat(cells[stressIndex].trim()));
            selfLevels.push(parseFloat(cells[selfIndex].trim()));
            heartRates.push(parseFloat(cells[heartIndex].trim()));
           
        }
    }
    return { studyHours, stressLevels, selfLevels, heartRates };
}


fetch('student_health_data.csv')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    })
    .then(csvData => {
        const { studyHours, stressLevels, selfLevels, heartRates } = parseCSV(csvData);
        console.log('Study Hours:', studyHours);
        console.log('Stress Levels (Biosensor):', stressLevels);

        const limitedStudyHours = studyHours.slice(0, 10); 
        const limitedStressLevels = stressLevels.slice(0, 10);
        const limitedSelfLevels = selfLevels.slice(0, 10);
        const limitedHeartRate = heartRates.slice(0,10)

        const ctx1 = document.getElementById('stressChart1').getContext('2d');
        const stressChar1 = new Chart(ctx1, {
            type: 'line',
            data: {
                labels: limitedStudyHours,
                datasets: [{
                    label: 'Stress',
                    data: limitedSelfLevels,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderWidth: 2,
                    tension: 0.4, 
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    title: {
                        display: true,
                        text: 'Stress Levels (Self Reported) vs. Study Hours'
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Study Hours'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Stress Levels (Self Reported)'
                        }
                    }
                }
            }
        });
        console.log('Chart created successfully.');

        const ctx2 = document.getElementById('heartChart').getContext('2d');
        const heartChar = new Chart(ctx2, {
            type: 'line', 
            data: {
                labels: limitedStudyHours,
                datasets: [{
                    label: 'Heart Rate',
                    data: limitedHeartRate,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderWidth: 2,
                    tension: 0.4, 
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    title: {
                        display: true,
                        text: 'Heart Rate vs. Study Hours'
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Study Hours'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Heart Rate (BPM)'
                        }
                    }
                }
            }
        });
        console.log('Chart created successfully.');
        

        const ctx = document.getElementById('stressChart').getContext('2d');
        const stressChar = new Chart(ctx, {
            type: 'line', 
            data: {
                labels: limitedStudyHours,
                datasets: [{
                    label: 'Stress',
                    data: limitedStressLevels,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderWidth: 2,
                    tension: 0.4, 
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    title: {
                        display: true,
                        text: 'Stress Levels (Biosensor) vs. Study Hours'
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Study Hours'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Stress Levels (Biosensor)'
                        }
                    }
                }
            }
        });
        console.log('Chart created successfully.');
    })
    .catch(error => console.error('Error loading the CSV file:', error));