function validateForm(formId, validationRules) {
  const form = document.getElementById(formId);
  const errors = {};

  for (const field in validationRules) {
    const input = form[field];
    const rules = validationRules[field];

    for (const rule of rules) {
      if (rule.required && !input.value.trim()) {
        errors[field] = "This field is required";
        break;
      }

      if (rule.minLength && input.value.length < rule.minLength) {
        errors[field] = `Minimum length is ${rule.minLength} characters`;
        break;
      }

      if (rule.maxLength && input.value.length > rule.maxLength) {
        errors[field] = `Maximum length is ${rule.maxLength} characters`;
        break;
      }

      if (rule.pattern && !rule.pattern.test(input.value)) {
        errors[field] = rule.message || "Invalid input";
        break;
      }

      if (rule.customValidation && !rule.customValidation(input.value)) {
        errors[field] = rule.message || "Invalid input";
        break;
      }
    }
  }

  return errors;
}

function displayErrors(errors) {
  document.querySelectorAll(".error-message").forEach((el) => el.remove());

  for (const field in errors) {
    const input = document.getElementById(field);
    const errorMessage = document.createElement("div");
    errorMessage.className = "error-message";
    errorMessage.textContent = errors[field];
    input.parentNode.insertBefore(errorMessage, input.nextSibling);
  }
}

export const validatePassword = (password) => {
  const minLength = 8;
  const hasNumber = /\d/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  return {
    isValid: password.length >= minLength && hasNumber && hasUpper && hasLower,
    errors: []
      .concat(!hasUpper ? 'Missing uppercase letter' : [])
      .concat(!hasLower ? 'Missing lowercase letter' : [])
      .concat(!hasNumber ? 'Missing number' : [])
      .concat(password.length < minLength ? 'Too short' : [])
  };
};
