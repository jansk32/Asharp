import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';
import firebase from 'firebase';

// Return image object
export function pickImage() {
    return new Promise((resolve, reject) => {
        ImagePicker.showImagePicker(response => {
            if (!response.didCancel) {
                resolve({ uri: response.uri });
            }
        });
    });
}

// Return URL of uploaded image
export async function uploadImage(uri) {
    const Blob = RNFetchBlob.polyfill.Blob;
    const fs = RNFetchBlob.fs;
    window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
    window.Blob = Blob;

    const mime = 'image/jpg';
    const uploadUri = uri;
    const sessionId = new Date().getTime();
    let uploadBlob = null;
    const imageRef = firebase.storage().ref('images').child(sessionId.toString());

    const data = await fs.readFile(uploadUri, 'base64');
    const blob = await Blob.build(data, { type: `${mime};BASE64` });
    uploadBlob = blob;
    await imageRef.put(blob, { contentType: mime });
    uploadBlob.close();
    const url = await imageRef.getDownloadURL();
    return url;
}