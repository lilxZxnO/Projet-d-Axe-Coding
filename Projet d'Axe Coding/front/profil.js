document.addEventListener('DOMContentLoaded', async function () {
    const userName = 'John Doe'; // Nom de l'utilisateur connecté
    document.getElementById('user-name').textContent = userName;

    async function fetchUserCards() {
        const token = localStorage.getItem("token");
        const response = await fetch('http://localhost:3001/user-cards', {
            headers: {
                "x-access-token": token,
            },
        });
        return await response.json();
    }

    function groupCardsByHouse(cards) {
        const houses = {};
        cards.forEach(card => {
            const house = card.house || 'Unknown';
            if (!houses[house]) {
                houses[house] = [];
            }
            houses[house].push(card);
        });
        return houses;
    }

    function createCardElement(card) {
        return `
            <div class="card">
                <img src="${card.image}" alt="${card.name}">
                <h2>${card.name}</h2>
                <p>House: ${card.house || 'Unknown'}</p>
                <p>Actor: ${card.actor}</p>
            </div>
        `;
    }

    async function populateCards() {
        const cardsContainer = document.querySelector('.cards-container');
        const userCards = await fetchUserCards();
        const groupedCards = groupCardsByHouse(userCards);

        for (const house in groupedCards) {
            const houseSection = document.createElement('div');
            houseSection.classList.add('grid-item');
            houseSection.innerHTML = `<h2>${house}</h2>`;
            const houseCardsContainer = document.createElement('div');
            houseCardsContainer.classList.add('cards-container');

            groupedCards[house].forEach(card => {
                houseCardsContainer.innerHTML += createCardElement(card);
            });

            houseSection.appendChild(houseCardsContainer);
            cardsContainer.appendChild(houseSection);
        }
    }

    async function populateFriends() {
        const friendsList = document.querySelector('.friends-list');
        const friends = ['Friend 1', 'Friend 2', 'Friend 3'];
        friends.forEach(friend => {
            const friendElement = document.createElement('li');
            friendElement.textContent = friend;
            friendsList.appendChild(friendElement);
        });
    }

    async function fetchCharacterImages() {
        const response = await fetch('https://hp-api.lainocs.fr/characters');
        const characters = await response.json();
        const characterMap = characters.reduce((acc, character) => {
            acc[character.name] = { image: character.image, description: character.actor };
            return acc;
        }, {});
        return characterMap;
    }

    async function populateTradeRequests() {
        const tradeRequestsList = document.querySelector('.trade-requests-list');
        const tradeRequests = [
            { from: 'Friend 1', card: 'Draco Malfoy' },
            { from: 'Friend 2', card: 'Luna Lovegood' },
        ];
        const characterMap = await fetchCharacterImages();
        tradeRequests.forEach(request => {
            if (characterMap[request.card]) {
                const requestElement = document.createElement('li');
                requestElement.innerHTML = `
                    <div class="card">
                        <img src="${characterMap[request.card].image}" alt="${request.card}">
                        <h2>${request.card}</h2>
                        <p>${characterMap[request.card].description}</p>
                    </div>
                    <p>${request.from} wants to trade</p>
                    <button>Accept</button>
                    <button>Decline</button>
                `;
                tradeRequestsList.appendChild(requestElement);
            }
        });
    }

    await populateCards();
    await populateFriends();
    await populateTradeRequests();
});
