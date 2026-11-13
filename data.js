/* ALL SITE CONTENT LIVES HERE.
   Photos: put image files in the images/ folder, then replace an empty {} in a
   project's "photos" list with {src:"images/name.jpg", alt:"What it shows", caption:"Optional caption"}.
   Each project's photos correspond to its sections in order. A section can define
   its own "photos" list to override its matching project-level photo slot. */
window.SITE = {
  name: "Kevin Chang",
  tagline: "Mechanical and Artificial Intelligence Systems Engineering student at Western University",
  email: "kevinchang1822@gmail.com",
  links: { linkedin: "", instagram: "", github: "" },  // paste full URLs, e.g. "https://www.instagram.com/yourname"

  bio: [
    "I’m an engineering student at Western University, studying Mechanical Engineering and Artificial Intelligence Systems Engineering.",
    "I work on racing hardware with Western Formula Racing, lead the mechanical weapons team for a combat robot, and have built Python tools for supply chain research. Outside class I’m into motorsports, robotics, photography and videography."
  ],

  projects: [
    {
      id: "formula", nav: "Formula", title: "Western Formula Racing",
      meta: "Team member",
      summary: "CAD and analyze components using FEA in SolidWorks, manufactured carbon fiber components, performed pre competition checklists.",
      sections: [
        { heading: "Rear Wing Swan Mount", text: [
          "The carbon fiber swan mount had catastrophically failed during the previous season, so the team replaced it with an aluminum mount temporarily. I was tasked with designing a new carbon fibermount that would be able to withstand the increased downforce of the new wing.",
          "I worked in a team to research concepts, design a new mount in SolidWorks, and analyze using FEA."],
          photos: [
            { src: "images/formula-rear-wing-mount-cad.jpg", alt: "CAD assembly showing the rear wing swan mount on the car", caption: "Rear Wing Swan Mount - CAD Model" },
            { src: "images/formula-rear-wing-fea-results.jpg", alt: "Stress simulation results for the rear wing swan mount with annotated arrows", caption: "Rear Wing Swan Mount - FEA Results" },
            { src: "images/formula-rear-wing-temporary-aluminum-mount.jpg", alt: "Temporary aluminum mount supporting the rear wing on the car", caption: "Rear Wing Swan Mount - Temporary Aluminum Mount" }
          ] },
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
      id: "baja", nav: "Baja", title: "Western Baja Racing",
      meta: "Rear Suspension and Brakes Team Member",
      summary: "Researched and designed routing of brake lines, modeled routing in CAD in coordination with other subsystems.",
      sections: [
        { heading: "What I modeled", text: [
          "I was in charge of routing the brake lines from the reservoirs to the calipers. I modeled the routing pattern in CAD, inside the assembly that contains the suspension and braking system."] },
        { heading: "How it was built", text: [
          "I sketched each line path as a 3D spline in the assembly, then created the lines as an in-context part by sweeping along those paths.",
          "The lines use the standard 3/16 inch brake line diameter."] }
      ],
      photos: [{}, {}]
    },
    {
      id: "botbrawl", nav: "Bot Brawl", title: "Bot Brawl",
      meta: "Mechanical Weapons Team Lead",
      summary: "Developed an asymmetrical horizontal spinner weapon blade concept, testing the balance with a 3D printed prototype, taught team members the general concepts behind designing combat robot parts.",
      sections: [
        { heading: "My Role", text: [
          "I am the mechanical weapons team lead for WE First's Bot Brawl. This is the first year that the team is running, so I am responsible for doing the appropriate research and teaching the team members."],
          centered: true, photos: [] },
        { heading: "Teaching the Team", text: [
          "I teach team members the general concepts behind developing combat robot weapons:"],
          bullets: ["Gyroscopic effects", "Reusability of parts", "Bite angle", "Material selection"],
          photos: [] },
        { heading: "Asymmetric Weapon Blade", text: [
          "There are many benefits to using an asymmetric weapon blade rather than a symmetrical blade, however it introduces new design challenges. An asymmetric blade increases weapon bite and results in harder hits, however it wears unevenly and is difficult to balance.",
          "I modeled an asymmetric blade in OnShape, using mass tools to align the center of mass with the rotation axis, and tested the balance with a 3D printed prototype."],
          photos: [
            { src: "images/botbrawl-blade-prototype.jpg", alt: "3D-printed black asymmetric spinner blade prototype on a table", caption: "3D-printed asymmetric blade prototype" },
            { src: "images/botbrawl-blade-design.png", alt: "Dimensioned CAD sketch of the asymmetric spinner blade", caption: "Dimensioned blade design sketch" }
          ] }
      ],
      photos: []
    },
    {
      id: "aquaponics", nav: "Aquaponics", title: "Aquaponics System",
      meta: "Design Team Member",
      summary: "Designed a modular aquaponics system, created full CAD model of the system and its components, presented final product at Western University's ES1050 showcase.",
      sections: [
        { heading: "Concepts", text: [
          "The team generated multiple concepts for an efficient aquaponics system running off local wastewater."] },
        { heading: "Modular design", text: [
          "I designed a fully modular system in OnShape."] },
        { heading: "Presenting", text: [
          "I presented the research and design information."] }
      ],
      photos: [{}, {}, {}]
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
