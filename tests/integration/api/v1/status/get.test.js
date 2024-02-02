test("GET to api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3002/api/v1/status");
  expect(response.status).toBe(200);

  const responseBody = await response.json();

  const parseUpdatedAt = new Date(responseBody.updated_at).toISOString();
  expect(responseBody.updated_at).toEqual(parseUpdatedAt);

  const db = responseBody.dependencies.database;
  // versao do Postgres
  expect(db.version).toEqual("16.0");
  // conexoes maximas
  expect(db.max_connections).toEqual(100);
  // conexoes usadas
  expect(db.opened_connections).toEqual(1);
});
