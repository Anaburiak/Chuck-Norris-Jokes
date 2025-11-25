let savedJokes = [];
let nextId = 1;

const API_URL = 'https://api.chucknorris.io/jokes';
document.addEventListener('DOMContentLoaded', loadJokes);
document.getElementById('jokesForm').addEventListener('submit', function(e) {
    e.preventDefault();
    saveJoke();
});

document.getElementById('resetBtn').addEventListener('click', resetForm);

async function getRandomJoke() {
    try {
        const response = await fetch('https://api.chucknorris.io/jokes/random');
        const joke = await response.json();
        alert(joke.value);
        document.getElementById('value').value = joke.value;
        document.getElementById('category').value = joke.categories[0] || '';
    } catch (error) {
        console.error('An error while fetching a random joke:', error);
    }
}

async function loadJokes() {
    try {
        savedJokes = JSON.parse(localStorage.getItem('chuckJokes')) || [];
        
        if (savedJokes.length > 0) {
            nextId = Math.max(...savedJokes.map(joke => joke.id)) + 1;
        } else {
            nextId = 1;
        }

        displayJokes(savedJokes);
    } catch (error) {
        console.error('An error while loading the jokes:', error);
    }
}

function displayJokes(jokes) {
    const tbody = document.getElementById('jokesBody');
    tbody.innerHTML = '';

    if (!jokes || !Array.isArray(jokes)) {
        tbody.innerHTML = '<tr><td colspan="5">No jokes saved yet</td></tr>';
        return;
    }
    jokes.forEach(joke => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${joke.id}</td>
            <td>${joke.value}</td>
            <td>${joke.category || 'No comment'}</td>
            <td>${getStatusText(joke.status)}</td>
            <td class="actions">
                <button onclick="editJoke(${joke.id})">Edit</button>
                <button onclick="deleteJoke(${joke.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

async function saveJoke() {
    const jokeId = document.getElementById('jokeId').value;
    const jokeData = {
        value: document.getElementById('value').value,
        category: document.getElementById('category').value,
        status: document.getElementById('status').value
    };

    try {
        if (jokeId) {
            const index = savedJokes.findIndex(joke => joke.id == jokeId); 
            if (index !== -1) {
                savedJokes[index] = { 
                    ...savedJokes[index],
                    ...jokeData
                };
            }
            
            } else {
                const newJoke = {
                    id: nextId++,
                    ...jokeData
                };
                savedJokes.push(newJoke);
            }

            localStorage.setItem('chuckJokes', JSON.stringify(savedJokes));

            displayJokes(savedJokes);
            resetForm();
    
        } catch (error) {
            console.error('An error while saving the joke', error);
        }
}


async function editJoke(id) {
    try {
        const joke = savedJokes.find(j => j.id === id);
        if (joke) {
            document.getElementById('jokeId').value = joke.id;
            document.getElementById('value').value = joke.value;
            document.getElementById('category').value = joke.category || '';
            document.getElementById('status').value = joke.status;

            document.getElementById('submitBtn').textContent = 'Update the joke';
            document.getElementById('resetBtn').style.display = 'inline-block';
        } else {
            console.error('Joke not found');
        }
    } catch (error) {
        console.error('An error while loading the jokes:', error);
    }
}

async function deleteJoke(id) { // Добавлена функция удаления
    if (confirm('Are you sure you want to delete this joke? Chuck Norris would not approve!')) {
        try {
            savedJokes = savedJokes.filter(joke => joke.id !== id);
            localStorage.setItem('chuckJokes', JSON.stringify(savedJokes));
            displayJokes(savedJokes);
        } catch (error) {
            console.error('An error while deleting the joke', error);
        }
    }
}

function resetForm() {
    document.getElementById('jokesForm').reset();
    document.getElementById('jokeId').value = '';
    document.getElementById('submitBtn').textContent = 'Add a joke';
    document.getElementById('resetBtn').style.display = 'none';
}

function getStatusText(status) {
    const statusMap = {
        'favorite': 'Favorite',
        'funny': 'Funny',
        'epic': 'Epic',
    };
    return statusMap[status] || status;
}