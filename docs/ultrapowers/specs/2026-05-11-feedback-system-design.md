# Feedback System Design
**Date:** 2026-05-11  
**Purpose:** Add a feedback collection mechanism to allow customers to submit design and UX improvements for the MUVEN landing page.

## Overview

Implement a simple, non-intrusive feedback widget that allows customers to submit comments about the website. Feedback is collected via a floating button that opens a modal form, and submissions are sent to the developer's email.

## User Flow

1. Visitor sees floating "Feedback" button in top-right corner
2. Clicks button → modal dialog opens with textarea
3. Types feedback/observations
4. Clicks "Enviar" button
5. Form validates (non-empty)
6. EmailJS sends submission to jairmaldonador8@gmail.com
7. Success message displays for 2 seconds
8. Modal closes automatically

## Technical Implementation

### Frontend Components

**Floating Button:**
- Fixed position, top-right corner
- Button text: "Feedback"
- Styled to match MUVEN design system (colors, fonts, spacing)
- Accessible (semantic HTML, keyboard support)

**Modal Dialog:**
- Hidden by default, shown when button is clicked
- Contains textarea for feedback
- "Enviar" button to submit
- "Cerrar" button or close icon (X) to dismiss
- Overlay/backdrop to focus user attention
- Responsive on mobile

**Success Message:**
- Brief confirmation: "¡Gracias por tu feedback!"
- Auto-dismisses after 2 seconds
- Non-blocking (doesn't require interaction)

### Backend Integration

**EmailJS Setup:**
- Create free EmailJS account
- Set up email template with placeholder: `{message}`
- Generate API key and service ID
- Configure origin restriction to customer's domain (security)

**Script Logic:**
- Initialize EmailJS with API credentials on page load
- Attach click handler to feedback button
- Handle form submission → call EmailJS `send()` method
- Handle success/error responses
- Clear textarea on successful send

### File Structure

```
index.html (modified)
├── Embed EmailJS script tag
├── Add floating button markup
├── Add modal markup
└── Add feedback form styles + logic (inline <script> and <style>)
```

No additional files needed — all changes are within index.html.

## Success Criteria

- [x] Floating button visible and clickable in top-right
- [x] Modal opens/closes smoothly
- [x] Form submission sends email to jairmaldonador8@gmail.com
- [x] Success message appears and auto-dismisses
- [x] No page break/refresh on submit
- [x] Mobile responsive
- [x] Accessible (keyboard navigation, labels)

## Security Considerations

- EmailJS API key restricted to customer's domain origin
- Textarea has reasonable character limit (5000 chars) to prevent abuse
- No personally identifiable information collected (no name/email required)
- Rate limiting handled by EmailJS free tier defaults

## Future Improvements (Out of Scope)

- Collecting user email for follow-up
- Categorizing feedback (design, content, functionality)
- Admin dashboard to view all feedback
- Spam filtering/moderation
