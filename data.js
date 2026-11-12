/* ALL SITE CONTENT LIVES HERE. To add a project, copy one {...} block inside
   "projects", paste it at the top of the list, and edit the text.
   Put images in the images/ folder and reference them like "images/my-photo.jpg". */
window.SITE = {
  name: "Kevin Chang",
  tagline: "Engineering student building racing hardware, combat robots and data tools.",
  email: "kevinchang1822@gmail.com",
  github: "",    // e.g. "https://github.com/yourname"
  linkedin: "",  // e.g. "https://www.linkedin.com/in/yourname"

  titleBlock: [
    ["Studying", "Mechanical Engineering and Artificial Intelligence Systems Engineering"],
    ["School", "Western University, London, ON"],
    ["Teams", "Western Formula Racing, WE First Bot Brawl"],
    ["Tools", "SolidWorks (CSWA), OnShape, Python, Java, C++, MATLAB"]
  ],

  projects: [
    {
      title: "Asymmetric spinner weapon",
      date: "November 2026 to present",
      summary: "Horizontal spinner blade concept for a combat robot, with the center of mass balanced for stability. Balance checked on a 3D printed prototype.",
      tags: ["Combat robotics", "Prototyping"],
      image: "", imageAlt: "", link: ""
    },
    {
      title: "Formula rear wing swan mount",
      date: "2025 to 2026 season",
      summary: "Redesigned the rear wing mount that failed the previous season, using FEA to confirm the new design handles higher loads.",
      tags: ["Western Formula Racing", "FEA", "Carbon fibre"],
      image: "", imageAlt: "", link: ""
    },
    {
      title: "Supply chain research tool",
      date: "June to August 2026",
      summary: "Python program that uses a local LLM to map upstream and downstream supply chains, then filters supplier and earnings data to back test trading strategies.",
      tags: ["Python", "Local LLM", "Back testing"],
      image: "", imageAlt: "", link: ""
    },
    {
      title: "Modular aquaponics system",
      date: "January to April 2026",
      summary: "Concepts for an efficient aquaponics system running on local wastewater. Designed a fully modular system in OnShape and presented the research.",
      tags: ["OnShape", "Concept design", "Presentation"],
      image: "", imageAlt: "", link: ""
    }
  ],

  experience: [
    {
      title: "Mechanical Weapons Team Lead", subtitle: "WE First, Bot Brawl",
      dates: "Nov 2026 to present", location: "London, ON",
      bullets: [
        "Developed an asymmetric horizontal spinner weapon and balanced its center of mass for stability.",
        "Taught teammates weapon design concepts: gyroscopic effects, part reusability, bite angle and asymmetry."
      ]
    },
    {
      title: "Team Member", subtitle: "Western Formula Racing",
      dates: "Sep 2025 to present", location: "London, ON",
      bullets: [
        "Designed a new rear wing swan mount and validated it with FEA.",
        "Manufactured carbon aerodynamic components and assisted with layup and sanding.",
        "Assembled chassis components, including the rear jack bar and electrical parts.",
        "Ran mock safety and rulebook checks before competitions."
      ]
    },
    {
      title: "Quantitative Analyst Intern", subtitle: "LXC Technologies",
      dates: "Jun to Aug 2026", location: "Remote",
      bullets: [
        "Integrated a local LLM into a Python program that researches supply chains for a large list of companies.",
        "Built a Python tool that finds the highest correlations between suppliers and back tests strategies on historical data."
      ]
    }
  ],

  education: [
    { title: "B.E.Sc. Mechanical Engineering", subtitle: "Western University. Dean’s Honor List, 82.5% YWA", dates: "Sep 2025 to Apr 2030", location: "London, ON" },
    { title: "B.E.Sc. Artificial Intelligence Systems Engineering", subtitle: "Western University", dates: "Sep 2026 to Apr 2030", location: "London, ON" }
  ],

  skills: {
    Software: ["Python", "Java", "C++", "HTML", "CSS", "PHP", "OnShape", "SolidWorks", "MATLAB"],
    Equipment: ["Lathe", "Mill"],
    Languages: ["English", "Mandarin"],
    Certification: ["Certified SOLIDWORKS Associate (CSWA)"],
    Interests: ["Motorsports", "Robotics", "Photography", "Videography"]
  }
};
