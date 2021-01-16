from flask import Flask,render_template,request, jsonify, redirect,url_for,flash, session,send_from_directory
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import IntegrityError
from flask_marshmallow import Marshmallow
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import time
import string
import random
import os

"""
   **e-loan management system**

   basic application to request loan from customer portal, which will be handle by agent and send to admin 
   for approval.. update and editing can be done both agent and admin, customer will get customer key just after
   the submission of application. by using this key customer can check current status or changes in there application 
   from customer portal...
"""

UPLOAD_FOLDER = 'C:\\xampp\\htdocs\\reactjs\\static\\images'
ALLOWED_EXTENSIONS = { 'png', 'jpg', 'jpeg'}

# start flask app
app = Flask(__name__)
# set secret key for flask session
app.secret_key = os.urandom(24)
# setting upload folder for images 
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
# connect to database using db link:
# here we are using mysql for this application
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:@localhost/redCarpet'

# flask-SQLAlchemy instance to work with database
db = SQLAlchemy(app)
# marshmallow is used to jsonify database rows.
ma = Marshmallow(app)

# define app models here...
# both adminstration and application table must exist in database to 
# work with... 
# Columns: id name phone username password role user_img created_at updated_at deleted_at
class administration(db.Model):
   id = db.Column(db.Integer, primary_key = True)
   name = db.Column(db.String(36), nullable = False)
   phone = db.Column(db.String(14), nullable = False)
   username = db.Column(db.String(255), unique = True, nullable = False)
   password = db.Column(db.String(255), unique = True, nullable = False)
   role = db.Column(db.String(10), nullable = True)
   user_img = db.Column(db.Text, nullable = True)
   created_at = db.Column(db.String(14), nullable = False)
   updated_at = db.Column(db.String(14), nullable = True)
   deleted_at = db.Column(db.String(14), nullable = True)

class application(db.Model):
   id = db.Column(db.Integer, primary_key = True)
   customer_id = db.Column(db.String(16), unique = True, nullable = False)
   name =db.Column(db.String(36), nullable = False)
   phone = db.Column(db.String(14), unique = True)
   Address = db.Column(db.Text, nullable = False)
   dob = db.Column(db.String(12), nullable = False)
   loan_type= db.Column(db.String(128), nullable = False)
   loan_amount = db.Column(db.Integer, nullable = False)
   loan_term = db.Column(db.Integer, nullable = False)
   interest_rate = db.Column(db.Float, default = '18', nullable = True )
   user_img = db.Column(db.Text, nullable= True )
   user_id_num = db.Column(db.String(16), nullable = False)
   user_id_img = db.Column(db.Text, nullable = False)
   agent_check = db.Column(db.Integer, default = '0' , nullable = True)
   approved = db.Column(db.Integer, default = '0', nullable = True)
   created_at = db.Column(db.String(14), nullable = False)
   updated_at = db.Column(db.String(14), nullable = True)
   deleted_at = db.Column(db.String(14), nullable = True)

# Marshmallow class to jsonify db table instances..
class applicationSchema(ma.Schema):
  class Meta:
        # Fields to expose
        fields = (
           "id",
           "customer_id",
           "name", 
           "phone", 
           "Address", 
           "dob", 
           "loan_type", 
           "loan_amount", 
           "loan_term",
           "interest_rate",
           "user_img",
           "user_id_num",
           "user_id_img",
           "agent_check",
           "approved",
           "created_at",
           "updated_at",
           "deleted_at",
         )

class administrationSchema(ma.Schema):
  class Meta:
        # Fields to expose
        fields = ("name","username", "role", "user_img")

# creating instances for db tables..
application_schema = applicationSchema()
applications_schema = applicationSchema(many = True)
administration_schema = administrationSchema()

# secret key genrator..
def id_generator(size=6, chars=string.ascii_lowercase + string.ascii_uppercase + string.digits):
   return ''.join(random.choice(chars) for _ in range(size))

# allowed file extensions..
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def setCsrf():
   csrf = id_generator(64)
   session['csrf-Token'] = csrf
   return csrf

"""
 from here all application routes defined
 only these urls will send respose otherwise it shows 404 error page..
 we are using react so to look like single page application we are rendering
 only home page.. where react router render component as needed
"""
@app.route('/')
def home():
   return  render_template('home.html', __csrf__ = setCsrf())

# dashboard 
@app.route('/dashboard')
def dashboard():
   return  render_template('home.html', __csrf__ = setCsrf()) 

# register agent or admin
@app.route('/register-new-administrator', methods = ['GET','POST'])
def register():
   if (request.method == 'POST') :
      data = request.get_json()
      try:
         if data:
            row = administration.query.all()
            if row:
               if 'username' in session:
                  role =  "agent"
               else:
                  return jsonify({"message" : "only admin can register agents!!"})
            else:
               role = "admin"
            entry = administration(
               name = data['name'],
               phone = data['phone'],
               username = data['username'],
               password = generate_password_hash(data['password']),
               role = role,
               created_at = datetime.now()
            )
            db.session.add(entry)
            db.session.commit()
            return jsonify({"csrf": setCsrf(), "success" : f"{role} register successfully! page will redirect in 5 sec.."})
      except (IntegrityError) as error:
         return jsonify({"message" : "duplicate key error!!"})
      else:
         return jsonify({'message' : f'{role} not register due to technical error!!'})
   elif (request.method == 'GET'):
      return  render_template('home.html', __csrf__ = setCsrf())

