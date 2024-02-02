import database from "infra/database";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  // 1) versao do Postgres
  const dbVersionResult = await database.query("SHOW server_version;");
  const dbVersionValue = dbVersionResult.rows[0].server_version;
  // 2) conexoes maximas
  const dbMaxConnectionsResult = await database.query("SHOW max_connections;");
  const dbMaxConnectionsValue = dbMaxConnectionsResult.rows[0].max_connections;
  // 3) conexoes usadas
  const dbName = process.env.POSTGRES_DB;
  const dbOpenConnectionsResult = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [dbName],
  });
  const dbOpenConnectionsValue = dbOpenConnectionsResult.rows[0].count;

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        status: "",
        max_connections: parseInt(dbMaxConnectionsValue),
        opened_connections: dbOpenConnectionsValue,
        latency: {},
        version: dbVersionValue,
      },
      webserver: {},
    },
  });
}

export default status;
