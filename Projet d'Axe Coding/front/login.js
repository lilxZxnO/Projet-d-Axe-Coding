document.getElementById('loginForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  let email = document.querySelector('input[name="emailLogin"]').value;
  let password = document.querySelector('input[name="passwordLogin"]').value;

  try {
    let response = await fetch("http://localhost:3001/sign-in", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    let data = await response.json();
    localStorage.setItem("token", data.token);
    window.location.href = "profile.html";
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to log in. Please try again.');
  }
});
