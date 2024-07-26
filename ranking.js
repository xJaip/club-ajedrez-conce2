document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('./data/Resultados/ranking2023.csv');
        const csvText = await response.text();
        const players = parseCSV(csvText);

        document.getElementById('filter-button').addEventListener('click', () => {
            const yearSelect = document.getElementById('year-select');
            const categorySelect = document.getElementById('category-select');

            const selectedYear = yearSelect.value;
            const selectedCategory = categorySelect.value;

            const urlParams = new URLSearchParams(window.location.search);
            urlParams.set('year', selectedYear);
            urlParams.set('category', selectedCategory);
            window.history.replaceState({}, '', `${window.location.pathname}?${urlParams.toString()}`);

            const filteredPlayers = players.filter(player => 
                player.year === selectedYear && player.category === selectedCategory
            );

            filteredPlayers.sort((a, b) => b.puntos - a.puntos);

            const tournaments = groupByTournament(filteredPlayers);

            updateTournamentTabs(tournaments);
            updateTournamentContent(tournaments);
            updateTournamentDropdown(tournaments);
        });

        const urlParams = new URLSearchParams(window.location.search);
        const yearParam = urlParams.get('year') || '2024';
        const categoryParam = urlParams.get('category') || 'Sub-10';

        document.getElementById('year-select').value = yearParam;
        document.getElementById('category-select').value = categoryParam;

        document.getElementById('filter-button').click();

        // Check URL parameters for tournament
        const tournamentParam = urlParams.get('tournament');
        if (tournamentParam) {
            const selectedElement = document.querySelector(`#tournament-${tournamentParam}`);
            if (selectedElement) {
                const tab = new bootstrap.Tab(selectedElement);
                tab.show();
                document.getElementById('tournament-dropdown').value = `tournament-${tournamentParam}`;
            }
        }
    } catch (error) {
        console.error('Error fetching ranking:', error);
    }
});

function parseCSV(text) {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',');

    return lines.slice(1).map(line => {
        const values = line.split(',');
        const player = {};
        headers.forEach((header, index) => {
            player[header] = values[index];
        });
        return player;
    });
}

function groupByTournament(players) {
    return players.reduce((tournaments, player) => {
        if (!tournaments[player.tournament]) {
            tournaments[player.tournament] = [];
        }
        tournaments[player.tournament].push(player);
        return tournaments;
    }, {});
}

function updateTournamentTabs(tournaments) {
    const tournamentTabs = document.getElementById('tournament-tabs');
    while (tournamentTabs.firstChild) {
        tournamentTabs.removeChild(tournamentTabs.firstChild);
    }

    Object.keys(tournaments).forEach((tournament, index) => {
        const tab = document.createElement('li');
        tab.className = 'nav-item';

        const button = document.createElement('button');
        button.className = `nav-link ${index === 0 ? 'active' : ''}`;
        button.id = `tab-${tournament}`;
        button.setAttribute('data-bs-toggle', 'tab');
        button.setAttribute('data-bs-target', `#tournament-${tournament}`);
        button.setAttribute('type', 'button');
        button.setAttribute('role', 'tab');
        button.setAttribute('aria-controls', `tournament-${tournament}`);
        button.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
        button.textContent = `Torneo ${tournament}`;

        // Add click event to update URL
        button.addEventListener('click', () => {
            const urlParams = new URLSearchParams(window.location.search);
            urlParams.set('tournament', tournament);
            window.history.replaceState({}, '', `${window.location.pathname}?${urlParams.toString()}`);
            document.getElementById('tournament-dropdown').value = `tournament-${tournament}`;
        });

        tab.appendChild(button);
        tournamentTabs.appendChild(tab);
    });
}

function updateTournamentContent(tournaments) {
    const tournamentContent = document.getElementById('tournament-content');
    while (tournamentContent.firstChild) {
        tournamentContent.removeChild(tournamentContent.firstChild);
    }

    Object.keys(tournaments).forEach((tournament, index) => {
        const content = document.createElement('div');
        content.className = `tab-pane fade ${index === 0 ? 'show active' : ''}`;
        content.id = `tournament-${tournament}`;
        content.setAttribute('role', 'tabpanel');

        const list = document.createElement('ul');
        list.className = 'list-group';

        tournaments[tournament].forEach(player => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item';
            listItem.textContent = `${player.nombre} - ${player.puntos} puntos`;
            list.appendChild(listItem);
        });

        content.appendChild(list);
        tournamentContent.appendChild(content);
    });
}

function updateTournamentDropdown(tournaments) {
    const tournamentDropdown = document.getElementById('tournament-dropdown');
    while (tournamentDropdown.firstChild) {
        tournamentDropdown.removeChild(tournamentDropdown.firstChild);
    }

    Object.keys(tournaments).forEach((tournament) => {
        const option = document.createElement('option');
        option.value = `tournament-${tournament}`;
        option.textContent = `Torneo ${tournament}`;
        tournamentDropdown.appendChild(option);
    });

    tournamentDropdown.addEventListener('change', (event) => {
        const selectedId = event.target.value.replace('tournament-', '');
        const selectedElement = document.querySelector(`#tab-${selectedId}`);

        if (selectedElement) {
            const urlParams = new URLSearchParams(window.location.search);
            urlParams.set('tournament', selectedId);
            window.history.replaceState({}, '', `${window.location.pathname}?${urlParams.toString()}`);
            const tab = new bootstrap.Tab(selectedElement);
            tab.show();
        }
    });
}
