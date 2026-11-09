/* ==========================================================================
   Awan Brothers Services — site scripts
   No frameworks. Forms are in DEMO mode (no backend) — see submitForm().
   ========================================================================== */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  /* ---------- Icons (Lucide) ---------- */
  function renderIcons() {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons({ attrs: { "stroke-width": 2, "aria-hidden": "true" } });
    }
  }
  renderIcons();

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Active nav link ---------- */
  var page = document.body.getAttribute("data-page");
  if (page) {
    document.querySelectorAll('.main-nav a[data-nav="' + page + '"]').forEach(function (a) {
      a.classList.add("is-active");
      a.setAttribute("aria-current", "page");
    });
  }

  /* ---------- Sticky header + mobile nav ---------- */
  var header = document.querySelector(".site-header");
  var nav = document.querySelector(".main-nav");
  var toggle = document.querySelector(".nav-toggle");

  function onScroll() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 10);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function setNavTop() {
    if (!header || !nav) return;
    var rect = header.getBoundingClientRect();
    nav.style.setProperty("--nav-top", Math.max(rect.bottom, 0) + "px");
  }

  function closeNav() {
    if (!nav || !toggle) return;
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.innerHTML = '<i data-lucide="menu"></i>';
    renderIcons();
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = !nav.classList.contains("is-open");
      if (open) {
        setNavTop();
        nav.classList.add("is-open");
        toggle.setAttribute("aria-expanded", "true");
        toggle.innerHTML = '<i data-lucide="x"></i>';
        renderIcons();
      } else {
        closeNav();
      }
    });
    nav.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", closeNav); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeNav(); });
    window.addEventListener("resize", function () { if (window.innerWidth > 980) closeNav(); else setNavTop(); });
    window.addEventListener("scroll", function () { if (nav.classList.contains("is-open")) setNavTop(); }, { passive: true });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- Helpers ---------- */
  function qs(name) {
    try { return new URLSearchParams(window.location.search).get(name); } catch (e) { return null; }
  }
  function randomRef(prefix) {
    var n = Math.floor(100000 + Math.random() * 900000);
    return prefix + "-" + n;
  }

  /* ---------- Quick quote (home hero) -> quote page ---------- */
  var quick = document.getElementById("quick-quote-form");
  if (quick) {
    quick.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = new FormData(quick);
      var params = new URLSearchParams();
      ["service", "from", "to"].forEach(function (k) {
        var v = (data.get(k) || "").toString().trim();
        if (v) params.set(k, v);
      });
      window.location.href = "quote.html" + (params.toString() ? "?" + params.toString() : "") + "#quote-form";
    });
  }

  /* ---------- Quote page prefill ---------- */
  var quoteForm = document.getElementById("quote-form");
  if (quoteForm) {
    var svc = qs("service");
    if (svc) {
      var radio = quoteForm.querySelector('input[name="service"][value="' + CSS.escape(svc) + '"]');
      if (radio) radio.checked = true;
    }
    ["from", "to"].forEach(function (k) {
      var v = qs(k);
      var input = quoteForm.querySelector('[name="' + k + '"]');
      if (v && input) input.value = v;
    });
  }

  /* ---------- Dummy form handling ----------
     Any <form data-demo-form> is validated in the browser and then shows a
     success panel. To go live, replace the body of submitForm() with a real
     request, e.g. fetch("https://formspree.io/f/XXXX", { method: "POST", body: data })
     or a POST to your own PHP/Node endpoint.
  ------------------------------------------- */
  function submitForm(form, data) {
    // DEMO: pretend to send. Returns a Promise so a real fetch() can drop in.
    return new Promise(function (resolve) { setTimeout(resolve, 900); });
  }

  function validateField(field) {
    var wrap = field.closest(".field");
    var ok = field.checkValidity();
    if (wrap) wrap.classList.toggle("has-error", !ok);
    return ok;
  }

  document.querySelectorAll("form[data-demo-form]").forEach(function (form) {
    var fields = form.querySelectorAll("input, select, textarea");
    fields.forEach(function (f) {
      f.addEventListener("blur", function () { if (f.value) validateField(f); });
      f.addEventListener("input", function () {
        var wrap = f.closest(".field");
        if (wrap && wrap.classList.contains("has-error")) validateField(f);
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var firstBad = null;
      fields.forEach(function (f) {
        if (f.type === "radio" || f.type === "checkbox" || f.type === "hidden") return;
        if (!validateField(f) && !firstBad) firstBad = f;
      });
      // radio groups
      var radioNames = {};
      form.querySelectorAll('input[type="radio"][required]').forEach(function (r) { radioNames[r.name] = true; });
      Object.keys(radioNames).forEach(function (name) {
        var checked = form.querySelector('input[name="' + name + '"]:checked');
        var group = form.querySelector('[data-group="' + name + '"]');
        if (group) group.classList.toggle("has-error", !checked);
        if (!checked && !firstBad) firstBad = form.querySelector('input[name="' + name + '"]');
      });
      form.querySelectorAll('input[type="checkbox"][required]').forEach(function (c) {
        var wrap = c.closest(".field");
        if (wrap) wrap.classList.toggle("has-error", !c.checked);
        if (!c.checked && !firstBad) firstBad = c;
      });

      if (firstBad) {
        var target = firstBad.closest(".field") || firstBad;
        target.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(function () { try { firstBad.focus({ preventScroll: true }); } catch (err) {} }, 300);
        return;
      }

      var btn = form.querySelector('button[type="submit"]');
      var original = btn ? btn.innerHTML : "";
      if (btn) { btn.disabled = true; btn.innerHTML = "Sending…"; }

      submitForm(form, new FormData(form)).then(function () {
        var successId = form.getAttribute("data-success");
        var success = successId ? document.getElementById(successId) : null;
        var refEl = success ? success.querySelector("[data-ref]") : null;
        if (refEl) refEl.textContent = randomRef(form.getAttribute("data-ref-prefix") || "AB");
        if (success) {
          form.hidden = true;
          success.classList.add("is-visible");
          success.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        form.reset();
        if (btn) { btn.disabled = false; btn.innerHTML = original; renderIcons(); }
      });
    });
  });

  document.querySelectorAll("[data-reset-form]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var form = document.getElementById(btn.getAttribute("data-reset-form"));
      var success = btn.closest(".form-success");
      if (success) success.classList.remove("is-visible");
      if (form) { form.hidden = false; form.scrollIntoView({ behavior: "smooth", block: "start" }); }
    });
  });

  /* ---------- Shipment tracking (DEMO) ----------
     Generates a believable sample journey from the tracking number so the
     page can be demonstrated. Replace with a call to the TMS API when ready.
  ------------------------------------------- */
  var trackForm = document.getElementById("track-form");
  if (trackForm) {
    var trackInput = document.getElementById("track-id");
    var result = document.getElementById("track-result");

    var ROUTES = [
      { from: "Port Qasim, Karachi", to: "Lahore", stops: ["Port Qasim", "Hyderabad", "Sukkur", "Multan", "Lahore"], cargo: "1 × 40ft container — textile machinery", vehicle: "Container carrier (40ft)" },
      { from: "Karachi Port", to: "Islamabad", stops: ["Karachi Port", "Hyderabad", "Sukkur", "Multan", "Islamabad"], cargo: "2 × 20ft containers — electronics", vehicle: "Container carrier (2 × 20ft)" },
      { from: "Faisalabad", to: "Port Qasim, Karachi", stops: ["Faisalabad", "Multan", "Sukkur", "Hyderabad", "Port Qasim"], cargo: "Export cartons — home textiles", vehicle: "22-wheeler trailer" },
      { from: "Karachi", to: "Peshawar", stops: ["Karachi", "Sukkur", "Multan", "Islamabad", "Peshawar"], cargo: "FMCG pallets — 18 tons", vehicle: "Flatbed trailer (40ft)" },
      { from: "Karachi", to: "Quetta", stops: ["Karachi", "Hub", "Khuzdar", "Kalat", "Quetta"], cargo: "Construction steel — 25 tons", vehicle: "Flatbed trailer (40ft)" }
    ];

    function hash(str) {
      var h = 0;
      for (var i = 0; i < str.length; i++) { h = (h * 31 + str.charCodeAt(i)) >>> 0; }
      return h;
    }
    function fmt(d) {
      return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }) + ", " +
        d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
    }
    function esc(s) {
      return String(s).replace(/[&<>"']/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
      });
    }

    function showTracking(raw) {
      var id = raw.trim().toUpperCase();
      var field = trackInput.closest(".field");
      if (!/^[A-Z0-9-]{5,20}$/.test(id)) {
        if (field) field.classList.add("has-error");
        result.classList.remove("is-visible");
        trackInput.focus();
        return;
      }
      if (field) field.classList.remove("has-error");

      // Fixed samples so the demo matches the dashboard preview on the site
      var SAMPLES = {
        "AB-482915": { route: 0, stage: 3, delivered: false },
        "AB-482841": { route: 4, stage: 4, delivered: true }
      };
      var h = hash(id);
      var sample = SAMPLES[id];
      var r = ROUTES[sample ? sample.route : h % ROUTES.length];
      var stage = sample ? sample.stage : 1 + (h % 4); // 1..4 stops reached
      var delivered = sample ? sample.delivered : (h % 7) === 0;
      if (delivered) stage = 4;
      var progress = delivered ? 100 : Math.min(92, Math.round((stage / 4) * 100) - 12 + (h % 9));

      var now = new Date();
      var hoursBack = delivered ? 50 : stage * 9 + 6; // keep every completed event in the past
      var start = new Date(now.getTime() - hoursBack * 3600 * 1000);
      var events = [
        { t: "Booking confirmed in TMS", s: "Vehicle and driver assigned" },
        { t: "Loaded & departed " + r.stops[0], s: "Seal verified, digital builty issued" },
        { t: "Passed " + r.stops[1], s: "GPS checkpoint" },
        { t: "Passed " + r.stops[2], s: "GPS checkpoint" },
        { t: "Passed " + r.stops[3], s: "GPS checkpoint" },
        { t: "Delivered at " + r.to, s: "Proof of delivery signed" }
      ];
      var reached = delivered ? events.length : stage + 1; // number of completed events

      var html = "";
      html += '<div class="track-summary">' +
        "<div><small>Tracking no.</small><b>" + esc(id) + "</b></div>" +
        "<div><small>Status</small><b>" + (delivered ? '<span style="color:var(--green)">Delivered</span>' : '<span style="color:var(--blue)">In transit</span>') + "</b></div>" +
        "<div><small>Origin</small><b>" + esc(r.from) + "</b></div>" +
        "<div><small>Destination</small><b>" + esc(r.to) + "</b></div>" +
        "</div>";

      html += '<div class="track-progress"><div class="route-line" style="--progress:' + progress + '%"><div class="fill"></div><div class="truck"><i data-lucide="truck"></i></div></div><div class="route-stops">';
      r.stops.forEach(function (s, i) {
        var done = delivered || i <= stage - 1 || (i === 0);
        html += '<span class="' + (done ? "done" : "") + '">' + esc(s) + "</span>";
      });
      html += "</div></div>";

      html += '<div class="grid grid-2" style="gap:36px;align-items:start"><div><h3 style="font-size:1.35rem">Shipment journey</h3><ol class="timeline">';
      events.forEach(function (ev, i) {
        var cls = i < reached ? "done" : (i === reached ? "current" : "pending");
        var when = i < reached ? fmt(new Date(start.getTime() + i * 9 * 3600 * 1000)) : (i === reached ? "Expected " + fmt(new Date(now.getTime() + 7 * 3600 * 1000)) : "—");
        html += '<li class="' + cls + '"><b>' + esc(ev.t) + "</b><small>" + esc(ev.s) + " · " + when + "</small></li>";
      });
      html += "</ol></div>";

      html += '<div><h3 style="font-size:1.35rem">Shipment details</h3><ul class="contact-lines">' +
        '<li><span class="ico"><i data-lucide="package"></i></span><div><small>Cargo</small>' + esc(r.cargo) + "</div></li>" +
        '<li><span class="ico"><i data-lucide="truck"></i></span><div><small>Vehicle</small>' + esc(r.vehicle) + "</div></li>" +
        '<li><span class="ico"><i data-lucide="calendar"></i></span><div><small>Booked</small>' + fmt(start) + "</div></li>" +
        '<li><span class="ico"><i data-lucide="headphones"></i></span><div><small>Need help with this shipment?</small><a href="tel:+923002087527">+92-300-2087527</a></div></li>' +
        "</ul></div></div>";

      html += '<div class="demo-note"><i data-lucide="info"></i><span><b>Demo mode:</b> this is sample data generated for preview. Live tracking will connect to the Awan Brothers TMS.</span></div>';

      result.innerHTML = html;
      result.classList.add("is-visible");
      renderIcons();
      result.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    trackForm.addEventListener("submit", function (e) {
      e.preventDefault();
      showTracking(trackInput.value);
      try { history.replaceState(null, "", "?id=" + encodeURIComponent(trackInput.value.trim().toUpperCase())); } catch (err) {}
    });

    document.querySelectorAll("[data-sample-id]").forEach(function (b) {
      b.addEventListener("click", function () {
        trackInput.value = b.getAttribute("data-sample-id");
        showTracking(trackInput.value);
      });
    });

    var pre = qs("id");
    if (pre) { trackInput.value = pre; showTracking(pre); }
  }
})();
