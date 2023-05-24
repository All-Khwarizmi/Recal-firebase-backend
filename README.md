# Recal-firebase-backend

This is where all the Recal flutter application backend logic is located. 

I tryed to manage all the business logic and user data on local, however I hit some limitations, most of all on Ios devices (background processes, local notifications). 

So I decided to manage all the heavy lifting on Firebase:

- Authentication, anonymous for now
- Database: Firestore for realtime like feeling and off line handling
- Business logic: Cloud Functions and Firebase Cloud Notifications

## Business logic 

The business logic is mainly devided into tow big parts

- Processing application events
- Sending notifications

### Handling events

### Notifications
