import {
  SiReact,
  SiTypescript,
  SiFastapi,
  SiSupabase,
  SiPostgresql,
  SiOpencv,
  SiPython,
  SiJavascript,
  SiC,
  SiCplusplus
} from "react-icons/si";
import attendence from "../components/sections/projects/attendence.png";
import lms from "../components/sections/projects/lms.png";

export const technologies = [
  { name: "React", icon: SiReact },
  { name: "TypeScript", icon: SiTypescript },
  { name: "FastAPI", icon: SiFastapi },
  { name: "Supabase", icon: SiSupabase },
  { name: "PostgreSQL", icon: SiPostgresql },
  { name: "OpenCV", icon: SiOpencv },
  { name: "Python", icon: SiPython },
  { name: "JavaScript", icon: SiJavascript },
  { name: "C", icon: SiC },
  { name: "C++", icon: SiCplusplus },
];

// portfolio.ts
export type Experience = {
  role: string;
  company: string;
  duration: string;
  description: string;
  responsibilities: string[];
  technologies: string[];
};

export const experience: Experience[] = [
  {
    role: "Software Development Intern",
    company: "Talent Corner HR Services Pvt. Ltd.",
    duration: "June 2026 - August 2026",
    description:
      "Contributed to the development of a production Learning Management System by integrating backend APIs, refining dashboards, and collaborating on scalable frontend and backend features.",
    responsibilities: [
      "Built production LMS features",
      "Integrated backend APIs",
      "Developed dashboard modules",
      "Refined UI and UX",
      "Collaborated using Git & GitHub",
    ],
    technologies: [
      "React",
      "JavaScript",
      "FastAPI",
      "PostgreSQL",
      "Supabase",
      "Python",
    ],
  },
];

export const projects = [
  {
    id: "ai-attendance",
    title: "AI Attendance System",

    subtitle: "Real-time face recognition attendance platform",

    description:
      "Developed a real-time attendance system using YOLOv8 for face detection and DeepFace for face recognition, integrated with FastAPI and Supabase for backend services, enabling efficient and accurate attendance tracking.",

    image: attendence,

    github:
      "https://github.com/Atharva-333/Face-Detection-recognition-logging-system.git",

    live: "",

    featured: true,

    technologies: ["React", "FastAPI", "YOLOv8", "DeepFace", "Supabase"],

    architecture: [
      "Camera",
      "YOLOv8",
      "DeepFace",
      "FastAPI",
      "Supabase",
      "Dashboard",
    ],

    features: [
      "Real-time face detection and recognition",
      "Integration with FastAPI and Supabase",
      "Efficient and accurate attendance tracking",
    ],

    challenges:
      "Ensuring real-time performance and accuracy in face recognition, integrating multiple technologies seamlessly, and handling edge cases in attendance logging.",

    results:
      "Successfully deployed the AI attendance system, resulting in a 90% accuracy rate in face recognition and a significant reduction in manual attendance tracking time.",
  },
  {
    id: "LMS Portal",
    title: "Learning Management System",

    subtitle: "A comprehensive LMS for educational institutions",

    description:
      "Developed a full-featured Learning Management System (LMS) that allows educational institutions to manage courses, track student progress, and facilitate online learning through an intuitive web interface.",

    image: lms,

    github: "",

    live: "",

    featured: true,

    technologies: ["React", "FastAPI", "PostgreSQL", "Supabase"],

    architecture: [
      "Frontend (React)",
      "Backend (FastAPI)",
      "Database (PostgreSQL)",
      "Authentication & Storage (Supabase)",
    ],

    features: [
      "Course management",
      "Student progress tracking",
      "Online learning facilitation",
      "User authentication and authorization",
    ],

    challenges:
      "Designing a scalable architecture, ensuring data integrity, and providing a seamless user experience across different devices.",

    results:
      "The LMS was successfully implemented in multiple institutions, improving course management efficiency and enhancing the online learning experience for students.",
  },
];

export const skillCategories = [
  {
    title: "Frontend",
    skills: ["React", "TypeScript", "Tailwind CSS", "Vite", "HTML5", "CSS3"],
  },
  {
    title: "Backend",
    skills: ["FastAPI", "Python", "Supabase", "PostgreSQL", "REST APIs"],
  },
  {
    title: "AI & Computer Vision",
    skills: ["YOLOv8", "DeepFace", "OpenCV", "NumPy", "Pandas"],
  },
  {
    title: "Tools",
    skills: ["Git", "GitHub", "Docker", "VS Code", "Linux", "Postman"],
  },
];

export const contact = {
  email: "atharvalohar333@gmail.com",

  github: {
    username: "Atharva-333",
    url: "https://github.com/Atharva-333",
  },

  linkedin: {
    username: "atharva-lohar",
    url: "https://linkedin.com/in/atharva-lohar",
  },

  location: "Maharashtra, India",
};
