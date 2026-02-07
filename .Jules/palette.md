## 2025-05-02 - Icon-Only Button Accessibility
**Learning:** The application frequently uses icon-only buttons (e.g., history items) that lack descriptive `aria-label`s, relying instead on generic `alt` text like "History" which provides poor context for screen reader users.
**Action:** Always verify `aria-label` and `title` presence on icon-only interactive elements, and ensure `alt` text is specific to the content (e.g., using the prompt text) rather than the component type.
