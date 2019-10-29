export const BACK_END_ENDPOINT = 'http://asharp-mementos.herokuapp.com';
// export const BACK_END_ENDPOINT = 'http://localhost:3000';

export const ONESIGNAL_ENDPOINT = 'https://onesignal.com/api/v1/notifications';
export const ONESIGNAL_APP_ID = 'f9de7906-8c82-4674-808b-a8048c4955f1';
export const BLANK_PROFILE_PIC_URI = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png';
export const DATE_FORMAT = 'DD-MMM-YYYY';

// Enum type to describe kinship terms, used for adding new family members to family tree
export const KinshipEnum = Object.freeze({
    PARENT: 'parent',
    SPOUSE: 'spouse',
    CHILD: 'child',
});