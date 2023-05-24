# Recal-firebase-backend

This is where all the Recal flutter application backend logic is located. 

I tryed manage all the business logic a user data on local, however I hit some limitations, mostofall on Ios devices (background processes, local notifications). 

So I decided to manage all the heavy lifting on Firebase:

- Authentication, anonymous for now
- Database: Firestore for realtime like feeling and off line handling
- Business logic: Cloud Functions and Firebase Cloud Notifications

## Business logic 
