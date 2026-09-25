
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

          {/* Amount */}
          <div className="mb-5 text-center">
            <p className="text-xs font-semibold uppercase text-slate-500">
              Payment Amount
            </p>

            <div className="mt-1 flex items-center justify-center gap-1 text-3xl font-bold">
              <IndianRupee size={24} />
              {DEFAULT_AMOUNT}
            </div>
          </div>

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

          {/* UPI ID */}
          <div className="mt-5 flex flex-col gap-2 rounded-lg bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs text-slate-500">
                UPI ID
              </p>

              <p className="break-all text-sm font-bold">
                {UPI_ID}
              </p>
            </div>

            <button
              type="button"
              onClick={copyUpiId}
              className="flex w-full items-center justify-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-100 sm:w-auto"
            >
              <Copy size={16} />
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          {/* I Have Paid */}
          <div className="mt-5">
            {!paid ? (
              <button
                type="button"
                onClick={handlePaidClick}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-700"
              >
                <CheckCircle size={20} />
                I Have Paid
              </button>
            ) : (
              <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">
                <CheckCircle size={20} />
                Payment completed. Enter your UTR below.
              </div>
            )}
          </div>

          {/* Verification */}
          <div
            id="payment-verification"
            className="mt-6 border-t pt-6"
          >
            <h2 className="text-lg font-bold">
              Payment Verification
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Enter your mobile number and UTR / transaction ID.
            </p>

            <form
              onSubmit={(event) => {
                event.preventDefault();

                alert(
                  "Payment details submitted successfully. Our team will verify your payment."
                );
              }}
              className="mt-4 space-y-4"
            >
              {/* Mobile */}
              <div>
                <label
                  htmlFor="payment-mobile"
                  className="mb-1 block text-sm font-semibold"
                >
                  Mobile Number
                </label>

                <div className="flex items-center border border-slate-300 bg-white">
                  <div className="flex h-11 w-11 items-center justify-center text-slate-400">
                    <Phone size={18} />
                  </div>

                  <input
                    id="payment-mobile"
                    type="tel"
                    inputMode="numeric"
                    maxLength="10"
                    pattern="[0-9]{10}"
                    placeholder="Enter 10-digit mobile number"
                    required
                    className="h-11 min-w-0 flex-1 border-0 px-2 text-sm outline-none"
                  />
                </div>
              </div>

              {/* UTR */}
              <div>
                <label
                  htmlFor="payment-utr"
                  className="mb-1 block text-sm font-semibold"
                >
                  UTR / Transaction ID
                </label>

                <input
                  id="payment-utr"
                  type="text"
                  placeholder="Enter UTR / Transaction ID"
                  required
                  className="h-11 w-full border border-slate-300 px-3 text-sm outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-bold text-white hover:bg-slate-800"
              >
                Submit Payment Details
              </button>
            </form>
          </div>
        </div>

        {/* Safety */}
        <div className="mt-4 flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
          <ShieldCheck size={18} className="shrink-0" />

          <p>
            Payment karne se pehle UPI ID verify karein:
            <strong> {UPI_ID}</strong>
          </p>
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

