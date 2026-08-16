import { runAgent } from "../agent/run";

runAgent()
  .then((result) => {
    console.log(
      "Agent completed successfully."
    );

    console.log(result);

    process.exit(0);
  })
  .catch((error) => {
    console.error(
      "Agent failed:",
      error
    );

    process.exit(1);
  });