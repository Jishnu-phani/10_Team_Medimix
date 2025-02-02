from flask import Flask, render_template, request, jsonify
import os
from flask_cors import CORS
import openai
import datetime

import firebase_admin
from firebase_admin import db,storage,credentials
import datetime
import sys
from Firebase.pdf import pdf_conv
from Firebase.firebase_stuff import create_doctor_account, upload_pdf_to_bucket, download_prescription, login_firebase, delete_pharm
#from Firebase.pharmacist import pharmacist
from Firebase.register_firebase import registration
from Firebase.text_formatting import formatting
from transformers import pipeline
from Firebase.fetch_records import get_doctor,get_patient, get_pharmacist

device = 0
pipe = pipeline(model='Bhaveen/500medimix', device=device,return_timestamps=True)


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

@app.route('/get_doctor_data/<phno>',methods=['POST','GET'])
def get_doctor_data(phno):
    data = get_doctor(phno,db)
    print(data)
    return jsonify({"data":data,"status":200})

@app.route('/get_pharmacistx',methods=['POST','GET'])
def get_pharmacistx():
    data = get_pharmacist(db)
    return jsonify(data)

@app.route('/download_pdf/<appt>', methods = ['POST', 'GET'])
def download_pdf(appt):
    download_prescription(appt,bucket)
    return jsonify({'message':'OK','status':200})
        

@app.route('/get_patient_datax/<phno>',methods=['POST','GET'])
def get_patient_datax(phno):
    data = get_patient(phno,db)
    return jsonify(data)

@app.route('/mark_as_delivered/<name>',methods=['POST','GET'])
def mark_as_delivered(name):
    delete_pharm(name,db)
    return jsonify({'message':'OK','status':200})

@app.route('/upload_audio', methods=['POST'])
def upload_audio():
    if 'audio' not in request.files or 'patientphno' not in request.form:
        return jsonify({'message': 'No audio file or patient name provided'}), 400

    audio = request.files['audio']
    # patient_phno = request.form['patientphno']
    # folder_path = os.path.join('C:/Prescribe', patient_phno)
    folder_path = r"C:\Users\gteja\Documents\Prescribe_recordings"

    if not os.path.exists(folder_path):
        os.makedirs(folder_path)

    audio_path = os.path.join(folder_path, audio.filename)
    audio.save(audio_path)

    return jsonify({'message': 'Audio uploaded successfully'})

@app.route('/transcribe_audio', methods=['POST'])
def transcribe_audio():
    if 'audio' not in request.files:
        return jsonify({'message': 'No audio file provided'}), 400

    audio = r"C:\Users\gteja\Documents\Prescribe_recordings\recording.mp3"
    print(audio)
    print(request.files)
    transcription = pipe(audio)
    text = transcription['text']
    # this is a sample transcription
    # transcription = "Yes, four is what? Closetectomy, left rear assist. All right, let's do it. Thank you. What is the history? Line-based negative? Levered is fine. Spline is fine. Gold butter? No, starting with the gold fossa, Come close to me. Pancras is fine. Thumbuck is fine. Mobile loops are fine. We just add them. What do we do? Just add them in. Add three-centimum left-wing assist. Apprentices, a bigger, simple assist. Apprentices 15, HU. Okay. Oh, before we do that, right to premium. Erdan, we'll come on to the classification. IVC and remarkable. No, no, bring it up with the right key. Normal. Left key, need normal, but add assist. Comparison, stable. All right. Eleves and geeks, chest to views. Zero, orange. Raul, P.A.5. Left, left ankle. Right knee, zero, one, two. Now foot zero one two. All fractures neck of third worth of fifth the right"
    print(text)
    return jsonify({'transcription': text, })

@app.route('/save_transcript', methods=['POST'])
def save_transcript():
    now = datetime.datetime.now()
    s = [now.year, now.month, now.day, now.hour, now.minute]
    strx = ""
    for i in s:
        strx += str(i) if i>9 else '0'+str(i)
    data = request.get_json()
    patient_phno = data.get('patientphno')
    transcript = data.get('transcript')

    print(patient_phno, transcript)
    text = formatting(transcript)
    lines = text.strip().split('\n')
    meds = []
    diagnosis = ""
    for line in lines:
        if ':' in line:
            head, content = line.split(':', 1)
            if head.strip() in ['Medication']:
                meds = content.split(',')
            if head.strip() in ['Medical condition/Inference']:
                diagnosis = content

            else:
                print(line.strip())

    upload_pdf_to_bucket(patient_phno,strx,path=r'C:\Users\gteja\Documents\Prescribe_recordings\patient_record.pdf',bucket=bucket)
    create_doctor_account(strx,data['doctorName'],patient_phno,diag = diagnosis, medicines = meds,text=transcript,db=db)        #(data,doctor,patient,medicines,text,db)
    return jsonify({'message': 'Transcript saved successfully'})

@app.route('/download_prescription', methods=['POST','GET'])

@app.route('/test',methods=['GET','POST'])
def test():
    data = request.get_json()
    print(data)
    return jsonify({'message':'Test successful'})


if __name__ == '__main__':
    app.run(debug=True, port = 5000)