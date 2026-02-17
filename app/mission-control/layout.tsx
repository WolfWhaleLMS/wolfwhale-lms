import type { Metadata } from "next";
import "./mission-control.css";

export const metadata: Metadata = {
  title: "Mission Control",
  description: "Developer productivity hub",
};

export default function MissionControlLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div data-theme="mission-control">{children}</div>;
}
