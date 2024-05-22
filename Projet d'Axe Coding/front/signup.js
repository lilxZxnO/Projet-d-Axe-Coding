document.getElementById('signUpForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  let username = document.querySelector('input[name="username"]').value;
  let email = document.querySelector('input[name="email"]').value;
  let password = document.querySelector('input[name="password"]').value;

  try {
    let response = await fetch("http://localhost:3001/sign-up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
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
    alert('Failed to sign up. Please try again.');
  }
});
