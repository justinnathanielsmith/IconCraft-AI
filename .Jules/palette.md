## 2025-05-02 - Icon-Only Button Accessibility
**Learning:** The application frequently uses icon-only buttons (e.g., history items) that lack descriptive `aria-label`s, relying instead on generic `alt` text like "History" which provides poor context for screen reader users.
**Action:** Always verify `aria-label` and `title` presence on icon-only interactive elements, and ensure `alt` text is specific to the content (e.g., using the prompt text) rather than the component type.

## 2025-05-02 - Form Label Association and Interactive Element Names
**Learning:** Key form inputs (Prompt, Style, Instructions) relied on implicit or visual-only labeling, and interactive elements like color presets and sliders lacked accessible names, making them difficult for screen reader users to navigate and understand.
**Action:** Enforce strict `htmlFor`/`id` association for all form labels and ensure all interactive elements (especially icon-only buttons or sliders) have descriptive `aria-label`s.

## 2025-05-02 - Semantic Icon Usage
**Learning:** The `Maximize` icon was used for a "Reset" action, which is semantically incorrect and confusing for users. Using standard icons like `RotateCcw` for reset actions improves intuitiveness.
**Action:** Review icon usage to ensure they semantically match the action they perform, not just look "kind of similar".

## 2025-05-02 - Focus Styles on Custom Buttons
**Learning:** Custom icon buttons (like the Close button in the editor) often lack explicit focus styles, making keyboard navigation difficult as the default browser focus ring might be suppressed or invisible against dark backgrounds.
**Action:** Always add `focus-visible` utility classes (e.g., `focus-visible:ring-2`) to interactive elements that have custom styling, ensuring they are visible to keyboard users.
