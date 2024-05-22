// Fonction pour gérer l'ajout/suppression de favoris
function toggleFavorite(characterName) {
    const favoriteCharacters = JSON.parse(localStorage.getItem('favoriteCharacters')) || [];

    const index = favoriteCharacters.indexOf(characterName);
    if (index === -1) {
        // Ajouter le personnage aux favoris
        favoriteCharacters.push(characterName);
    } else {
        // Supprimer le personnage des favoris
        favoriteCharacters.splice(index, 1);
    }

    localStorage.setItem('favoriteCharacters', JSON.stringify(favoriteCharacters));
}

// Fonction pour mettre à jour l'icône de favori
function updateFavoriteIcon(characterName, card) {
    const favoriteCharacters = JSON.parse(localStorage.getItem('favoriteCharacters')) || [];
    const isFavorite = favoriteCharacters.includes(characterName);

    const heartIcon = card.querySelector('.heart-icon');
    if (isFavorite) {
        heartIcon.classList.add('favorited');
    } else {
        heartIcon.classList.remove('favorited');
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const apiUrl = "https://hp-api.lainocs.fr/characters";
    const houseContainers = {
        Gryffindor: document.querySelector("#gryffindor .cards-container"),
        Ravenclaw: document.querySelector("#ravenclaw .cards-container"),
        Hufflepuff: document.querySelector("#hufflepuff .cards-container"),
        Slytherin: document.querySelector("#slytherin .cards-container"),
        Unknown: document.querySelector("#unknown .cards-container")
    };
    let characters = [];

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            characters = data;
            displayCharacters(characters);
        })
        .catch(error => console.error("Error fetching data:", error));

    function displayCharacters(data) {
        Object.values(houseContainers).forEach(container => container.innerHTML = '');
        data.forEach(character => {
            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.name = character.name;

            const name = document.createElement('h2');
            name.textContent = character.name;

            const house = document.createElement('p');
            house.textContent = `House: ${character.house || 'Unknown'}`;

            const ancestry = document.createElement('p');
            ancestry.textContent = `Ancestry: ${character.ancestry || 'Unknown'}`;

            const patronus = document.createElement('p');
            patronus.textContent = `Patronus: ${character.patronus || 'Unknown'}`;

            const actor = document.createElement('p');
            actor.textContent = `Actor: ${character.actor || 'Unknown'}`;

            const image = document.createElement('img');
            image.src = character.image || 'https://via.placeholder.com/200x300?text=No+Image';
            image.alt = `${character.name}`;

            const heartIcon = document.createElement('i');
            heartIcon.classList.add('heart-icon', 'far', 'fa-heart');

            heartIcon.addEventListener('click', () => {
                toggleFavorite(character.name);
                updateFavoriteIcon(character.name, card);
            });

            card.appendChild(image);
            card.appendChild(name);
            card.appendChild(house);
            card.appendChild(ancestry);
            card.appendChild(patronus);
            card.appendChild(actor);
            card.appendChild(heartIcon);

            const houseName = character.house || 'Unknown';
            if (houseContainers[houseName]) {
                houseContainers[houseName].appendChild(card);
            } else {
                houseContainers.Unknown.appendChild(card);
            }

            updateFavoriteIcon(character.name, card);
        });
    }

    document.querySelectorAll('.filter-button').forEach(button => {
        button.addEventListener('click', function() {
            const house = this.dataset.house;
            document.body.className = `house-background-${house}`;
            document.querySelectorAll('.filter-button').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            if (house === 'All') {
                displayCharacters(characters);
            } else {
                const filteredCharacters = characters.filter(character => character.house === house);
                displayCharacters(filteredCharacters);
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", function() {
    // Votre code JavaScript existant va ici...

    // Récupérer la référence du modal et du bouton pour l'ouvrir
    const modal = document.getElementById('exchange-modal');
    const btnOpenModal = document.querySelector('.floating-button');

    // Récupérer la référence du bouton pour fermer le modal
    const closeModalButton = modal.querySelector('.close');

    // Fonction pour ouvrir le modal
    function openModal() {
        modal.style.display = 'block';
    }

    // Fonction pour fermer le modal
    function closeModal() {
        modal.style.display = 'none';
    }

    // Gérer l'événement de clic sur le bouton pour ouvrir le modal
    btnOpenModal.addEventListener('click', openModal);

    // Gérer l'événement de clic sur le bouton de fermeture du modal
    closeModalButton.addEventListener('click', closeModal);

    // Gérer l'événement de clic en dehors du modal pour le fermer
    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            closeModal();
        }
    });

    // Empêcher la propagation de l'événement de clic à l'intérieur du modal
    modal.addEventListener('click', function(event) {
        event.stopPropagation();
    });

    // Dynamiquement remplir les options du formulaire avec les noms de cartes
    const cardSelect = document.getElementById('card');
    function populateCardOptions() {
        characters.forEach(character => {
            const option = document.createElement('option');
            option.value = character.name;
            option.textContent = character.name;
            cardSelect.appendChild(option);
        });
    }

    // Appeler la fonction pour remplir les options des cartes
    populateCardOptions();
});

