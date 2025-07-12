// Portfolio Main JavaScript - Extracted from index.html

// Utility function to check if device is touch
function isTouchDevice() {
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
}

// Particle System Class
class ParticleSystem {
  constructor() {
    this.canvas = document.getElementById("particle-canvas");
    this.ctx = null;
    this.particles = [];
    this.mouse = { x: null, y: null, radius: 150 };
    this.isTouch = isTouchDevice();
    this.isSmallScreen = window.innerWidth < 768;
    
    if (this.canvas) {
      this.init();
    }
  }

  init() {
    this.ctx = this.canvas.getContext("2d");
    this.setupCanvas();
    this.initParticles();
    this.setupEventListeners();
    
    if (!this.isTouch && !this.isSmallScreen) {
      this.animate();
    } else {
      this.drawStaticStars();
    }
  }

  setupCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  setupEventListeners() {
    window.addEventListener("resize", () => {
      this.setupCanvas();
      this.initParticles();
      if (this.isTouch || this.isSmallScreen) {
        this.drawStaticStars();
      }
    });

    if (!this.isTouch && !this.isSmallScreen) {
      window.addEventListener("mousemove", (event) => {
        this.mouse.x = event.clientX;
        this.mouse.y = event.clientY;
      });
      window.addEventListener("mouseout", () => {
        this.mouse.x = null;
        this.mouse.y = null;
      });
    } else {
      this.mouse.x = null;
      this.mouse.y = null;
    }
  }

  initParticles() {
    this.particles = [];
    const particleCount = 2000;
    for (let i = 0; i < particleCount; i++) {
      let size = Math.random() * 1.5 + 0.5;
      let x = Math.random() * this.canvas.width;
      let y = Math.random() * this.canvas.height;
      let opacity = Math.random() * 0.5 + 0.3;
      this.particles.push(new Particle(x, y, size, opacity, this.mouse, this.isTouch, this.isSmallScreen));
    }
  }

  drawStaticStars() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.particles.forEach((p) => p.draw(this.ctx));
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.particles.forEach((p) => {
      if (!this.isTouch && !this.isSmallScreen) {
        p.update();
      }
      p.draw(this.ctx);
    });
    if (!this.isTouch && !this.isSmallScreen) {
      requestAnimationFrame(() => this.animate());
    }
  }
}

// Particle Class
class Particle {
  constructor(x, y, size, alpha, mouse, isTouch, isSmallScreen) {
    this.x = x;
    this.y = y;
    this.originX = x;
    this.originY = y;
    this.size = size;
    this.baseAlpha = alpha;
    this.alpha = alpha;
    this.vx = 0;
    this.vy = 0;
    this.density = Math.random() * 20 + 10;
    this.mouse = mouse;
    this.isTouch = isTouch;
    this.isSmallScreen = isSmallScreen;
  }

  draw(ctx) {
    ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
    ctx.fillRect(
      this.x - this.size / 2,
      this.y - this.size / 2,
      this.size,
      this.size
    );
  }

  update() {
    if (!this.isTouch && !this.isSmallScreen && this.mouse.x !== null) {
      let dx = this.mouse.x - this.x;
      let dy = this.mouse.y - this.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < this.mouse.radius) {
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let force = (this.mouse.radius - distance) / this.mouse.radius;
        this.vx += forceDirectionX * force * this.density * 0.033;
        this.vy += forceDirectionY * force * this.density * 0.033;
      }
    }
    if (!this.isTouch && !this.isSmallScreen && Math.random() > 0.997) {
      this.alpha = Math.min(1.0, this.alpha + 0.5);
    }
    if (this.alpha > this.baseAlpha) {
      this.alpha -= 0.01;
    } else if (this.alpha < this.baseAlpha) {
      this.alpha = this.baseAlpha;
    }
    this.vx *= 0.92;
    this.vy *= 0.92;
    this.vx += (this.originX - this.x) * 0.02;
    this.vy += (this.originY - this.y) * 0.02;
    this.x += this.vx;
    this.y += this.vy;
  }
}

