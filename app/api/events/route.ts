import { NextResponse } from "next/server";
import { approvalMonitor } from "@/services/monitor";

let monitoringStarted = false;

export async function GET() {
  if (!monitoringStarted) {
    approvalMonitor.startMonitoring();
    monitoringStarted = true;
  }

  const events = approvalMonitor.getEvents();
  return NextResponse.json({ events });
}
