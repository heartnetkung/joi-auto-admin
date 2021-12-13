import axios from "axios";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { nanoid } from "nanoid";

const NOOP = () => null;
var fb = null;
const getFirebase = (firebaseConfig) => {
	if (!fb) fb = getStorage(initializeApp(firebaseConfig));
	return fb;
};

export const handleFileUpload = (props) => {
	const { uploadFile, getUploadUrl, firebaseConfig } = props;

	//manual upload
	if (typeof uploadFile === "function")
		return { uploadFile: uploadFile, uploadFileInit: NOOP };
	//gcs style
	else if (typeof getUploadUrl === "function")
		return {
			uploadFile: async (file) => {
				var url = await getUploadUrl(file.type, file.name);
				await axios.put(url, file, {
					headers: { "Content-Type": file.type },
				});
				return url;
			},
			uploadFileInit: NOOP,
		};
	else if (firebaseConfig) {
		return {
			uploadFile: async (file) => {
				const fileName = props.prefixFileName
					? `${props.prefixFileName}-${nanoid()}`
					: nanoid();
				const pathReference = props.collectionName
					? `${props.collectionName}/${fileName}`
					: `defaultCollections/${fileName}`;
				const storageRef = ref(getFirebase(), pathReference);
				await uploadBytes(storageRef, file);
				return await getDownloadURL(storageRef);
			},
			uploadFileInit: () => getFirebase(firebaseConfig),
		};
	}
	return { uploadFile: NOOP, uploadFileInit: NOOP };
};
