# Drive Tutorial

## TODO

- [x] Set up database and data model
- [x] Move folder open state to URL
- [x] Add auth
- [x] Add file uploading
- [x] Add analytics
- [x] Make sure sort order is consistent
- [x] Real homepage + onboarding
- [x] Delete files button

## Follow ups

### Folder deletion

Make sure you fetch all of the folders that has it as a parent, and their children too

### Folder creation

Make a server action that takes a name and parentId, and creates a folder with the name and parentId (don't forget to set the ownerId)

### Access control

Check if user is owner before showing the folder page
