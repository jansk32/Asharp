# A# - mementos

## Functionalities of Our Application

### Sign-Up & Login: 
- Sign-up and login using email 
- Implement email and input verification
- After signed up or logged in, the app will remember the user's credentials until they log out.

### Profile page: 
- Display the user's name and date of birth.
- Display the user's profile picture from Firebase. 
- Display artefacts created by the user in a 3 column grid format.
  
### Family Tree:
- Display the tree structure including profile pictures of each of the family member
- When user press a profile picture, user will be directed to a new screen that shows the details of that user.
- When user do a long press on the profile picuture, user will be given options to either add parents/ spouse/ child. 
- User can add existing users as their family member or create dummy users.
- User can delete the dummy user and replaced it with an existing user. 

### Upload Artefact:
- Uploading the artefact from the app and stored the data into Firebase (for pictures) and MongoDB (other details).
- The uploaded artefact will be displayed on the user's profile screen, timeline and gallery.

### Sending Artefact:
- User can send their own artefact (displayed in their profile/timeline/gallery screen) to other registered family member. 
- When user tapped the "Send Artefact" button, their artefact will not be visible in the profile screen and the ownership details will be changed onto the recipient.  

### Item Detail Page
- When the artefact is selected, the item detail screen will appear
- Display details of the artefact including:
    - Name
    - Value
    - Description
    - Date
- If Edit button is tapped, the page will become editable
- User can fill in fields to edit the details of the artefact

### Timeline:
- Display artefacts of all users in the family tree with the corresponding time. 
- Artefacts are sorted based on the dates, starting from the most recent to the most oldest.

### Gallery: 
- Display artefacts in a 3 column grid format of all users in the family tree.
- Display artefacts that are only belong to those in the user's family

### Notification:
- User will receive a notification when someone passed an artefact to them.
- The history of the notification will be displayed in the notification screen. 
