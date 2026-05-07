"use client";

const HOURS = [
  { day: "Sunday", hours: "Closed" },
  { day: "Monday", hours: "Closed" },
  { day: "Tuesday", hours: "10:00 AM — 5:00 PM" },
  { day: "Wednesday", hours: "10:00 AM — 5:00 PM" },
  { day: "Thursday", hours: "10:00 AM — 5:00 PM" },
  { day: "Friday", hours: "10:00 AM — 5:00 PM" },
  { day: "Saturday", hours: "10:00 AM — 5:00 PM" },
];

export function HoursList() {
  const today = new Date().getDay(); // 0=Sun … 6=Sat

  return (
    <ul className="mt-2 space-y-1.5 font-[family-name:var(--font-inter)] text-sm">
      {HOURS.map((row, i) => (
        <li
          key={row.day}
          className={`flex justify-between gap-8 ${
            row.hours === "Closed" ? "text-[#B8A898]" : "text-[#6B5C4D]"
          } ${i === today ? "font-semibold text-[#2C2420]" : ""}`}
        >
          <span className="min-w-[100px]">{row.day}</span>
          <span>{row.hours}</span>
        </li>
      ))}
    </ul>
  );
}
