const form = document.getElementById("waitlist-form");
const emailInput = document.getElementById("email");
const messageEl = document.getElementById("form-message");
const submitButton = form.querySelector('button[type="submit"]');
const FORM_ENDPOINT = "https://formsubmit.co/ajax/ilovarluka@gmail.com";

function setMessage(text, type) {
  messageEl.textContent = text;
  messageEl.className = `form-message ${type}`;
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function sendWaitlistEmail(email) {
  const response = await fetch(FORM_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      email,
      source: "ThinkSlack waitlist",
      _subject: "New ThinkSlack waitlist signup",
      _captcha: "false",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to submit waitlist signup");
  }
}

form.addEventListener("submit", async (event) => {
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

  submitButton.disabled = true;
  submitButton.textContent = "Sending...";
  setMessage("Submitting your email...", "success");

  try {
    await sendWaitlistEmail(email);
    list.push(email);
    localStorage.setItem("waitlist", JSON.stringify(list));
    setMessage("You're in. We'll notify you at launch.", "success");
    form.reset();
  } catch (error) {
    setMessage("Submission failed. Please try again.", "error");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Notify me";
  }
});
