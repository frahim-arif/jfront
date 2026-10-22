
import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  ShieldCheck,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import "./JobStatsSection.css";

function AnimatedNumber({ value = 0 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const target = Math.max(0, Number(value) || 0);
    const duration = 1400;
    let frameId;
    let startTime;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;

      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);

      setCount(Math.floor(target * eased));

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameId);
  }, [value]);

  return <>{count.toLocaleString("en-IN")}</>;
}

export default function JobStatsSection({
  totalJobs = 0,
  availableJobsCount = 0,
  is24x7 = true,
}) {
  const stats = [
    {
      label: "Total Jobs",
      value: totalJobs,
      icon: BriefcaseBusiness,
      description: "Opportunities listed",
      className: "jobstat-card-gold",
    },
    {
      label: "Available Jobs",
      value: availableJobsCount,
      icon: TrendingUp,
      description: "Explore openings",
      className: "jobstat-card-green",
    },
  ];

  return (
    <section className="jobstats-section" aria-label="JobHir job statistics">
      <div className="jobstats-glow jobstats-glow-one" />
      <div className="jobstats-glow jobstats-glow-two" />

      <div className="jobstats-inner">
        <div className="jobstats-heading">
          <div className="jobstats-eyebrow">
            <span className="jobstats-live-dot" />
            YOUR NEXT OPPORTUNITY STARTS HERE
          </div>

          <h2>
            Jobs that bring you
            <span> closer to your future.</span>
          </h2>

          <p>
            Discover opportunities, explore new skills, and take your next
            career step with JobHir.
          </p>
        </div>

        <div className="jobstats-grid">
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <div
                className={`jobstat-card ${stat.className}`}
                key={stat.label}
                style={{ "--card-delay": `${index * 160}ms` }}
              >
                <div className="jobstat-card-top">
                  <span className="jobstat-icon-wrap">
                    <Icon size={23} strokeWidth={1.8} />
                  </span>
                  <span className="jobstat-arrow">
                    <TrendingUp size={17} />
                  </span>
                </div>

                <div className="jobstat-number">
                  <AnimatedNumber value={stat.value} />
                  <span className="jobstat-plus">+</span>
                </div>

                <h3>{stat.label}</h3>
                <p>{stat.description}</p>

                <div className="jobstat-progress">
                  <span />
                </div>
              </div>
            );
          })}

          <div
            className="jobstat-card jobstat-card-access"
            style={{ "--card-delay": "320ms" }}
          >
            <div className="jobstat-card-top">
              <span className="jobstat-icon-wrap">
                <Clock3 size={23} strokeWidth={1.8} />
              </span>
              <span className="jobstat-status">
                <span />
                ALWAYS ON
              </span>
            </div>

            <div className="jobstat-access-number">24/7</div>
            <h3>Job Access</h3>
            <p>Explore jobs whenever you need</p>

            <div className="jobstat-progress">
              <span />
            </div>
          </div>
        </div>

        <div className="jobstats-trust">
          <div>
            <ShieldCheck size={18} />
            <span>Safety matters</span>
          </div>
          <span className="jobstats-trust-divider" />
          <div>
            <CheckCircle2 size={18} />
            <span>Opportunities in one place</span>
          </div>
          <span className="jobstats-trust-divider" />
          <div>
            <UsersRound size={18} />
            <span>For everyone</span>
          </div>
        </div>
      </div>
    </section>
  );
}
