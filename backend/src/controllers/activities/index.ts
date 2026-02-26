import { exportActivity } from "./export";
import { readActivities } from "./read";
import { fetchAndSaveActivities } from "./readAndSave";
import { fetchAndSaveActivityStream } from "./syncStream";

const methods = {
    read: readActivities,
    readAndSave: fetchAndSaveActivities,
    syncStream: fetchAndSaveActivityStream,
    export: exportActivity,
};

export default methods;
