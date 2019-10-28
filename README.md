# A# - mementos

## Functionalities of Our Application

### Sign-Up & Login: 
- Sign-up and login using email 
- Implement email and input verification
- After signed up or logged in, the app will remember the user's credentials until they log out.
  
### Family Tree:
- Display the tree structure including profile pictures of each of the family member
- When user press a profile picture, user will be directed to a new screen that shows the details of that user.
- When user do a long press on the profile picuture, user will be given options to either add parents/ spouse/ child. 
- User can add an existing user as a family member
- User can add a dummy user as a family member

### Upload Artefact:
- Uploading the artefact from the app and stored the data into Firebase (for pictures) and MongoDB (other details).
- The uploaded artefact will be displayed on the user's profile screen, timeline and gallery.

### Timeline:
- Display artefacts of all users in the family tree with the corresponding time. 
- Artefacts are sorted based on the dates, starting from the most recent to the most oldest.

### Gallery: 
- Display artefacts in a 3 column grid format of all users in the family tree.
- Display artefacts that are only belong to those in the user's family
   
### Profile page: 
- Display the user's name and date of birth.
- Display the user's profile picture from Firebase. 
- Display artefacts created by the user in a 3 column grid format.

### Notification:
- User will be notified when someone passed an artefact to them.

### Item Detail Page
- When the artefact is selected, the item detail screen will appear
- Display details of the artefact including:
    - Name
    - Value
    - Description
    - Date
- If Edit button is tapped, the page will become editable
- User can fill in fields to edit the details of the artefact