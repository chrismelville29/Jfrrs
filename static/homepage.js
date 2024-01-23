function initialize() {
    setConferenceSelectorHTML();

    let conferenceButton = document.getElementById('conference_selector_button');
    conferenceButton.onclick = onConferenceSelectorButton;
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
        document.getElementById('conference_selector').innerHTML = options;
    })

    .catch(function(error) {
        console.log(error);
    });
}

function onConferenceSelectorButton() {
    let userChoice = document.getElementById('conference_selector').value;
    let link = getBaseURL() + '/athletes/'+userChoice;
    window.location.assign(link);
}


function getBaseURL() {
    return window.location.protocol+'//'+window.location.hostname+':'+window.location.port;
}
window.onload = initialize;
