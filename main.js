(function () {
  const S = window.SITE, page = document.body.dataset.page, app = document.getElementById("app");
  const h = (t, a, ...k) => {
    const e = document.createElement(t);
    for (const [x, v] of Object.entries(a || {})) if (v) e.setAttribute(x, v);
    k.flat().forEach((c) => e.append(c));
    return e;
  };
  const url = (id) => (id === "home" ? "index.html" : id + ".html");
  const wrap = (...k) => h("div", { class: "wrap" }, ...k);
  const section = (title, ...body) => h("section", {}, h("h2", {}, title), ...body);
  const list = (a) => h("ul", {}, a.map((x) => h("li", {}, x)));

  const pages = [["home", "Home"], ...S.projects.map((p) => [p.id, p.nav]), ["about", "About"]];
  document.getElementById("site-header").append(wrap(
    h("a", { class: "brand", href: "index.html" }, S.name),
    h("nav", { "aria-label": "Main" }, h("ul", {}, pages.map(([id, label]) =>
      h("li", {}, h("a", { href: url(id), "aria-current": id === page ? "page" : null }, label)))))));
  document.getElementById("site-footer").append("© " + new Date().getFullYear() + " " + S.name);

  const photos = (arr, className = "photos") => h("div", { class: className }, arr.map((p) => h("figure", {},
    p.src ? h("img", { src: p.src, alt: p.alt || "", loading: "lazy" }) : h("div", { class: "ph", "aria-hidden": "true" }, "Photo coming soon"),
    p.caption ? h("figcaption", {}, p.caption) : "")));

  if (page === "home") {
    document.title = S.name + " | Portfolio";
    app.append(
      h("div", { class: "hero" }, wrap(h("h1", {}, S.name), h("p", { class: "lead" }, S.tagline))),
      wrap(section("Projects & Teams", h("div", { class: "cards" }, S.projects.map((p) =>
        h("a", { class: "card", href: url(p.id) }, h("h3", {}, p.title), h("p", { class: "meta" }, p.meta), h("p", {}, p.summary)))))));
  } else if (page === "about") {
    document.title = "About | " + S.name;
    const links = [["LinkedIn", S.links.linkedin, 1], ["Instagram", S.links.instagram, 1], ["GitHub", S.links.github, 0], ["Email", S.email && "mailto:" + S.email, 0]];
    app.append(wrap(
      h("div", { class: "page-head" }, h("h1", {}, "About me")),
      section("Bio", S.bio.map((t) => h("p", {}, t))),
      section("Links", h("ul", { class: "links" }, links.filter(([, u, always]) => u || always).map(([l, u]) =>
        h("li", {}, u ? h("a", { href: u }, l) : h("span", { class: "soon" }, l + " (coming soon)"))))),
      section("Experience", h("div", { class: "timeline" }, S.experience.map((x) => h("article", {},
        h("div", { class: "meta" }, x.dates),
        h("div", {}, h("h3", {}, x.title), h("div", { class: "meta" }, x.org),
          x.bullets ? list(x.bullets) : "", x.page ? h("a", { href: url(x.page) }, "See the project page") : ""))))),
      section("Education", h("div", { class: "timeline" }, S.education.map((x) => h("article", {},
        h("div", { class: "meta" }, x.dates), h("div", {}, h("h3", {}, x.title), h("div", { class: "meta" }, x.org)))))),
      section("Skills", h("dl", { class: "skills" }, Object.entries(S.skills).flatMap(([k, v]) => [h("dt", {}, k), h("dd", {}, v.join(", "))])))));
  } else {
    const p = S.projects.find((x) => x.id === page);
    document.title = p.title + " | " + S.name;
    app.append(wrap(
      h("div", { class: "page-head" }, h("h1", {}, p.title), h("p", { class: "meta" }, p.meta), h("p", { class: "lead" }, p.summary)),
      h("div", { class: "project-sections" }, p.sections.map((s, index) =>
        h("section", { class: "project-section" },
          h("div", { class: "project-copy" }, h("h2", {}, s.heading),
            ...(s.text || []).map((t) => h("p", {}, t)), s.bullets ? list(s.bullets) : ""),
          photos([p.photos[index] || {}], "section-photo"))))));
  }
})();
