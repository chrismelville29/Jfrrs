let conferenceID = document.getElementsByName('conference_id')[0].content;

function initialize() {
    loadTable('5000');
}

function loadTable(sortDistance) {
    let url = getBaseURL() + '/api/conferences/' + conferenceID + '/athletes/'+sortDistance;

    fetch(url, {method: 'get'})

    .then((response) => response.json())

    .then(function(athletes) {
        document.getElementById('athletes_table').innerHTML = createTableHTML(athletes);
        document.getElementById('sort_key').innerHTML = sortDistance;
    })

    .catch(function(error) {
        console.log(error);
    });

}

function createHeaderHTML(rlvtKeys) {
    let headerHTML = '<tr><th>Ranking</th><th>Name</th><th>Team</th>';
    for(const key of rlvtKeys) {
        headerHTML+='<th><button onclick="loadTable(\''+key+'\')">'+key+'</button></th>';
    }
    return headerHTML+'</tr>';
}

function createAthleteHTML(athlete) {
    let rowHTML = '<td>'+athlete['name']+'</td><td>'+athlete['team']+'</td>';
    let rlvtTimes = Object.values(athlete['relevant_prs']);
    for(const time of rlvtTimes) {
        rowHTML += '<td>'+fmtTime(time)+'</td>';
    }
    return rowHTML;
}

function createTableHTML(athletes) {
    let tableHTML = createHeaderHTML(Object.keys(athletes[0]['relevant_prs']));
    for(let i = 0; i < athletes.length; i++) {
        tableHTML += '<tr><td>'+(i+1).toString()+'</td>'+createAthleteHTML(athletes[i])+'</tr>';
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

function getBaseURL() {
    let baseURL = window.location.protocol
                    + '//' + window.location.hostname
                    + ':' + window.location.port;
    return baseURL;
}

window.onload = initialize;
