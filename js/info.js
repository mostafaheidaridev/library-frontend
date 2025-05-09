let BASE_URL = "http://127.0.0.1:8080/";

async function detectServer() {
  try {
    const res = await fetch(`${BASE_URL}/health-check`);
    if (!res.ok) throw new Error("Not OK");
  } catch (err) {
    BASE_URL = "http://127.0.0.1:5000/";
  }
}

await detectServer();
export { BASE_URL };