import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();

  const { username, content } = await request.json();
  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }
    // is user accepting the messages
    if (!user.isAcceptingMessage) {
      return Response.json(
        {
          success: false,
          message: "User is not accepting the messages",
        },
        { status: 403 }
      );
    }
    // create a new message
    const newMessage = { content, createdAt: new Date() };
    user.messages.push(newMessage as Message); // to validate the message is strictly in the given format we import that message model and we asert this as message to push else it will throw me an error as of type safety
    await user.save();
    return Response.json(
      {
        success: true,
        message: "Message send successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error adding messages: ", error);
    return Response.json(
      {
        success: false,
        message: "Error sending messages",
      },
      { status: 500 }
    );
  }
}
