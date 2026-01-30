import { ImageResponse } from "next/og";
import { getTheme } from "@/lib/themes"; // We can reuse your theme logic!
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

// Image metadata
export const alt = "Visit my LinkHub Profile";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }) {
  const { username } = params;
  
  // Fetch user data
  await dbConnect();
  const user = await User.findOne({ username });

  if (!user) return new ImageResponse(<div >Not Found</div>);

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fff", // You could make this dynamic based on theme
          backgroundImage: "linear-gradient(to bottom right, #eff6ff, #fff)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white",
            padding: "40px 80px",
            borderRadius: "40px",
            boxShadow: "0 20px 50px rgba(0,0,0,0.1)",
          }}
        >
          {/* Avatar (We use a simple div if image fails, or fetch it) */}
          <img 
            src={user.image} 
            alt={user.name}
            style={{
              width: 150,
              height: 150,
              borderRadius: 100,
              objectFit: "cover",
              marginBottom: 20,
              border: "4px solid white",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
            }} 
          />
          
          <h1 style={{ fontSize: 60, fontWeight: 900, color: "#0f172a", margin: 0 }}>
            {user.name}
          </h1>
          <p style={{ fontSize: 30, color: "#64748b", margin: "10px 0 0 0" }}>
            @{user.username}
          </p>
          
          <div style={{ display: "flex", marginTop: 40, gap: 10 }}>
            <div style={{ padding: "10px 20px", background: "#0f172a", color: "white", borderRadius: 20, fontSize: 24 }}>
              LinkHub.
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}