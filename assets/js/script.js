document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const commentInput = document.getElementById("comments");
    const errorMessage = document.getElementById("error-message");
    const infoMessage = document.getElementById("info-message");

    let errors = [];
    let form_errors = [];

    function pushError(array, fieldName, message) {
        array.push({ field: fieldName, message });
    }

    function updateErrorMessage() {
        if (errors.length > 0) {
            errorMessage.innerHTML = errors
                .map(err => `<strong>${err.field}</strong>: ${err.message}`)
                .join("<br>");
        } else {
            errorMessage.textContent = "";
        }
    }

    nameInput.addEventListener("input", function () {
        const nameRegex = /^[A-Za-z ]*$/;
        const validNameFormat = /^[A-Za-z]{1,} [A-Za-z]{1,}$/;
        const nameValue = nameInput.value;
        const lastChar = nameValue[nameValue.length - 1];

        errors = errors.filter(err => err.field !== "Name");

        if (!nameRegex.test(nameValue)) {
            nameInput.value = nameValue.slice(0, -1); // remove bad char
            pushError(errors, "Name", `Invalid character "${lastChar}" used.`);
            pushError(form_errors, "Name", `Invalid character "${lastChar}" used.`);
            nameInput.classList.add("invalid");
        } else if (!validNameFormat.test(nameValue)) {
            pushError(errors, "Name", "Should be in format 'FirstName LastName'.");
            pushError(form_errors, "Name", `Invalid character "${lastChar}" used.`);
            nameInput.classList.add("invalid");
        } else {
            nameInput.classList.remove("invalid");
        }

        updateErrorMessage();
    });

    emailInput.addEventListener("input", function () {
        errors = errors.filter(err => err.field !== "Email");

        if (!emailInput.checkValidity()) {
            pushError(errors, "Email", "Invalid email format.");
            pushError(form_errors, "Email", "Invalid email format.");
            emailInput.classList.add("invalid");
        } else {
            emailInput.classList.remove("invalid");
        }

        updateErrorMessage();
    });

    commentInput.addEventListener("input", function () {
        const commentRegex = /^[a-zA-Z0-9.,!? ]*$/;
        const commentValue = commentInput.value;
        const lastChar = commentValue[commentValue.length - 1];

        errors = errors.filter(err => err.field !== "Comments");

        if (!commentRegex.test(commentValue)) {
            commentInput.value = commentValue.slice(0, -1);
            pushError(errors, "Comments", `Invalid character "${lastChar}" used.`);
            pushError(form_errors, "Comments", `Invalid character "${lastChar}" used.`);
            commentInput.classList.add("invalid");
        } else {
            commentInput.classList.remove("invalid");
        }

        updateErrorMessage();
    });

    commentInput.addEventListener("input", function () {
        const remaining = 200 - commentInput.value.length;
        infoMessage.textContent = `Characters remaining: ${remaining}`;
        infoMessage.style.color = remaining <= 20 ? "orange" : "lightgray";
        if (remaining <= 0) infoMessage.style.color = "red";
    });

    form.addEventListener("submit", function (event) {
        errors = [];

        if (!nameInput.checkValidity()) {
            nameInput.classList.add("invalid");
            pushError(errors, "Name", "This field is required or invalid.");
        } else {
            nameInput.classList.remove("invalid");
        }
        if (!emailInput.checkValidity()) {
            emailInput.classList.add("invalid");
            pushError(errors, "Email", "This field is required or invalid.");
        } else {
            emailInput.classList.remove("invalid");
        }
        if (!commentInput.checkValidity()) {
            commentInput.classList.add("invalid");
            pushError(errors, "Comments", "Must be between 10 and 200 characters, only certain symbols allowed.");
        } else {
            commentInput.classList.remove("invalid");
        }

        updateErrorMessage();

        // Create/update the hidden input "form-errors"
        let errorsInput = document.querySelector("input[name='form-errors']");
        if (!errorsInput) {
            errorsInput = document.createElement("input");
            errorsInput.type = "hidden";
            errorsInput.name = "form-errors";
            form.appendChild(errorsInput);
        }
        errorsInput.value = JSON.stringify(form_errors);

        if (errors.length > 0) {
            event.preventDefault();
        }
    });
});
