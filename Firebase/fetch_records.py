# def get_doctor(doc_ph,db):
#     result = {}
#     refCred = db.reference(f'/Creds')
#     chx = refCred.get()
#     doc = [j for i,j in chx.items() if i in [doc_ph]]
#     doc_name = doc[0]['name']
#     refD = db.reference(f'/User/Doctor/{doc_name}')
#     refC = db.reference(f'/User/Patient')
#     ch = refD.get()
#     patients = [i for i in ch.keys()]
#     chP = refC.get()
#     for i,j in chP.items():
#         if i in patients:
#             for k in j:
#                 temp_dict = {'patient_phno': '', 'Date': '', 'Diagnosis': '', 'medication': ''}
#                 temp_dict['Date']=(j[k]['date']).strip()
#                 temp_dict['Diagnosis']=(j[k]['diagnosis']).strip()
#                 temp_dict['medication']=(j[k]['medication'])
#                 temp_dict['patient_phno']=(i).strip()
#                 result[k] = temp_dict
#     return result

def get_doctor(doc_ph, db):
    try:
        result = {}
        # Get doctor credentials
        refCred = db.reference('/Creds')
        chx = refCred.get()
        doc = [j for i,j in chx.items() if i in [doc_ph]]
        if not doc:
            return {"error": "Doctor not found"}
        
        doc_name = doc[0]['name']
        
        # Get doctor's patients
        refD = db.reference(f'/User/Doctor/{doc_name}')
        refC = db.reference('/User/Patient')
        
        ch = refD.get()
        if not ch:
            return {"error": "No patient records found"}
            
        patients = list(ch.keys())
        chP = refC.get()

        # Process patient records
        for patient_ph, records in chP.items():
            if patient_ph in patients:
                for record_id, record in records.items():
                    
                    result[record_id] = {
                        'patient_phno': patient_ph.strip(),
                        'date': record.get('date', '').strip(),
                        'diagnosis': record.get('diagnosis', '').strip(),
                        'medication': record.get('medication', []),
                        'doctor_name': doc_name,
                        'appt':record_id
                    }
        
        return {
            "status": "success",
            "data": result,
            "doctor_name": doc_name
        }
        
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }
    

def get_patient(phno,db):
    
    refP = db.reference(f'/User/Patient/{phno}')
    chP = refP.get()
    refD = db.reference(f'/User/Doctor')
    chD = refD.get()
    refCred = db.reference(f'/Creds')
    chx = refCred.get()
    #print(chx.items())
    doc = [j for i,j in chx.items() if i in [phno]]
    result = {doc[0]['name']:[]}    
    appts = [i for i in chP.keys()]
    #print(appts)
    for i,j in chD.items():
        temp_dict = {'date':'','diagnosis':'','medication':[],'Doc_name':''}
        if phno in list(j.keys()):
            for k in appts:
                #print(i,j)
                if k in j[phno].keys():
                    
                    temp_dict['date'] = j[phno][k]['date']
                    temp_dict['diagnosis'] = j[phno][k]['diagnosis']
                    temp_dict['medication'] = j[phno][k]['medication']
                    temp_dict['appt'] = k
                    temp_dict['Doc_name'] = i
                    result[doc[0]['name']].append(temp_dict)
    return result

def get_pharmacist(db):
    result = {}
    refPharm = db.reference('/Pharm')
    ch = refPharm.get()
    for i,j in ch.items():
        result[i] = j
    return result
            
