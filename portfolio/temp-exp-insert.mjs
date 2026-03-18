const API = "https://portfoilo-two-ivory.vercel.app/api/experiences";

const entries = [
  {
    title: "Bachelor of Science in Electrical & Electronics Engineering",
    company: "University of Education, Winneba (UEW)",
    location: "Winneba, Ghana",
    description: "Studied core electrical engineering principles including circuit analysis, power systems, control systems, and electronics. Developed a strong foundation in signal processing, electromagnetics, and embedded systems design. Completed capstone projects involving microcontroller-based systems and power distribution analysis.",
    startDate: "2018-09-01",
    endDate: "2022-06-30",
    current: false,
    type: "education",
    order: 1,
  },
  {
    title: "Master of Science in Signal Processing & Machine Learning",
    company: "University of Education, Winneba (UEW)",
    location: "Winneba, Ghana",
    description: "Advanced postgraduate studies focused on digital signal processing, statistical learning theory, deep neural networks, and their applications in speech/audio analysis, image processing, and intelligent systems. Research interests include real-time signal classification, time-series prediction, and applied ML for engineering problems.",
    startDate: "2025-09-01",
    endDate: "2027-06-30",
    current: true,
    type: "education",
    order: 2,
  },
  {
    title: "Junior Signal Engineer",
    company: "Electricity Company of Ghana (ECG)",
    location: "Accra, Ghana",
    description: "Supported the design, installation, and maintenance of signal and communication systems within the nationwide power distribution network. Assisted senior engineers with fault diagnosis on transmission lines, SCADA system monitoring, and relay protection coordination. Gained hands-on experience with industrial control systems and power quality analysis.",
    startDate: "2021-06-01",
    endDate: "2022-08-31",
    current: false,
    type: "work",
    order: 3,
  },
  {
    title: "Junior Electro-Technical Officer",
    company: "Danaso Shipping Ltd",
    location: "Tema, Ghana",
    description: "Responsible for the maintenance, troubleshooting, and repair of onboard electrical and electronic systems across the vessel fleet. Managed navigation equipment calibration, communication systems upkeep, power generation units, and automation controls. Ensured compliance with maritime safety standards and class society requirements.",
    startDate: "2023-01-01",
    endDate: "2025-05-31",
    current: false,
    type: "work",
    order: 4,
  },
  {
    title: "Freelance Full-Stack Developer",
    company: "Self-Employed",
    location: "Remote, Ghana",
    description: "Designing and building modern web applications for clients across education, finance, and non-profit sectors. Specializing in Next.js, TypeScript, Prisma, and PostgreSQL full-stack architecture. Delivered projects including academic management platforms, hire-purchase BNPL systems, and organizational websites — from concept through deployment and maintenance.",
    startDate: "2025-06-01",
    endDate: null,
    current: true,
    type: "work",
    order: 5,
  },
];

async function insert() {
  for (const entry of entries) {
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      });
      const data = await res.json();
      console.log(`✓ ${entry.type.toUpperCase()}: ${data.title || data.error}`);
    } catch (e) {
      console.error(`✗ Failed: ${entry.title}`, e);
    }
  }
}

insert();
