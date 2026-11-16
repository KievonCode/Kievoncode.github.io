/* ALL SITE CONTENT LIVES HERE.
   Photos: put image files in the images/ folder, then replace an empty {} in a
   project's "photos" list with {src:"images/name.jpg", alt:"What it shows", caption:"Optional caption"}.
   Each project's photos correspond to its sections in order. A section can define
   its own "photos" list to override its matching project-level photo slot. */
window.SITE = {
  name: "Kevin Chang",
  tagline: "Mechanical and Artificial Intelligence Systems Engineering student at Western University",
  email: "kevinchang1822@gmail.com",
  links: { linkedin: "https://www.linkedin.com/in/kevin-chang-99557b300", github: "" },  // paste full URLs

  bio: [
    "I’m an engineering student at Western University, studying Mechanical Engineering and Artificial Intelligence Systems Engineering.",
    "I work on racing hardware with Western Formula Racing and Western Baja Racing, lead the mechanical weapons team for a combat robot, and have built Python tools for supply chain research. Outside class I’m into motorsports, robotics, photography and videography."
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
        { heading: "Carbon Aerodynamic Components", text: [
          "I manufactured carbon aerodynamic components and assisted with the carbon layup process and sanding."],
          photos: [
            { src: "images/formula-carbon-aerodynamic-components.jpg", alt: "Carbon fiber aerodynamic components in the workshop during fabrication", caption: "Carbon aerodynamic components during fabrication" }
          ] },
        { heading: "Chassis Assembly", text: [
          "I assembled components on the chassis, including drilling mounting holes, mounting the rear jack bar and installing electrical components inside the chassis."],
          photos: [
            { src: "images/formula-chassis-assembly.jpg", alt: "Formula race car chassis in the workshop during assembly", caption: "Formula car chassis during assembly" }
          ] }
      ],
      photos: []
    },
    {
      id: "baja", nav: "Baja", title: "Western Baja Racing",
      meta: "Rear Suspension and Brakes Team Member",
      summary: "Researched and designed routing of brake lines, modeled routing in CAD in coordination with other subsystems.",
      sections: [
        { heading: "Brake Lines", text: [
          "I was tasked with routing the front and rear brake lines from the master cylinders to the calipers. I first looked at our two previous cars to see where the brake lines were routed and what obstacles might be in the way. Then I made multiple revisions of 3d sketches in SolidWorks to find the optimal route.",
          "I sketched each line path as a 3D spline in the assembly, then created the lines as an in-context part by sweeping along those paths."],
          photos: [
            { src: "images/baja-brake-lines-assembly.png", alt: "Brake lines routed through a Baja rear suspension assembly", caption: "Brake lines in the rear suspension assembly" },
            { src: "images/baja-brake-lines-routing.png", alt: "CAD view showing the 3D spline path for Baja brake-line routing", caption: "Brake line spline routing path" }
          ] }
      ],
      photos: []
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
            { src: "images/botbrawl-blade-design.png", alt: "Dimensioned CAD sketch of the asymmetric spinner blade", caption: "Dimensioned blade design sketch" },
            { src: "images/botbrawl-blade-prototype-sketch-2.png", alt: "Dimensioned second sketch of the asymmetric spinner blade with angle, radius, and diameter callouts", caption: "Second asymmetric blade prototype sketch" }
          ] }
      ],
      photos: []
    },
    {
      id: "aquaponics", nav: "Aquaponics", title: "Aquaponics System",
      meta: "Design Team Member",
      summary: "Designed a modular aquaponics system, created full CAD model of the system and its components, presented final product at Western University's ES1050 showcase.",
      sections: [
        { heading: "Design Process", text: [
          "The team generated multiple concepts for an efficient aquaponics system running off local wastewater. After refining our ideas and deciding on a final design, I created a full CAD model of the system with all appropriate drawings and components."],
          photos: [
            { src: "images/aquaponics-design-isometric.png", alt: "Isometric CAD view of the modular aquaponics system", caption: "Aquaponics system isometric view" },
            { src: "images/aquaponics-design-grow-pod-holder.png", alt: "Square-cropped engineering drawing of the grow pod holder", caption: "Grow pod holder engineering drawing" },
            { src: "images/aquaponics-design-solar-panel-bracket.png", alt: "Square-cropped engineering drawing of the solar panel bracket", caption: "Solar panel bracket engineering drawing" },
            { src: "images/aquaponics-design-system-drawing.png", alt: "Square-cropped engineering drawing of the aquaponics system", caption: "Aquaponics system engineering drawing" }
          ] },
        { heading: "Presentation", text: [
          "Our design team presented our aquaponics system at Western University's ES1050 Design Showcase, and went through 3 judging sessions, where walked through our design process and answered questions about our final design."],
          photos: [
            { src: "images/aquaponics-presentation-board.jpg", alt: "Aquaponics project presentation board at the showcase", caption: "Aquaponics project presentation board" },
            { src: "images/aquaponics-presentation-team.jpg", alt: "Aquaponics project team at the showcase", caption: "Aquaponics project team" }
          ] }
      ],
      photos: []
    },
    {
      id: "quant-research", nav: "Quantitative Research", title: "Quantitative Research",
      meta: "Quantitative Analyst Intern",
      summary: "I developed Python tools to research supply chains and back-test trading strategies.",
      sections: [
        { heading: "Supply Chain Research", text: [
          "I Integrated a local large language model using Ollama to research upstream and downstream suppliers of a company. This model used DDGS to retrieve SEC documents (10-K, 10-Q, 8-K, etc.) and press reports related to a company, and use deductive reasoning to find which companies mentioned in the documents are suppliers to the company. The program then continues down a 6000 ticker list, and verifies that a previously listed upstream supplier also lists the company as a downstream supplier in its own list. All data is exported in CSV files."],
          photos: [] },
        { heading: "Correlation Analysis", text: [
          "Developed a program that takes CSV files of upstream and downstream suppliers for a company, uses historical EOD data on report dates to calculate the correlation between the company and its listed suppliers. This program runs through the same 6000 ticker list, outputting a single CSV file with the highest correlation company pairs."],
          photos: [] },
        { heading: "Backtesting", text: [
          "I used the high correlation company pairs to back-test multiple trading strategies using historical return data to see if a new strategy would have been successful if applied previously."],
          photos: [] }
      ],
      photos: []
    }
  ],

  experience: [
    { title: "Mechanical Weapons Team Lead", org: "WE First, Bot Brawl", dates: "Nov 2026 to present", page: "botbrawl" },
    { title: "Team Member", org: "Western Formula Racing", dates: "Sep 2025 to present", page: "formula" },
    { title: "Team Member", org: "Western Baja Racing", dates: "Nov 2026", page: "baja" },
    { title: "Quantitative Analyst Intern", org: "LXC Technologies (remote)", dates: "Jun to Aug 2026", page: "quant-research" }
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
