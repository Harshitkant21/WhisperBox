import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();

  try {
    // Extract query parameters from the URL
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");
    const code = searchParams.get("code");

    if (!username || !code) {
      return (
        Response.json({
          success: false,
          message: "Username and code are required",
        }),
        { status: 400 }
      );
    }

    const decodedUsername = decodeURIComponent(username);
    console.log(decodedUsername);

    const user = await UserModel.findOne({ username: decodedUsername });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found!",
        },
        {
          status: 500,
        }
      );
    }

    const isCodeValid = user?.verifyCode === code;
    const isCodeNotExpired = new Date(user?.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();
      return Response.json(
        {
          success: true,
          message: "Account verified successfully",
        },
        {
          status: 200,
        }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message: "Verification code has expired. Please sign up again",
        },
        {
          status: 400,
        }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Invalid verification code",
        },
        {
          status: 400,
        }
      );
    }
  } catch (error) {
    console.error("Error verifying user", error);
    return Response.json(
      {
        success: false,
        message: "Error verifying user",
      },
      {
        status: 500,
      }
    );
  }
}
