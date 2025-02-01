import datetime
now = datetime.datetime.now()
s = [now.year, now.month, now.day, now.hour, now.minute]
strx = ""
for i in s:
    strx += str(i) if i>9 else '0'+str(i)

# creates doctor transcript
def create_doctor_account(data,doctor,patient,medicines,text,db):
    date = str(datetime.date.today())
    ref1 = db.reference(f'/User/Doctor/{doctor}/{patient}')
    ref2 = db.reference(f"/User/Patient/{patient}")
    ch1 = ref1.child(strx)
    ch2 = ref2.child(strx)
    ch2.set({'medication': medicines,'date':date})
    ch1.set({'date': date,'transcript':text})

# this uploads the pdf to the bucket
def upload_pdf_to_bucket(patient,id,path,bucket):
    file_name = id
    blob = bucket.blob(f'{file_name}/{patient}.pdf')
    blob.upload_from_filename(path)

# this downloads the prescription in pdf format
def download_prescription(appt_id,bucket):
    blobs = bucket.list_blobs(prefix=f'{strx}/')
    name = ""
    for i in blobs:
        name = (i.name)
    dest_nm = name.split('/')[-1]
    bucket.blob(name).download_to_filename(f'{dest_nm}')
