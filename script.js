const form = document.getElementById("waitlist-form");
const emailInput = document.getElementById("email");
const messageEl = document.getElementById("form-message");

function setMessage(text, type) {
  messageEl.textContent = text;
  messageEl.className = `form-message ${type}`;
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = emailInput.value.trim().toLowerCase();

  if (!isValidEmail(email)) {
    setMessage("Please enter a valid email address.", "error");
    return;
  }

  const raw = localStorage.getItem("waitlist");
  const list = raw ? JSON.parse(raw) : [];

  if (list.includes(email)) {
    setMessage("This email is already on the waitlist.", "error");
    return;
  }

  list.push(email);
  localStorage.setItem("waitlist", JSON.stringify(list));

  setMessage("You're in. We'll notify you at launch.", "success");
  form.reset();
});
