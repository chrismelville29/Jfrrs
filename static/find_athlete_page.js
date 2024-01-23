function initialize() {
    setConferenceSelectorHTML();

    let findButton = document.getElementById('find_athlete_button');
    findButton.onclick = onFindButton;
}

window.onload = initialize;

function onFindButton() {
    let athleteName = document.getElementById('athlete_name').value;
    let athleteConferenceID = document.getElementById('athlete_conference_selector').value;
    let comparisonConferenceID = document.getElementById('comparison_conference_selector').value;
    let errorMessage = document.getElementById('error_message');
    let athletesTable = document.getElementById('athletes_table');
    if(athleteName == "") {
        errorMessage.innerHTML = "Please enter athlete.";
        return;
    }

    let url = getBaseURL() + '/api/find_athlete';
    let post = {method: 'post',
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
        name: athleteName,
        athlete_conference: athleteConferenceID,
        comparison_conference: comparisonConferenceID})};

    fetch(url, post)

    .then((response) => response.json())

    .then(function(athletes) {
        if(athletes.length == 0) {
            errorMessage.innerHTML = "Could not find '"+athleteName+"'";
            athletesTable.innerHTML = "";
        }
        else {
            athletesTable.innerHTML = createTableHTML(athletes);
            errorMessage.innerHTML = "";
        }
    })

    .catch(function(error) {
        console.log(error);
    });


}

function createHeaderHTML(rlvtKeys) {
    let headerHTML = '<tr><th>Similarity</th><th>Name</th><th>Team</th>';
    for(const key of rlvtKeys) {
        headerHTML+='<th>'+key+'</th>';
    }
    return headerHTML+'</tr>';
}

function createAthleteHTML(athlete) {
    let rowHTML = '<td>'+athlete['distance'].toFixed(2)+'</td><td>'+athlete['name']+'</td><td>'+athlete['team']+'</td>';
    let prs = athlete['relevant_prs'];
    let colors = athlete['colors'];
    for(const event of Object.keys(prs)) {
        rowHTML += '<td';
        if(event in colors) {
            rowHTML += ' bgcolor=' + colors[event];
        }
        rowHTML += '>'+fmtTime(prs[event])+'</td>';
    }
    return rowHTML;
}

function createTableHTML(athletes) {
    let tableHTML = createHeaderHTML(Object.keys(athletes[0]['relevant_prs']));
    for(let i = 0; i < athletes.length; i++) {
        tableHTML += '<tr>'+createAthleteHTML(athletes[i])+'</tr>';
    }
    return tableHTML;
}

function fmtTime(seconds) {
    if(seconds == 100000) {
        return '--';
    }
    let minutes = parseInt(seconds/60);
    seconds = (seconds - minutes*60).toFixed(2);
    if (seconds.split('.')[0].length < 2) {
        seconds = "0"+seconds;
    }
    return minutes.toString()+':'+seconds;
}

function setConferenceSelectorHTML() {
    let url = getBaseURL() + '/api/available_conferences';

    fetch(url, {method: 'get'})

    .then((response) => response.json())

    .then(function(conferences) {
        let options = "";
        for(const id of Object.keys(conferences)) {
            options += "<option value ='" + id + "'>" + conferences[id] + "</option>";
        }
        document.getElementById('athlete_conference_selector').innerHTML = options;
        document.getElementById('comparison_conference_selector').innerHTML = options;
    })

    .catch(function(error) {
        console.log(error);
    });
}

function getBaseURL() {
    let baseURL = window.location.protocol
                    + '//' + window.location.hostname
                    + ':' + window.location.port;
    return baseURL;
}