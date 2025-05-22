const { CosmosClient } = require("@azure/cosmos");

// Replace with your actual values
const endpoint = "<COSMOS_DB_URI>";
const key = "<COSMOS_DB_PRIMARY_KEY>";
const databaseId = "taskEstimation";
const containerId = "tasks";

const client = new CosmosClient({ endpoint, key });

async function run() {
  const { database } = await client.databases.createIfNotExists({
    id: databaseId,
  });
  const { container } = await database.containers.createIfNotExists({
    id: containerId,
    partitionKey: { paths: ["/projectId"] },
  });

  const task = {
    id: "task-001",
    projectId: "demo",
    description: "Build landing page with animation",
    actualHours: 8,
  };

  const { resource: createdItem } = await container.items.upsert(task);
  console.log("Inserted item:", createdItem);
}

run().catch((err) => {
  console.error("❌ Error inserting item:", err.message);
});