# conditional login for agent or admin
@app.route('/login/<role>', methods = ['GET','POST'])
def login(role):
   if (request.method == 'POST'):
      data = request.get_json()
      if data['_token'] == session['csrf-Token']:
         if (data['username']):
            if (data['role'].casefold() == role.casefold()):
               row = administration.query.filter_by(username = data['username'],role = role.casefold()).first()
               if row:
                  result = check_password_hash(row.password, data['password'])
                  if result:
                     session['username'] = row.username
                     return administration_schema.jsonify(row)
                  else:
                     return jsonify("password did not match!!")
               else: 
                  return jsonify('username does not exist!!')
            else:
               return jsonify('user role not defined!!')
         else:
            return jsonify('username cant be empty!')
      else:
         return jsonify("token is not valid!!")
   elif (request.method == 'GET'):
      return  render_template('home.html', __csrf__ = setCsrf()) 

@app.route('/check-login-status')
def checkLoginStatus():
   if 'username' in session:
      row = administration.query.filter_by(username = session['username']).first()
      if row:
         return administration_schema.jsonify(row)
   return jsonify(False)

@app.route('/logout')
def logout():
   if 'username' in session:
      session.pop('username', None)
   return  jsonify(True)

@app.route('/upload-image', methods = ['POST'])
def uploadImg():
   if (request.method == 'POST'):
      if 'file' not in request.files:
            return jsonify({"message":"please upload valid file"})
      img = request.files['file']
      if img.filename == '':
         return jsonify({"message":"filename can't be empty"})
      if img and allowed_file(img.filename):
         filename = secure_filename(img.filename)
         try:
            if 'username' in session:
               username = session['username']
               row = administration.query.filter_by(username = username).first()
               if row:
                  if row.user_img:
                     if os.path.exists(os.path.join(app.config['UPLOAD_FOLDER'], "admin/"+row.user_img)):
                        os.remove(os.path.join(app.config['UPLOAD_FOLDER'], "admin/"+row.user_img))
                  row.user_img = filename
                  row.updated_at = datetime.now()
                  db.session.commit()
                  img.save(os.path.join(app.config['UPLOAD_FOLDER'], "admin/"+filename))
                  return jsonify({"filename":filename,"message":"file uploaded successfully!!"})
         except:
            return jsonify({"message":'image could not upload! try after some time'})

@app.route('/upload-customer-images', methods = ['POST'])
def uploadImgs():
   if (request.method == 'POST'):
      if 'customerImg' not in request.files:
         return jsonify({"message":"please upload valid customer image"})
      if 'idImg' not in request.files:
         return jsonify({"message":"please upload valid id image"})

      customerImg = request.files['customerImg']
      idImg = request.files['idImg']

      if (customerImg.filename == '' or idImg.filename == ''):
         return jsonify({"message":"filename can't be empty"})
      
      try:
         if customerImg and allowed_file(customerImg.filename):
            cFile = secure_filename(customerImg.filename)
            if os.path.exists(os.path.join(app.config['UPLOAD_FOLDER'], "customer/"+cFile)):
               os.remove(os.path.join(app.config['UPLOAD_FOLDER'], "customer/"+cFile))
            customerImg.save(os.path.join(app.config['UPLOAD_FOLDER'], "customer/"+cFile))
         if idImg and allowed_file(idImg.filename):
            idFile = secure_filename(idImg.filename)
            if os.path.exists(os.path.join(app.config['UPLOAD_FOLDER'], "idCard/"+idFile)):
               os.remove(os.path.join(app.config['UPLOAD_FOLDER'], "idCard/"+idFile))
            idImg.save(os.path.join(app.config['UPLOAD_FOLDER'], "idCard/"+idFile))
         return jsonify({"cFile": cFile,"idFile": idFile})
      except:
         return jsonify({"message":'image could not upload! try after some time'})
      

@app.route('/user-request-form-loan', methods= ['POST'])
def create():
   if (request.method == 'POST'):
      try:
         data = request.get_json()
         if(data):
            if data['_token'] == session['csrf-Token']:
               customerId = id_generator(16)
               entry = application(
                  customer_id = customerId,
                  name = data['name'],
                  phone = data['phone'],
                  Address = data['address'],
                  dob = data['dob'],
                  loan_type = data['l_type'],
                  loan_amount = data['l_amnt'],
                  loan_term = data['l_term'],
                  user_img = data['customerImg'],
                  user_id_num = data['aadhar_num'],
                  user_id_img = data['idImg'], 
                  created_at = datetime.now()
               )
               db.session.add(entry)
               db.session.commit()
               return jsonify({"csrf": setCsrf(), "message": f'your loan request submited successfuly!! \
                  your customer id is "{customerId}", save it to check your status for approval'})
            return jsonify({"message" : "token is not valid!!"})
         else:
            return jsonify({"message" : "there is no data to create!!"})
      except:
         return jsonify({"message": 'application can not submit due to technical error, please try later!!'})
      
