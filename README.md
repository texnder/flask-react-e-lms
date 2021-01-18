# e-Loan Management system

	the project requirements is: python, flask, reactjs, mySql

Author:
{ 
	"name" : "Inderjeet",
	 "Email" : "inderjeetchohana1431996@gmail.com" 
}

## Setting Up

To setup this project on docker container you need python and mysql image, to build and run this project use on cmd command  "docker-compose up --build"

project will build and start for you. once your project image build you can open http://localhost:5000 on your browser you'll get home page. if not, please recompile react project using "npm start" command on cmd..

if you get front page it means everything works fine. Now, you can build database and migrate tables by importing 'tables.sql' file  in your database or you can use do it manually or simply use flask method to create table. table structure you'll get in tables.sql file or in 'main.py'. see class administration and application.

once you created database and tables you can configure 'SQLALCHEMY_DATABASE_URI' in 'main.py'. mysql link should be match with your mysql database conifguration. once you set that in write formate you are ready to go.

start docker container and go to http://localhost:5000 on your browser..

if any error occure or any kind of help regarding to this application you need.. please mail me: "texnder.components@gmail.com"

## Application:

application is designed for e-loan request, customer can fill there details through our user portal. loan application will be handle by our agents to check or verify and forworded to our admin to approve it.. 

Once customer submit there form and get 'customer_id', they can check application status by entering there 'customer_id' on customer portal  

### Customer

customer can apply for loan by customer portal simply by filling the form. he needs to upload one photo and id card(eg. aadhar card) by default interest rate is 18% per year. minimun loan approval for one year, interest rate can be manage by agent or admin, customer can contact to them.

after submiting the form customer will get a "customer id", so he needs to wait for 5 sec after submission. if form successfully  submitted page will reload and customer_id will pop-up. customer needs to save that id to check status of the loan application.

### Agent

agent need to log in to agent dashboard for any kind of task performance update delete or forwording to admin. without agent approval admin will not approve any application. this is only for security perpose.

Agent can register only by admin.. 

### Admin 

Admin is the boss. he has all authority and to do anything related database.

admin can add agent through there dashboard and approve any loan application. but here for security admin can only approve forworded application by agent. 

once application forworded, admin can update or reject for review, agent can review and update application and can forword again. 

here customer image and id image cant be update. so customer needs to fill there full details again. 

both 'admin' and 'agent' can delete permanently any loan application, not after approved. 


================================== end =====================================
