# Recal-firebase-backend

<br>

This is where all the Recal flutter application backend logic is located. 

I tryed to manage all the business logic and user data on local, however I hit some limitations, most of all on Ios devices (background processes, local notifications). 

So I decided to manage all the heavy lifting on Firebase:

- Authentication, anonymous for now
- Database: Firestore for realtime like feeling and off line handling
- Business logic: Cloud Functions and Firebase Cloud Notifications

<br>

## Business logic 

The business logic is mainly devided into tow big parts:

- Processing application events
- Sending notifications


### Handling events

The backend structure follows the guidelines of the package [firebase-backend](https://www.npmjs.com/package/firebase-backend) "that helps with the management and expansion of a maintainable firebase backend". 

So we handle events in three ways:

#### Reactive
Whenever an event on the Firestore database that triggers a cloud function:
- On user created:
- On quizz created
- On question created: 
- On quizz done:

  
#### RESTful
There are HTTP POST endpoints that when hit make CRUD operations: 
- Create an user
- Create a quizz
- Create a question

#### Task queue
Task queue functions that run periodicaly to:
- Check if a user needs to take a quizz and notify him

<br>

### Notifications
