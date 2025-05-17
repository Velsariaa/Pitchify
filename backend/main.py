from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import json

app = Flask(__name__)
cors = CORS(app, origins='*')

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

class PitchDeck(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    title = db.Column(db.String(200))
    refined_problem = db.Column(db.Text)
    slides = db.Column(db.Text)  # Store as JSON string

    user = db.relationship('User', backref=db.backref('pitch_decks', lazy=True))

with app.app_context():
    db.create_all()

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    if User.query.filter_by(username=username).first():
        return jsonify({'message': 'Username already exists'}), 400
    hashed_pw = generate_password_hash(password)
    new_user = User(username=username, password=hashed_pw)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User registered successfully'})

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    user = User.query.filter_by(username=username).first()
    if user and check_password_hash(user.password, password):
        return jsonify({'message': 'Login successful'})
    return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/api/users', methods=['GET'])
def users():
    user_list = [user.username for user in User.query.all()]
    return jsonify({"users": user_list})

@app.route('/api/pitch-decks', methods=['POST'])
def save_pitch_deck():
    data = request.json
    username = data.get('username')
    pitch = data.get('pitch')
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({'message': 'User not found'}), 404
    new_deck = PitchDeck(
        user_id=user.id,
        title=pitch.get('pitchTitle'),
        refined_problem=pitch.get('refinedProblem'),
        slides=json.dumps(pitch.get('slides', []))
    )
    db.session.add(new_deck)
    db.session.commit()
    return jsonify({'message': 'Pitch deck saved', 'deck_id': new_deck.id})

@app.route('/api/pitch-decks', methods=['GET'])
def get_pitch_decks():
    username = request.args.get('username')
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({'message': 'User not found'}), 404
    decks = PitchDeck.query.filter_by(user_id=user.id).all()
    result = []
    for deck in decks:
        result.append({
            'id': deck.id,
            'pitchTitle': deck.title,
            'refinedProblem': deck.refined_problem,
            'slides': json.loads(deck.slides)
        })
    return jsonify({'pitchDecks': result})

@app.route('/api/pitch-decks/<int:deck_id>', methods=['GET'])
def get_pitch_deck(deck_id):
    deck = PitchDeck.query.get(deck_id)
    if not deck:
        return jsonify({'message': 'Pitch deck not found'}), 404
    return jsonify({
        'id': deck.id,
        'pitchTitle': deck.title,
        'refinedProblem': deck.refined_problem,
        'slides': json.loads(deck.slides)
    })

if __name__ == '__main__':
    app.run(debug=True, port=3000)
