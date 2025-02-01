from flask import Flask, render_template, request, jsonify
import os
from flask_cors import CORS
#import openai

import firebase_admin
from firebase_admin import db,storage,credentials
import datetime
import sys
from Firebase.pdf import pdf_conv
from Firebase.firebase_stuff import create_doctor_account, upload_pdf_to_bucket, download_prescription, login_firebase
#from Firebase.pharmacist import pharmacist
from Firebase.register_firebase import registration



cred = credentials.Certificate('Firebase/credentials_new.json')
firebase_admin.initialize_app(
    cred,
    {'databaseURL' : 'https://dr-writely-default-rtdb.asia-southeast1.firebasedatabase.app/','storageBucket': 'dr-writely.appspot.com'}
)

bucket = storage.bucket()

app = Flask(__name__)
CORS(app)

# Set your OpenAI API key
#openai.api_key = ''

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/login',methods=['POST','GET'])
def login():
    data = request.get_json()
    res = login_firebase(db,data)
    if res == 1:
        return jsonify({'status':200,'message':'OK'})
    elif res == 0:
        return jsonify({'status':404,'message':'User not found'})
    else:
        return jsonify({'status':401,'message':'Incorrect password'})

@app.route('/register', methods=['POST','GET'])
def register_doctor():
    data = request.get_json()
    print(data)
    registration(data,db)
    return jsonify({'status':200,'message':'OK'})


@app.route('/upload_audio', methods=['POST'])
def upload_audio():
    if 'audio' not in request.files or 'patientName' not in request.form:
        return jsonify({'message': 'No audio file or patient name provided'}), 400

    audio = request.files['audio']
    patient_name = request.form['patientName']
    folder_path = os.path.join('C:/Prescribe', patient_name)

    if not os.path.exists(folder_path):
        os.makedirs(folder_path)

    audio_path = os.path.join(folder_path, audio.filename)
    audio.save(audio_path)

    return jsonify({'message': 'Audio uploaded successfully'})

@app.route('/transcribe_audio', methods=['POST'])
def transcribe_audio():
    # if 'audio' not in request.files:
    #     return jsonify({'message': 'No audio file provided'}), 400

    # audio = request.files['audio']
    # audio_path = os.path.join('C:/Prescribe', audio.filename)
    # # audio.save(audio_path)

    # with open(audio_path, 'rb') as audio_file:
    #     response = openai.Audio.transcribe(
    #         model="whisper-1",
    #         file=audio_file
    #     )

    # transcription = response['text']
    # os.remove(audio_path)

    #testing start
    transcription = "Hello, how are you?"
    #testing end


    print(transcription)
    return jsonify({'transcription': transcription})

@app.route('/save_transcript', methods=['POST'])
def save_transcript():
    data = request.get_json()
    patient_name = data.get('patientName')
    transcript = data.get('transcript')

    # if not patient_name or not transcript:
    #     return jsonify({'message': 'Patient name or transcript not provided'}), 400

    # folder_path = os.path.join('Prescribe', patient_name)
    # if not os.path.exists(folder_path):
    #     os.makedirs(folder_path)

    # transcript_path = os.path.join(folder_path, 'transcript.txt')
    # with open(transcript_path, 'w') as file:
    #     file.write(transcript)
    print(patient_name, transcript)
    return jsonify({'message': 'Transcript saved successfully'})


@app.route('/test',methods=['GET','POST'])
def test():
    data = request.get_json()
    print(data)
    return jsonify({'message':'Test successful'})


if __name__ == '__main__':
    app.run(debug=True, port = 5000)



