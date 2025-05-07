import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Notification from "@/models/Notification"; // Fix import path

// Helper function to add CORS headers
function corsHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  return corsHeaders(
    new NextResponse(null, {
      status: 200,
    })
  );
}

export async function POST(request: Request) {
  try {
    await connectDB();
    
    let body;
    try {
      body = await request.json();
    } catch (error) {
      console.error("Error parsing JSON:", error); 
      return corsHeaders(
        NextResponse.json(
          { error: "Invalid JSON body" },
          { status: 400 }
        )
      );
    }
    
    const { title, content } = body;
    
    // Validate request body
    if (!title || !content) {
      return corsHeaders(
        NextResponse.json(
          { error: "Title and content are required" },
          { status: 400 }
        )
      );
    }
    
    // Create new notification
    const notification = await Notification.create({
      title,
      content,
    });
    
    // Add console log for successful notification creation
    console.log("Notification created successfully:", notification);
    
    return corsHeaders(
      NextResponse.json(
        { status: "success", message: "Notification created successfully", notification },
        { status: 201 }
      )
    );
  } catch (error: unknown) {
    console.error("Error creating notification:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to create notification";
    return corsHeaders(
      NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      )
    );
  }
}

// GET route to fetch notifications
export async function GET() {
  try {
    await connectDB();
    
    const notifications = await Notification.find({})
      .sort({ createdAt: -1 });
    
    return corsHeaders(
      NextResponse.json(notifications)
    );
    
  } catch (error: unknown) {
    console.error("Error fetching notifications:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch notifications";
    return corsHeaders(
      NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      )
    );
  }
}

// DELETE route to delete a notification by ID
export async function DELETE(request: Request) {
  try {
    await connectDB();
    
    // Get the notification ID from the request URL search params
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return corsHeaders(
        NextResponse.json(
          { error: "Notification ID is required" },
          { status: 400 }
        )
      );
    }

    // Check if notification exists and delete it in one operation
    const deletedNotification = await Notification.findByIdAndDelete(id);
    
    if (!deletedNotification) {
      return corsHeaders(
        NextResponse.json(
          { error: "Notification not found" },
          { status: 404 }
        )
      );
    }

    return corsHeaders(
      NextResponse.json(
        { 
          message: "Notification deleted successfully",
          deletedNotification: {
            _id: deletedNotification._id,
            title: deletedNotification.title
          }
        },
        { status: 200 }
      )
    );
  } catch (error: unknown) {
    console.error("Error deleting notification:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to delete notification";
    return corsHeaders(
      NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      )
    );
  }
}
