const showModal = (popup) => {
  popup.classList.remove("opacity-0", "pointer-events-none");
  popup.classList.add("opacity-100", "pointer-events-auto");
};

const hideModal = (popup) => {
  popup.classList.remove("opacity-100", "pointer-events-auto");
  popup.classList.add("opacity-0", "pointer-events-none");
};

const commun = () => {
  const clubPopup = document.getElementById("club-popup");
  const adminPopup = document.getElementById("admin-popup");
  const joinClubBtn = document.getElementById("join-club-btn");
  const adminBtn = document.getElementById("admin-btn");
  const clubModalCloseBtn = document.getElementById("club-modal-close-btn");
  const adminModalCloseBtn = document.getElementById("admin-modal-close-btn");

  // Mobile menu elements
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileMenuClose = document.getElementById("mobile-menu-close");
  const menuIcon = document.getElementById("menu-icon");
  const closeIcon = document.getElementById("close-icon");

  // Mobile modal buttons
  const mobileJoinClubBtn = document.getElementById("mobile-join-club-btn");
  const mobileAdminBtn = document.getElementById("mobile-admin-btn");

  // Mobile menu functions
  const openMobileMenu = () => {
    mobileMenu.classList.remove("opacity-0", "pointer-events-none");
    mobileMenu.classList.add("opacity-100", "pointer-events-auto");
    mobileMenu.querySelector(".transform").classList.remove("translate-x-full");
    menuIcon.classList.add("hidden");
    closeIcon.classList.remove("hidden");
  };

  const closeMobileMenu = () => {
    mobileMenu.classList.add("opacity-0", "pointer-events-none");
    mobileMenu.classList.remove("opacity-100", "pointer-events-auto");
    mobileMenu.querySelector(".transform").classList.add("translate-x-full");
    menuIcon.classList.remove("hidden");
    closeIcon.classList.add("hidden");
  };

  // Desktop modal events
  if (joinClubBtn) {
    joinClubBtn.addEventListener("click", () => showModal(clubPopup));
  }
  if (clubModalCloseBtn) {
    clubModalCloseBtn.addEventListener("click", () => hideModal(clubPopup));
  }
  if (adminBtn) {
    adminBtn.addEventListener("click", () => showModal(adminPopup));
  }
  if (adminModalCloseBtn) {
    adminModalCloseBtn.addEventListener("click", () => hideModal(adminPopup));
  }

  // Mobile menu events
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", openMobileMenu);
  }
  if (mobileMenuClose) {
    mobileMenuClose.addEventListener("click", closeMobileMenu);
  }

  // Mobile modal events
  if (mobileJoinClubBtn) {
    mobileJoinClubBtn.addEventListener("click", () => {
      closeMobileMenu();
      showModal(clubPopup);
    });
  }
  if (mobileAdminBtn) {
    mobileAdminBtn.addEventListener("click", () => {
      closeMobileMenu();
      showModal(adminPopup);
    });
  }

  // Close mobile menu when clicking overlay
  if (mobileMenu) {
    mobileMenu.addEventListener("click", (e) => {
      if (e.target === mobileMenu || e.target.classList.contains("bg-black")) {
        closeMobileMenu();
      }
    });
  }

  // Close mobile menu on window resize to desktop size
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768) {
      // md breakpoint
      closeMobileMenu();
    }
  });
};

export default commun;
export { showModal, hideModal };
