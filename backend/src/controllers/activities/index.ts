import { readActivities } from "./read";
import { fetchAndSaveActivities } from "./readAndSave";
import { fetchAndSaveActivityStream } from "./syncStream";

const methods = {
    read: readActivities,
    readAndSave: fetchAndSaveActivities,
    syncStream: fetchAndSaveActivityStream,
};

export default methods;
