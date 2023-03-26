// Validate username
// If username is unavailable, return "User required"
// Or return true
function validateUsername(username) {
    if (username === "") {
      return "Username required";
    }
  
    return true;
}
  
// Validate password
// If password is unavailable, return "Password required"
// If password < 3 characters, return "Password must have at least 3 characters"
// Or return true
function validatePassword(password) {
    if (password === "") {
        return "Password required";
    } else if (password.length < 3) {
        return "Password must have at least 3 characters";
    }
    
    return true;
}
  
// Validate password confirmation
// If confirmation is empty, return "Password confirmation required"
// Password confirmation !== password, return "Password doesn't match"
function validatePasswordConfirmation(passwordConfirmation, password) {
    if (!passwordConfirmation) {
        return "Password confirmation required";
    } else if (passwordConfirmation !== password) {
        return "Password doesn't match";
    }
  
    return true;
}
  
// Valid date email
// If email is empty, return "Email required"
// If email doesn't match a regular expression, return "Email invalid"
// Or return true
function validateEmail(email) {
    if (!email) return "Email required";
  
    const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!re.test(email)) return "Invalid email";
  
    return true;
}
  
// Select the form element
let form = document.querySelector(".form");
  
// Select 4 input elements
// Assign event listener to those inputs
const ids = ["username", "email", "password", "password-confirmation"];
const inputs = ids.map((id) => document.querySelector(`#${id}`));

inputs.forEach((input) => {
    input.addEventListener("input", () => {
        validateFields(input);
    });
});
  
// Add event listener to the form element
// When the submit button is clicked, the data can't be sent
// Each input element is re-validated again
form.addEventListener("submit", (event) => {
    event.preventDefault();
  
    inputs.forEach((input) => validateFields(input));
});
  
// Validate input fields
function displayValidation(input, message, type) {
    const successIcon = input.parentNode.querySelector(".icon-success");
    const errorIcon = input.parentNode.querySelector(".icon-error");
    const errorMessage = document.querySelector(".error-message");
  
    if (type === "success") {
      // display success icon
      successIcon.classList.remove("hidden");
      errorIcon.classList.add("hidden");
      errorMessage.textContent = "";
    } else {
      // display error message & error icon
      successIcon.classList.add("hidden");
      errorIcon.classList.remove("hidden");
      errorMessage.textContent = message;
    }
}
  
function validateFields(input) {
    let message;
    switch (input.id) {
      case "username":
        message = validateUsername(input.value.trim());
        break;
      case "email":
        message = validateEmail(input.value.trim());
        break;
      case "password":
        message = validatePassword(input.value.trim());
        break;
      case "password-confirmation":
        const pwd = document.querySelector("#password").value.trim();
        message = validatePasswordConfirmation(input.value.trim(), pwd);
        break;
      default:
        break;
    }
  
    if (message === true) {
      displayValidation(input, "", "success");
    } else {
      displayValidation(input, message, "error");
    }
}
  