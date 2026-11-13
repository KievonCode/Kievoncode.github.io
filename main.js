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

  const photoDisplay = (arr, label) => {
    if (arr.length < 2) return photos(arr, "section-photo");

    const slides = arr.map((photo, index) => h("div", {
      class: "carousel-slide",
      role: "group",
      "aria-roledescription": "slide",
      "aria-label": (index + 1) + " of " + arr.length,
      "aria-hidden": index === 0 ? null : "true"
    }, photos([photo], "carousel-photos")));
    const track = h("div", { class: "carousel-track" }, ...slides);
    const status = h("span", { class: "carousel-status", "aria-live": "polite" }, "1 of " + arr.length);
    const previous = h("button", { type: "button", "aria-label": "Previous " + label + " photo" }, "Previous");
    const next = h("button", { type: "button", "aria-label": "Next " + label + " photo" }, "Next");
    const carousel = h("div", {
      class: "section-photo photo-carousel",
      role: "region",
      "aria-roledescription": "carousel",
      "aria-label": label + " photos",
      tabindex: "0"
    },
    h("div", { class: "carousel-viewport" }, track),
    h("div", { class: "carousel-controls" }, previous, status, next));

    let activeIndex = 0;
    const show = (index) => {
      activeIndex = (index + arr.length) % arr.length;
      slides.forEach((slide, slideIndex) => {
        if (slideIndex === activeIndex) slide.removeAttribute("aria-hidden");
        else slide.setAttribute("aria-hidden", "true");
      });
      track.style.transform = "translateX(-" + (activeIndex * 100) + "%)";
      status.textContent = (activeIndex + 1) + " of " + arr.length;
    };
    previous.addEventListener("click", () => show(activeIndex - 1));
    next.addEventListener("click", () => show(activeIndex + 1));
    carousel.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") show(activeIndex - 1);
      if (event.key === "ArrowRight") show(activeIndex + 1);
    });

    let touchStartX = null;
    carousel.addEventListener("touchstart", (event) => {
      touchStartX = event.changedTouches[0].clientX;
    }, { passive: true });
    carousel.addEventListener("touchend", (event) => {
      if (touchStartX === null) return;
      const distance = event.changedTouches[0].clientX - touchStartX;
      if (Math.abs(distance) > 40) show(activeIndex + (distance < 0 ? 1 : -1));
      touchStartX = null;
    }, { passive: true });

    return carousel;
  };

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
      h("div", { class: "project-sections" }, p.sections.map((s, index) => {
        const sectionPhotos = s.photos || [p.photos[index] || {}];
        return h("section", { class: "project-section" + (s.centered ? " centered-copy" : "") },
          h("div", { class: "project-copy" }, h("h2", {}, s.heading),
            ...(s.text || []).map((t) => h("p", {}, t)), s.bullets ? list(s.bullets) : ""),
          sectionPhotos.length ? photoDisplay(sectionPhotos, s.heading) : "");
      }))));
  }
})();
