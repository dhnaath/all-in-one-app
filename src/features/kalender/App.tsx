import { TasksView } from "../wira/components/views/TasksView";
import { CountdownView } from "../wira/components/views/CountdownView";
import { motion, useMotionValue, animate } from "motion/react";
import { useEffect, useState, useRef } from "react";
import { Upload, Camera } from "lucide-react";

const daysBoard = [
  [30, 31, "", "", "", "", 1, 2, 3, 4, 5, 6, 7],
  [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
  [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
  [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28],
  [23, 24, 25, 26, 27, 28, 29, 30, 31, "", "", "", ""],
];

const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

const AnimatedBackground = ({ theme = "transparent" }: { theme?: string }) => {
  // Palet warna yang digunakan untuk transisi warna pada setiap blob
  const blob1Colors = [
    "#2D2F47",
    "#5D194B",
    "#3D1A6A",
    "#82350C",
    "#134D66",
    "#1A4938",
    "#13113C",
    "#433632",
    "#2D2F47",
  ];
  const blob2Colors = [
    "#8A6543",
    "#96225B",
    "#6F1D8A",
    "#B31D12",
    "#1B6F8A",
    "#2E7550",
    "#2D2A72",
    "#6D594E",
    "#8A6543",
  ];
  const blob3Colors = [
    "#D18A49",
    "#C62B4A",
    "#9D2395",
    "#E25300",
    "#289299",
    "#5FA85B",
    "#042BAB",
    "#A98763",
    "#D18A49",
  ];
  const blob4Colors = [
    "#E3C38B",
    "#F26430",
    "#E2278C",
    "#ECA734",
    "#43B2A6",
    "#A9DD4F",
    "#5FBCBB",
    "#DCCFC2",
    "#E3C38B",
  ];

  const opacityClass = theme === "transparent" ? "opacity-100" : "opacity-80";

  return (
    // fixed inset-0 membuat elemen memenuhi seluruh layar di latar belakang
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Blob 1 - Top Left (60vw) */}
      <motion.div
        className={`absolute -top-[10%] -left-[10%] w-[60vw] h-[60vw] rounded-full blur-[150px] ${opacityClass} mix-blend-screen pointer-events-none`}
        animate={{
          x: ["0vw", "10vw", "-5vw", "0vw"],
          y: ["0vh", "5vh", "-10vh", "0vh"],
          scale: [1, 1.15, 0.9, 1],
          backgroundColor: blob1Colors,
        }}
        transition={{
          x: { duration: 25, repeat: Infinity, repeatType: "mirror", ease: "easeInOut", delay: 0 },
          y: { duration: 25, repeat: Infinity, repeatType: "mirror", ease: "easeInOut", delay: 0 },
          scale: {
            duration: 25,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
            delay: 0,
          },
          backgroundColor: { duration: 40, repeat: Infinity, ease: "linear" },
        }}
      />

      {/* Blob 2 - Bottom Right (50vw) */}
      <motion.div
        className={`absolute -bottom-[10%] -right-[10%] w-[50vw] h-[50vw] rounded-full blur-[150px] ${opacityClass} mix-blend-screen pointer-events-none`}
        animate={{
          x: ["0vw", "-15vw", "10vw", "0vw"],
          y: ["0vh", "-10vh", "5vh", "0vh"],
          scale: [1, 1.2, 0.95, 1],
          backgroundColor: blob2Colors,
        }}
        transition={{
          x: { duration: 25, repeat: Infinity, repeatType: "mirror", ease: "easeInOut", delay: 2 },
          y: { duration: 25, repeat: Infinity, repeatType: "mirror", ease: "easeInOut", delay: 2 },
          scale: {
            duration: 25,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
            delay: 2,
          },
          backgroundColor: { duration: 40, repeat: Infinity, ease: "linear" },
        }}
      />

      {/* Blob 3 - Top Right (45vw) */}
      <motion.div
        className={`absolute -top-[5%] -right-[5%] w-[45vw] h-[45vw] rounded-full blur-[150px] ${opacityClass} mix-blend-screen pointer-events-none`}
        animate={{
          x: ["0vw", "-10vw", "15vw", "0vw"],
          y: ["0vh", "15vh", "-5vh", "0vh"],
          scale: [1, 0.9, 1.15, 1],
          backgroundColor: blob3Colors,
        }}
        transition={{
          x: { duration: 25, repeat: Infinity, repeatType: "mirror", ease: "easeInOut", delay: 4 },
          y: { duration: 25, repeat: Infinity, repeatType: "mirror", ease: "easeInOut", delay: 4 },
          scale: {
            duration: 25,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
            delay: 4,
          },
          backgroundColor: { duration: 40, repeat: Infinity, ease: "linear" },
        }}
      />

      {/* Blob 4 - Bottom Left (40vw) */}
      <motion.div
        className={`absolute -bottom-[5%] -left-[5%] w-[40vw] h-[40vw] rounded-full blur-[150px] ${opacityClass} mix-blend-screen pointer-events-none`}
        animate={{
          x: ["0vw", "15vw", "-10vw", "0vw"],
          y: ["0vh", "-15vh", "10vh", "0vh"],
          scale: [1, 1.1, 0.85, 1],
          backgroundColor: blob4Colors,
        }}
        transition={{
          x: { duration: 25, repeat: Infinity, repeatType: "mirror", ease: "easeInOut", delay: 6 },
          y: { duration: 25, repeat: Infinity, repeatType: "mirror", ease: "easeInOut", delay: 6 },
          scale: {
            duration: 25,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
            delay: 6,
          },
          backgroundColor: { duration: 40, repeat: Infinity, ease: "linear" },
        }}
      />
    </div>
  );
};

function MechanicalCalendar() {
  const [colOffset, setColOffset] = useState(0);
  const [monthOffset, setMonthOffset] = useState(0);
  const [photo, setPhoto] = useState(
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800",
  );

  const xDays = useMotionValue(0);
  const xMonths = useMotionValue(0);

  // Initialize to current month and day
  useEffect(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    setMonthOffset(currentMonth);

    const firstDay = new Date(today.getFullYear(), currentMonth, 1).getDay();
    // Mathematical alignment: Frame column (firstDay) needs to land on Board column 6 (which is '1')
    // colOffset + firstDay = 6  =>  colOffset = 6 - firstDay
    const targetColOffset = 6 - firstDay;
    setColOffset(targetColOffset);
  }, []);

  // Animate to snapped positions when states change
  useEffect(() => {
    animate(xDays, colOffset * 48, { type: "spring", stiffness: 300, damping: 30 });
  }, [colOffset, xDays]);

  useEffect(() => {
    animate(xMonths, monthOffset * 48, { type: "spring", stiffness: 300, damping: 30 });
  }, [monthOffset, xMonths]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhoto(url);
    }
  };

  // Pre-calculate SVG holes for the days frame
  const holes = [];
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 7; c++) {
      holes.push({
        x: 16 + c * 48,
        y: 60 + r * 48,
      });
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center overflow-hidden w-full relative font-sans">
      {/* --- AMBIENT BACKGROUND --- */}
      <AnimatedBackground theme="transparent" />

      {/* Responsive Scaler for fixed-size desk object */}
      <div className="scale-[0.45] sm:scale-[0.6] md:scale-[0.75] lg:scale-[0.9] xl:scale-100 origin-center transition-transform duration-300 relative z-10">
        {/* Main Glass Board */}
        <div
          className="w-[1120px] h-[509px] rounded-[20px] relative flex items-start p-8 z-10 overflow-visible"
          style={{
            background: "rgba(255, 255, 255, 0.10)",
            backdropFilter: "blur(28px) saturate(180%)",
            WebkitBackdropFilter: "blur(28px) saturate(180%)",
            border: "1px solid rgba(255, 255, 255, 0.28)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.45)",
          }}
        >
          {/* Glass Gloss/Sheen Overlay */}
          <div
            className="absolute inset-0 pointer-events-none rounded-[20px]"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.22), rgba(255,255,255,0.05) 30%, transparent 55%)",
            }}
          ></div>

          {/* Left Side: Calendars */}
          <div className="w-[660px] flex flex-col pt-4 relative z-10">
            {/* --- MONTHS SLIDER --- */}
            <div className="relative w-full h-[80px]">
              {/* Groove */}
              <div
                className="absolute top-[20px] left-[16px] w-[576px] h-[8px] rounded-full z-0"
                style={{
                  background: "rgba(255, 255, 255, 0.10)",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  boxShadow: "inset 0 3px 6px rgba(0, 0, 0, 0.2)",
                }}
              ></div>

              {/* Months Text on Board */}
              <div className="absolute top-[42px] left-[16px] flex gap-2 font-bold text-white/90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)] text-sm tracking-wider select-none z-0">
                {months.map((m) => (
                  <div key={m} className="w-[40px] text-center">
                    {m}
                  </div>
                ))}
              </div>

              {/* Slidable Month Frame */}
              <motion.div
                className="absolute top-[30px] left-[8px] cursor-grab active:cursor-grabbing z-20 drop-shadow-xl"
                style={{ x: xMonths }}
                drag="x"
                dragConstraints={{ left: 0, right: 11 * 48 }}
                onDragEnd={() => {
                  const currentX = xMonths.get();
                  const nearestCol = Math.round(currentX / 48);
                  setMonthOffset(Math.max(0, Math.min(11, nearestCol)));
                }}
              >
                {/* Glass Frame Masked by SVG */}
                <div style={{ width: 56, height: 44, position: "relative" }}>
                  {/* Glass layer */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: "rgba(255, 255, 255, 0.16)",
                      backdropFilter: "blur(20px) saturate(180%)",
                      WebkitBackdropFilter: "blur(20px) saturate(180%)",
                      maskImage: "url(#month-hole-mask)",
                      WebkitMaskImage: "url(#month-hole-mask)",
                    }}
                  ></div>

                  {/* SVG for mask definition and outlines */}
                  <svg
                    width={56}
                    height={44}
                    className="absolute inset-0 overflow-visible pointer-events-none"
                  >
                    <defs>
                      <mask id="month-hole-mask">
                        <rect width="100%" height="100%" fill="white" rx={20} />
                        <rect x={8} y={8} width={40} height={28} rx={10} fill="black" />
                      </mask>
                    </defs>
                    <rect
                      x={8}
                      y={8}
                      width={40}
                      height={28}
                      rx={10}
                      fill="none"
                      stroke="rgba(255,255,255,0.5)"
                      strokeWidth="1.5"
                    />
                    <rect
                      width="100%"
                      height="100%"
                      rx={20}
                      fill="none"
                      stroke="rgba(255,255,255,0.28)"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>

                {/* Silver Peg */}
                <div
                  className="absolute top-[-22px] left-1/2 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.8), rgba(255,255,255,0.15))",
                    backdropFilter: "blur(4px)",
                    WebkitBackdropFilter: "blur(4px)",
                    border: "1px solid rgba(255,255,255,0.5)",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2), inset 0 2px 2px rgba(255,255,255,0.5)",
                  }}
                >
                  <div className="w-2 h-2 rounded-full bg-card/70 shadow-sm"></div>
                </div>
              </motion.div>
            </div>

            {/* --- DAYS SLIDER --- */}
            <div className="relative mt-8 w-full h-[320px]">
              {/* Groove */}
              <div
                className="absolute top-[10px] left-[24px] w-[584px] h-[8px] rounded-full z-0"
                style={{
                  background: "rgba(255, 255, 255, 0.10)",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  boxShadow: "inset 0 3px 6px rgba(0, 0, 0, 0.2)",
                }}
              ></div>

              {/* Days Numbers on Board */}
              <div className="absolute top-[60px] left-0 grid grid-cols-[repeat(13,40px)] gap-[8px] px-[16px] font-bold text-white/90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)] text-xl select-none z-0">
                {daysBoard.map((row, r) =>
                  row.map((day, c) => (
                    <div
                      key={`${r}-${c}`}
                      className="w-[40px] h-[40px] flex items-center justify-center"
                    >
                      {day}
                    </div>
                  )),
                )}
              </div>

              {/* Slidable Days Frame */}
              <motion.div
                className="absolute top-0 left-0 cursor-grab active:cursor-grabbing z-20 drop-shadow-2xl"
                style={{ x: xDays }}
                drag="x"
                dragConstraints={{ left: 0, right: 6 * 48 }}
                onDragEnd={() => {
                  const currentX = xDays.get();
                  const nearestCol = Math.round(currentX / 48);
                  setColOffset(Math.max(0, Math.min(6, nearestCol)));
                }}
              >
                {/* Glass Frame Masked by SVG */}
                <div style={{ width: 360, height: 316, position: "relative" }}>
                  <div
                    className="absolute inset-0"
                    style={{
                      background: "rgba(255, 255, 255, 0.16)",
                      backdropFilter: "blur(20px) saturate(180%)",
                      WebkitBackdropFilter: "blur(20px) saturate(180%)",
                      maskImage: "url(#days-hole-mask)",
                      WebkitMaskImage: "url(#days-hole-mask)",
                    }}
                  ></div>

                  <svg
                    width={360}
                    height={316}
                    className="absolute inset-0 overflow-visible pointer-events-none"
                  >
                    <defs>
                      <mask id="days-hole-mask">
                        <rect width="100%" height="100%" fill="white" rx={20} />
                        {holes.map((h, i) => (
                          <rect
                            key={`mask-${i}`}
                            x={h.x}
                            y={h.y}
                            width={40}
                            height={40}
                            rx={12}
                            fill="black"
                          />
                        ))}
                      </mask>
                    </defs>

                    {/* Days Header Text */}
                    {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                      <text
                        key={day + i}
                        x={16 + 20 + i * 48}
                        y={40}
                        fill="rgba(255,255,255,0.9)"
                        fontSize="16"
                        fontWeight="bold"
                        textAnchor="middle"
                        style={{ textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}
                      >
                        {day}
                      </text>
                    ))}

                    {/* Outer border highlight */}
                    <rect
                      width="100%"
                      height="100%"
                      rx={20}
                      fill="none"
                      stroke="rgba(255,255,255,0.28)"
                      strokeWidth="1.5"
                    />

                    {/* Inner rims */}
                    {holes.map((h, i) => (
                      <rect
                        key={`hole-${i}`}
                        x={h.x}
                        y={h.y}
                        width={40}
                        height={40}
                        rx={12}
                        fill="none"
                        stroke="rgba(255,255,255,0.5)"
                        strokeWidth="1.5"
                      />
                    ))}
                  </svg>
                </div>

                {/* Silver Pegs */}
                <div
                  className="absolute top-[2px] left-[36px] w-6 h-6 rounded-full flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.8), rgba(255,255,255,0.15))",
                    backdropFilter: "blur(4px)",
                    WebkitBackdropFilter: "blur(4px)",
                    border: "1px solid rgba(255,255,255,0.5)",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2), inset 0 2px 2px rgba(255,255,255,0.5)",
                  }}
                >
                  <div className="w-2 h-2 rounded-full bg-card/70 shadow-sm"></div>
                </div>
                <div
                  className="absolute top-[2px] right-[36px] w-6 h-6 rounded-full flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.8), rgba(255,255,255,0.15))",
                    backdropFilter: "blur(4px)",
                    WebkitBackdropFilter: "blur(4px)",
                    border: "1px solid rgba(255,255,255,0.5)",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2), inset 0 2px 2px rgba(255,255,255,0.5)",
                  }}
                >
                  <div className="w-2 h-2 rounded-full bg-card/70 shadow-sm"></div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right Side: Photo Frame */}
          <div
            className="absolute right-10 top-6 w-[380px] h-[410px] p-[24px] z-20 flex flex-col"
            style={{
              background: "rgba(255, 255, 255, 0.10)",
              backdropFilter: "blur(28px) saturate(180%)",
              WebkitBackdropFilter: "blur(28px) saturate(180%)",
              border: "1px solid rgba(255, 255, 255, 0.28)",
              boxShadow:
                "0 8px 32px rgba(0, 0, 0, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.45)",
              borderRadius: "20px",
            }}
          >
            <div
              className="flex-1 w-full relative group overflow-hidden rounded-[12px]"
              style={{
                border: "1px solid rgba(255,255,255,0.3)",
                boxShadow: "inset 0 4px 10px rgba(0,0,0,0.2)",
              }}
            >
              <img
                src={photo}
                alt="Calendar Photo"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Hover Upload Overlay */}
              <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center cursor-pointer backdrop-blur-md border border-white/20 rounded-[12px]">
                <div className="bg-card/20 p-4 rounded-full mb-3 shadow-lg backdrop-blur-md border border-white/30">
                  <Camera size={32} className="text-white" />
                </div>
                <span className="text-white font-bold tracking-wide drop-shadow-md">
                  Change Photo
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App_Component() {
  return (
    <div className="flex flex-col h-screen w-full bg-muted/30">
      <div className="flex-1 relative overflow-hidden">
        <MechanicalCalendar />
      </div>
    </div>
  );
}
