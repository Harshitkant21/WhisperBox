import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 401 }
    );
  }

  //when we use string as the data type in the user model for the id then it might create a problem while using aggregation pipeline so for that we create object out of it and then store in userID
  //so the problems can be it might have trouble linking up data, slow or broken searches or we need to write more complex code like converting its string id to object id then use it


  const userID = new mongoose.Types.ObjectId(user._id);

  try {
    const user = 
  } catch (error) {
    
  }
}
