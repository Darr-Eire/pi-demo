export default async function handler(req, res) {
  const { paymentId, txid } = req.body;
  const apiKey = process.env.PI_API_KEY;

  const result = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/complete`, {
    method: 'POST',
    headers: {
      Authorization: `Key ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ txid })
  });

  const data = await result.json();
  res.status(200).json(data);
}
