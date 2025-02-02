import datetime

# creates doctor transcript
def create_doctor_account(strx,doctor,patient,diag, medicines,text,db):
    date = str(datetime.date.today())
    ref1 = db.reference(f'/User/Doctor/{doctor}/{patient}')
    ref2 = db.reference(f"/User/Patient/{patient}")
    refC = db.reference(f'/Creds')
    ch = refC.get()
    user = [j for i,j in ch.items() if i in [patient]]
    ref3 = db.reference(f"/Pharm")
    ch1 = ref1.child(strx)
    ch2 = ref2.child(strx)
    ch2.set({'medication': medicines,'date':date, 'diagnosis':diag})
    ch1.set({'date': date,'transcript':text,'diagnosis':diag,'medication':medicines})
    ch3 = ref3.child(user[0]['name'])
    ch3.set({'date': date,'diagnosis':diag,'medication':medicines,'Phone Number':patient})

# this uploads the pdf to the bucket
def upload_pdf_to_bucket(patient,id,path,bucket):
    file_name = id
    blob = bucket.blob(f'{file_name}/{patient}.pdf')
    blob.upload_from_filename(path)

# this downloads the prescription in pdf format
def download_prescription(appt_id,bucket):
    blobs = bucket.list_blobs(prefix=f'{appt_id}/')
    name = ""
    for i in blobs:
        name = (i.name)
    dest_nm = name.split('/')[-1]
    bucket.blob(name).download_to_filename(f'{dest_nm}')

def login_firebase(db,data):
    ref = db.reference(f'/Creds/')
    creds = ref.get()
    if data['phone'] in list(creds.keys()):
        ch = ref.child(data['phone'])
        psw = dict(ch.get())['password']
        if data['password'] == psw:
            return 1
        else:
            return -1   
    else:
        return 0
    
def delete_pharm(name,db):
    ref = db.reference(f'Pharm/{name}')
    ref.set('')
    return
    

        
    
