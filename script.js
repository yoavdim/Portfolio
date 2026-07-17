/* Renders the portfolio from the data in projects.js */

(function () {
  "use strict";

  // Wire up profile links (GitHub / LinkedIn / CV).
  document.querySelectorAll("[data-link]").forEach(function (el) {
    var key = el.getAttribute("data-link");
    if (PROFILE[key]) {
      el.setAttribute("href", PROFILE[key]);
      if (key !== "cv") {
        el.setAttribute("target", "_blank");
        el.setAttribute("rel", "noopener");
      }
    }
  });

  function el(tag, className, html) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (html != null) node.innerHTML = html;
    return node;
  }

  function list(items) {
    var ul = document.createElement("ul");
    items.forEach(function (item) {
      ul.appendChild(el("li", null, item));
    });
    return ul;
  }

  var GH_ICON =
    '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">' +
    '<path d="M12 .5C5.73.5.5 5.73.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.79 2.73 1.27 3.4.97.1-.76.41-1.27.74-1.56-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.08 0 4.41-2.69 5.38-5.25 5.67.42.36.8 1.08.8 2.18v3.23c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z"/></svg>';

  function ghIconLink(url) {
    var a = el("a", "gh-link gh-link--icon", GH_ICON);
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener";
    a.setAttribute("aria-label", "View on GitHub");
    a.title = "View on GitHub";
    return a;
  }

  // Research-paper icon in the same solid "paper-cut" style as the GH
  // icon: a filled document with text lines and a magnifying glass
  // knocked out as negative space (fill-rule evenodd).
  var PAPER_ICON =
    '<svg viewBox="0 0 24 24" width="21" height="21" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" aria-hidden="true">' +
    // document body (rounded rect) with text lines knocked out
    '<path d="M6 2h9.2L20 6.8V19a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3Zm1 7.2a1 1 0 1 0 0 2h9a1 1 0 1 0 0-2H7Zm0 3.6a1 1 0 1 0 0 2h9a1 1 0 1 0 0-2H7Zm0 3.6a1 1 0 1 0 0 2h5a1 1 0 1 0 0-2H7Z"/>' +
    "</svg>";

  function paperIconLink(url) {
    var a = el("a", "gh-link gh-link--icon", PAPER_ICON);
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener";
    a.setAttribute("aria-label", "Read the paper");
    a.title = "Read the paper";
    return a;
  }

  function mockup(p) {
    var wrap = el("div", "mockup");
    var bar = el("div", "mockup__bar");
    bar.appendChild(el("span"));
    bar.appendChild(el("span"));
    bar.appendChild(el("span"));
    wrap.appendChild(bar);

    var screen = el("div", "mockup__screen");
    if (p.image) {
      var img = document.createElement("img");
      img.src = p.image;
      img.alt = p.title + " screenshot";
      img.loading = "lazy";
      screen.appendChild(img);
    } else {
      screen.appendChild(el("div", "mockup__placeholder", "screenshot"));
    }
    wrap.appendChild(screen);
    return wrap;
  }

  function lessonsPanel(p) {
    var panel = el("div", "lessons");
    panel.appendChild(el("h4", null, "Lessons"));
    panel.appendChild(list(p.lessons || []));
    return panel;
  }

  function featureBody(p) {
    var body = el("div", "feature-card__body");
    var head = el("div", "feature-card__head");
    head.appendChild(el("h3", "feature-card__title", p.title));
    if (p.gh) {
      head.appendChild(ghIconLink(p.gh));
    } else if (p.badge) {
      head.appendChild(el("span", "badge", p.badge));
    }
    if (p.paper) {
      head.appendChild(paperIconLink(p.paper));
    }
    body.appendChild(head);
    if (p.tech) {
      var techText = Array.isArray(p.tech) ? p.tech.join(" / ") : p.tech;
      body.appendChild(el("p", "tech-line", techText));
    }
    if (p.blurb) body.appendChild(el("p", "feature-blurb", p.blurb));
    body.appendChild(list(p.features || []));
    return body;
  }

  function slugify(str) {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  // Render featured cards, alternating layout each row.
  var featured = document.getElementById("featured");
  var sections = []; // { id, title } for the TOC + scroll-spy
  FEATURED.forEach(function (p, i) {
    var id = "project-" + slugify(p.title);
    var card = el("div", "feature-card" + (i % 2 === 1 ? " reverse" : ""));
    card.id = id;
    card.appendChild(mockup(p));
    card.appendChild(featureBody(p));
    card.appendChild(lessonsPanel(p));
    featured.appendChild(card);
    sections.push({ id: id, title: p.title });
  });
  sections.push({ id: "more", title: "More projects" });

  // Render smaller grid cards.
  var grid = document.getElementById("grid");
  var gridSections = []; // { id, title } for the expandable sub-list
  GRID.forEach(function (p) {
    var card = el("div", "mini-card");
    card.id = "project-" + slugify(p.title);
    gridSections.push({ id: card.id, title: p.title });
    var head = el("div", "mini-card__head");
    head.appendChild(el("h3", "mini-card__title", p.title));
    if (p.gh) {
      head.appendChild(ghIconLink(p.gh));
    } else if (p.badge) {
      head.appendChild(el("span", "badge", p.badge));
    }
    card.appendChild(head);
    if (p.description) card.appendChild(el("p", null, p.description));
    var tags = el("div", "tags");
    (p.tags || []).forEach(function (t) {
      tags.appendChild(el("span", "tag", t));
    });
    card.appendChild(tags);
    grid.appendChild(card);
  });

  // Build the sticky table of contents.
  var toc = document.getElementById("toc");
  toc.appendChild(el("p", "toc__title", "Jump to"));
  var tocLinks = {};

  function makeTocLink(s, extraClass) {
    var link = el("a", "toc__link" + (extraClass ? " " + extraClass : ""), s.title);
    link.href = "#" + s.id;
    link.addEventListener("click", function (e) {
      e.preventDefault();
      var target = document.getElementById(s.id);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    tocLinks[s.id] = link;
    return link;
  }

  sections.forEach(function (s) {
    toc.appendChild(makeTocLink(s));
    // After "More projects", nest the grid items in a collapsible group.
    if (s.id === "more") {
      var sub = el("div", "toc__sub");
      var subInner = el("div", "toc__sub-inner");
      gridSections.forEach(function (g) {
        subInner.appendChild(makeTocLink(g, "toc__link--sub"));
      });
      sub.appendChild(subInner);
      toc.appendChild(sub);
    }
  });

  // Scroll-spy: pick the single section whose top is the last one
  // above a trigger line near the top of the viewport. Deterministic,
  // so it advances one entry at a time as you scroll.
  var allSpySections = sections.concat(gridSections);
  var spyTargets = allSpySections
    .map(function (s) {
      return { id: s.id, node: document.getElementById(s.id) };
    })
    .filter(function (t) {
      return t.node;
    });

  var gridIds = gridSections.map(function (g) { return g.id; });
  var subGroup = toc.querySelector(".toc__sub");

  function setActive(id) {
    spyTargets.forEach(function (t) {
      tocLinks[t.id].classList.toggle("is-active", t.id === id);
    });
    // Expand the grid sub-list while we're in "More projects" or any grid card.
    var inMore = id === "more" || gridIds.indexOf(id) !== -1;
    if (subGroup) subGroup.classList.toggle("is-open", inMore);
    // Keep "More projects" highlighted as the parent while inside the grid.
    if (gridIds.indexOf(id) !== -1 && tocLinks["more"]) {
      tocLinks["more"].classList.add("is-active");
    }
  }

  function updateActive() {
    var line = window.innerHeight * 0.3; // trigger line at 30% down
    var activeId = spyTargets[0].id;
    for (var i = 0; i < spyTargets.length; i++) {
      var top = spyTargets[i].node.getBoundingClientRect().top;
      if (top - line <= 0) {
        activeId = spyTargets[i].id; // last section past the line
      } else {
        break;
      }
    }
    setActive(activeId);
  }

  var ticking = false;
  window.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          updateActive();
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true }
  );
  window.addEventListener("resize", updateActive);
  updateActive();

  // ===== Mobile: sticky title "stuck" detection + hamburger TOC =====
  var sectionHead = document.getElementById("sectionHead");
  var sentinel = document.querySelector(".stick-sentinel");
  var toggle = document.getElementById("tocToggle");
  var tocAside = document.querySelector(".toc");

  // Add "is-stuck" to the head when the sentinel scrolls above the top.
  if (sectionHead && sentinel && "IntersectionObserver" in window) {
    var stickObserver = new IntersectionObserver(
      function (entries) {
        var e = entries[0];
        // Stuck only when the sentinel has scrolled ABOVE the top
        // (not when it's still below the viewport before you reach it).
        var stuck = !e.isIntersecting && e.boundingClientRect.top < 0;
        sectionHead.classList.toggle("is-stuck", stuck);
      },
      { threshold: 0, rootMargin: "0px 0px 0px 0px" }
    );
    stickObserver.observe(sentinel);
  }

  // Hamburger opens the TOC as a dropdown panel (with a backdrop).
  if (toggle && tocAside) {
    var backdrop = document.createElement("div");
    backdrop.className = "toc-backdrop";
    document.body.appendChild(backdrop);

    function setMenu(open) {
      tocAside.classList.toggle("is-open", open);
      backdrop.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close project menu" : "Open project menu");
    }

    toggle.addEventListener("click", function () {
      setMenu(!tocAside.classList.contains("is-open"));
    });
    backdrop.addEventListener("click", function () {
      setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setMenu(false);
    });
    // Close after picking a destination.
    tocAside.addEventListener("click", function (e) {
      if (e.target.closest(".toc__link")) setMenu(false);
    });
  }
})();
