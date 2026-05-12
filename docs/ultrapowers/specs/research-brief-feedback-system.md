# Research Brief: Feedback System Implementation

**Date:** 2026-05-11  
**Topic:** EmailJS integration for static HTML feedback form

## Context

Building a feedback collection widget for the MUVEN landing page. The spec requires:
- Floating button in top-right corner
- Modal form with textarea input
- Email submission via EmailJS
- Accessible, responsive implementation

## Key Findings

### EmailJS Integration (2025)

**What it is:** JavaScript library for sending emails directly from frontend without server-side code. Free tier: 200 emails/month.

**How it works:**
- Create account → set up email service (Gmail, Outlook, etc.) → create template → initialize SDK with public key → call `emailjs.send()` or `emailjs.sendForm()`
- Form fields use `name` attributes that map to template variables
- Example: `<textarea name="feedback"></textarea>` → template uses `{{feedback}}`

**Setup steps:**
1. Create account at emailjs.com (free)
2. Add email service (Gmail with app password, or other provider)
3. Create template with `{{feedback}}` variable
4. Get Service ID, Template ID, Public Key
5. Add script tag: `<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/index.min.js"></script>`
6. Initialize: `emailjs.init("YOUR_PUBLIC_KEY")`
7. Call: `emailjs.send(serviceId, templateId, variables)`

**Security:**
- Domain whitelist prevents API key misuse from other domains
- IP-based rate limiting built-in
- Optional reCAPTCHA available
- Public key safe to expose (restricted to whitelisted domain)

**Sources:**
- [EmailJS Official Docs](https://www.emailjs.com/docs/tutorial/creating-contact-form/)
- [EmailJS 2026 Tutorial](https://mailtrap.io/blog/emailjs/)

---

### HTML Dialog Element (Accessible Modals)

**What it is:** Native HTML `<dialog>` element (modern standard, not div-based). Full browser support: Chrome 37+, Safari 15.4+, Firefox 98+, Edge 79+.

**Built-in features:**
- Automatic focus trapping (ESC closes, Tab cycles within dialog)
- Native backdrop/overlay with `::backdrop` pseudo-element
- `aria-modal="true"` automatically set
- ARIA support without extra markup

**Best practices for implementation:**
```html
<dialog id="feedbackDialog" aria-labelledby="dialogTitle">
  <h2 id="dialogTitle">Feedback</h2>
  <textarea required></textarea>
  <button>Close</button>
</dialog>
```

**UX considerations:**
- Place initial focus on textarea (better for keyboard users)
- Add visible "Close" button (users expect it)
- ESC key works automatically
- For feedback form: modal is appropriate, no need for non-modal

**Accessibility checklist:**
- ✅ Dialog has `aria-labelledby` pointing to title
- ✅ Initial focus on textarea (via `autofocus` or JS)
- ✅ Close button accessible
- ✅ Escape key support (native)

**Sources:**
- [W3C Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [HTML Dialog Accessibility](https://jaredcunha.com/blog/html-dialog-getting-accessibility-and-ux-right)

---

### EmailJS Template Variables and Formatting

**Template syntax:**
- Double brackets `{{variable}}` — escaped (safe for user text)
- Triple brackets `{{{html}}}` — unescaped (for HTML content)
- Example template:
  ```
  Subject: New Feedback
  Body:
  Feedback received:
  {{feedback}}
  ```

**Limits:** Templates support up to 50,000 characters (no issue for simple feedback).

**Recommended setup for this project:**
- Service ID: your-gmail-service
- Template ID: feedback-template
- Template body: 
  ```
  Subject: Feedback from MUVEN Landing Page
  
  {{feedback}}
  ```

**Sources:**
- [EmailJS Templates](https://www.emailjs.com/docs/user-guide/creating-email-templates/)
- [Dynamic Variables](https://www.emailjs.com/docs/user-guide/dynamic-variables-templates/)

---

### Frontend Form Validation

**Recommended approach:** HTML5 Constraint Validation API + custom messaging

**Pattern:**
```javascript
const form = document.querySelector('form');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // Check if valid (built-in HTML5 validation)
  if (!form.checkValidity()) {
    form.reportValidity(); // Shows browser's default message
    return;
  }
  
  // If valid, send via EmailJS
  emailjs.send(...).then(() => {
    // Show success message
  });
});
```

**Best practices:**
- Use `required` attribute on textarea (semantic, works without JS)
- Validate on form submit, not on blur (better UX)
- For this form: just check non-empty, no complex rules
- Character limit: 5000 chars is reasonable (prevents abuse)

**Accessibility:**
- Keep field labels clear
- Error messages associated with field
- No custom validation messages needed (simple form)

**Sources:**
- [MDN Constraint Validation API](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Constraint_validation)
- [Form Validation Best Practices](https://dev.to/itxshakil/the-definitive-guide-to-the-constraint-validation-api-3l80)

---

## Recommended Approach

1. **Modal:** Use native `<dialog>` element (no external library)
2. **EmailJS:** Standard SDK integration via CDN
3. **Validation:** HTML5 `required` attribute + submit handler
4. **Security:** Configure domain whitelist in EmailJS dashboard
5. **UX:** Floating button → modal on click → success message on send

This approach is:
- ✅ Zero external dependencies (besides EmailJS)
- ✅ Fully accessible (native dialog element)
- ✅ Simple and maintainable
- ✅ Mobile responsive (dialog adapts to viewport)

---

## Implementation Notes

**Critical setup steps:**
1. Create EmailJS account and template (5 minutes)
2. Get Service ID, Template ID, Public Key
3. Add domain to EmailJS whitelist
4. Embed script + initialize SDK
5. Add dialog markup + button
6. Wire up click handlers

**Common pitfalls:**
- Forgetting to whitelist domain → requests rejected
- Form field names don't match template variables → empty emails
- Not using `name` attribute on textarea → won't send
- Missing `required` attribute on textarea → allow empty submissions

**Testing checklist:**
- [ ] Button appears in top-right
- [ ] Click button opens dialog
- [ ] Can type in textarea
- [ ] Submit validation works (rejects empty)
- [ ] Email arrives within seconds
- [ ] Success message shows
- [ ] ESC closes dialog
- [ ] Mobile responsive (viewport at 375px)

---

## Sources

- [EmailJS Official Tutorial](https://www.emailjs.com/docs/tutorial/creating-contact-form/)
- [W3C Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [MDN Form Validation](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Constraint_validation)
- [EmailJS Security FAQ](https://www.emailjs.com/docs/faq/can-i-add-my-domain-to-allowlist/)
