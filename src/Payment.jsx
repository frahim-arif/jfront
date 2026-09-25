
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  Copy,
  CreditCard,
  IndianRupee,
  Phone,
  ShieldCheck,
} from "lucide-react";

const UPI_ID = "9058596626@ptsbi";
const DEFAULT_AMOUNT = 250;

const Payment = () => {
  const [copied, setCopied] = useState(false);
  const [paid, setPaid] = useState(false);

  const copyUpiId = async () => {
    try {
      await navigator.clipboard.writeText(UPI_ID);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy UPI ID:", error);
    }
  };

  const handlePaidClick = () => {
    setPaid(true);

    setTimeout(() => {
      document
        .getElementById("payment-verification")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-3 py-3 sm:px-5">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-sm font-semibold text-slate-700"
          >
            <ArrowLeft size={18} />
            Back
          </Link>

          <Link
            to="/"
            className="text-xl font-extrabold"
          >
            Job<span className="text-emerald-600">Hir</span>
          </Link>

          <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
            <ShieldCheck size={17} />
            Secure
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto w-full max-w-2xl px-3 py-6 sm:px-5 sm:py-10">

        {/* Heading */}
        <div className="mb-5 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CreditCard size={24} />
          </div>

          <h1 className="text-2xl font-bold sm:text-3xl">
            Pay JobHir
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Scan the QR code and make your payment.
          </p>
        </div>

        {/* Payment Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">

          

          {/* QR */}
          <div className="text-center">
            <p className="mb-3 text-sm font-semibold">
              Scan & Pay
            </p>

            <div className="mx-auto w-full max-w-[280px] border border-slate-200 bg-white p-3">
              <img
                src="/images/jobhir-payment-qr.png"
                alt="JobHir UPI QR Code"
                className="block aspect-square w-full object-contain"
              />
            </div>

            <p className="mt-3 text-xs text-slate-500">
              Scan this QR code using PhonePe, Google Pay,
              Paytm or any UPI app.
            </p>
          </div>

          
        </div>

       

        {/* Home */}
        <div className="mt-5 text-center">
          <Link
            to="/"
            className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
          >
            ← Return to JobHir
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white px-4 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} JobHir. All rights reserved.
      </footer>
    </div>
  );
};

export default Payment;

