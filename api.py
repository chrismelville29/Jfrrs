'''
    api.py
    Christopher Melville

    Flask API to support tfrrs enhancement

'''
import flask
from flask import request
import json
import numpy

relevant_distances = ['800','1000','1500','MILE','3000','5000','10,000','3000S']

def get_conference_json(conference):
    with open('data/'+conference+'.txt','r') as file:
        return json.loads(file.read())

def pr_weights(prs, means, std_devs):
    weights = {}
    min_weight = 100000
    for distance in prs:
        if prs[distance] != 100000:
            weight = (prs[distance] - means[distance]) / std_devs[distance]
            weights[distance] = weight
            if weight < min_weight:
                min_weight = weight
    for weight in weights:
        weights[weight] -= min_weight
    return weights

def find_shared_events(athlete1, athlete2):
    athlete1_shared = {}
    athlete2_shared = {}
    for event in athlete1['relevant_prs']:
        if athlete1['relevant_prs'][event] != 100000 and athlete2['relevant_prs'][event] != 100000:
            athlete1_shared[event] = athlete1['relevant_prs'][event]
            athlete2_shared[event] = athlete2['relevant_prs'][event]
    return {'athlete1':athlete1_shared, 'athlete2':athlete2_shared}

def new_similarity(athlete1, athlete2, means, std_devs):
    numerator = 0
    denominator = 0
    numerator_weights1 = pr_weights(athlete1['relevant_prs'], means, std_devs)
    numerator_weights2 = pr_weights(athlete2['relevant_prs'], means, std_devs)
    shared = find_shared_events(athlete1, athlete2)
    denominator_weights1 = pr_weights(shared['athlete1'], means, std_devs)
    denominator_weights2 = pr_weights(shared['athlete2'], means, std_devs)
    for event in shared['athlete1']:
        athlete1_time = athlete1['relevant_prs'][event]
        athlete2_time = athlete2['relevant_prs'][event]
        stdized_difference = abs((athlete1_time - athlete2_time) / std_devs[event])
        numerator += numpy.exp(-stdized_difference - numerator_weights1[event] - numerator_weights2[event])
        denominator += numpy.exp(-denominator_weights1[event] - denominator_weights2[event])
    if denominator == 0:
        return 0
    return numerator / denominator

def similarity(athlete1, athlete2, std_devs):
    similarity = 0
    shared_events = 0
    min_crossover = 3
    for relevant_distance in relevant_distances:
        athlete1_time = athlete1['relevant_prs'][relevant_distance]
        athlete2_time = athlete2['relevant_prs'][relevant_distance]
        if athlete1_time != 100000 and athlete2_time != 100000:
            stdized_difference = abs((athlete1_time - athlete2_time) / std_devs[relevant_distance])
            similarity += numpy.exp(-stdized_difference)
            shared_events += 1
    return similarity / max(shared_events, min_crossover)

def event_colors(weights):
    colors = {}
    for event in weights:
        red_blue = hex(255 - int(numpy.exp(-weights[event]) * 255))[2:4]
        if len(red_blue) == 1:
            red_blue = "0" + red_blue
        color = "#" + red_blue + "ff" + red_blue
        colors[event] = color
    return colors

def find_neighbors(tar_athlete, conference_id):
    conference = get_conference_json(conference_id)
    athletes = conference['athletes']
    std_devs = conference['stats']['std_devs']
    means = conference['stats']['means']
    sort_key = lambda athlete: -new_similarity(tar_athlete, athlete, means, std_devs)
    neighbors = sorted(athletes, key=sort_key)[:10]
    if(tar_athlete['name'] != neighbors[0]['name']):
        neighbors.insert(0, tar_athlete)
    for neighbor in neighbors:
        neighbor['distance'] = new_similarity(neighbor, tar_athlete, means, std_devs)
        weights = pr_weights(neighbor['relevant_prs'], means, std_devs)
        neighbor['colors'] = event_colors(weights)
    return neighbors

api = flask.Blueprint('api', __name__)

@api.route('/conferences/<conference>/athletes/<sort_distance>')
def get_athletes(conference, sort_distance):
    sort_key = lambda athlete: (athlete['relevant_prs'][sort_distance],athlete['name'])
    athletes = get_conference_json(conference)['athletes']
    return json.dumps(sorted(athletes,key=sort_key))

@api.route('find_athlete', methods = ['POST'])
def find_athlete():
    user_input = request.json
    conference = get_conference_json(user_input['athlete_conference'])
    for athlete in conference['athletes']:
        if athlete['name'].lower() == user_input['name'].lower():
            return json.dumps(find_neighbors(athlete, user_input['comparison_conference']))
    return json.dumps([])

@api.route('available_conferences')
def find_available_conferences():
    with open('data/conferences.txt','r') as file:
        return json.loads(file.read())




