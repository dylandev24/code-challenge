export async function fetchTokens() {
  const res = await fetch("https://interview.switcheo.com/prices.json");
  return res.json();
}
