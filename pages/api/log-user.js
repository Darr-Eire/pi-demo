import clientPromise from '@/lib/mongodb';

export default async function handler(req, res) {
  const db = (await clientPromise).db();
  const { user } = req.body;
  await db.collection('users').updateOne(
    { uid: user.uid },
    { $set: { username: user.username } },
    { upsert: true }
  );
  res.status(200).json({ success: true });
}
