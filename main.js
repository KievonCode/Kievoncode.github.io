(function () {
  const S = window.SITE, page = document.body.dataset.page, app = document.getElementById("app");
  const h = (t, a, ...k) => {
    const e = document.createElement(t);
    for (const [x, v] of Object.entries(a || {})) if (v) e.setAttribute(x, v);
    k.flat().forEach((c) => e.append(c));
    return e;
  };
  const intern = S.internship || {};
  const url = (id) => (id === "home" ? "index.html" : id === intern.project ? "internship.html" : id + ".html");
  const wrap = (...k) => h("div", { class: "wrap" }, ...k);
  const section = (title, ...body) => h("section", {}, h("h2", {}, title), ...body);
  const list = (a) => h("ul", {}, a.map((x) => h("li", {}, x)));
  const hidden = (t) => h("span", { class: "visually-hidden" }, t);
  const readMore = (href, what) => h("a", { href }, "Read more", hidden(" about " + what));
  const linkOrSoon = (label, href) => href ? h("a", { href }, label) : h("span", { class: "soon" }, label + " (coming soon)");

  const navProjects = S.projects.filter((p) => p.id !== intern.project);
  const internProject = S.projects.find((p) => p.id === intern.project);
  const internExp = S.experience.find((x) => x.page === intern.project);
  const category = (p) => (S.categories || {})[p.id] || "Projects";

  /* ---------- Photos ---------- */
  const figure = (p) => h("figure", {},
    p.src ? h("img", { src: p.src, alt: p.alt || "", loading: "lazy" }) : h("div", { class: "ph", "aria-hidden": "true" }),
    p.caption ? h("figcaption", {}, p.caption) : "");
  const photos = (arr) => h("div", { class: "photos" }, arr.map(figure));
  const sectionPhotos = (p, s, i) => s.photos || [p.photos[i] || {}];

  /* ---------- Header and navigation ---------- */
  const cur = (id) => (id === page ? "page" : null);
  const inProjects = page === "projects" || navProjects.some((p) => p.id === page);
  const toggle = h("button", { type: "button", class: "menu-toggle", "aria-expanded": "false", "aria-controls": "site-nav" }, "Menu");
  const projectsLink = h("a", { href: "projects.html", "aria-current": cur("projects") }, "Projects");
  const projItem = h("li", { class: "has-sub" + (inProjects ? " is-current" : "") }, projectsLink,
    h("ul", { class: "sub" }, navProjects.map((p) => h("li", {}, h("a", { href: url(p.id), "aria-current": cur(p.id) }, p.nav)))));
  const nav = h("nav", { id: "site-nav", "aria-label": "Main" }, h("ul", { class: "menu" },
    h("li", {}, h("a", { href: "index.html", "aria-current": cur("home") }, "Home")),
    projItem,
    h("li", {}, h("a", { href: "internship.html", "aria-current": cur("internship") }, "Internship Experience")),
    h("li", {}, h("a", { href: "resume.html", "aria-current": cur("resume") }, "Resume"))));
  document.getElementById("site-header").append(wrap(h("a", { class: "brand", href: "index.html" }, S.name), toggle, nav));
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("open", open);
  });
  projItem.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { projItem.classList.add("closed"); projectsLink.focus(); }
  });
  projItem.addEventListener("mouseenter", () => projItem.classList.remove("closed"));
  projItem.addEventListener("focusout", (e) => { if (!projItem.contains(e.relatedTarget)) projItem.classList.remove("closed"); });

  /* ---------- Contact footer ---------- */
  document.getElementById("site-footer").append(
    h("h2", {}, "Contact"),
    h("ul", { class: "contact" }, [
      linkOrSoon("LinkedIn", S.links.linkedin),
      linkOrSoon(S.email || "Email", S.email && "mailto:" + S.email),
      h("a", { href: "resume.html" }, "Resume")
    ].map((x) => h("li", {}, x))),
    h("p", { class: "copy" }, "© " + new Date().getFullYear() + " " + S.name));

  /* ---------- Shared blocks ---------- */
  const projectBlock = (p, level) => h("article", { class: "project-block" },
    h("h" + level, {}, p.title),
    h("p", {}, p.summary),
    readMore(url(p.id), p.title));
  const projectGroups = (level) => {
    const groups = {};
    S.projects.forEach((p) => (groups[category(p)] = groups[category(p)] || []).push(p));
    return Object.entries(groups).map(([name, ps]) => h("div", { class: "project-group" },
      h("h" + level, {}, name),
      h("div", { class: "project-grid" }, ps.map((p) => projectBlock(p, level + 1)))));
  };
  const splitOrg = (x) => {
    const m = x.org.match(/^(.*?)\s*\(([^)]+)\)$/);
    return m ? [m[1], m[2]] : [x.org, x.location || ""];
  };
  const projectBody = (p) => h("div", { class: "project-sections" }, p.sections.map((s, i) => {
    const ph = sectionPhotos(p, s, i);
    return h("section", {}, h("h2", {}, s.heading),
      ...(s.text || []).map((t) => h("p", {}, t)), s.bullets ? list(s.bullets) : "",
      ph.length ? photos(ph) : "");
  }));
  const resumeEntry = (x) => {
    const [org, loc] = x.org ? splitOrg(x) : ["", x.location || ""];
    const sub = [org, x.tools, loc].filter(Boolean).join(" · ");
    return h("article", {},
      h("div", { class: "meta" }, x.dates),
      h("div", {}, h("h3", {}, x.title), sub ? h("div", { class: "meta" }, sub) : "",
        x.bullets ? list(x.bullets) : "",
        x.page ? readMore(url(x.page), x.title + (org ? ", " + org : "")) : ""));
  };
  const back = () => h("p", { class: "back" }, h("a", { href: "projects.html" }, "Back to projects"));

  /* ---------- Pages ---------- */
  if (page === "home") {
    document.title = S.name + " | Portfolio";
    app.append(
      h("div", { id: "hero" }, wrap(h("h1", {}, S.name), h("p", { class: "lead" }, S.tagline))),
      wrap(
        h("section", { id: "projects" }, h("h2", {}, "Projects"), projectGroups(3))));
  } else if (page === "projects") {
    document.title = "Projects | " + S.name;
    app.append(wrap(h("div", { class: "page-head" }, h("h1", {}, "Projects")), projectGroups(2)));
  } else if (page === "internship") {
    document.title = "Internship Experience | " + S.name;
    const [, loc] = internExp ? splitOrg(internExp) : [];
    app.append(wrap(
      h("div", { class: "page-head" }, h("h1", {}, intern.title),
        internExp ? h("p", { class: "meta" }, internExp.dates, loc ? h("span", { class: "exp-loc" }, " · " + loc) : "") : "",
        internProject ? h("p", { class: "lead" }, internProject.summary) : ""),
      internProject ? projectBody(internProject) : "",
      back()));
  } else if (page === "resume") {
    document.title = "Resume | " + S.name;
    const links = [["LinkedIn", S.links.linkedin, 1], ["GitHub", S.links.github, 0], [S.email, S.email && "mailto:" + S.email, 0]];
    app.append(wrap(
      h("div", { class: "page-head" }, h("h1", {}, "Resume"),
        h("p", {}, h("a", { href: S.resumePdf, download: S.resumePdf.split("/").pop() }, "Download resume (PDF)"))),
      section("Bio", S.bio.map((t) => h("p", {}, t))),
      section("Links", h("ul", { class: "links" }, links.filter(([, u, always]) => u || always).map(([l, u]) =>
        h("li", {}, linkOrSoon(l, u))))),
      section("Education", h("div", { class: "timeline" }, S.education.map(resumeEntry))),
      section("Experience", h("div", { class: "timeline" }, S.experience.map(resumeEntry))),
      (S.resumeProjects || []).length ? section("Projects", h("div", { class: "timeline" }, S.resumeProjects.map(resumeEntry))) : "",
      section("Skills", h("dl", { class: "skills" }, Object.entries(S.skills).flatMap(([k, v]) => [h("dt", {}, k), h("dd", {}, v.join(", "))])))));
  } else {
    const p = S.projects.find((x) => x.id === page);
    if (!p) return;
    document.title = p.title + " | " + S.name;
    app.append(wrap(
      h("div", { class: "page-head" }, h("h1", {}, p.title), h("p", { class: "meta" }, p.meta), h("p", { class: "lead" }, p.summary)),
      projectBody(p),
      back()));
  }
})();
