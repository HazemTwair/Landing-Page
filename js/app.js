/**
 *
 * Manipulating the DOM exercise.
 * Exercise programmatically builds navigation,
 * scrolls to anchors from navigation,
 * and highlights section in viewport upon scrolling.
 *
 * Dependencies: None
 *
 * JS Version: ES2015/ES6
 *
 * JS Standard: ESlint
 *
 */

/**
 * Comments should be present at the beginning of each procedure and class.
 * Great to have comments before crucial code sections within the procedure.
 */

/**
 * Define Global Variables
 *
 */
const sections = document.querySelectorAll("section");
const navbarList = document.querySelector("#navbar__list");
const scrollToTopBtn = document.querySelector(".btn-scroll-to-top");
let hideNavTimeout;

/**
 * End Global Variables
 * Start Helper Functions
 *
 */

// Scroll to anchor ID using scrollTO event
function navLinkClickHandler(event) {
    event.preventDefault();
    const { target } = event;
    const link = target.closest("li");

    if (link && !target.classList.contains("active-section")) {
        const sectionId = link.dataset.id;
        const section = document.querySelector(`#${sectionId}`);

        const viewportWidth = window.innerWidth;
        if (viewportWidth > 560) {
            window.scrollTo({
                top: section.offsetTop,
                behavior: "smooth",
            });
        } else {
            window.scrollTo({
                top: section.offsetTop - 240,
                behavior: "smooth",
            });
            navbarList.classList.toggle("show");
        }
    }
}

// Toggle the collapsed class on the section / Update the aria-expanded attribute on H2
function collapseHandler(event) {
    const { target } = event;
    if (target.nodeName == "H2") {
        target.closest("section").classList.toggle("collapsed");
        target.ariaExpanded = target.ariaExpanded == "true" ? "false" : "true";
    }
}

/**
 * End Helper Functions
 * Begin Main Functions
 *
 */

// Build the nav
function buildNav() {
    const linksContainer = document.createDocumentFragment();
    for (const section of sections) {
        const sectionId = section.id;
        const linkText = section.dataset.nav;
        const link = document.createElement("li");

        link.dataset.id = sectionId;
        link.dataset.nav = linkText;
        link.innerHTML = `<a href="#${sectionId}" class="menu__link ${
            section.classList.contains("active-section") ? "active-section" : ""
        }">${linkText}</a>`;
        linksContainer.appendChild(link);
    }
    navbarList.appendChild(linksContainer);
}

// Hide the nav bar smooothly
function hideNav(nav) {
    let opacity = 1;

    function animate() {
        opacity -= 0.02;
        nav.style.opacity = opacity;

        if (opacity > 0) {
            // To perform an animation frame request and call animate function before the next repaint
            requestAnimationFrame(animate);
        } else {
            nav.style.display = "none";
        }
    }

    animate();
}

// Add class 'active-section' to section, nav link when section is near top of viewport
function makeActive() {
    for (const section of sections) {
        const box = section.getBoundingClientRect();
        const correspondingLink = navbarList.querySelector(
            `[data-id=${section.id}] a`
        );
        const viewportHeight = window.innerHeight;
        const threshold = viewportHeight * 0.25;
        if (
            (section.id == "section1" && box.top > threshold) ||
            (box.top <= threshold && box.bottom >= threshold)
        ) {
            // Apply active state on current section and corresponding Nav link
            section.classList.add("active-section");
            correspondingLink.classList.add("active-section");
        } else {
            // Remove active state from other sections and corresponding Nav links
            section.classList.remove("active-section");
            correspondingLink.classList.remove("active-section");
        }
    }
}

function scrollHandler() {
    // Clear any previous timeout to prevent unexpected hiding
    clearTimeout(hideNavTimeout);

    const navBar = document.querySelector(".navbar__menu");
    const viewportWidth = window.innerWidth;

    // Show Navbar for desktops
    if (viewportWidth > 560) {
        navBar.style.display = "block";
        navBar.style.opacity = 1;
    }

    // Update active sections
    makeActive();

    // Hide Navbar after 1s of inactivity
    if (viewportWidth > 560 && window.scrollY >= 100) {
        hideNavTimeout = setTimeout(() => {
            hideNav(navBar);
        }, 1000);
    }

    // Show/Hide ScrollToTop button
    if (window.scrollY >= 150) {
        scrollToTopBtn.style.display = "flex";
    } else {
        scrollToTopBtn.style.display = "none";
    }
}

/**
 * End Main Functions
 * Begin Events
 *
 */

// Scroll to section on link click
navbarList.addEventListener("click", navLinkClickHandler);

// Toggle collapsing on section title  click
document.querySelector("main").addEventListener("click", collapseHandler);

// Handle all changes on scrolling
document.addEventListener("scroll", scrollHandler);

// Scroll to top on scrollToTop button click
scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
});

const burger = document.querySelector(".burger");
burger.addEventListener("click", () => {
    navbarList.classList.toggle("show");
});

/**
 * End Events
 *
 * Build the nav bar menu
 *
 */

buildNav();
