/* ==========================================================================
   上海精智官网交互脚本
   ========================================================================== */
(function () {
  "use strict";

  /* ---------- 头部滚动状态 ---------- */
  var header = document.getElementById("siteHeader");
  function onScrollHeader() {
    if (window.scrollY > 10) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();

  /* ---------- 移动端菜单 ---------- */
  var navToggle = document.getElementById("navToggle");
  var mainNav = document.getElementById("mainNav");

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      var open = mainNav.classList.toggle("open");
      navToggle.classList.toggle("open", open);
      navToggle.setAttribute("aria-label", open ? "关闭菜单" : "打开菜单");
    });

    /* 二级下拉：移动端点击展开，桌面端 hover 生效 */
    var navItems = mainNav.querySelectorAll(".nav-item");
    navItems.forEach(function (item) {
      var link = item.querySelector(".nav-link");
      if (!link) return;
      link.addEventListener("click", function (e) {
        if (window.innerWidth > 1120) return; /* 桌面端交给 hover */
        e.preventDefault();
        var wasOpen = item.classList.contains("open");
        navItems.forEach(function (o) { o.classList.remove("open"); });
        if (!wasOpen) item.classList.add("open");
      });
    });

    /* 点击普通链接后收起菜单 */
    mainNav.querySelectorAll("a:not(.nav-link)").forEach(function (a) {
      a.addEventListener("click", function () {
        mainNav.classList.remove("open");
        navToggle.classList.remove("open");
      });
    });
  }

  /* ---------- 滚动显现 ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- 数字滚动 ---------- */
  var counters = document.querySelectorAll(".cnt[data-count]");
  if (counters.length) {
    function animateCount(el) {
      var target = parseInt(el.getAttribute("data-count"), 10);
      var duration = 1400;
      var start = null;
      function tick(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased);
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      }
      requestAnimationFrame(tick);
    }
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          cio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ---------- 回到顶部 ---------- */
  var backTop = document.getElementById("backTop");
  if (backTop) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 600) backTop.classList.add("show");
      else backTop.classList.remove("show");
    }, { passive: true });
    backTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- 联系表单 ---------- */
  var form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.querySelector("#fName");
      var phone = form.querySelector("#fPhone");
      var email = form.querySelector("#fEmail");
      var content = form.querySelector("#fContent");
      var msg = document.getElementById("formMsg");
      var ok = true;

      [name, phone, content].forEach(function (f) {
        if (f && !f.value.trim()) {
          f.style.borderColor = "#E60013";
          ok = false;
        } else if (f) {
          f.style.borderColor = "";
        }
      });
      if (email && email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        email.style.borderColor = "#E60013";
        ok = false;
      }
      if (!ok) return;

      /* 前端演示：提交内容组装为邮件草稿，正式上线请接入接口或邮件服务 */
      var subject = "【官网咨询】" + (form.querySelector("#fType") ? form.querySelector("#fType").value : "");
      var body =
        "姓名：" + name.value + "\n" +
        "公司：" + (form.querySelector("#fCompany") ? form.querySelector("#fCompany").value : "") + "\n" +
        "电话：" + phone.value + "\n" +
        "邮箱：" + (email ? email.value : "") + "\n\n" +
        content.value;
      var mailto = "mailto:" + form.getAttribute("data-mail") +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);
      window.location.href = mailto;

      if (msg) {
        msg.textContent = "感谢您的留言，我们已为您打开邮件草稿，确认发送即可。团队将在 1-2 个工作日内与您联系。";
        msg.classList.add("show");
      }
      form.reset();
    });
  }
})();
