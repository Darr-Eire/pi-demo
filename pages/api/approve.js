export default async function handler(req, res) {
  const { paymentId } = req.body;
  const apiKey = process.env.PI_API_KEY;

  const result = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
    method: 'POST',
    headers: { Authorization: `Key ${apiKey}` }
  });

  const data = await result.json();
  res.status(200).json(data);
}
