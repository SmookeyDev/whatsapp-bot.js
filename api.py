from flask import Flask, request, jsonify
from modules.deep import deepinteligency
from waitress import serve
import logging, os

app = Flask(__name__)
logging.getLogger('werkzeug').setLevel(logging.ERROR)
os.system('clear')


@app.route('/api')
def main():
    try:
        response = deepinteligency(request.args.get('msg'))
        return jsonify({'process': True, 'message': response})
    except Exception as e:
        return jsonify({'process': False, 'message': e})

@app.errorhandler(404)
def page_not_found(e):
    return jsonify({'process': False, 'message': 'route not found'})

if __name__ == '__main__':
    serve(app, host='0.0.0.0', port=8080)