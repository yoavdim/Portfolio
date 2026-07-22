/* Renders the portfolio from the data in projects.js */

(function () {
  "use strict";

  // Wire up profile links (GitHub / LinkedIn / CV).
  document.querySelectorAll("[data-link]").forEach(function (el) {
    var key = el.getAttribute("data-link");
    if (PROFILE[key]) {
      el.setAttribute("href", PROFILE[key]);
      if (key !== "cv" && key !== "email") {
        el.setAttribute("target", "_blank");
        el.setAttribute("rel", "noopener");
      }
    }
  });

  // Hero down-arrow: scroll to the projects section via JS. A native
  // "#projects" hash jump gets canceled by the page's scroll-snap
  // (proximity) and yanked back to the hero, so drive it explicitly —
  // same approach the TOC links use.
  var scrollCue = document.querySelector(".scroll-cue");
  if (scrollCue) {
    scrollCue.addEventListener("click", function (e) {
      var target = document.getElementById("projects");
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

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
    '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true">' +
    '<path d="M12 .5C5.73.5.5 5.73.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.79 2.73 1.27 3.4.97.1-.76.41-1.27.74-1.56-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.08 0 4.41-2.69 5.38-5.25 5.67.42.36.8 1.08.8 2.18v3.23c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z"/></svg>';

  function ghIconLink(url, label) {
    // When a label is given, show the icon + a small text label
    // (used to distinguish multiple repos on one card, e.g. cuda1/2/3).
    var a = el("a", "gh-link gh-link--icon" + (label ? " gh-link--labeled" : ""), GH_ICON + (label ? "<span>" + label + "</span>" : ""));
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener";
    a.setAttribute("aria-label", label ? "View " + label + " on GitHub" : "View on GitHub");
    a.title = label ? label + " on GitHub" : "View on GitHub";
    return a;
  }

  // GitHub logo with a diagonal strike through it — signals "no public
  // repo (yet)" in a quieter way than a badge. The white underlay line
  // gives the strike a clean cut against the logo.
  var GH_ICON_CROSSED =
    '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">' +
    '<path fill="currentColor" d="M12 .5C5.73.5.5 5.73.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.79 2.73 1.27 3.4.97.1-.76.41-1.27.74-1.56-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.08 0 4.41-2.69 5.38-5.25 5.67.42.36.8 1.08.8 2.18v3.23c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z"/>' +
    '<line x1="3" y1="21" x2="21" y2="3" stroke="#fff" stroke-width="4" stroke-linecap="round"/>' +
    '<line x1="3" y1="21" x2="21" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
    "</svg>";

  // Crossed-out GH icon that reveals a project-specific note on hover,
  // focus, or tap. Used when a project has no public repo yet.
  function ghPendingIcon(message) {
    var wrap = el("span", "gh-pending");
    var btn = el("button", "gh-pending__btn", GH_ICON_CROSSED);
    btn.type = "button";
    btn.setAttribute("aria-label", message);
    var tip = el("span", "gh-pending__tip", message);
    tip.setAttribute("role", "tooltip");
    wrap.appendChild(btn);
    wrap.appendChild(tip);
    return wrap;
  }

  // Research-paper icon in the same solid "paper-cut" style as the GH
  // icon: a filled document with text lines and a magnifying glass
  // knocked out as negative space (fill-rule evenodd).
  var PAPER_ICON =
    '<svg viewBox="0 0 24 24" width="25" height="25" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" aria-hidden="true">' +
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
    // Simple rounded image (no browser chrome) for non-app images.
    if (p.noFrame && p.image) {
      var frame = el("div", "mockup mockup--bare");
      var img = document.createElement("img");
      img.src = p.image;
      img.alt = p.title;
      img.loading = "lazy";
      frame.appendChild(img);
      return frame;
    }

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
    } else if (p.illustration && ILLUSTRATIONS[p.illustration]) {
      var ill = el("div", "mockup__illustration", ILLUSTRATIONS[p.illustration]);
      screen.appendChild(ill);
    } else {
      screen.appendChild(el("div", "mockup__placeholder", "screenshot"));
    }
    wrap.appendChild(screen);
    return wrap;
  }

  // Draw a donut chart from proportions (0..1) as SVG arc segments.
  function donut(cx, cy, rOuter, rInner, colors, props) {
    var s = "";
    var a0 = -Math.PI / 2; // start at top
    for (var i = 0; i < props.length; i++) {
      var a1 = a0 + props[i] * 2 * Math.PI;
      var large = props[i] > 0.5 ? 1 : 0;
      var x0 = cx + rOuter * Math.cos(a0), y0 = cy + rOuter * Math.sin(a0);
      var x1 = cx + rOuter * Math.cos(a1), y1 = cy + rOuter * Math.sin(a1);
      var xi1 = cx + rInner * Math.cos(a1), yi1 = cy + rInner * Math.sin(a1);
      var xi0 = cx + rInner * Math.cos(a0), yi0 = cy + rInner * Math.sin(a0);
      s += '<path d="M' + x0.toFixed(1) + ' ' + y0.toFixed(1) +
        ' A' + rOuter + ' ' + rOuter + ' 0 ' + large + ' 1 ' + x1.toFixed(1) + ' ' + y1.toFixed(1) +
        ' L' + xi1.toFixed(1) + ' ' + yi1.toFixed(1) +
        ' A' + rInner + ' ' + rInner + ' 0 ' + large + ' 0 ' + xi0.toFixed(1) + ' ' + yi0.toFixed(1) +
        ' Z" fill="' + colors[i % colors.length] + '"/>';
      a0 = a1;
    }
    return s;
  }

  // Named SVG illustrations for project thumbnails (cleaner than a
  // dense screenshot at small sizes). Reference via illustration: "key".
  var ILLUSTRATIONS = {
    // Split-pane job finder: a job list on the left, an open detail on the right.
    "job-finder":
      '<svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Split-pane job tracker">' +
      '<rect width="320" height="200" fill="#1f2229"/>' +
      // left pane: list (dark app UI)
      '<rect x="14" y="16" width="150" height="168" rx="8" fill="#2a2734" stroke="#3b3749"/>' +
      '<rect x="26" y="28" width="70" height="8" rx="4" fill="#a274d6"/>' +
      // list rows (checkbox + lines), one highlighted
      '<g fill="#c9a7f0">' +
      '<rect x="26" y="52" width="10" height="10" rx="2"/>' +
      '<rect x="26" y="82" width="10" height="10" rx="2"/>' +
      '<rect x="26" y="112" width="10" height="10" rx="2"/>' +
      '<rect x="26" y="142" width="10" height="10" rx="2"/>' +
      "</g>" +
      // highlighted (selected) row — dark purple tint
      '<rect x="20" y="104" width="138" height="26" rx="5" fill="#352d4c"/>' +
      '<g fill="#635e75">' +
      '<rect x="44" y="52" width="104" height="6" rx="3"/>' +
      '<rect x="44" y="63" width="70" height="5" rx="2.5"/>' +
      '<rect x="44" y="82" width="104" height="6" rx="3"/>' +
      '<rect x="44" y="93" width="60" height="5" rx="2.5"/>' +
      "</g>" +
      '<g fill="#c1a0ec">' +
      '<rect x="44" y="112" width="104" height="6" rx="3"/>' +
      '<rect x="44" y="123" width="76" height="5" rx="2.5"/>' +
      "</g>" +
      '<g fill="#635e75">' +
      '<rect x="44" y="142" width="104" height="6" rx="3"/>' +
      '<rect x="44" y="153" width="66" height="5" rx="2.5"/>' +
      "</g>" +
      // right pane: open detail tab (stays LIGHT — the embedded page)
      '<rect x="176" y="16" width="130" height="168" rx="8" fill="#ffffff" stroke="#e3dcef"/>' +
      '<rect x="176" y="16" width="130" height="30" rx="8" fill="#7a4fb0"/>' +
      '<rect x="176" y="38" width="130" height="8" fill="#7a4fb0"/>' +
      '<circle cx="192" cy="31" r="5" fill="#ffffff" opacity="0.9"/>' +
      '<rect x="204" y="27" width="60" height="8" rx="4" fill="#ffffff" opacity="0.9"/>' +
      // detail content
      '<rect x="188" y="58" width="80" height="9" rx="4" fill="#3a3346"/>' +
      '<rect x="188" y="74" width="106" height="6" rx="3" fill="#c8c0d6"/>' +
      '<rect x="188" y="86" width="96" height="6" rx="3" fill="#d7d1e2"/>' +
      '<rect x="188" y="104" width="60" height="18" rx="9" fill="#c9a7f0"/>' +
      '<rect x="188" y="134" width="106" height="5" rx="2.5" fill="#e0dae9"/>' +
      '<rect x="188" y="145" width="106" height="5" rx="2.5" fill="#e0dae9"/>' +
      '<rect x="188" y="156" width="80" height="5" rx="2.5" fill="#e0dae9"/>' +
      "</svg>",

    // Physics lab: a small regression plot (top-left quarter) plus the
    // two key formulas — chi-squared and error propagation.
    "physics-fit":
      (function () {
        var svg =
          '<svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Regression plot with chi-squared and error propagation formulas">' +
          '<rect width="320" height="200" fill="#ffffff"/>';

        // ---- Small plot in the top-left quarter (~150 x 96) ----
        // data points around a rising line, with vertical error bars
        var pts = [
          [42, 78, 8],
          [64, 66, 7],
          [86, 58, 9],
          [108, 44, 7],
          [130, 32, 8],
        ];
        svg += '<line x1="30" y1="16" x2="30" y2="96" stroke="#333" stroke-width="1.3"/>';
        svg += '<line x1="30" y1="96" x2="150" y2="96" stroke="#333" stroke-width="1.3"/>';
        // best-fit line
        svg += '<line x1="34" y1="84" x2="146" y2="26" stroke="#c0392b" stroke-width="2"/>';
        // error bars + caps
        svg += '<g stroke="#2f6fb0" stroke-width="1.4">';
        pts.forEach(function (p) {
          var x = p[0], y = p[1], e = p[2];
          svg += '<line x1="' + x + '" y1="' + (y - e) + '" x2="' + x + '" y2="' + (y + e) + '"/>';
          svg += '<line x1="' + (x - 3) + '" y1="' + (y - e) + '" x2="' + (x + 3) + '" y2="' + (y - e) + '"/>';
          svg += '<line x1="' + (x - 3) + '" y1="' + (y + e) + '" x2="' + (x + 3) + '" y2="' + (y + e) + '"/>';
        });
        svg += "</g>";
        svg += '<g fill="#1f4e79">';
        pts.forEach(function (p) { svg += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="3"/>'; });
        svg += "</g>";

        var SERIF = "Georgia, 'Times New Roman', serif";

        // ---- chi-squared formula (top-right) ----
        // χ² = Σ (yᵢ − f(xᵢ))² / σᵢ²   shown with a fraction
        svg += '<text x="176" y="46" font-family="' + SERIF + '" font-size="20" fill="#2a2333">' +
          '<tspan font-style="italic">&#967;</tspan>' +
          '<tspan font-size="12" dy="-8">2</tspan>' +
          '<tspan font-size="20" dy="8"> = &#931;</tspan>' +
          "</text>";
        // fraction: numerator (yi - f(xi))^2 over sigma_i^2
        svg += '<text x="226" y="38" font-family="' + SERIF + '" font-size="13" fill="#2a2333">' +
          '(y' +
          '<tspan font-size="9" dy="3">i</tspan>' +
          '<tspan font-size="13" dy="-3"> &#8722; f</tspan>)' +
          '<tspan font-size="9" dy="-6">2</tspan>' +
          "</text>";
        svg += '<line x1="226" y1="44" x2="300" y2="44" stroke="#2a2333" stroke-width="1.2"/>';
        svg += '<text x="252" y="58" font-family="' + SERIF + '" font-size="13" fill="#2a2333">' +
          '<tspan font-style="italic">&#963;</tspan>' +
          '<tspan font-size="9" dy="3">i</tspan>' +
          '<tspan font-size="9" dy="-9">2</tspan>' +
          "</text>";

        // ---- error propagation formula (bottom half, prominent) ----
        // δf = √( Σᵢ (∂f/∂xᵢ)² · δxᵢ² )
        // Built from separately-positioned pieces (no cumulative dy drift).
        svg += '<rect x="24" y="118" width="272" height="64" rx="6" fill="#f4f0fa" stroke="#c9a7f0" stroke-width="1"/>';
        var baseY = 156, PU = "#5b3a91";
        function t(x, y, size, str, italic) {
          return '<text x="' + x + '" y="' + y + '" font-family="' + SERIF + '" font-size="' + size + '" fill="' + PU + '"' +
            (italic ? ' font-style="italic"' : "") + ">" + str + "</text>";
        }
        // δf =
        svg += t(38, baseY, 22, "&#948;f", true);
        svg += t(66, baseY, 20, "=");
        // radical: short kick then long vinculum over the expression
        svg += '<path d="M84 ' + baseY + ' l5 9 l7 -26 h188" fill="none" stroke="' + PU + '" stroke-width="1.6"/>';
        // Σ with subscript i
        svg += t(100, baseY, 22, "&#931;");
        svg += t(116, baseY + 6, 10, "i", true);
        // ( ∂f / ∂x_i )^2
        svg += t(126, baseY, 16, "(");
        svg += t(133, baseY, 15, "&#8706;f", true);
        svg += t(150, baseY, 15, "/");
        svg += t(157, baseY, 15, "&#8706;x", true);
        svg += t(175, baseY + 5, 10, "i", true);
        svg += t(182, baseY, 16, ")");
        svg += t(190, baseY - 9, 11, "2");
        // · δx_i^2
        svg += t(200, baseY, 16, "&#183;");
        svg += t(210, baseY, 15, "&#948;x", true);
        svg += t(228, baseY + 5, 10, "i", true);
        svg += t(235, baseY - 9, 11, "2");
        svg += "</svg>";
        return svg;
      })(),

    // Stock analyzer dashboard: efficient-frontier scatter + frontier
    // curve on the left, allocation donut charts on the right.
    "stock-analyzer":
      (function () {
        var svg =
          '<svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Portfolio analyzer dashboard">' +
          '<rect width="320" height="200" fill="#1f2229"/>';
        // ---- Left: chart panel ----
        svg += '<rect x="10" y="12" width="188" height="176" rx="4" fill="#15171c"/>';
        // axes
        svg += '<line x1="30" y1="24" x2="30" y2="168" stroke="#3a3f47" stroke-width="1.5"/>';
        svg += '<line x1="30" y1="168" x2="188" y2="168" stroke="#3a3f47" stroke-width="1.5"/>';
        // gridlines
        svg += '<g stroke="#282c33" stroke-width="1">';
        for (var gy = 48; gy < 168; gy += 30) svg += '<line x1="30" y1="' + gy + '" x2="188" y2="' + gy + '"/>';
        for (var gx = 60; gx < 188; gx += 32) svg += '<line x1="' + gx + '" y1="24" x2="' + gx + '" y2="168"/>';
        svg += "</g>";
        // capital allocation line (dashed green)
        svg += '<line x1="30" y1="150" x2="180" y2="40" stroke="#4c9a4c" stroke-width="1.5" stroke-dasharray="4,3"/>';
        // efficient frontier curve (blue)
        svg += '<path d="M40 150 Q70 70 120 52 T182 40" fill="none" stroke="#4a90d9" stroke-width="2.5"/>';
        // asset points (scattered)
        svg += '<g>' +
          '<circle cx="176" cy="44" r="3.5" fill="#111"/>' +           // AAPL
          '<circle cx="182" cy="66" r="3.5" fill="#111"/>' +           // MSFT
          '<circle cx="110" cy="70" r="4" fill="#2f8f2f"/>' +          // market
          '<circle cx="130" cy="78" r="4.5" fill="#c94fc9"/>' +        // optimal (magenta)
          '<circle cx="96" cy="96" r="4.5" fill="#2fb7c9"/>' +         // min variance (cyan)
          '<circle cx="128" cy="104" r="3" fill="#111"/>' +
          '<circle cx="120" cy="118" r="3" fill="#111"/>' +
          '<circle cx="34" cy="150" r="4" fill="#2f8f2f"/>' +          // risk-free
          "</g>";
        // legend chip
        svg += '<rect x="36" y="30" width="66" height="26" rx="2" fill="#15171c" stroke="#3a3f47" stroke-width="0.8"/>';
        svg += '<line x1="40" y1="37" x2="52" y2="37" stroke="#4a90d9" stroke-width="2"/>';
        svg += '<line x1="40" y1="45" x2="52" y2="45" stroke="#4c9a4c" stroke-width="1.5" stroke-dasharray="3,2"/>';
        svg += '<g fill="#8a9099"><rect x="56" y="34" width="40" height="3" rx="1.5"/><rect x="56" y="43" width="34" height="3" rx="1.5"/></g>';
        // ---- Right: stats + donuts panel ----
        svg += '<rect x="206" y="12" width="104" height="176" rx="4" fill="#15171c"/>';
        // stat text lines
        svg += '<g fill="#9aa0a6">';
        svg += '<rect x="214" y="22" width="70" height="4" rx="2"/>';
        svg += '<rect x="214" y="30" width="52" height="4" rx="2" fill="#4c9a4c"/>';
        svg += '<rect x="214" y="44" width="70" height="4" rx="2"/>';
        svg += '<rect x="214" y="52" width="52" height="4" rx="2" fill="#4c9a4c"/>';
        svg += "</g>";
        // mini weight table
        svg += '<g fill="#3a3f47">';
        for (var ty = 66; ty <= 90; ty += 8) svg += '<rect x="214" y="' + ty + '" width="88" height="3" rx="1.5"/>';
        svg += "</g>";
        // action buttons (red-outlined)
        svg += '<g fill="none" stroke="#c0392b" stroke-width="1.2">';
        svg += '<rect x="214" y="100" width="88" height="11" rx="2"/>';
        svg += '<rect x="214" y="114" width="88" height="11" rx="2"/>';
        svg += "</g>";
        // two donut charts
        svg += donut(238, 158, 16, 9, ["#c0392b", "#2f8f2f", "#e08a3c", "#4a90d9"], [0.55, 0.2, 0.15, 0.1]);
        svg += donut(284, 158, 16, 9, ["#8e2f8e", "#c94fc9", "#c0392b", "#e0a0d0"], [0.4, 0.3, 0.2, 0.1]);
        svg += "</svg>";
        return svg;
      })(),

    // VABA leader election: 3 stages. Candidates on the left, an elected
    // one committed in the ballot box; each round is signed (σ); a crashed
    // candidate (red X) drops out of the next round's pool. Stacked
    // vertically for a compact, thumbnail-friendly aspect ratio.
    "vaba":
      (function () {
        var BLUE = "#4a90d9", ORANGE = "#e08a3c", GREEN = "#5aa84f", RED = "#d23b3b";

        function sq(cx, cy, col) { return '<rect x="' + (cx - 8) + '" y="' + (cy - 8) + '" width="16" height="16" rx="2" fill="' + col + '"/>'; }
        function circ(cx, cy, col) { return '<circle cx="' + cx + '" cy="' + cy + '" r="9" fill="' + col + '"/>'; }
        function tri(cx, cy, col) { return '<path d="M' + cx + ' ' + (cy - 10) + ' L' + (cx + 9) + ' ' + (cy + 7) + ' L' + (cx - 9) + ' ' + (cy + 7) + ' Z" fill="' + col + '"/>'; }
        function sigma(x, y) { return '<text x="' + x + '" y="' + y + '" font-family="Georgia,serif" font-style="italic" font-size="12" fill="#333">σ</text>'; }

        // One column: 3 candidate options on top feeding into a mux (green
        // box with a grey trapezoid), the elected option output below it.
        function column(cx, shapeFn, electedCol, opts) {
          opts = opts || {};
          var candY = 34;
          var xs = [cx - 26, cx, cx + 26];
          var s = "";
          // candidate options (with optional σ above, optional crashed strike)
          for (var i = 0; i < 3; i++) {
            s += shapeFn(xs[i], candY, [BLUE, ORANGE, GREEN][i]);
            if (opts.candSigma) s += sigma(xs[i] - 4, candY - 13);
          }
          if (opts.crashed != null) {
            var xC = xs[opts.crashed];
            s += '<line x1="' + (xC - 12) + '" y1="' + (candY + 11) + '" x2="' + (xC + 12) + '" y2="' + (candY - 11) + '" stroke="' + RED + '" stroke-width="3" stroke-linecap="round"/>';
          }
          // mux: green box + grey trapezoid (wide top, narrow bottom)
          s += '<rect x="' + (cx - 44) + '" y="68" width="88" height="86" rx="3" fill="#fff" stroke="#5aa84f" stroke-width="2"/>';
          s += '<path d="M' + (cx - 36) + ' 82 h72 l-16 16 h-40 z" fill="#c9ccd1" stroke="#9aa0a6" stroke-width="1.4"/>';
          // elected output below the mux
          s += electedCol.fn(cx, 126, electedCol.col);
          if (opts.electedSigma) s += sigma(cx + 12, 132);
          return s;
        }

        function arrow(x) {
          // right-pointing arrow between columns, around the mux height
          return '<path d="M' + x + ' 104 h16 v-6 l12 9 -12 9 v-6 h-16 z" fill="#3a6fc4"/>';
        }

        var svg =
          '<svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="VABA leader election stages">' +
          '<rect width="320" height="200" fill="#ffffff"/>';
        // Stage 1: squares, orange elected
        svg += column(58, sq, { fn: sq, col: ORANGE }, {});
        // Stage 2: circles (all σ-signed), green elected + σ
        svg += column(160, circ, { fn: circ, col: GREEN }, { candSigma: true, electedSigma: true });
        // Stage 3: triangles, blue crashed (X), blue elected
        svg += column(262, tri, { fn: tri, col: BLUE }, { candSigma: true, crashed: 0 });
        // arrows between columns (σ progression)
        svg += arrow(106) + sigma(118, 128);
        svg += arrow(208) + sigma(220, 128);
        svg += "</svg>";
        return svg;
      })(),

    // Quadruped robot (Unitree Go1-style) — stylized geometric silhouette.
    "robot-dog":
      '<svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Quadruped robot">' +
      '<rect width="320" height="200" fill="#edf2f7"/>' +
      // body (rounded pill shape)
      '<rect x="100" y="62" width="140" height="42" rx="18" fill="#8a8f96" stroke="#6e7379" stroke-width="2"/>' +
      // head (angular box)
      '<path d="M88 74 L88 98 L64 96 L64 80 Z" fill="#a0a5ab" stroke="#6e7379" stroke-width="2"/>' +
      // head sensors (eyes)
      '<circle cx="72" cy="84" r="3.5" fill="#4a4e54"/>' +
      '<circle cx="72" cy="92" r="2.5" fill="#4a4e54"/>' +
      // handle on top
      '<path d="M135 62 Q160 42 185 62" fill="none" stroke="#555" stroke-width="4" stroke-linecap="round"/>' +
      // front-left leg
      '<path d="M120 104 L116 130 L110 156 Q108 168 116 168 L120 168" fill="none" stroke="#a0a5ab" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>' +
      // front-right leg
      '<path d="M136 104 L134 128 L130 154 Q128 166 136 166 L140 166" fill="none" stroke="#c0c4c9" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>' +
      // rear-left leg
      '<path d="M210 104 L214 132 L218 158 Q220 170 212 170 L208 170" fill="none" stroke="#a0a5ab" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>' +
      // rear-right leg
      '<path d="M224 104 L226 130 L228 156 Q230 168 222 168 L218 168" fill="none" stroke="#c0c4c9" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>' +
      // "Unitree" label
      '<text x="178" y="88" font-family="Inter,sans-serif" font-size="10" font-weight="600" fill="#eee">Unitree</text>' +
      // one leg highlighted red (the malfunctioning leg concept)
      '<path d="M210 104 L214 132 L218 158 Q220 170 212 170 L208 170" fill="none" stroke="#e05555" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="5,4" opacity="0.8"/>' +
      "</svg>",
  };

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
    } else if (p.ghPending) {
      head.appendChild(ghPendingIcon(p.ghPending));
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
    if (p.image) {
      var thumb = el("div", "mini-card__thumb");
      var timg = document.createElement("img");
      timg.src = p.image;
      timg.alt = p.title;
      timg.loading = "lazy";
      thumb.appendChild(timg);
      card.appendChild(thumb);
    }
    var head = el("div", "mini-card__head");
    head.appendChild(el("h3", "mini-card__title", p.title));
    if (Array.isArray(p.gh)) {
      p.gh.forEach(function (g) {
        head.appendChild(ghIconLink(g.url || g, g.label));
      });
    } else if (p.gh) {
      head.appendChild(ghIconLink(p.gh));
    } else if (p.ghPending) {
      head.appendChild(ghPendingIcon(p.ghPending));
    } else if (p.badge) {
      head.appendChild(el("span", "badge", p.badge));
    }
    card.appendChild(head);
    if (p.description) card.appendChild(el("p", null, p.description));
    var tags = el("div", "tags");
    (p.tech || []).forEach(function (t) {
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

  var sectionHead = document.getElementById("sectionHead");
  var sentinel = document.querySelector(".stick-sentinel");

  function updateStickyHeader() {
    if (sectionHead && sentinel) {
      var stuck = sentinel.getBoundingClientRect().top < 0;
      sectionHead.classList.toggle("is-stuck", stuck);
    }
  }

  var ticking = false;
  window.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          updateActive();
          updateStickyHeader();
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true }
  );
  window.addEventListener("resize", function () {
    updateActive();
    updateStickyHeader();
  });
  updateActive();
  updateStickyHeader();

  // ===== Mobile: sticky title "stuck" detection + hamburger TOC =====
  var toggle = document.getElementById("tocToggle");
  var tocAside = document.querySelector(".toc");

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
      projects.push({ title: p.title, id: "project-" + slugify(p.title), tags: p.tech || [] });
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

    var tagSection = document.getElementById("tag-index-section");

    if (typeof ForceGraph !== "function") {
      // Library didn't load — show only the static reverse index.
      mount.hidden = true;
      if (tagSection) tagSection.hidden = false;
      return;
    }
    // Graph loaded: show the index too, as a companion panel.
    if (tagSection) tagSection.hidden = false;

    // Compact/Full mode toggle for the tag index
    var modeToggle = document.getElementById("tag-mode-toggle");
    if (modeToggle && fallbackEl) {
      // On mobile (side waves hidden at <= 720px) default to the compact
      // list; on wider screens keep the full list with projects.
      var mobileNoWaves = window.matchMedia("(max-width: 720px)").matches;
      if (mobileNoWaves) {
        fallbackEl.classList.add("is-compact");
        modeToggle.textContent = "Full list";
        modeToggle.setAttribute("aria-label", "Show full list with projects");
      }

      modeToggle.addEventListener("click", function (e) {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        var isCompact = fallbackEl.classList.toggle("is-compact");
        modeToggle.textContent = isCompact ? "Full list" : "Compact";
        modeToggle.setAttribute("aria-label", isCompact ? "Show full list with projects" : "Show compact tag list");
        
        // Stabilize scroll position to prevent jumping
        if (tagSection) {
          tagSection.scrollIntoView({ behavior: "auto", block: "nearest" });
        }
      });

      initLongPressTooltips(fallbackEl);
    }

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
    var hoverId = null;   // node currently under the pointer (target)
    var activeId = null;  // node being highlighted (kept during fade-out)
    var strength = 0;     // 0..1 eased highlight amount (for the fade)
    var lastFrame = 0;
    var FADE_MS = 200;

    function lerp(a, b, t) { return a + (b - a) * t; }

    function connected(aId, bId) {
      return aId === bId || (neighbors[aId] && neighbors[aId][bId]);
    }

    var Graph = ForceGraph()(mount)
      .graphData({ nodes: nodes, links: links });
    Graph
      .backgroundColor("#ffffff")
      // Keep repainting even when idle. Our hover highlight is driven by
      // an external `hoverId`, which force-graph can't detect — with the
      // default auto-pause the canvas freezes once the layout settles and
      // hover stops having any visible effect.
      .autoPauseRedraw(false)
      .nodeRelSize(5)
      .nodeVal(function (n) {
        return n.type === "project" ? 6 : Math.max(3, (n.deg || 1) * 1.6);
      })
      .linkColor(function (l) {
        // All three states share the same RGB, only the alpha differs,
        // so we can ease the alpha by the highlight strength.
        var a = 0.18;
        if (strength > 0 && activeId) {
          var s = typeof l.source === "object" ? l.source.id : l.source;
          var t = typeof l.target === "object" ? l.target.id : l.target;
          var hot = s === activeId || t === activeId;
          a = lerp(0.18, hot ? 1 : 0.06, strength);
        }
        return "rgba(122,79,176," + a + ")";
      })
      .linkWidth(function (l) {
        if (strength <= 0 || !activeId) return 1;
        var s = typeof l.source === "object" ? l.source.id : l.source;
        var t = typeof l.target === "object" ? l.target.id : l.target;
        var hot = s === activeId || t === activeId;
        return hot ? lerp(1, 2.5, strength) : 1;
      })
      .nodeCanvasObject(function (node, ctx, scale) {
        var faded = strength > 0 && activeId && !connected(activeId, node.id);
        var isProject = node.type === "project";
        var r = isProject
          ? 6
          : node.isLeaf
          ? LAYOUT.leafTagSize
          : Math.max(3.5, (node.deg || 1) * 1.4);
        ctx.globalAlpha = faded ? lerp(1, 0.15, strength) : 1;

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
        if (isProject || scale > 1.1 || strength > 0.02) {
          ctx.fillText(label, node.x, node.y + r + fontSize * 0.9);
        }
        ctx.globalAlpha = 1;
      })
      // Ease the highlight strength toward its target every frame so the
      // hover effect fades in/out instead of snapping. Runs each frame
      // because autoPauseRedraw is disabled.
      .onRenderFramePre(function () {
        var now = (typeof performance !== "undefined" ? performance.now() : Date.now());
        var dt = lastFrame ? now - lastFrame : 16;
        lastFrame = now;
        if (hoverId) activeId = hoverId; // remember what to keep lit while fading
        var target = hoverId ? 1 : 0;
        var step = dt / FADE_MS;
        if (strength < target) strength = Math.min(target, strength + step);
        else if (strength > target) strength = Math.max(target, strength - step);
      })
      // Define the hover/click hit area. Without this, a custom
      // nodeCanvasObject leaves the tiny tag dots almost impossible to
      // hover, so highlighting appeared to do nothing. Pad the radius
      // generously so tags are easy to target.
      .nodePointerAreaPaint(function (node, color, ctx) {
        var isProject = node.type === "project";
        var r = isProject
          ? 6
          : node.isLeaf
          ? LAYOUT.leafTagSize
          : Math.max(3.5, (node.deg || 1) * 1.4);
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(node.x, node.y, r + 6, 0, 2 * Math.PI);
        ctx.fill();
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
      row.title = "Projects: " + byTag[tag].join(", ");
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

  function initLongPressTooltips(el) {
    if (!el) return;
    var timer = null, clear = function () { el.querySelectorAll(".show-tooltip").forEach(function (r) { r.classList.remove("show-tooltip"); }); }, cancel = function () { clearTimeout(timer); };
    el.addEventListener("touchstart", function (e) {
      var r = e.target.closest(".tag-index__row");
      if (!r || !el.classList.contains("is-compact")) return;
      clear();
      timer = setTimeout(function () {
        r.classList.add("show-tooltip");
        if (navigator.vibrate) navigator.vibrate(10);
      }, 500);
    }, { passive: true });
    el.addEventListener("touchend", cancel, { passive: true });
    el.addEventListener("touchmove", cancel, { passive: true });
    document.addEventListener("touchstart", function (e) {
      if (!e.target.closest(".tag-index__row")) clear();
    }, { passive: true });
  }
})();
