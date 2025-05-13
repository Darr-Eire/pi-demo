import { useState } from "react";

export default function Home() {
  const [user, setUser] = useState<{ uid: string; username: string } | null>(null);

  const login = async () => {
    try {
      const result = await window.Pi.authenticate(
        ["username", "payments", "wallet_address"],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (payment: any) => console.log("Incomplete Payment Found:", payment)
      );

      setUser(result.user);

      await fetch("/api/log-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result),
      });
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  const pay = async () => {
    window.Pi.createPayment(
      {
        amount: 3.14,
        memo: "Demo Payment",
        metadata: { demo: true },
      },
      {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onReadyForServerApproval: async (paymentId: any) => {
          await fetch("/api/approve", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paymentId }),
          });
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onReadyForServerCompletion: async (paymentId: any, txid: any) => {
          await fetch("/api/complete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paymentId, txid }),
          });
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onCancel: (paymentId: any) => {
          console.log("Payment cancelled", paymentId);
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any, payment?: any) => {
          console.error("Payment error", error, payment);
        },
      }
    );
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-4 p-8 bg-gray-900 text-white">
      <h1 className="text-4xl font-bold">Pi SDK Demo App</h1>
      {!user ? (
        <button
          onClick={login}
          className="bg-yellow-400 hover:bg-yellow-300 px-6 py-3 rounded-xl text-black"
        >
          Login with Pi
        </button>
      ) : (
        <>
          <div className="text-xl">Welcome, @{user.username}</div>
          <button
            onClick={pay}
            className="bg-green-500 hover:bg-green-400 px-6 py-3 rounded-xl text-black"
          >
            Pay 3.14 π
          </button>
        </>
      )}
    </main>
  );
}
