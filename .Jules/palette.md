## 2025-05-02 - Icon-Only Button Accessibility
**Learning:** The application frequently uses icon-only buttons (e.g., history items) that lack descriptive `aria-label`s, relying instead on generic `alt` text like "History" which provides poor context for screen reader users.
**Action:** Always verify `aria-label` and `title` presence on icon-only interactive elements, and ensure `alt` text is specific to the content (e.g., using the prompt text) rather than the component type.

## 2025-05-02 - Form Label Association and Interactive Element Names
**Learning:** Key form inputs (Prompt, Style, Instructions) relied on implicit or visual-only labeling, and interactive elements like color presets and sliders lacked accessible names, making them difficult for screen reader users to navigate and understand.
**Action:** Enforce strict `htmlFor`/`id` association for all form labels and ensure all interactive elements (especially icon-only buttons or sliders) have descriptive `aria-label`s.

## 2026-02-12 - Disruptive Error Handling (Alerts)
**Learning:** The application used `alert()` for critical errors in `IconEditor.tsx` (background removal, crop), which blocks the UI thread and provides a jarring user experience compared to inline error messages.
**Action:** Replace `alert()` calls with dismissible inline error states (`role="alert"`) in complex interactive components to maintain flow and accessibility.
