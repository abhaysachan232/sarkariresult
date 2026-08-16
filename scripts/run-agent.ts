import {
  runAgent,
} from "../agent/run";

runAgent()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(
      "Agent failed:",
      error
    );

    process.exit(1);
  });
