/* ALL SITE CONTENT LIVES HERE.
   Photos: put image files in the images/ folder, then replace an empty {} in a
   project's "photos" list with {src:"images/name.jpg", alt:"What it shows", caption:"Optional caption"}.
   Add more {} entries for more photo squares. */
window.SITE = {
  name: "Kevin Chang",
  tagline: "Engineering student building racing hardware, combat robots and data tools.",
  email: "kevinchang1822@gmail.com",
  links: { linkedin: "", instagram: "", github: "" },  // paste full URLs, e.g. "https://www.instagram.com/yourname"

  bio: [
    "I’m an engineering student at Western University, studying Mechanical Engineering and Artificial Intelligence Systems Engineering.",
    "I work on racing hardware with Western Formula Racing, lead the mechanical weapons team for a combat robot, and have built Python tools for supply chain research. Outside class I’m into motorsports, robotics, photography and videography."
  ],

  projects: [
    {
      id: "formula", nav: "Formula", title: "Western Formula Racing",
      meta: "Team member, Sep 2025 to present",
      summary: "A new rear wing mount, carbon aero parts, chassis assembly and pre-competition checks.",
      sections: [
        { heading: "Rear wing swan mount", text: [
          "The swan mount on the previous season’s rear wing failed, so I worked on a new design concept to fix it.",
          "I used FEA to check that the new design can withstand greater forces than the mount it replaces."] },
        { heading: "Carbon aerodynamic components", text: [
          "I manufactured carbon aerodynamic components and assisted with the carbon layup process and sanding."] },
        { heading: "Chassis assembly", text: [
          "I assembled components on the chassis, including drilling mounting holes, mounting the rear jack bar and installing electrical components inside the chassis."] },
        { heading: "Safety and rules", text: [
          "Before competitions I completed mock safety and rulebook checks."] }
      ],
      photos: [{}, {}, {}, {}]
    },
    {
      id: "baja", nav: "Baja", title: "Baja brake line routing",
      meta: "Brake system CAD, Baja SAE car",
      summary: "Brake line routing from the reservoirs to the calipers, modeled in the car’s suspension and brake assembly.",
      sections: [
        { heading: "What I modeled", text: [
          "I was in charge of routing the brake lines from the reservoirs to the calipers. I modeled the routing pattern in CAD, inside the assembly that contains the suspension and braking system."] },
        { heading: "How it was built", text: [
          "I sketched each line path as a 3D spline in the assembly, then created the lines as an in-context part by sweeping along those paths.",
          "The lines use the standard 3/16 inch brake line diameter."] }
      ],
      photos: [{}, {}, {}, {}]
    },
    {
      id: "botbrawl", nav: "Bot Brawl", title: "Bot Brawl combat robot",
      meta: "Mechanical weapons team lead, WE First, Nov 2026 to present",
      summary: "An asymmetric horizontal spinner weapon, and teaching the team how combat robot weapons work.",
      sections: [
        { heading: "My role", text: [
          "I’m the mechanical weapons team lead for WE First’s Bot Brawl team."] },
        { heading: "Asymmetric spinner design", text: [
          "I developed an asymmetric horizontal spinner weapon blade concept. The center of mass is balanced so the weapon stays stable while spinning.",
          "I tested the balance with a 3D printed prototype."] },
        { heading: "Teaching the team", text: [
          "I teach team members the general concepts behind developing combat robot weapons:"],
          bullets: ["Gyroscopic effects", "Reusability of parts", "Bite angle", "Asymmetry"] }
      ],
      photos: [{}, {}, {}, {}]
    },
    {
      id: "aquaponics", nav: "Aquaponics", title: "Modular aquaponics system",
      meta: "Design team member, Jan to Apr 2026",
      summary: "A concept for an efficient aquaponics system that runs on local wastewater.",
      sections: [
        { heading: "Concepts", text: [
          "The team generated multiple concepts for an efficient aquaponics system running off local wastewater."] },
        { heading: "Modular design", text: [
          "I designed a fully modular system in OnShape."] },
        { heading: "Presenting", text: [
          "I presented the research and design information."] }
      ],
      photos: [{}, {}, {}, {}]
    }
  ],

  experience: [
    { title: "Mechanical Weapons Team Lead", org: "WE First, Bot Brawl", dates: "Nov 2026 to present", page: "botbrawl" },
    { title: "Team Member", org: "Western Formula Racing", dates: "Sep 2025 to present", page: "formula" },
    { title: "Quantitative Analyst Intern", org: "LXC Technologies (remote)", dates: "Jun to Aug 2026", bullets: [
      "Integrated a local LLM into a Python program that researches the upstream and downstream supply chains of a large list of companies.",
      "Built a Python program that filters supply chain and earnings data for the highest correlation between suppliers, and back tests trading strategies against historical data."] }
  ],

  education: [
    { title: "B.E.Sc. Mechanical Engineering", org: "Western University. Dean’s Honor List, 82.5% YWA", dates: "Sep 2025 to Apr 2030" },
    { title: "B.E.Sc. Artificial Intelligence Systems Engineering", org: "Western University", dates: "Sep 2026 to Apr 2030" }
  ],

  skills: {
    Software: ["Python", "Java", "C++", "HTML", "CSS", "PHP", "OnShape", "SolidWorks", "MATLAB"],
    Equipment: ["Lathe", "Mill"],
    Languages: ["English", "Mandarin"],
    Certification: ["Certified SOLIDWORKS Associate (CSWA)"],
    Interests: ["Motorsports", "Robotics", "Photography", "Videography"]
  }
};
