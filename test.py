from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle


class FlaskTests(TestCase):
    def setUp(self):
        self.client = app.test_client()
        app.config['TESTING'] = True
    
    def test_intialization(self):
        response = self.client.get('/')
        self.assertIn('board', session)
        self.assertIsNone(session.get('highscore'))
        self.assertIn(b'Seconds Left:', response.data)
        self.assertIn(b'Score:', response.data)

    def test_word_check(self):
        with self.client as client:
            with client.session_transaction() as sess:
                sess['board'] = [["P", "E", "T", "E", "R"], 
                                 ["P", "E", "T", "E", "R"], 
                                 ["P", "E", "T", "E", "R"], 
                                 ["P", "E", "T", "E", "R"], 
                                 ["P", "E", "T", "E", "R"]]
                response = self.client.get('/check-word?word=peter')
                self.assertEqual(response.json['result'], 'ok')
            

    def test_invalid_word(self):
        self.client.get('/')
        response = self.client.get('/check-word?word=petunia')
        self.assertEqual(response.json['result'], 'not-on-board')

    def test_dictionary(self):
        self.client.get('/')
        response = self.client.get('/check-word?word=ahadkfhasn')
        self.assertEqual(response.json['result'], 'not-word')