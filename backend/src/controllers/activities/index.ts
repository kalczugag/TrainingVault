import { exportActivity } from "./export";
import { readActivities } from "./read";
import { fetchAndSaveActivities } from "./readAndSave";
import { readActivityById } from "./readById";
import { fetchAndSaveActivityStream } from "./syncStream";
import { uploadFitActivity } from "./upload";

const methods = {
    read: readActivities,
    readById: readActivityById,
    readAndSave: fetchAndSaveActivities,
    syncStream: fetchAndSaveActivityStream,
    export: exportActivity,
    upload: uploadFitActivity,
};

export default methods;
