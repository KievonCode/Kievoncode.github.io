(function () {
  const S = window.SITE;
  const $ = (id) => document.getElementById(id);
  const h = (tag, attrs, ...kids) => {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) if (v) e.setAttribute(k, v);
    kids.flat().forEach((k) => e.append(k));
    return e;
  };

  document.title = S.name + " | Portfolio";
  $("name").textContent = S.name;
  $("tagline").textContent = S.tagline;
  S.titleBlock.forEach(([k, v]) => $("titleblock").append(h("dt", {}, k), h("dd", {}, v)));

  S.projects.forEach((p) => {
    $("project-list").append(h("article", { class: "project" },
      p.image ? h("img", { src: p.image, alt: p.imageAlt || p.title, loading: "lazy" }) : "",
      h("div", { class: "body" },
        h("h3", {}, p.title),
        h("p", { class: "meta" }, p.date),
        h("p", {}, p.summary),
        p.link ? h("a", { href: p.link }, p.linkText || "View project") : "",
        h("ul", { class: "tags" }, (p.tags || []).map((t) => h("li", {}, t))))));
  });

  const timeline = (id, items) => items.forEach((x) => {
    $(id).append(h("article", {},
      h("div", { class: "when" }, x.dates, h("br"), x.location),
      h("div", {}, h("h3", {}, x.title), h("div", { class: "meta" }, x.subtitle),
        x.bullets ? h("ul", {}, x.bullets.map((b) => h("li", {}, b))) : "")));
  });
  timeline("experience-list", S.experience);
  timeline("education-list", S.education);

  Object.entries(S.skills).forEach(([k, v]) => $("skill-list").append(h("dt", {}, k), h("dd", {}, v.join(", "))));

  const c = $("contact-links");
  [["Email", S.email && "mailto:" + S.email], ["GitHub", S.github], ["LinkedIn", S.linkedin]]
    .forEach(([label, url]) => { if (url) c.append(h("a", { href: url }, label)); });
})();
