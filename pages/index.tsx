import { useState } from 'react';

export default function Home() {
  const [user, setUser] = useState(null);

  const login = async () => {
    try {
      const result = await window.Pi.authenticate(
        ['username', 'payments', 'wallet_address'],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
(payment: any) => console.log('Incomplete Payment Found:', payment)


      );
      setUser(result.user);
      await fetch('/api/log-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result)
      });
    } catch (err) {
      console.error('Login failed', err);
    }
  };

  const pay = async () => {
    window.Pi.createPayment({
      amount: 3.14,
      memo: "Demo Payment",
      metadata: { demo: true }
    }, {
      onReadyForServerApproval: async (paymentId) => {
        await fetch('/api/approve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentId })
        });
      },
      onReadyForServerCompletion: async (paymentId, txid) => {
        await fetch('/api/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentId, txid })
        });
      },
      onCancel: paymentId => console.log('Cancelled', paymentId),
      onError: (err, payment) => console.error('Error', err, payment),
    });
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-4 p-8 bg-gray-900 text-white">
      <h1 className="text-4xl font-bold">Pi SDK Demo App</h1>
      {!user ? (
        <button onClick={login} className="bg-yellow-400 px-6 py-2 rounded-xl text-black">Login with Pi</button>
      ) : (
        <>
          <div className="text-xl">Welcome, @{user.username}</div>
          <button onClick={pay} className="bg-green-500 px-6 py-2 rounded-xl text-black">Pay 3.14 π</button>
        </>
      )}
    </main>
  );
}
