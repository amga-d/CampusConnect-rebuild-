document
  .getElementById("googleButton")
  .addEventListener("click", function (event) {
    event.preventDefault(); // Prevent form submission
  });
console.log("sdfa");
document.getElementById("show-password").addEventListener("click", function () {
  const passwordfield = document.getElementById("passwordfield");
  if (passwordfield.type == "password") {
    passwordfield.type = "text";
  } else if (passwordfield.type == "text") {
    passwordfield.type = "password";
  }
});

const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = form.email.value;
  const password = form.password.value;

  if (email === "" || password === "") {
    return;
  }
  const data = JSON.stringify({ email, password });
  try {
    const res = await fetch("/api/v1/auth/login", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: data,
    });
    if (res.ok) {
      window.location.href = res.url;
    } else {
      const json = await res.json();
      console.table(json?.msg);
    }
  } catch (error) {
    console.log(error);
  }
});
