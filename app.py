'''
    app.py
    Chris Melville
    Fantasy Track
'''
import flask
import argparse
import api

app = flask.Flask(__name__, static_folder='static', template_folder='templates')
app.register_blueprint(api.api, url_prefix='/api')


@app.route('/')
def load_homepage():
    return flask.render_template('homepage.html')

@app.route('/athletes/<conference>')
def load_athletes_page(conference):
    return flask.render_template('athletes_page.html',conference_id=conference)

@app.route('/find_athlete')
def load_find_athlete_page():
    return flask.render_template('find_athlete_page.html')


if __name__ == '__main__':
    parser = argparse.ArgumentParser('A track and field viewing application')
    parser.add_argument('host', help='the host to run on')
    parser.add_argument('port', type=int, help='the port to listen on')
    arguments = parser.parse_args()
    app.run(host=arguments.host, port=arguments.port, debug=True)