// Custom Cursor Class
class CustomCursor {
  constructor() {
    this.cursor = document.getElementById("custom-cursor");
    this.cursorDot = document.getElementById("custom-cursor-dot");
    this.cursorArrow = document.getElementById("custom-cursor-arrow");
    this.hoverables = document.querySelectorAll("a, svg, button, .card-hover");
    
    if (this.cursor && this.cursorDot && this.cursorArrow) {
      this.init();
    }
  }

  init() {
    document.addEventListener("mousemove", (e) => {
      const ringTransform = `translate3d(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%), 0)`;
      this.cursor.style.transform = ringTransform;
      this.cursorDot.style.transform = ringTransform;
      const arrowTransform = `translate3d(calc(${e.clientX}px - 0.375rem), ${e.clientY}px, 0)`;
      this.cursorArrow.style.transform = arrowTransform;
    });

    this.hoverables.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        this.cursor.classList.add("hidden");
        this.cursorDot.classList.add("hidden");
        this.cursorArrow.classList.remove("hidden");
      });
      el.addEventListener("mouseleave", () => {
        this.cursor.classList.remove("hidden");
        this.cursorDot.classList.remove("hidden");
        this.cursorArrow.classList.add("hidden");
      });
    });
  }
}

// Scroll Animations Class
class ScrollAnimations {
  constructor() {
    this.snapWrapper = document.getElementById("snap-scroll-wrapper");
    this.sections = document.querySelectorAll("section[id]");
    this.navLinks = document.querySelectorAll(".nav-link");
    this.homeNavLink = document.getElementById("nav-home-link");
    this.isScrolling = false;
    this.scrollTimeout = null;
    
    this.init();
  }

  init() {
    this.setupScrollObserver();
    this.setupSectionObserver();
    this.setupSmoothScrolling();
    this.setupSnapScrolling();
    this.setupNavHeight();
  }

