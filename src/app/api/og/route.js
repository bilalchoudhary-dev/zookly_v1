import { ImageResponse } from "next/og";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

export const runtime = "nodejs";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");

    if (!username) return new ImageResponse(<div>Missing username</div>, { width: 1200, height: 630 });

    await dbConnect();
    const user = await User.findOne({ username }).select("name username image theme bio").lean();

    if (!user) return new ImageResponse(<div>User not found</div>, { width: 1200, height: 630 });

    // --- Dynamic Theme Colors ---
    const isDark = ["dark", "luxury", "midnight"].includes(user.theme);
    
    // Zookly Brand Colors (adjust if needed)
    const brandColor = "#2563EB"; // Bright Blue
    
    const colors = isDark ? {
      bg: "#0f172a",         // Slate 900
      card: "rgba(30, 41, 59, 0.8)", // Slate 800 (Glass)
      text: "#ffffff",
      subtext: "#94a3b8",    // Slate 400
      border: "rgba(255,255,255,0.1)",
    } : {
      bg: "#f0f9ff",         // Sky 50
      card: "rgba(255, 255, 255, 0.8)", // White (Glass)
      text: "#0f172a",       // Slate 900
      subtext: "#64748b",    // Slate 500
      border: "rgba(255,255,255,0.6)",
    };

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: colors.bg,
            // Premium Gradient Background
            backgroundImage: isDark 
              ? `radial-gradient(circle at 0% 0%, #1e3a8a 0%, transparent 50%), radial-gradient(circle at 100% 100%, #172554 0%, transparent 50%)`
              : `radial-gradient(circle at 0% 0%, #dbeafe 0%, transparent 50%), radial-gradient(circle at 100% 100%, #eff6ff 0%, transparent 50%)`,
          }}
        >
          {/* Main Business Card */}
          <div
            style={{
              display: "flex",
              position: "relative",
              width: "90%",
              height: "70%",
              backgroundColor: colors.card,
              borderRadius: "40px",
              border: `2px solid ${colors.border}`,
              boxShadow: "0 50px 100px -20px rgba(0,0,0,0.25)",
              overflow: "hidden",
            }}
          >
            {/* Zookly Branding Badge (Top Right) */}
            <div style={{
              position: 'absolute',
              top: 40,
              right: 40,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              opacity: 0.8
            }}>
              {/* Zookly Icon Shape */}
              <div style={{ width: 40, height: 40, background: brandColor, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              </div>
              <span style={{ fontSize: 32, fontWeight: 900, color: colors.text, letterSpacing: '-1px' }}>Zookly</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '60px', width: '100%', gap: '60px' }}>
              
              {/* Avatar Section */}
              <div style={{ display: 'flex', position: 'relative' }}>
                <div style={{ position: 'absolute', inset: -6, borderRadius: '100%', border: `4px solid ${brandColor}`, opacity: 0.2 }}></div>
                <img
                  src={user.image || "https://zookly.com/default.png"}
                  alt={user.name}
                  style={{
                    width: 220,
                    height: 220,
                    borderRadius: "100%",
                    objectFit: "cover",
                    border: `6px solid ${colors.card}`,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                  }}
                />
              </div>

              {/* Text Info Section */}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1 }}>
                
                {/* Name & Verified Badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <h1 style={{ fontSize: 64, fontWeight: 900, color: colors.text, margin: 0, lineHeight: 1 }}>
                    {user.name}
                  </h1>
                  {/* Blue Verified Checkmark */}
                  <svg width="48" height="48" viewBox="0 0 24 24" fill={brandColor}>
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="white"/>
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill={brandColor} opacity="0.2"/>
                  </svg>
                </div>

                {/* Handle */}
                <p style={{ fontSize: 32, color: brandColor, margin: "10px 0 25px 0", fontWeight: 700 }}>
                  @{user.username}
                </p>

                {/* Bio */}
                {user.bio && (
                  <p style={{ 
                    fontSize: 26, 
                    color: colors.subtext, 
                    margin: 0, 
                    lineHeight: 1.4, 
                    maxHeight: '3em', 
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}>
                    {user.bio}
                  </p>
                )}
                
                {/* Call to Action Footer */}
                <div style={{ marginTop: 40, display: 'flex', alignItems: 'center', gap: 10 }}>
                   <div style={{ height: 2, width: 40, background: brandColor }}></div>
                   <span style={{ fontSize: 20, color: colors.subtext, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px' }}>
                     Visit my profile
                   </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  } catch (e) {
    console.error(e);
    return new ImageResponse(<div>Error</div>, { width: 1200, height: 630 });
  }
}