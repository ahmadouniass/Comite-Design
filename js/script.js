document.addEventListener("DOMContentLoaded", function () {
    const jsonBinApiKey = '$2a$10$dp5UO108x.5VkCxGtZ/lYeDMCop61PGhq1iJQe..z5ClGTKLDgyGW';
    const jsonBinUrl = 'https://api.jsonbin.io/v3/b/67a0f35aad19ca34f8f93001';
    const messageDiv = document.getElementById('message');
    const ideaList = document.querySelector(".idea-list");
    const ideaInput = document.getElementById('ideaInput');
    const showIdeaFormButton = document.getElementById('showIdeaFormButton');
    const ideaFormContainer = document.getElementById('ideaFormContainer');

    const homePage = document.getElementById('home-page');
    const historyPage = document.getElementById('history-page');

    let ideas = [];

    // Charger les idées existantes depuis JSONBin
    async function loadIdeas() {
        try {
            const response = await fetch(jsonBinUrl, {
                headers: {
                    'X-Master-Key': jsonBinApiKey,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error("Erreur lors du chargement des idées.");
            }

            const data = await response.json();
            ideas = data.record.ideas || [];
            renderIdeas();  // Affiche immédiatement les idées après le chargement
        } catch (error) {
            console.error('Erreur de chargement:', error);
        }
    }

    // Afficher les idées dans la section "Historique des idées"
    function renderIdeas() {
        ideaList.innerHTML = "";  // Réinitialise la liste

        ideas.forEach((idea) => {
            const ideaItem = document.createElement("div");
            ideaItem.className = "idea-item";
            ideaItem.innerHTML = `
                <div class="idea-text">${idea.idea}</div>
                <div class="idea-date">Soumis le ${idea.date}</div>
            `;
            ideaList.appendChild(ideaItem);
        });
    }

    // Soumettre une nouvelle idée
    async function submitIdea() {
        const idea = ideaInput.value.trim();

        if (idea === "") {
            messageDiv.textContent = "Veuillez entrer une idée avant de la soumettre.";
            messageDiv.style.color = "red";
            return;
        }

        const newIdea = { idea: idea, date: new Date().toLocaleString() };
        ideas.unshift(newIdea);

        try {
            const response = await fetch(jsonBinUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': jsonBinApiKey,
                    'X-Bin-Versioning': 'false'
                },
                body: JSON.stringify({ ideas })
            });

            if (response.ok) {
                messageDiv.textContent = "Votre idée a été soumise avec succès !";
                messageDiv.style.color = "green";
                ideaInput.value = "";  // Réinitialise la zone de texte
                renderIdeas();  // Met à jour l'affichage des idées
            } else {
                messageDiv.textContent = "Une erreur s'est produite lors de la soumission.";
                messageDiv.style.color = "red";
            }
        } catch (error) {
            messageDiv.textContent = "Erreur de connexion au serveur.";
            messageDiv.style.color = "red";
        }
    }

    // Navigation entre les pages
    document.getElementById('home-link').addEventListener('click', () => {
        homePage.style.display = 'block';
        historyPage.style.display = 'none';
    });

    document.getElementById('history-link').addEventListener('click', () => {
        homePage.style.display = 'none';
        historyPage.style.display = 'block';
        renderIdeas();  // Affiche les idées lors de la navigation vers la page historique
    });

    showIdeaFormButton.addEventListener('click', () => {
        ideaFormContainer.style.display = 'block';
        showIdeaFormButton.style.display = 'none';
    });

    document.getElementById('submitIdeaButton').addEventListener('click', submitIdea);

    // Charger les idées au démarrage
    loadIdeas();
});