  setupScrollObserver() {
    const scrollObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = parseInt(entry.target.dataset.delay) || 0;
            entry.target.style.transitionDelay = `${delay}ms`;
            entry.target.classList.add("is-visible");
            entry.target.classList.remove(
              "opacity-0",
              "translate-y-12",
              "-translate-x-24",
              "translate-x-24",
              "scale-75"
            );
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, root: this.snapWrapper }
    );

    document
      .querySelectorAll(".animate-on-scroll, .card-hover")
      .forEach((el) => {
        el.classList.add("transition-all", "duration-1000", "ease-out");
        scrollObserver.observe(el);
      });
  }

  setupSectionObserver() {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute("id");
          const navLink = document.querySelector(`.nav-link[href="#${id}"]`);

          if (entry.isIntersecting) {
            // Remove active class from all icons
            this.navLinks.forEach((link) => {
              const icon = link.querySelector("svg");
              if (icon) {
                icon.classList.remove("text-purple-400", "scale-110");
                icon.classList.add("text-gray-300");
              }
            });

            // Add active class to the current icon
            if (navLink) {
              const icon = navLink.querySelector("svg");
              if (icon) {
                icon.classList.add("text-purple-400", "scale-110");
                icon.classList.remove("text-gray-300");
              }
            }

            // Handle home link visibility
            if (id === "hero") {
              this.homeNavLink.classList.add("hidden");
            } else {
              this.homeNavLink.classList.remove("hidden");
            }
          }
        });
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );

    this.sections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }

  setupSmoothScrolling() {
    document.querySelectorAll('nav a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        document
          .querySelector(this.getAttribute("href"))
          .scrollIntoView({ behavior: "smooth" });
      });
    });

    const scrollArrow = document.querySelector(".scroll-down-arrow");
    if (scrollArrow) {
      scrollArrow.addEventListener("click", () => {
        document
          .getElementById("about")
          .scrollIntoView({ behavior: "smooth" });
      });
    }
  }

  setupSnapScrolling() {
    const snapSections = Array.from(this.snapWrapper.querySelectorAll("section"));

    const scrollToSection = (index) => {
      if (index < 0 || index >= snapSections.length) return;
      this.isScrolling = true;
      snapSections[index].scrollIntoView({ behavior: "smooth" });
      clearTimeout(this.scrollTimeout);
      this.scrollTimeout = setTimeout(() => {
        this.isScrolling = false;
      }, 700);
    };

    const getCurrentSectionIndex = () => {
      const scrollTop = this.snapWrapper.scrollTop;
      let closestIdx = 0;
      let minDist = Infinity;
      snapSections.forEach((section, i) => {
        const dist = Math.abs(section.offsetTop - scrollTop);
        if (dist < minDist) {
          minDist = dist;
          closestIdx = i;
        }
      });
      return closestIdx;
    };

    this.snapWrapper.addEventListener(
      "wheel",
      (e) => {
        if (this.isScrolling) {
          e.preventDefault();
          return;
        }
        const delta = e.deltaY;
        if (Math.abs(delta) < 10) return; // ignore tiny scrolls
        const currentIdx = getCurrentSectionIndex();
        let nextIdx = currentIdx + (delta > 0 ? 1 : -1);
        if (nextIdx < 0) nextIdx = 0;
        if (nextIdx >= snapSections.length)
          nextIdx = snapSections.length - 1;
        if (nextIdx !== currentIdx) {
          e.preventDefault();
          scrollToSection(nextIdx);
        }
      },
      { passive: false }
    );

    this.snapWrapper.addEventListener("keydown", (e) => {
      if (this.isScrolling) {
        e.preventDefault();
        return;
      }
      const currentIdx = getCurrentSectionIndex();
      let nextIdx = currentIdx;
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        nextIdx = Math.min(currentIdx + 1, snapSections.length - 1);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        nextIdx = Math.max(currentIdx - 1, 0);
      }
      if (nextIdx !== currentIdx) {
        e.preventDefault();
        scrollToSection(nextIdx);
      }
    });
  }

  setupNavHeight() {
    const nav = document.querySelector("nav");
    if (nav) {
      const setNavHeight = () => {
        document.documentElement.style.setProperty(
          "--nav-height",
          `${nav.offsetHeight}px`
        );
      };
      setNavHeight();
      window.addEventListener("resize", setNavHeight);
    }
  }
}

// Carousel Class


