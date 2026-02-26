import { createPlannedWorkout } from "./create";
import { deletePlannedWorkout } from "./delete";
import { exportPlannedWorkout } from "./export";
import { readPlannedWorkouts } from "./read";
import { updatePlannedWorkout } from "./update";

const methods = {
    read: readPlannedWorkouts,
    create: createPlannedWorkout,
    update: updatePlannedWorkout,
    delete: deletePlannedWorkout,
    export: exportPlannedWorkout,
};

export default methods;
