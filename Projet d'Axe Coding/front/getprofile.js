document.addEventListener('DOMContentLoaded', async function() {
  const token = localStorage.getItem("token");
  if (!token) {
      window.location.href = "login.html";
      return;
  }

  try {
      const response = await fetch('http://localhost:3001/getProfile', {
          headers: {
              'x-access-token': token,
          },
      });

      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch profile');
      }

      const profile = await response.json();
      document.getElementById('user-name').textContent = profile.username;

      const cardsContainer = document.querySelector('.cards-container');
      cardsContainer.innerHTML = '';

      profile.cards.forEach(cardUser => {
          const card = cardUser.card;
          const cardElement = document.createElement('div');
          cardElement.classList.add('card');
          cardElement.innerHTML = `
              <img src="${card.image}" alt="${card.name}">
              <h2>${card.name}</h2>
              <p>House: ${card.house || 'Unknown'}</p>
              <p>Actor: ${card.actor}</p>
          `;
          cardsContainer.appendChild(cardElement);
      });
  } catch (error) {
      console.error('Error fetching profile:', error);
      alert(error.message);
  }
});
