/* ============================================================
   MagicByte — wizard.js
   Shared behaviour for every page. Safe to include everywhere:
   each block checks for its own elements before running.

   Contents
     0  Config          — your Formspree IDs go here
     1  Spark burst + cast rings (shared, exposed on window)
     2  Cursor wisp (desktop only)
     3  Dust motes
     4  Hero sigil parallax
     5  FAQ sparks
     6  Shop filters
     7  Written form (AJAX submit)
     8  The Voice Orb
   ============================================================ */

(function () {
  "use strict";

  /* ---------- 0  Config ------------------------------------
     Replace the two IDs below with your own Formspree form IDs.
     Parts orders are configured separately, inside cart.js.
     --------------------------------------------------------- */
  var FORMS = {
    // Voice orb recordings + written messages
    consult: "https://formspree.io/f/REPLACE_WITH_YOUR_CONSULT_FORM_ID"
  };

  var PHONE = "316-559-4816";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1  Spark burst on click ----------
     Motion that answers an action, not ambient decoration. */
  function burst(x, y, tint, count) {
    if (reduced) return;
    var n = count || 10;
    for (var i = 0; i < n; i++) {
      var s = document.createElement("span");
      s.className = "spark" + (tint === "teal" ? " teal" : "");
      var angle = (Math.PI * 2 * i) / n + Math.random() * 0.5;
      var dist = 26 + Math.random() * 34;
      s.style.left = x + "px";
      s.style.top = y + "px";
      s.style.setProperty("--dx", Math.cos(angle) * dist + "px");
      s.style.setProperty("--dy", Math.sin(angle) * dist + "px");
      s.style.animationDelay = Math.random() * 60 + "ms";
      document.body.appendChild(s);
      window.setTimeout(function (node) {
        return function () { node.remove(); };
      }(s), 800);
    }
  }

  /* An expanding rune ring, for the moment a spell lands. */
  function castRing(host, tint) {
    if (reduced || !host) return;
    var r = document.createElement("span");
    r.className = "cast-ring" + (tint === "gold" ? " gold" : "");
    host.appendChild(r);
    window.setTimeout(function () { r.remove(); }, 1200);
  }

  // cart.js uses these too, so the whole site sparks the same way
  window.MagicByteFX = { burst: burst, castRing: castRing };

  document.addEventListener("click", function (e) {
    var target = e.target.closest(".btn-primary, .btn-add, .orb-btn, .cue-arrow");
    if (!target) return;
    var r = target.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height / 2,
          target.classList.contains("orb-btn") ? "teal" : "gold",
          target.classList.contains("orb-btn") ? 16 : 10);
  });

  /* ---------- 2  Cursor wisp ----------
     Desktop pointers only. Throttled, and capped by its own
     short animation, so it never accumulates nodes. */
  (function wisp() {
    if (reduced) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    var last = 0;
    document.addEventListener("mousemove", function (e) {
      var now = Date.now();
      if (now - last < 55) return;
      last = now;

      var w = document.createElement("span");
      w.className = "wisp";
      w.style.left = e.clientX + "px";
      w.style.top = e.clientY + "px";
      document.body.appendChild(w);
      window.setTimeout(function () { w.remove(); }, 800);
    }, { passive: true });
  })();

  /* ---------- 3  Dust motes ----------
     A slow drift of gold and teal specks behind every page. */
  (function motes() {
    if (reduced) return;
    var layer = document.createElement("div");
    layer.className = "motes";
    layer.setAttribute("aria-hidden", "true");
    for (var i = 0; i < 14; i++) {
      var m = document.createElement("i");
      m.style.left = (Math.random() * 100).toFixed(2) + "%";
      m.style.setProperty("--drift", (Math.random() * 120 - 60).toFixed(0) + "px");
      m.style.animationDuration = (16 + Math.random() * 20).toFixed(1) + "s";
      m.style.animationDelay = (-Math.random() * 30).toFixed(1) + "s";
      layer.appendChild(m);
    }
    document.body.appendChild(layer);
  })();

  /* ---------- 4  Hero sigil parallax ----------
     The sigil drifts a little against the pointer. Desktop only —
     there is no pointer to track on a phone. */
  (function parallax() {
    if (reduced) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(max-width: 780px)").matches) return;

    var sigil = document.querySelector(".hero-sigil");
    var mascot = document.querySelector(".sigil-mascot");
    if (!sigil) return;

    var pending = false, mx = 0, my = 0;
    window.addEventListener("mousemove", function (e) {
      mx = (e.clientX / window.innerWidth) - 0.5;
      my = (e.clientY / window.innerHeight) - 0.5;
      if (pending) return;
      pending = true;
      requestAnimationFrame(function () {
        sigil.style.setProperty("--par-x", (mx * 26).toFixed(1) + "px");
        sigil.style.setProperty("--par-y", (my * 18).toFixed(1) + "px");
        if (mascot) {
          // the mascot leads the rings slightly, for a sense of depth
          mascot.style.transform =
            "translate(-50%, -50%) translate(" + (mx * 14).toFixed(1) + "px," + (my * 10).toFixed(1) + "px)";
        }
        pending = false;
      });
    }, { passive: true });
  })();

  /* ---------- 5  FAQ sparks ----------
     A small flare off the rune as an answer unfurls. */
  (function faqSparks() {
    var items = document.querySelectorAll("details.faq-item");
    if (!items.length) return;
    items.forEach(function (d) {
      d.addEventListener("toggle", function () {
        if (!d.open) return;
        var s = d.querySelector("summary");
        if (!s) return;
        var r = s.getBoundingClientRect();
        burst(r.left + 6, r.top + r.height / 2, "teal", 6);
      });
    });
  })();

  /* ---------- 6  Shop filters ---------- */
  (function filters() {
    var buttons = document.querySelectorAll(".shop-filter");
    if (!buttons.length) return;

    var cards = document.querySelectorAll(".part-card");
    var count = document.getElementById("filter-count");

    function apply(filter) {
      var shown = 0;
      cards.forEach(function (card) {
        // Cards marked data-always stay visible under every filter
        var always = card.hasAttribute("data-always");
        var match = filter === "all" || card.getAttribute("data-category") === filter;
        var show = always || match;
        card.hidden = !show;
        if (show && !always) shown++;
      });
      if (count) {
        count.textContent = shown === 1 ? "1 part" : shown + " parts";
      }
    }

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        buttons.forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
        btn.setAttribute("aria-pressed", "true");
        apply(btn.getAttribute("data-filter"));
      });
    });

    apply("all");
  })();

  /* ---------- 7  Written form ---------- */
  (function writtenForm() {
    var form = document.getElementById("write-form");
    if (!form) return;

    var status = document.getElementById("write-status");
    var submit = form.querySelector("[type=submit]");

    form.setAttribute("action", FORMS.consult);

    form.addEventListener("submit", function (e) {
      if (!window.fetch) return; // let the browser post it the old way
      e.preventDefault();

      submit.disabled = true;
      submit.textContent = "Sending…";
      status.className = "field-hint";
      status.textContent = "Sending your message…";

      fetch(FORMS.consult, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      })
        .then(function (res) {
          if (!res.ok) throw new Error("rejected");
          form.reset();
          status.className = "field-hint ok";
          status.textContent = "Sent. You'll hear back by text or email, usually same day.";
          submit.textContent = "Sent";
        })
        .catch(function () {
          status.className = "field-hint err";
          status.textContent = "That didn't go through. Text " + PHONE + " instead and I'll pick it up there.";
          submit.disabled = false;
          submit.textContent = "Send message";
        });
    });
  })();

  /* ---------- 8  The Voice Orb ---------- */
  (function orb() {
    var btn = document.getElementById("orb-btn");
    if (!btn) return;

    var MAX_SECONDS = 90;

    var label = document.getElementById("orb-label");
    var status = document.getElementById("orb-status");
    var playbackWrap = document.getElementById("orb-playback");
    var player = document.getElementById("orb-player");
    var buttonsWrap = document.getElementById("orb-buttons");
    var reRecord = document.getElementById("orb-rerecord");
    var cue = document.getElementById("orb-cue");
    var form = document.getElementById("orb-form");
    var sendBtn = document.getElementById("orb-send");

    var recorder = null;
    var chunks = [];
    var blob = null;
    var ticker = null;
    var seconds = 0;
    var state = "idle";

    // Web Audio, used only to make the orb pulse with the voice
    var audioCtx = null;
    var analyser = null;
    var levelFrame = null;

    function say(text, isError) {
      status.textContent = text;
      status.className = "orb-status" + (isError ? " err" : "");
    }

    function setLevel(v) {
      document.documentElement.style.setProperty("--orb-level", v.toFixed(3));
    }

    function canRecord() {
      return !!(navigator.mediaDevices &&
                navigator.mediaDevices.getUserMedia &&
                window.MediaRecorder);
    }

    function clock(s) {
      var m = Math.floor(s / 60);
      var r = s % 60;
      return m + ":" + (r < 10 ? "0" + r : r);
    }

    /* Drive --orb-level from the live mic signal so the orb
       visibly reacts while someone is talking. */
    function watchLevel(stream) {
      if (reduced) return;
      var Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      try {
        audioCtx = new Ctx();
        var src = audioCtx.createMediaStreamSource(stream);
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.75;
        src.connect(analyser);

        var data = new Uint8Array(analyser.frequencyBinCount);
        (function loop() {
          if (!analyser) return;
          analyser.getByteFrequencyData(data);
          var sum = 0;
          for (var i = 0; i < data.length; i++) sum += data[i];
          setLevel(Math.min(1, (sum / data.length) / 90));
          levelFrame = requestAnimationFrame(loop);
        })();
      } catch (err) {
        /* pulsing is a nicety; recording continues without it */
      }
    }

    function stopLevel() {
      if (levelFrame) cancelAnimationFrame(levelFrame);
      levelFrame = null;
      analyser = null;
      if (audioCtx && audioCtx.state !== "closed") audioCtx.close();
      audioCtx = null;
      setLevel(0);
    }

    function start() {
      if (!canRecord()) {
        say("This browser can't record audio. Use the written message below instead.", true);
        return;
      }

      navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
        chunks = [];
        recorder = new MediaRecorder(stream);

        recorder.ondataavailable = function (e) {
          if (e.data.size > 0) chunks.push(e.data);
        };
        recorder.onstop = function () {
          blob = new Blob(chunks, { type: "audio/webm" });
          player.src = URL.createObjectURL(blob);
          stream.getTracks().forEach(function (t) { t.stop(); });
          stopLevel();
          recorded();
        };

        recorder.start();
        watchLevel(stream);

        state = "recording";
        seconds = 0;
        btn.classList.add("recording");
        label.innerHTML = "Listening…<br>touch to stop";
        say("0:00");

        ticker = setInterval(function () {
          seconds += 1;
          say(clock(seconds) + " / " + clock(MAX_SECONDS));
          if (seconds >= MAX_SECONDS) stop();
        }, 1000);
      }).catch(function () {
        say("Microphone access was blocked. Use the written message below instead.", true);
      });
    }

    function stop() {
      if (recorder && recorder.state !== "inactive") recorder.stop();
      clearInterval(ticker);
      btn.classList.remove("recording");
      setLevel(0);
    }

    function recorded() {
      state = "recorded";
      label.innerHTML = "Message ready";
      say("Give it a listen, then add your details below and send.");
      playbackWrap.hidden = false;
      buttonsWrap.hidden = false;
      form.hidden = false;
      cue.hidden = false;

      // The form appears below the fold, so bring it into view rather than
      // leaving people to wonder whether anything happened.
      window.setTimeout(function () {
        if (form.getBoundingClientRect().bottom > window.innerHeight) {
          form.scrollIntoView({
            behavior: reduced ? "auto" : "smooth",
            block: "center"
          });
        }
      }, 420);
    }

    btn.addEventListener("click", function () {
      if (state === "idle") start();
      else if (state === "recording") stop();
    });

    cue.addEventListener("click", function () {
      form.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
      document.getElementById("orb-contact").focus({ preventScroll: true });
    });

    reRecord.addEventListener("click", function () {
      blob = null;
      playbackWrap.hidden = true;
      buttonsWrap.hidden = true;
      form.hidden = true;
      cue.hidden = true;
      btn.classList.remove("sent");
      label.innerHTML = "Touch the orb<br>to leave me a message";
      say("");
      state = "idle";
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!blob) return;

      sendBtn.disabled = true;
      sendBtn.textContent = "Sending…";
      say("Sending your message…");

      var data = new FormData();
      data.append("voice_message", blob, "wizard-consult.webm");
      data.append("contact", document.getElementById("orb-contact").value);
      data.append("device", document.getElementById("orb-device").value);
      data.append("_subject", "New voice message — MagicByte");

      fetch(FORMS.consult, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" }
      })
        .then(function (res) {
          if (!res.ok) throw new Error("rejected");
          state = "sent";
          btn.classList.add("sent");
          cue.hidden = true;
          castRing(document.querySelector(".orb-wrap"));
          label.innerHTML = "Message sent";
          say("Sent. You'll hear back by text or email, usually same day.");
          sendBtn.textContent = "Sent";
        })
        .catch(function () {
          say("That didn't go through. Text " + PHONE + " instead and I'll pick it up there.", true);
          sendBtn.disabled = false;
          sendBtn.textContent = "Send voice message";
        });
    });
  })();

  /* ---------- 9  Repair estimator ----------
     Every figure here comes from the labor table on the services page.
     Labor can be quoted blind; parts cannot, so the estimator says so
     rather than inventing a total it can't stand behind. */
  (function estimator() {
    var root = document.getElementById("estimator");
    if (!root) return;

    var REPAIRS = {
      screen:    { label: "Cracked screen or dead display", labor: "$35\u201345", time: "about 1\u00bd hours" },
      battery:   { label: "Battery dying fast or swollen",  labor: "$35\u201340", time: "about 1\u00bd hours" },
      port:      { label: "Won\u2019t charge / loose port",   labor: "$40\u201360", time: "about 1\u00bd hours" },
      camera:    { label: "Camera or camera glass",         labor: "$40\u201350", time: "about 1\u00bd hours" },
      backglass: { label: "Cracked back glass",             labor: "$40\u201350", time: "about 1\u00bd hours" },
      polish:    { label: "Scratched glass \u2014 polishing", labor: "Quoted once I see it", time: "about 2 hours" },
      water:     { label: "Liquid damage",                  labor: "$15\u201320 to diagnose first", time: "about 30 min to assess" },
      unsure:    { label: "Something else / not sure",      labor: "$15\u201320 to diagnose", time: "about 30 min" }
    };

    var DEVICES = {
      iphone:  "iPhone",
      samsung: "Samsung Galaxy",
      pixel:   "Google Pixel",
      other:   "Another phone or tablet"
    };

    /* Caveats, straight from what the services page and FAQ already say.
       Better the customer reads these now than is surprised on the day. */
    function caveats(device, repair) {
      var out = [];
      if (repair === "backglass" && device === "iphone") {
        out.push("On iPhone X through 14, back glass needs laser separation I don\u2019t have yet, so that one takes at least two days rather than same-day. iPhone 15 and up is same-day.");
      }
      if (repair === "water") {
        out.push("I only take liquid damage on if the device still shows some sign of life. Fully dead means board-level work, and I\u2019ll point you to someone with a microsoldering bench instead of taking your money.");
      }
      if (repair === "screen" && device === "iphone") {
        out.push("An aftermarket screen makes iOS log a non-genuine part in Settings, and True Tone usually stops working. Nothing else about the phone changes. Full detail on the Trust page.");
      }
      if (repair === "battery" && device === "iphone") {
        out.push("With an aftermarket battery, iOS often stops showing the battery health percentage. The battery itself works normally.");
      }
      if (repair === "polish") {
        out.push("Polishing clears scratches and haze in the glass. It can\u2019t close a crack that has gone all the way through.");
      }
      return out;
    }

    var device = null, repair = null;
    var deviceWrap = document.getElementById("est-devices");
    var repairWrap = document.getElementById("est-repairs");
    var result     = document.getElementById("est-result");
    var stepTwo    = document.getElementById("est-step-2");
    var stepThree  = document.getElementById("est-step-3");

    function chip(value, label, group) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "est-chip";
      b.setAttribute("aria-pressed", "false");
      b.textContent = label;
      b.addEventListener("click", function () {
        group.querySelectorAll(".est-chip").forEach(function (c) { c.setAttribute("aria-pressed", "false"); });
        b.setAttribute("aria-pressed", "true");
        if (group === deviceWrap) { device = value; stepTwo.hidden = false; }
        else { repair = value; }
        render();
      });
      return b;
    }

    Object.keys(DEVICES).forEach(function (k) { deviceWrap.appendChild(chip(k, DEVICES[k], deviceWrap)); });
    Object.keys(REPAIRS).forEach(function (k) { repairWrap.appendChild(chip(k, REPAIRS[k].label, repairWrap)); });

    function render() {
      if (!device || !repair) return;
      var r = REPAIRS[repair];
      var notes = caveats(device, repair);

      result.innerHTML =
        '<p class="est-line"><span>MagicByte labor</span><strong>' + r.labor + '</strong></p>' +
        '<p class="est-line"><span>Parts</span><strong>At cost, quoted once I confirm the model</strong></p>' +
        '<p class="est-line"><span>Typical time on site</span><strong>' + r.time + '</strong></p>' +
        '<p class="est-line"><span>Warranty</span><strong>30 days, parts and labor</strong></p>' +
        (notes.length
          ? '<div class="est-notes">' + notes.map(function (n) { return "<p>" + n + "</p>"; }).join("") + "</div>"
          : "") +
        '<p class="est-fineprint">Labor is a range because it moves with the model. Parts move with the market, so I confirm the exact figure before you commit to anything. While the First 100 Heroes promo lasts, labor is $20 flat.</p>' +
        '<div class="est-actions">' +
          '<a class="btn btn-primary" href="book.html">Send this to the wizard</a>' +
          '<a class="btn btn-ghost" href="sms:+13165594816">Text instead</a>' +
        '</div>';

      stepThree.hidden = false;
      if (result.getBoundingClientRect().bottom > window.innerHeight) {
        result.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "nearest" });
      }
    }
  })();
})();