// Skills Management Class
class SkillsManager {
  constructor() {
    this.grid = document.getElementById("skills-grid");
    this.filterBtns = document.querySelectorAll(".skills-filter-btn");
    this.dropdownBtn = document.getElementById("skills-filter-dropdown-btn");
    this.dropdownList = document.getElementById("skills-filter-dropdown-list");
    this.selected = document.getElementById("skills-filter-dropdown-selected");
    this.leftBtn = document.getElementById("skills-scroll-left");
    this.rightBtn = document.getElementById("skills-scroll-right");
    
    this.skills = [
      {
        label: "C++",
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg",
        category: "languages",
        color: "text-blue-200",
        bg: "from-black/80 via-blue-900/40 to-black/80",
        border: "border-blue-900/30",
      },
      {
        label: "Python",
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
        category: "languages",
        color: "text-yellow-200",
        bg: "from-black/80 via-yellow-400/40 to-blue-900/40",
        border: "border-yellow-900/30",
      },
      {
        label: "Java",
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
        category: "languages",
        color: "text-orange-200",
        bg: "from-black/80 via-orange-600/40 to-blue-900/60",
        border: "border-orange-900/30",
      },
      {
        label: "Kotlin",
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg",
        category: "languages",
        color: "text-purple-200",
        bg: "from-black/80 via-purple-500/40 to-blue-900/40",
        border: "border-purple-900/30",
      },
      {
        label: "HTML",
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
        category: "frontend",
        color: "text-orange-200",
        bg: "from-black/80 via-orange-900/40 to-black/80",
        border: "border-orange-900/30",
      },
      {
        label: "CSS",
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
        category: "frontend",
        color: "text-blue-200",
        bg: "from-black/80 via-blue-900/40 to-black/80",
        border: "border-blue-900/30",
      },
      {
        label: "JavaScript",
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
        category: "frontend",
        color: "text-yellow-200",
        bg: "from-black/80 via-yellow-900/40",
        border: "border-yellow-900/30",
      },
      {
        label: "Tailwind CSS",
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
        category: "frontend",
        color: "text-blue-200",
        bg: "from-black/80 via-blue-900/40 to-black/80",
        border: "border-blue-900/30",
      },
      {
        label: "Jetpack Compose",
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jetpackcompose/jetpackcompose-original.svg",
        category: "frontend",
        color: "text-blue-200",
        bg: "from-black/80 via-blue-900/40 to-black/80",
        border: "border-blue-900/30",
      },
      {
        label: "Node.js",
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
        category: "backend",
        color: "text-green-200",
        bg: "from-black/80 via-green-900/40 to-black/80",
        border: "border-green-900/30",
      },
      {
        label: "Express",
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
        category: "backend",
        color: "text-gray-200",
        bg: "from-black/80 via-blue-900/40 to-black/80",
        border: "border-white/10",
        extra: "bg-white rounded-xl p-2",
      },
      {
        label: "MySQL",
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
        category: "database",
        color: "text-blue-200",
        bg: "from-black/80 via-blue-900/40 to-black/80",
        border: "border-blue-900/30",
      },
      {
        label: "PostgreSQL",
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
        category: "database",
        color: "text-blue-200",
        bg: "from-black/80 via-blue-900/40 to-black/80",
        border: "border-blue-900/30",
      },
      {
        label: "MongoDB",
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
        category: "database",
        color: "text-green-200",
        bg: "from-black/80 via-yellow-900/40 to-black/80",
        border: "border-yellow-900/40",
      },
      {
        label: "Firebase",
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-original.svg",
        category: "database",
        color: "text-green-200",
        bg: "from-black/80 via-green-900/40 to-black/80",
        border: "border-green-900/30",
      },
      {
        label: "Vercel",
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg",
        category: "cloud",
        color: "text-pink-200",
        bg: "from-black/80 via-pink-900/40 to-black/80",
        border: "border-pink-900/30",
      },
      {
        label: "Figma",
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
        category: "design",
        color: "text-pink-200",
        bg: "from-black/80 via-pink-900/40 to-black/80",
        border: "border-pink-900/30",
      },
      {
        label: "Canva",
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/canva/canva-original.svg",
        category: "design",
        color: "text-blue-200",
        bg: "from-black/80 via-blue-900/40 to-black/80",
        border: "border-blue-900/30",
      },
      {
        label: "Git",
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
        category: "tools",
        color: "text-red-200",
        bg: "from-black/80 via-red-900/40 to-black/80",
        border: "border-red-900/30",
      },
      {
        label: "Postman",
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg",
        category: "tools",
        color: "text-red-200",
        bg: "from-black/80 via-red-900/40 to-black/80",
        border: "border-red-900/30",
      },
      {
        label: "Visual Studio Code",
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg",
        category: "tools",
        color: "text-red-200",
        bg: "from-black/80 via-red-900/40 to-black/80",
        border: "border-red-900/30",
      },
      {
        label: "Android Studio",
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/androidstudio/androidstudio-original.svg",
        category: "tools",
        color: "text-red-200",
        bg: "from-black/80 via-red-900/40 to-black/80",
        border: "border-red-900/30",
      },
    ];
    
    this.init();
  }

  init() {
    this.renderSkillsGrid("languages");
    this.setupFilterButtons();
    this.setupDropdown();
    this.setupScrollButtons();
  }

