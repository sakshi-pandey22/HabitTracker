// script.js
document.addEventListener("DOMContentLoaded", () => {
    const habitInput = document.getElementById("habit-name");
    const addHabitButton = document.getElementById("add-habit");
    const habitList = document.getElementById("habit-items");
    const canvas = document.getElementById("habitChart");
    const ctx = canvas.getContext("2d");

    let habits = JSON.parse(localStorage.getItem("habits")) || [];
    let habitChart = null;

    function updateLocalStorage() {
        localStorage.setItem("habits", JSON.stringify(habits));
    }

    function renderHabits() {
        habitList.innerHTML = "";
        habits.forEach((habit, index) => {
            const habitItem = document.createElement("li");
            habitItem.innerHTML = `
                ${habit.name} - Completed: ${habit.completed}
                <button onclick="markCompleted(${index})">✔</button>
                <button onclick="deleteHabit(${index})">❌</button>
            `;
            habitList.appendChild(habitItem);
        });
        updateChart();
    }

    function updateChart() {
        let habitNames = habits.map(h => h.name);
        let habitData = habits.map(h => h.completed);

        if (habitChart) {
            habitChart.destroy();
        }

        function fixCanvasResolution() {
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();

            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            ctx.scale(dpr, dpr);
        }

        fixCanvasResolution();

        habitChart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: habitNames,
                datasets: [{
                    label: "Habit Completion",
                    data: habitData,
                    backgroundColor: "#ffcc00"
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            font: {
                                size: 14
                            }
                        }
                    }
                }
            }
        });
    }

    addHabitButton.addEventListener("click", () => {
        const habitName = habitInput.value.trim();
        if (habitName) {
            habits.push({ name: habitName, completed: 0 });
            habitInput.value = "";
            renderHabits();
            updateLocalStorage();
        }
    });

    window.markCompleted = function (index) {
        habits[index].completed += 1;
        renderHabits();
        updateLocalStorage();
    };

    window.deleteHabit = function (index) {
        habits.splice(index, 1);
        renderHabits();
        updateLocalStorage();
    };

    renderHabits();
});