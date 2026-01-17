import { NextResponse } from "next/server";
import { approvalMonitor } from "@/services/monitor";

export async function POST() {
  try {
    await approvalMonitor.startMonitoring();
    const status = approvalMonitor.getStatus();
    return NextResponse.json({
      success: true,
      message: "Monitoring started",
      status
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to start monitoring", error },
      { status: 500 }
    );
  }
}
