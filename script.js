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
  sections.push({ id: "graph", title: "Explore by tech" });

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
    // Expand the grid sub-list while we're in "More projects", any grid
    // card, or the "Explore by tech" graph section that follows them.
    var inMore = id === "more" || id === "graph" || gridIds.indexOf(id) !== -1;
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

  // ===== Tag ↔ project graph =====
  buildTagGraph();

  function buildTagGraph() {
    var mount = document.getElementById("tag-graph");
    var fallbackEl = document.getElementById("tag-index");
    if (!mount) return;

    /* ---- Layout controls (tweak these to reshape the graph) ---- */
    var LAYOUT = {
      charge: -90,          // node repulsion; more negative = more spread out
      linkDistance: 34,     // base edge length for shared tags
      leafLinkDistance: 14, // shorter edge for single-project tags (pulls them in tight)
      leafTagSize: 2,       // radius of single-project tags (smaller)
      hideLeafTags: false,  // set true to remove single-project tags entirely
      verticalGravity: 0.12,// pull toward the horizontal centerline; higher
                            // = flatter layout that spreads clusters sideways
    };
    /* ------------------------------------------------------------ */

    // Collect every project with its normalized tag list.
    var projects = [];
    FEATURED.forEach(function (p) {
      projects.push({ title: p.title, id: "project-" + slugify(p.title), tags: p.tech || [] });
    });
    GRID.forEach(function (p) {
      projects.push({ title: p.title, id: "project-" + slugify(p.title), tags: p.tags || [] });
    });

    // Build nodes + links (bipartite: project nodes <-> tag nodes).
    var nodesById = {};
    var links = [];
    var tagCount = {};

    projects.forEach(function (p) {
      nodesById[p.id] = { id: p.id, name: p.title, type: "project", cardId: p.id };
      p.tags.forEach(function (raw) {
        var tag = String(raw).trim();
        if (!tag) return;
        var tagId = "tag:" + tag.toLowerCase();
        if (!nodesById[tagId]) {
          nodesById[tagId] = { id: tagId, name: tag, type: "tag" };
        }
        tagCount[tagId] = (tagCount[tagId] || 0) + 1;
        links.push({ source: p.id, target: tagId });
      });
    });

    var nodes = Object.keys(nodesById).map(function (k) {
      var n = nodesById[k];
      if (n.type === "tag") {
        n.deg = tagCount[n.id] || 1;
        n.isLeaf = n.deg === 1; // tag attached to only one project
      }
      return n;
    });

    // Optionally drop single-project tags (and their links) entirely.
    if (LAYOUT.hideLeafTags) {
      var leafIds = {};
      nodes = nodes.filter(function (n) {
        if (n.type === "tag" && n.isLeaf) { leafIds[n.id] = true; return false; }
        return true;
      });
      links = links.filter(function (l) {
        return !leafIds[l.source] && !leafIds[l.target];
      });
    }

    // Holds a reference so the index can drive the graph once built.
    var graphApi = { focusTag: function () {} };

    // Build the reverse-index list. Clicking a tag focuses it in the
    // graph. Always shown alongside the graph (also acts as fallback).
    buildTagIndexFallback(fallbackEl, projects, function (tagId) {
      graphApi.focusTag(tagId);
    });

    if (typeof ForceGraph !== "function") {
      // Library didn't load — show only the static reverse index.
      mount.hidden = true;
      if (fallbackEl) fallbackEl.hidden = false;
      return;
    }
    // Graph loaded: show the index too, as a companion panel.
    if (fallbackEl) fallbackEl.hidden = false;

    // "Hide graph" checkbox: collapse the canvas, keep the tag index.
    var hideToggle = document.getElementById("hideGraph");
    if (hideToggle) {
      var graphWrap = mount.closest(".graph-wrap");
      hideToggle.addEventListener("click", function () {
        var hide = !mount.hidden; // toggle
        mount.hidden = hide;
        if (graphWrap) graphWrap.classList.toggle("graph-hidden", hide);
        hideToggle.textContent = hide ? "Show graph" : "Hide graph";
        hideToggle.setAttribute("aria-pressed", hide ? "true" : "false");
        if (!hide) {
          // re-fit the layout when the canvas comes back
          sizeGraph();
          Graph.zoomToFit(400, 40);
        }
      });
    }

    // Precompute each node's neighbors for hover highlighting.
    var neighbors = {};
    var linkKey = {};
    nodes.forEach(function (n) { neighbors[n.id] = {}; });
    links.forEach(function (l) {
      neighbors[l.source][l.target] = true;
      neighbors[l.target][l.source] = true;
      linkKey[l.source + "|" + l.target] = true;
    });

    var PURPLE = "#7a4fb0";
    var TAG_COL = "#c9a7f0";
    var INK = "#4a4a4a";
    var hoverId = null;

    function connected(aId, bId) {
      return aId === bId || (neighbors[aId] && neighbors[aId][bId]);
    }

    var Graph = ForceGraph()(mount)
      .graphData({ nodes: nodes, links: links });
    Graph
      .backgroundColor("#ffffff")
      .nodeRelSize(5)
      .nodeVal(function (n) {
        return n.type === "project" ? 6 : Math.max(3, (n.deg || 1) * 1.6);
      })
      .linkColor(function (l) {
        if (!hoverId) return "rgba(122,79,176,0.18)";
        var s = typeof l.source === "object" ? l.source.id : l.source;
        var t = typeof l.target === "object" ? l.target.id : l.target;
        return s === hoverId || t === hoverId ? PURPLE : "rgba(122,79,176,0.06)";
      })
      .linkWidth(function (l) {
        if (!hoverId) return 1;
        var s = typeof l.source === "object" ? l.source.id : l.source;
        var t = typeof l.target === "object" ? l.target.id : l.target;
        return s === hoverId || t === hoverId ? 2.5 : 1;
      })
      .nodeCanvasObject(function (node, ctx, scale) {
        var faded = hoverId && !connected(hoverId, node.id);
        var isProject = node.type === "project";
        var r = isProject
          ? 6
          : node.isLeaf
          ? LAYOUT.leafTagSize
          : Math.max(3.5, (node.deg || 1) * 1.4);
        ctx.globalAlpha = faded ? 0.15 : 1;

        // node dot
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, 2 * Math.PI);
        ctx.fillStyle = isProject ? PURPLE : TAG_COL;
        ctx.fill();
        if (isProject) {
          ctx.lineWidth = 1.5 / scale;
          ctx.strokeStyle = "#fff";
          ctx.stroke();
        }

        // label
        var label = node.name;
        var fontSize = (isProject ? 12 : 11) / scale;
        ctx.font = (isProject ? "600 " : "") + fontSize + "px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = isProject ? "#1c1c1c" : INK;
        // only show tag labels when zoomed in enough, to reduce clutter
        if (isProject || scale > 1.1 || hoverId) {
          ctx.fillText(label, node.x, node.y + r + fontSize * 0.9);
        }
        ctx.globalAlpha = 1;
      })
      .onNodeHover(function (node) {
        hoverId = node ? node.id : null;
        mount.style.cursor = node && node.type === "project" ? "pointer" : node ? "default" : "";
      })
      .onNodeClick(function (node) {
        if (node.type === "project" && node.cardId) {
          var card = document.getElementById(node.cardId);
          if (card) card.scrollIntoView({ behavior: "smooth", block: "start" });
        } else if (node.type === "tag") {
          zoomToNode(node);
          highlightIndexRow(node.id);
        }
      });

    // Layout forces (driven by LAYOUT config above). Uses only the
    // forces force-graph provides internally, to avoid mixing d3 builds.
    Graph.d3Force("charge").strength(LAYOUT.charge);
    Graph.d3Force("link").distance(function (l) {
      var t = typeof l.target === "object" ? l.target : nodesById[l.target];
      return t && t.isLeaf ? LAYOUT.leafLinkDistance : LAYOUT.linkDistance;
    });

    // Vertical gravity: gently pull every node toward the horizontal
    // centerline (y=0). This flattens the layout so node repulsion
    // spreads disconnected clusters SIDEWAYS into a wide, short pane.
    // Scaled by the pane's aspect ratio: strong when wide/short, and
    // effectively off when the pane is squarish (e.g. mobile).
    var vForce = function (alpha) {
      var w = mount.clientWidth || 1;
      var h = mount.clientHeight || 1;
      // 0 when square, ramps up as the pane gets wider than tall
      var wideness = Math.max(0, w / h - 1);
      var g = LAYOUT.verticalGravity * Math.min(1, wideness);
      if (g <= 0) return;
      for (var i = 0; i < nodes.length; i++) {
        nodes[i].vy -= nodes[i].y * g * alpha;
      }
    };
    Graph.d3Force("vertGravity", vForce);

    function zoomToNode(node) {
      hoverId = node.id; // reuse highlight state to emphasize its links
      Graph.centerAt(node.x, node.y, 700);
      Graph.zoom(3, 700);
    }

    // Let the index drive the graph: focus a tag by its id.
    graphApi.focusTag = function (tagId) {
      var node = nodes.find(function (n) { return n.id === tagId; });
      if (!node) return;
      // Only scroll the graph into view if it's mostly off-screen,
      // so clicking a list row doesn't yank the page when the graph
      // is already visible.
      var rect = mount.getBoundingClientRect();
      var offscreen = rect.bottom < 80 || rect.top > window.innerHeight - 80;
      if (offscreen) mount.scrollIntoView({ behavior: "smooth", block: "center" });
      zoomToNode(node);
    };

    // Size the canvas to its container and keep it responsive.
    function sizeGraph() {
      Graph.width(mount.clientWidth).height(mount.clientHeight);
    }
    sizeGraph();
    window.addEventListener("resize", sizeGraph);

    // Reset-view button: clear any highlight and fit the whole graph.
    var resetBtn = document.getElementById("graphReset");
    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        hoverId = null;
        highlightIndexRow(null);
        Graph.zoomToFit(500, 40);
      });
    }

    // Fit the view once nodes have real coordinates. Using onEngineStop
    // alone fit too early (before layout settled) leaving it zoomed in;
    // instead fit on a short timer after load, same as the reset button.
    var fitTries = 0;
    function initialFit() {
      fitTries++;
      Graph.zoomToFit(600, 40);
      // keep re-fitting a few times as the layout settles
      if (fitTries < 6) setTimeout(initialFit, 400);
    }
    setTimeout(initialFit, 400);
  }

  function buildTagIndexFallback(el, projects, onTagClick) {
    if (!el) return;
    el.innerHTML = "";
    // tag -> [project titles]
    var byTag = {};
    projects.forEach(function (p) {
      p.tags.forEach(function (raw) {
        var tag = String(raw).trim();
        if (!tag) return;
        (byTag[tag] = byTag[tag] || []).push(p.title);
      });
    });
    var tags = Object.keys(byTag).sort(function (a, b) {
      return byTag[b].length - byTag[a].length || a.localeCompare(b);
    });
    tags.forEach(function (tag) {
      var tagId = "tag:" + tag.toLowerCase();
      var row = el2("button", "tag-index__row");
      row.type = "button";
      row.setAttribute("data-tag-id", tagId);
      row.appendChild(el2("span", "tag-index__tag", tag));
      row.appendChild(el2("span", "tag-index__projects", byTag[tag].join(", ")));
      if (typeof onTagClick === "function") {
        row.addEventListener("click", function () {
          onTagClick(tagId);
          highlightIndexRow(tagId);
        });
      }
      el.appendChild(row);
    });
  }

  // Highlight the matching row in the index (and scroll it into view).
  function highlightIndexRow(tagId) {
    var index = document.getElementById("tag-index");
    if (!index) return;
    index.querySelectorAll(".tag-index__row").forEach(function (r) {
      r.classList.toggle("is-active", r.getAttribute("data-tag-id") === tagId);
    });
    var active = index.querySelector(".tag-index__row.is-active");
    if (active) {
      // Scroll ONLY within the index panel (not the page) so clicking a
      // graph node doesn't yank the whole window.
      var top = active.offsetTop - index.clientHeight / 2 + active.offsetHeight / 2;
      index.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    }
  }

  function el2(tag, cls, txt) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (txt != null) n.textContent = txt;
    return n;
  }
})();
