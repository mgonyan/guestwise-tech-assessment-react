# Tech Assessment Notes

## Features

- **Restaurant Listing:**
  Displays a list of restaurants with options to filter and sort.

- **Filter and Sort Options:**
  Users can adjust search criteria and sort results, with an option to clear all filters.

- **Detailed View with Navigation:**
  Each restaurant in the listing can be selected to show details, and a back button allows easy navigation back to the listing.

- **Error Handling and Loading Indicators:**
  Provides user feedback with loading spinners and error alerts to ensure smooth operation.

## Technical Choices

1. **Form Handling and Validation**

   - React Final Form: For efficient and simplified form handling, making validation and field biding much easier to develop with time constrains. Also it is a battle tested library with a subscription based strategy that improves any form performance.

   - Yup Validator: To handle form validation, I integrated Yup to avoid reinventing validation logic. Yup provides a powerful, extensible way to enforce rules on form inputs, ensuring accuracy and ease of use.

2. **Testing Strategy**

   **Upgrade of React Testing Library:**

   Upgraded to the latest version to resolve an act warning seen in previous versions and to benefit from more recent testing improvements.

   **Acceptance and Component Tests:**

   - Developed a high-level acceptance test to cover the primary "happy path" of the app, focusing on a smooth end-to-end experience for users.

   - Created specific tests at the component level to validate critical areas, such as form validation, error handling, and other important edge cases.

3. UI Structure

   **Component Design:**

   - Organized the UI into two main sections: a Restaurant Listing and a Filter/Sort Menu. This structure improves usability by allowing users to focus on one task at a time.

   - Back Button: Included to streamline user navigation between listing and detailed views.

   **Loading and Error Handling:**

   Implemented loading spinners and error alerts at the component level, with potential for refactoring. A centralized error-handling component at the App level using React context could notify users about errors more effectively.

4. Future Improvements

   **Centralized Error Handling:**
   Refactor error handling by creating a shared error-alert component at the App level, using React Context to provide a unified way to notify users of errors. This will reduce code duplication

   **Refactor Fetch hooks**
   There is some duplicated code for managing loading and error states, which could be streamlined by refactoring into a centralized fetch function. Alternatively, adopting a data-fetching library like Apollo or React Query would handle these states more effectively, providing built-in support for loading, caching, and error management, which would simplify the codebase and improve overall maintainability.

   **Show List of Bookings**
   It would be valuable to display the list of bookings immediately after a table is successfully booked, providing users with quick confirmation and easy access to their reservations.
