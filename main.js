(function () {
  // Always open at the top of the page on load and reload (unless the URL points at an anchor).
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  const toTop = () => { if (!location.hash) window.scrollTo(0, 0); };
  toTop();
  window.addEventListener("load", toTop);
  window.addEventListener("pageshow", (e) => { if (e.persisted) toTop(); });

  const S = window.SITE, page = document.body.dataset.page, app = document.getElementById("app");
  const h = (t, a, ...k) => {
    const e = document.createElement(t);
    for (const [x, v] of Object.entries(a || {})) if (v) e.setAttribute(x, v);
    k.flat().forEach((c) => e.append(c));
    return e;
  };
  // Internships (data.js "internships"): one shared page, internship.html?id=<project id>.
  const interns = S.internships || (S.internship ? [S.internship] : []);
  const isIntern = (id) => interns.some((x) => x.project === id);
  const url = (id) => (id === "home" ? "index.html" : isIntern(id) ? "internship.html?id=" + encodeURIComponent(id) : id + ".html");
  const wrap = (...k) => h("div", { class: "wrap" }, ...k);
  const section = (title, ...body) => h("section", {}, h("h2", {}, title), ...body);
  const list = (a) => h("ul", {}, a.map((x) => h("li", {}, x)));
  const hidden = (t) => h("span", { class: "visually-hidden" }, t);
  const readMore = (href, what) => h("a", { href }, "Read more", hidden(" about " + what));
  const linkOrSoon = (label, href) => href ? h("a", { href }, label) : h("span", { class: "soon" }, label + " (coming soon)");

  const navProjects = S.projects.filter((p) => !isIntern(p.id));
  // the internship shown on internship.html: ?id=..., or the first one listed
  const internId = page === "internship" ? (new URLSearchParams(location.search).get("id") || (interns[0] || {}).project) : null;
  const category = (p) => (S.categories || {})[p.id] || "Projects";

  /* ---------- Photos ---------- */
  const figure = (p) => h("figure", {},
    p.src ? h("img", { src: p.src, alt: p.alt || "", loading: "lazy" }) : h("div", { class: "ph", "aria-hidden": "true" }),
    p.caption ? h("figcaption", {}, p.caption) : "");
  const photos = (arr) => h("div", { class: "photos" }, arr.map(figure));
  const sectionPhotos = (p, s, i) => s.photos || [p.photos[i] || {}];

  /* ---------- Header and navigation ---------- */
  const cur = (id) => (id === page ? "page" : null);
  const homeLink = h("a", { href: "index.html", "aria-current": cur("home") }, "Home");
  const toggle = h("button", { type: "button", class: "menu-toggle", "aria-expanded": "false", "aria-controls": "site-nav" }, "Menu");
  // A top-bar item with a hover dropdown. Projects and Internships are sections of the
  // home page; their dropdowns link to the individual pages.
  const dropdown = (label, href, items, current) => {
    const link = h("a", { href }, label);
    const item = h("li", { class: "has-sub" + (current ? " is-current" : "") }, link,
      h("ul", { class: "sub" }, items.map(([text, to, here]) => h("li", {}, h("a", { href: to, "aria-current": here ? "page" : null }, text)))));
    item.addEventListener("keydown", (e) => { if (e.key === "Escape") { item.classList.add("closed"); link.focus(); } });
    item.addEventListener("mouseenter", () => item.classList.remove("closed"));
    item.addEventListener("focusout", (e) => { if (!item.contains(e.relatedTarget)) item.classList.remove("closed"); });
    return { item, link };
  };
  const projNav = dropdown("Projects", "index.html#projects",
    navProjects.map((p) => [p.nav, url(p.id), p.id === page]), navProjects.some((p) => p.id === page));
  const internNav = dropdown("Internships", "index.html#internships",
    interns.map((x) => [x.nav || x.title, url(x.project), x.project === internId]), page === "internship");
  const nav = h("nav", { id: "site-nav", "aria-label": "Main" }, h("ul", { class: "menu" },
    h("li", {}, homeLink),
    projNav.item,
    internNav.item,
    h("li", {}, h("a", { href: "resume.html", "aria-current": cur("resume") }, "Resume"))));
  document.getElementById("site-header").append(wrap(h("a", { class: "brand", href: "index.html" }, S.name), toggle, nav));
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("open", open);
  });

  /* ---------- Footer ----------
     Contact links on every page except the resume, which already lists them at the top;
     the name line closes every page. */
  document.getElementById("site-footer").append(
    page === "resume" ? "" : h("h2", {}, "Contact"),
    page === "resume" ? "" : h("ul", { class: "contact" }, [
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
    navProjects.forEach((p) => (groups[category(p)] = groups[category(p)] || []).push(p));
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
  // Resume entries laid out like the PDF: two lines, each with text on the left and right.
  const row = (cls, left, right) => h("div", { class: "row " + cls }, h("span", {}, left), right ? h("span", {}, right) : "");
  const resumeEntry = (x, kind) => {
    const [org, loc] = x.org ? splitOrg(x) : ["", x.location || ""];
    const head = kind === "education"
      ? [row("strong", x.org, loc), row("second", x.title, x.dates)]
      : kind === "project"
        ? [row("strong", h("span", {}, x.title, x.tools ? h("span", { class: "tools" }, " | ", h("em", {}, x.tools)) : ""), x.dates)]
        : [row("strong", x.title, x.dates), row("second", org, loc)];
    return h("article", { class: "resume-entry" }, ...head,
      x.bullets ? list(x.bullets) : "",
      x.page ? h("p", { class: "more" }, readMore(url(x.page), x.title + (org ? ", " + org : ""))) : "");
  };
  const back = (to) => to === "internships"
    ? h("p", { class: "back" }, h("a", { href: "index.html#internships" }, "Back to internships"))
    : h("p", { class: "back" }, h("a", { href: "index.html#projects" }, "Back to projects"));
  const internBlock = (x) => {
    const p = S.projects.find((q) => q.id === x.project) || {};
    const exp = S.experience.find((e) => e.page === x.project);
    return h("article", { class: "project-block" },
      h("h3", {}, x.title || p.title),
      exp ? h("p", { class: "meta" }, exp.dates) : "",
      p.summary ? h("p", {}, p.summary) : "",
      readMore(url(x.project), x.title || p.title));
  };

  /* ---------- Pages ---------- */
  if (page === "home") {
    document.title = S.name + " | Portfolio";
    app.append(
      h("div", { id: "hero" }, wrap(h("h1", {}, S.name), h("p", { class: "lead" }, S.tagline))),
      wrap(
        h("section", { id: "projects" }, h("h2", {}, "Projects"), projectGroups(3)),
        interns.length ? h("section", { id: "internships" }, h("h2", {}, "Internships"),
          h("div", { class: "project-grid" }, interns.map(internBlock))) : ""));
  } else if (page === "internship") {
    const x = interns.find((i) => i.project === internId) || interns[0] || {};
    const p = S.projects.find((q) => q.id === x.project);
    const exp = S.experience.find((e) => e.page === x.project);
    const [, loc] = exp ? splitOrg(exp) : [];
    document.title = (x.title || "Internships") + " | " + S.name;
    app.append(wrap(
      h("div", { class: "page-head" }, h("h1", {}, x.title || (p && p.title) || "Internships"),
        exp ? h("p", { class: "meta" }, exp.dates, loc ? h("span", { class: "exp-loc" }, " · " + loc.replace(/[()]/g, "")) : "") : "",
        p ? h("p", { class: "lead" }, p.summary) : ""),
      p ? projectBody(p) : "",
      back("internships")));
  } else if (page === "resume") {
    // The resume, word for word as in the PDF.
    document.title = "Resume | " + S.name;
    const contact = [S.email && h("a", { href: "mailto:" + S.email }, S.email),
      S.links.linkedin && h("a", { href: S.links.linkedin }, "LinkedIn"), S.links.github && h("a", { href: S.links.github }, "GitHub")]
      .filter(Boolean).flatMap((x, i) => (i ? [" | ", x] : [x]));
    const block = (title, items, kind) => section(title, h("div", { class: "resume-list" }, items.map((x) => resumeEntry(x, kind))));
    app.append(wrap(
      h("div", { class: "page-head resume-head" }, h("h1", {}, S.name), h("p", { class: "contact-line" }, ...contact),
        h("p", {}, h("a", { href: S.resumePdf, download: S.resumePdf.split("/").pop() }, "Download resume (PDF)"))),
      block("Education", S.education, "education"),
      block("Experience", S.experience, "experience"),
      (S.resumeProjects || []).length ? block("Projects", S.resumeProjects, "project") : "",
      section("Skills & Interests", h("dl", { class: "skills" }, Object.entries(S.skills).flatMap(([k, v]) => [h("dt", {}, k), h("dd", {}, v.join(", "))])))));
  } else {
    const p = S.projects.find((x) => x.id === page);
    if (!p) return;
    document.title = p.title + " | " + S.name;
    app.append(wrap(
      h("div", { class: "page-head" }, h("h1", {}, p.title), h("p", { class: "meta" }, p.meta), h("p", { class: "lead" }, p.summary)),
      projectBody(p),
      back()));
  }

  /* ---------- Home: Projects and Internships are sections, reached by scrolling ---------- */
  if (page === "home") {
    const hero = document.getElementById("hero"), header = document.getElementById("site-header");
    // top-bar items for each home section, in page order
    const sections = [
      { key: "projects", el: document.getElementById("projects"), nav: projNav },
      { key: "internships", el: document.getElementById("internships"), nav: internNav }
    ].filter((x) => x.el);
    const reduced = () => !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
    const closeMenu = () => { toggle.setAttribute("aria-expanded", "false"); nav.classList.remove("open"); };
    const topOf = (el) => Math.round(el.getBoundingClientRect().top + window.scrollY - header.offsetHeight);
    const projectsY = () => (sections[0] ? topOf(sections[0].el) : 0);

    // Top bar: a section's item is white and underlined once that section is coming up; Home before.
    let active = null, lockUntil = 0;
    const setActive = (key) => {
      if (key === active) return;
      active = key;
      sections.forEach((x) => x.nav.item.classList.toggle("is-current", x.key === key));
      if (key === "home") homeLink.setAttribute("aria-current", "page"); else homeLink.removeAttribute("aria-current");
    };
    const spy = () => {
      if (performance.now() < lockUntil) return; // a glide already chose; don't flicker on the way
      let key = "home";
      const line = window.innerHeight * 0.65;
      sections.forEach((x) => { if (x.el.getBoundingClientRect().top <= line) key = x.key; });
      // at the very bottom the last section is current even if it is too short to reach the line
      if (sections.length && window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2)
        key = sections[sections.length - 1].key;
      setActive(key);
    };
    const glideTo = (y, key) => {
      setActive(key);
      lockUntil = performance.now() + 1000;
      window.scrollTo({ top: Math.max(0, Math.round(y)), behavior: reduced() ? "auto" : "smooth" });
    };

    // the nav buttons scroll this page instead of loading another one, and swap the top bar at once;
    // a clicked dropdown closes and opens again the next time the mouse moves onto it
    homeLink.addEventListener("click", (e) => { e.preventDefault(); closeMenu(); glideTo(0, "home"); });
    sections.forEach((x) => x.nav.link.addEventListener("click", (e) => {
      e.preventDefault(); closeMenu();
      x.nav.item.classList.add("closed"); e.currentTarget.blur();
      glideTo(topOf(x.el), x.key);
    }));

    // Snap: when scrolling comes to rest anywhere between the fully shown car (hero-car.js stores
    // that scroll position on #hero as data-reveal-y) and the top of Projects, glide on in the
    // direction you were scrolling: down to the top of Projects, or up to the full car.
    // Nothing else about scrolling is changed. Skipped for reduced motion.
    let lastY = window.scrollY, dir = 0, idle = 0, touching = false;
    const settle = () => {
      if (touching || reduced() || performance.now() < lockUntil || !sections.length) return;
      const carY = +(hero && hero.dataset.revealY) || 0, projY = projectsY(), y = window.scrollY;
      if (!carY || projY <= carY + 8 || y <= carY + 4 || y >= projY - 4) return;
      glideTo(dir >= 0 ? projY : carY, dir >= 0 ? sections[0].key : "home");
    };
    const hasScrollEnd = "onscrollend" in window;
    const later = () => { clearTimeout(idle); idle = setTimeout(settle, 150); };
    window.addEventListener("scroll", () => {
      const y = window.scrollY;
      if (y !== lastY) dir = y > lastY ? 1 : -1;
      lastY = y;
      spy();
      if (!hasScrollEnd) later();
    }, { passive: true });
    if (hasScrollEnd) window.addEventListener("scrollend", () => { settle(); spy(); });
    window.addEventListener("touchstart", () => { touching = true; }, { passive: true });
    window.addEventListener("touchend", () => { touching = false; if (!hasScrollEnd) later(); }, { passive: true });
    window.addEventListener("resize", spy, { passive: true });

    // arriving from another page's top-bar link (index.html#projects or #internships): go to the
    // section once the layout has settled, then drop the # from the address so a reload starts at the top
    const arrive = sections.find((x) => "#" + x.key === location.hash);
    if (arrive) {
      arrive.nav.item.classList.add("closed"); // the cursor is still on the button from the click
      const jump = () => { window.scrollTo(0, topOf(arrive.el)); lastY = window.scrollY; setActive(arrive.key); lockUntil = performance.now() + 300; };
      window.addEventListener("load", () => {
        jump();
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(jump);
        history.replaceState(null, "", location.pathname + location.search);
      });
    }
    spy();
  }
})();