  renderSkillsGrid(filter) {
    let filtered = this.skills.filter((s) => s.category === filter);
    this.grid.innerHTML = filtered
      .map(
        (skill) => `
      <div class="skills-card group">
        <div class="icon-box ${skill.bg || ""} ${skill.border || ""}">
          <img src="${skill.src}" alt="${skill.label}" class="${
          skill.extra || ""
        }" />
          <span class="skills-tooltip">${skill.label}</span>
        </div>
      </div>
    `
      )
      .join("");
    
    this.grid.classList.remove(
      "flex",
      "overflow-x-auto",
      "gap-6",
      "md:gap-8",
      "whitespace-nowrap",
      "scrollbar-hide"
    );
    this.grid.classList.add(
      "grid",
      "grid-cols-2",
      "sm:grid-cols-3",
      "md:grid-cols-4",
      "lg:grid-cols-6"
    );
    
    // Tooltip show/hide
    this.grid.querySelectorAll(".skills-card").forEach((card) => {
      card.addEventListener("mouseenter", () => {
        const tip = card.querySelector(".skills-tooltip");
        if (tip) tip.style.opacity = "1";
      });
      card.addEventListener("mouseleave", () => {
        const tip = card.querySelector(".skills-tooltip");
        if (tip) tip.style.opacity = "0";
      });
    });
  }

  setupFilterButtons() {
    this.filterBtns.forEach((btn) => {
      btn.onclick = () => {
        this.filterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        this.renderSkillsGrid(btn.dataset.filter);
      };
    });
  }

  setupDropdown() {
    if (this.dropdownBtn && this.dropdownList && this.selected) {
      this.dropdownBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const expanded = this.dropdownBtn.getAttribute("aria-expanded") === "true";
        this.dropdownBtn.setAttribute("aria-expanded", !expanded);
        this.dropdownList.classList.toggle("hidden");
      });

      const dropdownBtns = this.dropdownList.querySelectorAll(".skills-filter-btn");
      dropdownBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          this.selected.textContent = btn.textContent;
          this.dropdownList.classList.add("hidden");
          this.dropdownBtn.setAttribute("aria-expanded", "false");
          this.renderSkillsGrid(btn.dataset.filter);
          
          dropdownBtns.forEach((b) => {
            b.classList.remove("active", "bg-purple-700", "text-white");
          });
          btn.classList.add("active", "bg-purple-700", "text-white");
        });
      });

      document.addEventListener("click", (e) => {
        if (
          !this.dropdownList.contains(e.target) &&
          !this.dropdownBtn.contains(e.target)
        ) {
          this.dropdownList.classList.add("hidden");
          this.dropdownBtn.setAttribute("aria-expanded", "false");
        }
      });
    }
  }

  setupScrollButtons() {
    if (this.leftBtn && this.rightBtn && this.grid) {
      const updateScrollButtons = () => {
        if (window.innerWidth >= 1024) {
          this.leftBtn.classList.add("hidden");
          this.rightBtn.classList.add("hidden");
          this.grid.classList.remove(
            "overflow-x-auto",
            "whitespace-nowrap",
            "scroll-smooth"
          );
          this.grid.classList.add(
            "lg:overflow-x-visible",
            "lg:whitespace-normal"
          );
          return;
        }
        
        if (this.grid.scrollWidth > this.grid.clientWidth + 8) {
          this.leftBtn.classList.remove("hidden");
          this.rightBtn.classList.remove("hidden");
        } else {
          this.leftBtn.classList.add("hidden");
          this.rightBtn.classList.add("hidden");
        }
        
        this.grid.classList.add(
          "overflow-x-auto",
          "whitespace-nowrap",
          "scroll-smooth"
        );
        this.grid.classList.remove(
          "lg:overflow-x-visible",
          "lg:whitespace-normal"
        );
      };

      this.leftBtn.addEventListener("click", () => {
        this.grid.scrollBy({
          left: -this.grid.clientWidth * 0.8,
          behavior: "smooth",
        });
      });

      this.rightBtn.addEventListener("click", () => {
        this.grid.scrollBy({
          left: this.grid.clientWidth * 0.8,
          behavior: "smooth",
        });
      });

      this.grid.addEventListener("scroll", updateScrollButtons);
      window.addEventListener("resize", updateScrollButtons);
      setTimeout(updateScrollButtons, 300);
    }
  }
}

// Mobile Menu Class
class MobileMenu {
  constructor() {
    this.menuBtn = document.getElementById("mobile-menu-btn");
    this.menu = document.getElementById("mobile-menu");
    this.closeBtn = document.getElementById("mobile-menu-close");
    
    if (this.menuBtn && this.menu && this.closeBtn) {
      this.init();
    }
  }

