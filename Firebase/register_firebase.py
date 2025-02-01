# create a ref to the 'creds' section.
# here we store the user details, using the email as the key
# store a role as well under the creds.

data = {'email':'tejaslovespancakes0507@gmail.com','phone':9019942460,}  #after fetching from server

def registration(data,db):
    ref = db.reference(f"/Creds/")
    sub = ref.get()
    if data['phone'] in list(sub.keys()):
        return 'user already exists'
    ch = ref.child(data['phone'])
    ch.set({i:data[i] for i in data if i not in ['phone']})
    return 'success'

# ch.set({i:data[i] for i in data})