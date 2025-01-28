document.addEventListener("DOMContentLoaded", function () {
    const homePage = document.getElementById("home-page");
    const historyPage = document.getElementById("history-page");
    const ideaList = document.querySelector(".idea-list");
    const prevPageButton = document.getElementById("prev-page");
    const nextPageButton = document.getElementById("next-page");
    const currentPageSpan = document.getElementById("current-page");
    const ideaInput = document.getElementById("idea-input");
    const popup = document.getElementById("idea-popup");
    const thankYouPopup = document.getElementById("thank-you-popup");
    const closePopupButton = document.getElementById("close-popup");
    const closeThankYouButton = document.getElementById("close-thank-you");
    const ideasPerPage = 5; // Limite à 5 idées par page
    let ideas = []; // Liste des idées
    let currentPage = 1;

    // Fonction pour afficher les idées pour la page courante
    function showPage(page) {
        const startIndex = (page - 1) * ideasPerPage;
        const endIndex = startIndex + ideasPerPage;
        const ideasToShow = ideas.slice(startIndex, endIndex);

        ideaList.innerHTML = ""; // Réinitialise la liste d'idées

        ideasToShow.forEach((idea) => {
            const ideaItem = document.createElement("div");
            ideaItem.className = "idea-item";
            ideaItem.innerHTML = `
                <span class="idea-text">${idea.text}</span>
                <span class="idea-date">Soumis le ${idea.date}</span>
            `;
            ideaList.appendChild(ideaItem);
        });

        currentPageSpan.textContent = page;

        // Gestion des boutons de pagination
        prevPageButton.disabled = page === 1; // Désactiver "Précédent" si on est sur la première page
        nextPageButton.disabled = endIndex >= ideas.length; // Désactiver "Suivant" si on est sur la dernière page
    }

    // Fonction pour ajouter une nouvelle idée
    function addIdea(text, date) {
        ideas.unshift({ text, date }); // Ajouter l'idée au début du tableau pour que les plus récentes soient en premier
        currentPage = 1; // Revenir à la première page
        showPage(currentPage); // Afficher les idées
    }

    // Navigation entre les pages
    prevPageButton.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            showPage(currentPage);
        }
    });

    nextPageButton.addEventListener("click", () => {
        if ((currentPage - 1) * ideasPerPage + ideasPerPage < ideas.length) {
            currentPage++;
            showPage(currentPage);
        }
    });

    // Navigation entre Accueil et Historique des idées
    document.getElementById("home-link").addEventListener("click", () => {
        homePage.style.display = "block";
        historyPage.style.display = "none";
    });

    document.getElementById("history-link").addEventListener("click", () => {
        homePage.style.display = "none";
        historyPage.style.display = "block";
        showPage(currentPage);
    });

    // Gestion de l'envoi d'une nouvelle idée
    document.getElementById("submit-idea").addEventListener("click", () => {
        const ideaText = ideaInput.value.trim();
        if (ideaText) {
            const currentDate = new Date().toLocaleDateString();
            addIdea(ideaText, currentDate);
            ideaInput.value = ""; // Réinitialiser le champ texte
            popup.style.display = "none"; // Fermer le pop-up
            thankYouPopup.style.display = "flex"; // Afficher le pop-up de remerciement
        }
    });

    // Fermer les pop-ups
    closePopupButton.addEventListener("click", () => {
        popup.style.display = "none";
    });

    closeThankYouButton.addEventListener("click", () => {
        thankYouPopup.style.display = "none";
    });

    // Ouvrir le pop-up pour soumettre une idée
    document.getElementById("idea-button").addEventListener("click", () => {
        popup.style.display = "flex";
    });
});
