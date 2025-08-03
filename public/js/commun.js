const showModal = (popup) => {
  popup.classList.remove("opacity-0");
  popup.classList.remove("pointer-events-none");
  popup.classList.add("opacity-100");
  popup.classList.add("pointer-events-auto");
};

const hideModal = (popup) => {
  popup.classList.remove("opacity-100");
  popup.classList.remove("pointer-events-auto");
  popup.classList.add("opacity-0");
  popup.classList.add("pointer-events-none");
};

const commun = () => {
  const clubPopup = document.getElementById("club-popup");
  const adminPopup = document.getElementById("admin-popup");
  const joinClubBtn = document.getElementById("join-club-btn");
  const adminBtn = document.getElementById("admin-btn");
  const clubModalCloseBtn = document.getElementById("club-modal-close-btn");
  const adminModalCloseBtn = document.getElementById("admin-modal-close-btn");

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
};

export default commun;
export { showModal, hideModal };
