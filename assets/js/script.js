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


document.addEventListener("DOMContentLoaded", function () {
    const themeToggle = document.getElementById("theme-toggle");
    const savedTheme = localStorage.getItem("theme") || "light";

    if (savedTheme === "dark") {
        document.body.classList.add("dark-theme");
        themeToggle.innerHTML = "&#9789;"; // Moon icon for dark mode
    } else {
        document.body.classList.remove("dark-theme");
        themeToggle.innerHTML = "&#9728;"; // Sun icon for light mode
    }

    themeToggle.addEventListener("click", function () {
        document.body.classList.toggle("dark-theme");
        if (document.body.classList.contains("dark-theme")) {
            localStorage.setItem("theme", "dark");
            themeToggle.innerHTML = "&#9789;"; // Moon icon
        } else {
            localStorage.setItem("theme", "light");
            themeToggle.innerHTML = "&#9728;"; // Sun icon
        }
    });
});

class ProjectCard extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const projectName = this.getAttribute('name') || 'Project Name';
        const projectDate = this.getAttribute('date') || 'Date Unknown';
        const projectImage = this.getAttribute('image') || '';
        const projectDesc = this.getAttribute('description') || 'No description available';
        const projectLang = this.getAttribute('languages') || '';
        const projectOutcome = this.getAttribute('outcome') || '';

        this.innerHTML = `
        <article class="project-card">
          <div class="project-info mixed-color">
            <h1 class="wider-color">${projectName}</h1>
            <p>${projectDesc}</p>
            <p><strong>Date:</strong> ${projectDate}</p>
            ${projectLang
                ? `<p><strong>Languages Used:</strong> ${projectLang}</p>`
                : ''
            }
            ${projectOutcome
                ? `<p><strong>Outcome:</strong> ${projectOutcome}</p>`
                : ''
            }
          </div>
          <div class="project-media">
            <img src="${projectImage}" alt="${projectName}" />
          </div>
        </article>
      `;
    }
}

customElements.define('project-card', ProjectCard);

function createProjectCards(projectArray) {
    const container = document.querySelector('.projects-grid');
    container.innerHTML = '';
    projectArray.forEach(project => {
        const card = document.createElement('project-card');
        card.setAttribute('name', project.name);
        card.setAttribute('date', project.date);
        card.setAttribute('image', project.image);
        card.setAttribute('description', project.description);
        card.setAttribute('languages', project.languages);
        card.setAttribute('outcome', project.outcome);
        container.appendChild(card);
    });
}


document.getElementById('load-local').addEventListener('click', () => {
    fetch('./assets/data/projects.json')
        .then(response => response.json())
        .then(data => {
            localStorage.setItem('projects', JSON.stringify(data));
            createProjectCards(data);
        })
        .catch(err => console.error('Error loading local JSON:', err));
});

document.getElementById('load-remote').addEventListener('click', () => {
    fetch('https://my-json-server.typicode.com/datungLA/CSE134-HW5/projects')
        .then(response => response.json())
        .then(data => {
            createProjectCards(data);
        })
        .catch(err => {
            console.error('Error fetching remote data:', err);
        });
});