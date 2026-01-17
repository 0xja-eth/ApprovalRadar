import { NextResponse } from "next/server";
import { approvalMonitor } from "@/services/monitor";

export async function POST() {
  try {
    approvalMonitor.stopMonitoring();
    const status = approvalMonitor.getStatus();
    return NextResponse.json({
      success: true,
      message: "Monitoring stopped",
      status
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to stop monitoring", error },
      { status: 500 }
    );
  }
}
