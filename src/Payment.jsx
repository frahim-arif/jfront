
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
  Smartphone,
} from "lucide-react";

const UPI_ID = "9058596626@ptsbi";
const DEFAULT_AMOUNT = 250;

const Payment = () => {
  const [amount, setAmount] = useState(DEFAULT_AMOUNT);
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
    <div className="jobhir-payment-page min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-3 py-3 sm:px-5 md:px-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:px-4"
          >
            <ArrowLeft size={18} />
            <span>Back</span>
          </Link>

          <Link
            to="/"
            className="text-xl font-extrabold tracking-tight sm:text-2xl"
          >
            Job<span className="text-emerald-600">Hir</span>
          </Link>

          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 sm:text-sm">
            <ShieldCheck size={18} />
            <span>Secure</span>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl px-3 py-6 sm:px-5 sm:py-8 md:px-6 md:py-10">
        {/* Heading */}
        <section className="mb-5 text-center sm:mb-7">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 sm:h-14 sm:w-14">
            <CreditCard size={25} />
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">
            Pay JobHir
          </h1>

          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
            Scan the QR code using any UPI app to make your payment.
          </p>
        </section>

        {/* Payment Card */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Amount */}
          <div className="flex flex-col gap-4 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 sm:text-sm">
                Payment Amount
              </span>

              <div className="mt-1 flex items-center gap-1 text-3xl font-extrabold text-slate-900 sm:text-4xl">
                <IndianRupee size={25} />
                <span>{amount}</span>
              </div>
            </div>

            <div className="w-fit rounded-lg bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 sm:text-sm">
              JobHir Payment
            </div>
          </div>

          {/* QR */}
          <div className="border-b border-slate-200 p-4 sm:p-6 md:p-8">
            <div className="mb-4 flex items-center justify-center gap-2 text-base font-bold text-slate-900 sm:text-lg">
              <Smartphone size={20} className="text-emerald-600" />
              <span>Scan & Pay</span>
            </div>

            <div className="mx-auto flex w-full justify-center">
              <div className="flex aspect-square w-[min(78vw,320px)] items-center justify-center border border-slate-200 bg-white p-3 shadow-sm sm:w-[320px] sm:p-4">
                <img
                  src="/images/jobhir-payment-qr.png"
                  alt="JobHir UPI Payment QR Code"
                  className="block h-full w-full object-contain"
                />
              </div>
            </div>

            <p className="mx-auto mt-4 max-w-md text-center text-xs leading-5 text-slate-500 sm:text-sm sm:leading-6">
              Open PhonePe, Google Pay, Paytm or any UPI app and
              scan this QR code.
            </p>
          </div>

          {/* UPI ID */}
          <div className="border-b border-slate-200 p-4 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  UPI ID
                </span>

                <strong className="mt-1 block break-all text-sm text-slate-900 sm:text-base">
                  {UPI_ID}
                </strong>
              </div>

              <button
                type="button"
                className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 sm:w-auto"
                onClick={copyUpiId}
              >
                <Copy size={17} />
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>

          {/* Payment Steps */}
          <div className="border-b border-slate-200 p-4 sm:p-6">
            <h2 className="mb-4 text-base font-bold text-slate-900">
              How to Pay
            </h2>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex gap-3 rounded-lg bg-slate-50 p-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                  1
                </span>
                <p className="text-sm leading-5 text-slate-600">
                  Open any UPI payment app.
                </p>
              </div>

              <div className="flex gap-3 rounded-lg bg-slate-50 p-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                  2
                </span>
                <p className="text-sm leading-5 text-slate-600">
                  Scan the JobHir QR code.
                </p>
              </div>

              <div className="flex gap-3 rounded-lg bg-slate-50 p-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                  3
                </span>
                <p className="text-sm leading-5 text-slate-600">
                  Pay the amount shown above.
                </p>
              </div>

              <div className="flex gap-3 rounded-lg bg-slate-50 p-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                  4
                </span>
                <p className="text-sm leading-5 text-slate-600">
                  Keep your UTR / transaction ID.
                </p>
              </div>
            </div>
          </div>

          {/* Paid Button */}
          <div className="p-4 sm:p-6">
            {!paid ? (
              <button
                type="button"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 active:scale-[0.99] sm:text-base"
                onClick={handlePaidClick}
              >
                <CheckCircle size={21} />
                I Have Paid
              </button>
            ) : (
              <div className="flex gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
                <CheckCircle size={22} className="mt-0.5 shrink-0" />

                <div>
                  <strong className="block text-sm sm:text-base">
                    Payment made?
                  </strong>

                  <span className="mt-1 block text-xs leading-5 sm:text-sm">
                    Please enter your transaction details below.
                  </span>
                </div>
              </div>
            )}

            {/* Verification */}
            <div
              id="payment-verification"
              className="mt-6 scroll-mt-24 border-t border-slate-200 pt-6"
            >
              <div className="mb-5">
                <h2 className="text-lg font-extrabold sm:text-xl">
                  Payment Verification
                </h2>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Submit your payment details after completing the
                  UPI payment.
                </p>
              </div>

              <form
                onSubmit={(event) => {
                  event.preventDefault();

                  alert(
                    "Payment details submitted successfully. Our team will verify your payment."
                  );
                }}
                className="space-y-4"
              >
                <div>
                  <label
                    htmlFor="payment-mobile"
                    className="mb-1.5 block text-sm font-semibold text-slate-700"
                  >
                    Mobile Number
                  </label>

                  <div className="flex items-center border border-slate-300 bg-white">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center text-slate-400">
                      <Phone size={18} />
                    </div>

                    <input
                      id="payment-mobile"
                      type="tel"
                      inputMode="numeric"
                      maxLength="10"
                      placeholder="Enter 10-digit mobile number"
                      required
                      pattern="[0-9]{10}"
                      className="h-11 min-w-0 flex-1 border-0 bg-transparent pr-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:ring-0"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="payment-utr"
                    className="mb-1.5 block text-sm font-semibold text-slate-700"
                  >
                    UTR / Transaction ID
                  </label>

                  <input
                    id="payment-utr"
                    type="text"
                    placeholder="Enter UTR / Transaction ID"
                    required
                    className="h-11 w-full border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-slate-800 sm:text-base"
                >
                  Submit Payment Details
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Security Note */}
        <div className="mt-5 flex gap-3 border border-amber-200 bg-amber-50 p-4 sm:mt-6">
          <ShieldCheck
            size={20}
            className="mt-0.5 shrink-0 text-amber-700"
          />

          <div className="min-w-0">
            <strong className="block text-sm text-amber-900">
              Payment Safety
            </strong>

            <p className="mt-1 text-xs leading-5 text-amber-800 sm:text-sm sm:leading-6">
              Always verify that the UPI ID shown above is
              <b> {UPI_ID}</b> before making the payment.
            </p>
          </div>
        </div>

        <div className="mt-5 text-center">
          <Link
            to="/"
            className="inline-flex items-center text-sm font-semibold text-emerald-700 hover:text-emerald-800"
          >
            ← Return to JobHir
          </Link>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white px-4 py-5 text-center text-xs text-slate-500 sm:text-sm">
        © {new Date().getFullYear()} JobHir. All rights reserved.
      </footer>
    </div>
  );
};

export default Payment;
