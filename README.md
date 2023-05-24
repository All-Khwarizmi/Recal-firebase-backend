# Recal-firebase-backend

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

<br>

### Handling events

The backend structure follows the guidelines of the package [firebase-backend](https://www.npmjs.com/package/firebase-backend) "that helps with the management and expansion of a maintainable firebase backend". 

So we handle events in two ways:

##### Reactive
Whenever an event on the Firestore database that triggers a cloud function

  
##### RESTful
There are HTTP POST endpoints that when hit make CRUD operations: 

<br>

### Notifications
