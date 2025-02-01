def get_doctor(doc_ph,db):
    result = {}
    refCred = db.reference(f'/Creds')
    chx = refCred.get()
    doc = [j for i,j in ch.items() if i in [doc_ph]]
    doc_name = doc[0]['name']
    refD = db.reference(f'/User/Doctor/{doc_name}')
    refC = db.reference(f'/User/Patient')
    ch = refD.get()
    patients = [i for i in ch.keys()]
    chP = refC.get()
    for i,j in chP.items():
        if i in patients:
            for k in j:
                temp_dict = {'patient_phno': '', 'Date': '', 'Diagnosis': '', 'medication': ''}
                temp_dict['Date']=(j[k]['date'])
                temp_dict['Diagnosis']=(j[k]['diagnosis'])
                temp_dict['medication']=(j[k]['medication'])
                temp_dict['patient_phno']=(i)
                result[k] = temp_dict
    return result
    

def get_patient(phno,db):
    result = {}
    refP = db.reference(f'/User/Patient/{phno}')
    chP = refP.get()
    refD = db.reference(f'/User/Doctor')
    chD = refD.get()
    appts = [i for i in chP.keys()]
    print(appts)
    for i,j in chD.items():
        temp_dict = {'date':'','diagnosis':'','medication':[]}
        if phno in list(j.keys()):
            for k in appts:
                print(j[phno][k])
                if k in j[phno].keys():
                    temp_dict['date'] = j[phno][k]['date']
                    temp_dict['diagnosis'] = j[phno][k]['diagnosis']
                    temp_dict['medication'] = j[phno][k]['medication']
                    result[i].append(temp_dict)
    return result

def get_pharmacist(db):
    result = {}
    refPharm = db.reference('/Creds')
    ch = refPharm.get()
    for i,j in ch.items():
        result[i] = j
    return result
            
