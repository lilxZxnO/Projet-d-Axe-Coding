document.addEventListener('DOMContentLoaded', function() {
    const openBoosterButton = document.getElementById('open-booster-button');
    if (openBoosterButton) {
        openBoosterButton.addEventListener('click', function() {
            openBooster();
        });
    } else {
        console.error("Button with ID 'open-booster-button' not found.");
    }
});

async function openBooster() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('You need to log in first!');
            window.location.href = 'login.html';
            return;
        }

        const response = await fetch('http://localhost:3001/open-booster', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to open booster');
        }

        const newCards = await response.json();
        displayCards(newCards);
    } catch (error) {
        console.error('Error opening booster:', error);
        alert(error.message);
    }
}

function displayCards(cards) {
    const cardContainer = document.getElementById('card-container');
    cardContainer.innerHTML = '';

    cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');

        const cardImage = document.createElement('img');
        cardImage.src = card.image;
        cardImage.alt = card.name;

        const cardName = document.createElement('h2');
        cardName.textContent = card.name;

        const cardDetails = document.createElement('p');
        cardDetails.innerHTML = `
            <strong>House:</strong> ${card.house}<br>
            <strong>Role:</strong> ${card.role}<br>
            <strong>Patronus:</strong> ${card.patronus}
        `;

        cardElement.appendChild(cardImage);
        cardElement.appendChild(cardName);
        cardElement.appendChild(cardDetails);
        cardContainer.appendChild(cardElement);
    });
}