  init() {
    this.menuBtn.addEventListener("click", () => {
      this.menu.classList.add("opacity-100", "pointer-events-auto");
      this.menu.classList.remove("opacity-0", "pointer-events-none");
      this.menuBtn.setAttribute("aria-expanded", "true");
      this.closeBtn.focus();
    });

    this.closeBtn.addEventListener("click", () => {
      this.menu.classList.remove("opacity-100", "pointer-events-auto");
      this.menu.classList.add("opacity-0", "pointer-events-none");
      this.menuBtn.setAttribute("aria-expanded", "false");
      this.menuBtn.focus();
    });

    this.menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        this.menu.classList.remove("opacity-100", "pointer-events-auto");
        this.menu.classList.add("opacity-0", "pointer-events-none");
        this.menuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }
}

// Touch Device Handler
class TouchDeviceHandler {
  constructor() {
    this.init();
  }

  init() {
    if (isTouchDevice()) {
      // Hide custom cursor elements
      const cursor = document.getElementById("custom-cursor");
      const cursorDot = document.getElementById("custom-cursor-dot");
      const cursorArrow = document.getElementById("custom-cursor-arrow");
      
      if (cursor) cursor.style.display = "none";
      if (cursorDot) cursorDot.style.display = "none";
      if (cursorArrow) cursorArrow.style.display = "none";
      
      // Remove cursor-none from body and elements
      document.body.classList.remove("cursor-none");
      document.querySelectorAll("a, button, .card-hover").forEach((el) => {
        el.style.cursor = "";
      });
      
      // Remove hover effects for touch devices
      document.querySelectorAll(".skills-card, .card-hover").forEach((el) => {
        el.onmouseenter = null;
        el.onmouseleave = null;
      });
    }
  }
}

// Navbar Visibility Handler
class NavbarVisibilityHandler {
  constructor() {
    this.nav = document.querySelector("nav");
    this.homeSection = document.getElementById("hero");
    
    if (this.nav && this.homeSection) {
      this.init();
    }
  }

  init() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (window.innerWidth < 768) {
            if (entry.isIntersecting) {
              this.nav.classList.remove("hidden");
            } else {
              this.nav.classList.add("hidden");
            }
          } else {
            this.nav.classList.remove("hidden");
          }
        });
      },
      { threshold: 0.1 }
    );
    
    observer.observe(this.homeSection);
    
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 768) {
        this.nav.classList.remove("hidden");
      }
    });
  }
}

// Performance Monitoring
class PerformanceMonitor {
  constructor() {
    this.init();
  }

  init() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            console.log('LCP:', entry.startTime);
            // You can send this to analytics here
          }
        }
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }
  }
}

// Error Handler
class ErrorHandler {
  constructor() {
    this.init();
  }

  init() {
    window.addEventListener('error', (e) => {
      console.error('Global error:', e.error);
    });

    window.addEventListener('unhandledrejection', (e) => {
      console.error('Unhandled promise rejection:', e.reason);
    });
  }
}

// Main Portfolio App Class
class PortfolioApp {
  constructor() {
    this.init();
  }

  init() {
    try {
      // Initialize all components
      new ParticleSystem();
      new CustomCursor();
      new ScrollAnimations();
      new SkillsManager();
      new MobileMenu();
      new TouchDeviceHandler();
      new NavbarVisibilityHandler();
      new PerformanceMonitor();
      new ErrorHandler();
      
      console.log('Portfolio app initialized successfully');
    } catch (error) {
      console.error('Portfolio app failed to initialize:', error);
    }
  }
}

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new PortfolioApp();
});

// Initialize when window loads (for any late-loading resources)
window.addEventListener("load", () => {
  // Set current date in footer if it exists
  const currentDateElement = document.getElementById("current-date");
  if (currentDateElement) {
    const now = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    currentDateElement.textContent = now.toLocaleDateString("en-US", options);
  }
}); 