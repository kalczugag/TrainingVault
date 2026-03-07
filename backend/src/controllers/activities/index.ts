import { exportActivity } from "./export";
import { readActivities } from "./read";
import { fetchAndSaveActivities } from "./readAndSave";
import { readActivityById } from "./readById";
import { fetchAndSaveActivityStream } from "./syncStream";

const methods = {
    read: readActivities,
    readById: readActivityById,
    readAndSave: fetchAndSaveActivities,
    syncStream: fetchAndSaveActivityStream,
    export: exportActivity,
};

export default methods;
