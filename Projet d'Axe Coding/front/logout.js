const logout = async () => {
    let token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    try {
        let response = await fetch("http://localhost:3001/sign-out", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-access-token": token,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        let data = await response.json();
        console.log(data);
        localStorage.removeItem("token");
        window.location.href = "index.html";
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to log out. Please try again.');
    }
};
