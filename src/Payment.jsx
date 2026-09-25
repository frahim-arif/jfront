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
    <div className="jobhir-payment-page">
      {/* Header */}
      <header className="payment-header">
        <div className="payment-header-inner">
          <Link to="/" className="payment-back-btn">
            <ArrowLeft size={20} />
            <span>Back</span>
          </Link>

          <Link to="/" className="payment-logo">
            Job<span>Hir</span>
          </Link>

          <div className="payment-secure-small">
            <ShieldCheck size={18} />
            <span>Secure</span>
          </div>
        </div>
      </header>

      <main className="payment-main">
        {/* Page Heading */}
        <section className="payment-heading">
          <div className="payment-heading-icon">
            <CreditCard size={25} />
          </div>

          <h1>Pay JobHir</h1>

          <p>
            Scan the QR code using any UPI app to make your payment.
          </p>
        </section>

        {/* Payment Card */}
        <section className="payment-card">
          {/* Amount */}
          <div className="payment-amount-box">
            <div>
              <span className="payment-label">Payment Amount</span>
              <div className="payment-amount">
                <IndianRupee size={24} />
                <span>{amount}</span>
              </div>
            </div>

            <div className="payment-amount-badge">
              JobHir Payment
            </div>
          </div>

          {/* QR */}
          <div className="qr-section">
            <div className="qr-title">
              <Smartphone size={20} />
              <span>Scan & Pay</span>
            </div>

            <div className="qr-wrapper">
              <img
                src="/images/jobhir-payment-qr.png"
                alt="JobHir UPI Payment QR Code"
                className="jobhir-payment-qr"
              />
            </div>

            <p className="qr-help">
              Open PhonePe, Google Pay, Paytm or any UPI app
              and scan this QR code.
            </p>
          </div>

          {/* UPI ID */}
          <div className="upi-box">
            <div>
              <span className="upi-label">UPI ID</span>
              <strong>{UPI_ID}</strong>
            </div>

            <button
              type="button"
              className="copy-upi-btn"
              onClick={copyUpiId}
            >
              <Copy size={17} />
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          {/* Payment Steps */}
          <div className="payment-steps">
            <div className="payment-step">
              <span>1</span>
              <p>Open any UPI payment app.</p>
            </div>

            <div className="payment-step">
              <span>2</span>
              <p>Scan the JobHir QR code.</p>
            </div>

            <div className="payment-step">
              <span>3</span>
              <p>Pay the amount shown above.</p>
            </div>

            <div className="payment-step">
              <span>4</span>
              <p>Keep your UTR / transaction ID.</p>
            </div>
          </div>

          {/* Paid Button */}
          {!paid ? (
            <button
              type="button"
              className="i-paid-btn"
              onClick={handlePaidClick}
            >
              <CheckCircle size={21} />
              I Have Paid
            </button>
          ) : (
            <div className="paid-success">
              <CheckCircle size={22} />
              <div>
                <strong>Payment made?</strong>
                <span>
                  Please enter your transaction details below.
                </span>
              </div>
            </div>
          )}

          {/* Verification */}
          <div
            id="payment-verification"
            className="payment-verification"
          >
            <div className="verification-heading">
              <h2>Payment Verification</h2>
              <p>
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
            >
              <div className="payment-form-group">
                <label htmlFor="payment-mobile">
                  Mobile Number
                </label>

                <div className="input-with-icon">
                  <Phone size={18} />

                  <input
                    id="payment-mobile"
                    type="tel"
                    inputMode="numeric"
                    maxLength="10"
                    placeholder="Enter 10-digit mobile number"
                    required
                    pattern="[0-9]{10}"
                  />
                </div>
              </div>

              <div className="payment-form-group">
                <label htmlFor="payment-utr">
                  UTR / Transaction ID
                </label>

                <input
                  id="payment-utr"
                  type="text"
                  placeholder="Enter UTR / Transaction ID"
                  required
                />
              </div>

              <button
                type="submit"
                className="submit-payment-btn"
              >
                Submit Payment Details
              </button>
            </form>
          </div>
        </section>

        {/* Security Note */}
        <div className="payment-security-note">
          <ShieldCheck size={20} />

          <div>
            <strong>Payment Safety</strong>
            <p>
              Always verify that the UPI ID shown above is
              <b> {UPI_ID}</b> before making the payment.
            </p>
          </div>
        </div>

        <Link to="/" className="payment-home-link">
          ← Return to JobHir
        </Link>
      </main>

      <footer className="payment-footer">
        © {new Date().getFullYear()} JobHir. All rights reserved.
      </footer>
    </div>
  );
};

export default Payment;