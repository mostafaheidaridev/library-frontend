import { BASE_URL } from "./info.js";
import { getAuthHeaders } from "./auth.js";

const showSingleBook = async () => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get("id");

    if (!bookId) {
      throw new Error("No book ID provided");
    }

    const response = await fetch(`${BASE_URL}/books/${bookId}`);
    if (!response.ok) throw new Error("Network response was not ok");

    const fetchedBookData = await response.json();

    const bookContainer = document.getElementById("book-details");
    const bookTemplate = document.getElementById(
      "book-detail-template"
    ).content;
    const bookElement = bookTemplate.cloneNode(true);
    const breadCrumb = document.getElementById("breadcrumb-current-book");

    document.title = `${fetchedBookData.title} | Library Frontend`;
    breadCrumb.textContent = fetchedBookData.title;

    bookElement.querySelector(".book-cover-large").src =
      fetchedBookData.cover || "images/logo.svg";
    bookElement.querySelector(".book-cover-large").alt = fetchedBookData.title;
    bookElement.querySelector(".book-title").textContent =
      fetchedBookData.title;
    bookElement.querySelector(".book-author").textContent =
      fetchedBookData.author;
    bookElement.querySelector(".book-year").textContent =
      fetchedBookData.publishing_year;
    bookElement.querySelector(".book-publisher").textContent =
      fetchedBookData.publishing_company;

    const isLoggedIn =
      sessionStorage.getItem("user_id") && sessionStorage.getItem("user_token");
    const isAdmin = sessionStorage.getItem("user_id") === "2679";

    const loanSection = bookElement.querySelector("#loan-section");

    if (isAdmin) {
      // hide loan button for admin
      loanSection.classList.add("hidden");

      const adminSection = bookElement.querySelector("#admin-section");
      adminSection.classList.remove("hidden");

      try {
        const baseUrlWithoutTrailingSlash = BASE_URL.endsWith("/")
          ? BASE_URL.slice(0, -1)
          : BASE_URL;

        const adminId = "2679";
        const loansResponse = await fetch(
          `${baseUrlWithoutTrailingSlash}/admin/${adminId}/books/${bookId}`,
          {
            headers: getAuthHeaders(),
          }
        );

        if (!loansResponse.ok) {
          throw new Error(
            `Failed to fetch loan history: ${loansResponse.status} ${loansResponse.statusText}`
          );
        }

        const bookWithLoansData = await loansResponse.json();

        const adminBookInfo = adminSection.querySelector("h3");
        adminBookInfo.textContent = `Admin View - Loan History for "${bookWithLoansData.title}"`;

        const loansData = bookWithLoansData.loans || [];
        const loansTable = adminSection.querySelector(
          "#loans-history-table tbody"
        );

        if (loansData.length === 0) {
          loansTable.innerHTML =
            '<tr><td colspan="4" class="no-data">No loan history for this book</td></tr>';
        } else {
          loansTable.innerHTML = "";

          loansData.forEach((loan) => {
            const row = document.createElement("tr");

            // Format date for better readability
            const loanDate = new Date(loan.loan_date).toLocaleDateString();

            const dueDate = new Date(loan.loan_date);
            dueDate.setDate(dueDate.getDate() + 30);

            row.innerHTML = `
    <td>${loan.user_id}</td>
    <td>${loanDate}</td>
    <td>${dueDate.toLocaleDateString()}</td>
  `;

            loansTable.appendChild(row);
          });
        }
      } catch (error) {
        console.error("Error fetching loan history:", error);
        const adminSection = bookElement.querySelector("#admin-section");
        adminSection.querySelector(".loan-history").innerHTML = `
          <p class="error-message">Failed to load loan history: ${error.message}</p>
          <p>This could be due to a CORS issue or the server not responding properly.</p>
        `;
      }
    } else if (isLoggedIn) {
      loanSection.classList.remove("hidden");
      const loanButton = bookElement.querySelector("#loan-button");
      const loanMessage = bookElement.querySelector("#loan-message");

      loanButton.addEventListener("click", async () => {
        try {
          loanButton.disabled = true;
          loanButton.textContent = "Processing...";

          const headers = getAuthHeaders();
          const userId = sessionStorage.getItem("user_id");

          const loanResponse = await fetch(
            `${BASE_URL}/users/${userId}/books/${bookId}`,
            {
              method: "POST",
              headers,
            }
          );

          const result = await loanResponse.json();

          if (loanResponse.ok) {
            loanMessage.textContent =
              "Success! This book is now loaned to you for 30 days. An access link will be sent to your email.";
            loanMessage.className = "loan-message success";
            loanButton.style.display = "none";
          } else {
            const errorMsg =
              result.error === "This user has still this book on loan"
                ? "You already have a loan for this book."
                : result.error ||
                  "An error occurred while processing your loan.";

            loanMessage.textContent = errorMsg;
            loanMessage.className = "loan-message error";
            loanButton.style.display = "none";
            loanButton.textContent = "Loan This Book";
          }
        } catch (error) {
          loanMessage.textContent =
            "An error occurred while processing your loan.";
          loanMessage.className = "loan-message error";
          loanButton.disabled = true;
          loanButton.textContent = "Loan This Book";
          console.error("Error creating loan:", error);
        }
      });
    }

    bookContainer.innerHTML = "";
    bookContainer.appendChild(bookElement);
  } catch (error) {
    console.error("Error fetching book details:", error.message);

    bookContainer.innerHTML = `
      <div class="error-message" role="alert">
        <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12" y2="16"></line>
        </svg>
        <p>${
          error.message === "No book ID provided"
            ? "No book was selected. Please choose a book from the list."
            : "Failed to load book details. The server might be unavailable."
        }</p>
        <a href="index.html" aria-label="Return to book list">Return to books list</a>
      </div>
    `;
  }
};

showSingleBook();
