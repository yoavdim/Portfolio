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
      var a = el("a", "gh-link", "(GH)");
      a.href = p.gh;
      a.target = "_blank";
      a.rel = "noopener";
      head.appendChild(a);
    } else if (p.badge) {
      head.appendChild(el("span", "badge", p.badge));
    }
    if (p.paper) {
      var paper = el("a", "gh-link", "(Paper)");
      paper.href = p.paper;
      paper.target = "_blank";
      paper.rel = "noopener";
      head.appendChild(paper);
    }
    body.appendChild(head);
    if (p.tech) body.appendChild(el("p", "tech-line", p.tech));
    if (p.blurb) body.appendChild(el("p", "feature-blurb", p.blurb));
    body.appendChild(list(p.features || []));
    return body;
  }

  // Render featured cards, alternating layout each row.
  var featured = document.getElementById("featured");
  FEATURED.forEach(function (p, i) {
    var card = el("div", "feature-card" + (i % 2 === 1 ? " reverse" : ""));
    card.appendChild(mockup(p));
    card.appendChild(featureBody(p));
    card.appendChild(lessonsPanel(p));
    featured.appendChild(card);
  });

  // Render smaller grid cards.
  var grid = document.getElementById("grid");
  GRID.forEach(function (p) {
    var card = el("div", "mini-card");
    var head = el("div", "mini-card__head");
    head.appendChild(el("h3", "mini-card__title", p.title));
    if (p.gh) {
      var a = el("a", "gh-link", "(GH)");
      a.href = p.gh;
      a.target = "_blank";
      a.rel = "noopener";
      head.appendChild(a);
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
})();
