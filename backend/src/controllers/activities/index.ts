import { fetchAndSaveActivities } from "./readAndSave";
import { fetchAndSaveActivityStream } from "./syncStream";

const methods = {
    readAndSave: fetchAndSaveActivities,
    syncStream: fetchAndSaveActivityStream,
};

export default methods;
