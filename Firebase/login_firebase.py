# need to get data from login page and server.
# after getting the data from login page, we need to check if the data is present in the server.
# send authentication confirmation to server.

# get data from server in the form of {email: email, password: password}
data = {}  #after fetching from server

    
def login_firebase(data, db):
    # Get reference to Creds node
    ref = db.reference("/Creds/")
    
    # Check if email exists in database
    user = ref.get()

    
    if data['phone'] not in list(user.keys()):
        return {'status': 'error', 'message': 'phone number not registered'}
    
    ch = ref.child(data['phone'])

    # Validate password
    if (dict(ch.get()))['password'] == data['password']:
        return {
            'status': 'success',
            'message': 'Login successful',
            'user_data': user,
        }
    else:
        return {'status': 'error', 'message': 'Invalid password'}