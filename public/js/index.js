/* eslint-disable import/extensions */
import commun, { showModal, hideModal } from "./commun.js";

window.addEventListener("DOMContentLoaded", () => {
  commun();
  const scrollDownBtn = document.getElementById("scroll-down-btn");

  const deleteMessageBtns = document.querySelectorAll(".delete-message-btn");
  const deleteMessagePopup = document.getElementById("delete-message-popup");
  const deleteMessageModalCloseBtn = document.getElementById(
    "delete-message-modal-close-btn",
  );

  const scrollToMessages = () => {
    const messagesSection = document.querySelector("section");
    if (messagesSection) {
      messagesSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  if (scrollDownBtn) {
    scrollDownBtn.addEventListener("click", scrollToMessages);
  }

  deleteMessageBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const { messageId } = btn.closest(".delete-message-btn").dataset;
      deleteMessagePopup.querySelector("form").action =
        `/delete-message/${messageId}`;
      showModal(deleteMessagePopup);
    });
  });

  if (deleteMessageModalCloseBtn) {
    deleteMessageModalCloseBtn.addEventListener("click", () =>
      hideModal(deleteMessagePopup),
    );
  }
});
