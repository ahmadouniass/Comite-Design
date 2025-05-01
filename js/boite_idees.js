// Gestion du Modal
const modal = document.getElementById('idea-modal');
const openModalBtn = document.getElementById('open-modal');
const closeModalBtn = document.querySelector('.close');

openModalBtn.onclick = () => {
    modal.style.display = "block";
};

closeModalBtn.onclick = () => {
    modal.style.display = "none";
};

window.onclick = (event) => {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

// JSONBin Setup
const jsonBinApiKey = '$2a$10$dp5UO108x.5VkCxGtZ/lYeDMCop61PGhq1iJQe..z5ClGTKLDgyGW';
const jsonBinUrl = 'https://api.jsonbin.io/v3/b/67a0f35aad19ca34f8f93001';
let ideas = [];

// Sélecteurs
const form = document.getElementById('idea-form');
const ideasList = document.getElementById('ideas-list');
const ideaInput = document.getElementById('idea-input');

// Charger les idées existantes depuis JSONBin
async function loadIdeas() {
    try {
        const response = await fetch(jsonBinUrl, {
            headers: {
                'X-Master-Key': jsonBinApiKey,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Erreur lors du chargement des idées.');
        }

        const data = await response.json();
        ideas = data.record.ideas || [];
        renderIdeas();
    } catch (error) {
        console.error('Erreur de chargement:', error);
    }
}

// Afficher les idées dans la grille
function renderIdeas() {
    ideasList.innerHTML = "";

    ideas.forEach((idea) => {
        const ideaItem = document.createElement('div');
        ideaItem.className = 'idea-item';
        ideaItem.innerHTML = `
            <div class="idea-text">${idea.idea}</div>
            <div class="idea-date">Soumis le ${idea.date}</div>
        `;
        ideasList.appendChild(ideaItem);

        // Animation douce à l'apparition
        setTimeout(() => {
            ideaItem.classList.add('visible');
        }, 100);
    });
}

// Soumettre une idée vers JSONBin
async function submitIdea() {
    const idea = ideaInput.value.trim();

    if (idea === "") {
        alert("Veuillez entrer une idée avant de soumettre !");
        return;
    }

    const newIdea = {
        idea: idea,
        date: new Date().toLocaleString()
    };

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
            ideaInput.value = "";
            modal.style.display = "none";
            renderIdeas();
            showToast("✅ Idée envoyée avec succès !");
            setTimeout(scrollToIdeasSection, 500); // 🚀 Scroller après 0.5s
        } else {
            alert("Erreur lors de la soumission.");
        }
    } catch (error) {
        alert("Erreur de connexion au serveur.");
    }
}

// Créer et afficher un toast
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    // Forcer l'affichage
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    // Retirer après 3 secondes
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 500);
    }, 3000);
}

// Soumission du formulaire
form.addEventListener('submit', function(event) {
    event.preventDefault();
    submitIdea();
});

function scrollToIdeasSection() {
    const ideasSection = document.querySelector('.ideas-section');
    if (ideasSection) {
      ideasSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
  

// Charger les idées au démarrage
loadIdeas();
