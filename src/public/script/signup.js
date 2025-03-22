const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = form.email.value;
  const username = form.username.value;
  const password = form.password.value;

  const data = JSON.stringify({ email, username, password });
  console.log(data);
  if (email === "" || username === "" || password === "") {
    console.log("nan");
    return;
  }
  try {
    const res = await fetch("/api/v1/auth/signUp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    });

    if (res.ok) {
      window.location.href = res.url;
    } else {
      const response = await res.json();
      showErrors(response.msg);
    }
  } catch (err) {
    alert(err.message);
  }
});

const username_error = document.querySelector(".username-error");
const email_error = document.querySelector(".email-error");
const password_error = document.querySelector(".password-error");

const showErrors = (message) => {
  console.log(message);
  if (message.username) {
    username_error.textContent = message.username;
  } else {
    username_error.textContent = "";
  }

  if (message.email) {
    email_error.textContent = message.email;
  } else {
    email_error.textContent = "";
  }

  if (message.password) {
    password_error.textContent = message.password;
  } else {
    password_error.textContent = "";
  }
};