@app.route('/check-application-status', methods = ['POST'])
def checkStatus():
   try:
      data = request.get_json()
      if(data):
         if data['_token'] == session['csrf-Token']:
            if(data['customer_id']):
               row = application.query.filter_by(customer_id=data['customer_id']).first()
               return jsonify({"row" : application_schema.dump(row), "csrf": setCsrf()}) if row else jsonify({"message" : "customer key not exist!!"})
            return jsonify({"message" : "please type valid customer key!!"})
         else:
            return jsonify({"message" : "token is not valid!!"})
   except:
      return jsonify({"message" : "can not fetch customer application!!"})

@app.route('/user-application', methods = ['POST'])
def getById():
   if 'username' in session:
      data = request.get_json()
      if(data['id']):
         data = application.query.get(data['id'])
         return application_schema.jsonify(data) if data else jsonify("id not exist!!")
      return jsonify("field not available!!")
   else:
      return jsonify("please login first!!")


@app.route('/get-applications')
def showAll():
   if 'username' in session:
      data = application.query.all()
      return applications_schema.jsonify(data)
   else:
      return jsonify(False)

@app.route('/update-user-profile',methods = ['POST'])
def update():
   if 'username' in session:
      try:
         data = request.get_json()
         if data['_token'] == session['csrf-Token']:
            if (data['customer_id']):
               _db = application.query.filter_by(customer_id=data['customer_id']).first()
               _db.name = data['name']
               _db.phone = data['phone']
               _db.dob = data['dob']
               _db.Address = data['address']
               _db.loan_type = data['l_type']
               _db.loan_amount = data['l_amnt']
               _db.loan_term = data['l_term']
               _db.interest_rate = data['interest']
               _db.updated_at = datetime.now()
               db.session.commit()
               return jsonify({"csrf": setCsrf(), 'message':'data updated successfully!!'})
            return jsonify({'message':'customer_id not exist!!'})
         else:
            return jsonify({'message':'token is not valid'})
      except:
         jsonify({'message':'some technical error!!'})
   else:
      return jsonify({'message':'please login first!!'})


@app.route('/approve-application',methods = ['POST'])
def approve():
   if 'username' in session:
      try:
         data = request.get_json()
         if data['_token'] == session['csrf-Token']:
            if (data['customer_id']):
               _db = application.query.filter_by(customer_id=data['customer_id']).first()
               _db.approved = int(time.time())
               db.session.commit()
               return jsonify({'csrf': setCsrf(), 'message':'application approved successfully!!'})
            return jsonify({'message':'customer_id not exist!!'})
         else:
            return jsonify({'message':'token is not valid'})
      except:
         return jsonify({'message':'application can not approve, due to technical error!!'})
   else:
      return jsonify({'message':'please login first!!'})


@app.route('/forword-user-profile',methods = ['POST'])
def forword():
   if 'username' in session:
      try:
         data = request.get_json()
         if data['_token'] == session['csrf-Token']:
            if (data['customer_id']):
               _db = application.query.filter_by(customer_id=data['customer_id']).first()
               _db.agent_check = 1
               _db.deleted_at = None
               db.session.commit()
               return jsonify({'csrf': setCsrf(), 'message':'application forworded to admin for approval!!'})
            return jsonify({'message':'customer_id not exist!!'})
         else:
            return jsonify({'message':'token is not valid'})
      except:
         return jsonify({'message':'application can not forword, due to technical error!!'})
   else:
      return jsonify({'message':'please login first!!'})



@app.route('/delete-user-profile',methods = ['POST'])
def delete():
   if 'username' in session:
      try:
         data = request.get_json()
         if data['_token'] == session['csrf-Token']:
            if (data['customer_id']):
               _db = application.query.filter_by(customer_id=data['customer_id']).first()
               _db.agent_check = 0
               _db.deleted_at = datetime.now()
               db.session.commit()
               return jsonify({'csrf': setCsrf(),'message':'application rejected successfully!!'})
            return jsonify({'message':'customer_id not exist!!'})
         else:
            return jsonify({'message':'token is not valid'})
      except:
         return jsonify({'message':'application can not reject, due to technical error!!'})
   else:
      return jsonify({'message':'please login first!!'})


@app.route('/delete-permanently-user-profile',methods = ['POST'])
def destroy():
   if 'username' in session:
      try:
         data = request.get_json()
         if data['_token'] == session['csrf-Token']:
            if (data['id']):
               _db = application.query.filter_by(id=data['id']).first()
               db.session.delete(_db)
               db.session.commit()
               return jsonify({'csrf': setCsrf(),'message':'application deleted successfully!!'})
            return jsonify({'message':'customer_id not exist!!'})
         else:
            return jsonify({'message':'token is not valid'})
      except:
         return jsonify({'message':'application can not delete, due to technical error!!'})
   else:
      return jsonify({'message':'please login first!!'})
      

# start app server in development mode:
app.run(debug=True)