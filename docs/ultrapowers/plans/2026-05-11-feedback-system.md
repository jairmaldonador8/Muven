# Feedback System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use ultrapowers:subagent-driven-development (recommended) or ultrapowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a feedback collection widget to the MUVEN landing page using a floating button that opens a modal form, with email delivery via EmailJS.

**Architecture:** Floating button (top-right corner) → click opens native HTML dialog → textarea for feedback → submit sends via EmailJS to jairmaldonador8@gmail.com. All changes contained in index.html (no external files).

**Tech Stack:** HTML5 dialog element, CSS (inline), JavaScript (inline), EmailJS SDK (CDN)

**Key References:**
- @ultrapowers-dev:javascript-best-practices (event handling, form submission)
- @ultrapowers-dev:frontend-design (button styling, responsive)
- research-brief-feedback-system.md (EmailJS setup, accessibility)

---

## File Structure

```
index.html (modified only)
├── Add EmailJS script tag (head)
├── Add floating button markup (body)
├── Add feedback dialog markup (body)
├── Add CSS styles for button/modal/dialog (inline <style>)
└── Add JavaScript logic for modal & EmailJS (inline <script>)
```

No new files needed. All changes are inline additions to existing index.html.

---

## Task 1: Set Up EmailJS Account & Template

**Files:** None (setup external to repo)

This task is manual setup for EmailJS. No code to commit yet.

- [ ] **Step 1: Create EmailJS account**

Go to https://www.emailjs.com/ → Sign up (free)

- [ ] **Step 2: Add email service**

In EmailJS dashboard: Settings → Email Services → Add Service
- Choose: Gmail (or your email provider)
- Follow auth flow (Gmail requires app password if 2FA enabled)
- Note the **Service ID** (e.g., `service_abc123`)

- [ ] **Step 3: Create email template**

Dashboard → Email Templates → Create Template
- Template Name: "feedback-template"
- To Email: `jairmaldonador8@gmail.com`
- Subject: `Feedback from MUVEN Landing Page`
- Body:
  ```
  New feedback received:
  
  {{feedback}}
  ```
- Save template
- Note the **Template ID** (e.g., `template_xyz789`)

- [ ] **Step 4: Get API credentials**

Dashboard → Account → API Keys
- Copy **Public Key** (safe to expose in frontend)
- Copy **Service ID** and **Template ID** from above

- [ ] **Step 5: Add domain to whitelist**

Dashboard → Account → Access Control (CORS)
- Add your domain (e.g., `yourdomain.com` or `localhost:3000` for testing)
- This prevents abuse from other domains

---

## Task 2: Add EmailJS Script Tag & Initialization

**Files:**
- Modify: `index.html:1-50` (before closing `</head>`)

- [ ] **Step 1: Locate the closing </head> tag**

In index.html, find the line with `</head>`. This is where the script tag goes.

- [ ] **Step 2: Add EmailJS script tag**

Right before `</head>`, add:

```html
<!-- EmailJS SDK for sending feedback emails -->
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/index.min.js"></script>
<script type="text/javascript">
  // Initialize EmailJS with your public key
  // Replace 'YOUR_PUBLIC_KEY' with your actual public key from emailjs.com
  emailjs.init("YOUR_PUBLIC_KEY");
</script>
```

- [ ] **Step 3: Replace placeholder with actual key**

Replace `YOUR_PUBLIC_KEY` with the Public Key you copied from EmailJS dashboard (Step 5 of Task 1).

Example: `emailjs.init("abc123def456ghi789");`

---

## Task 3: Add Floating Button Markup & Styling

**Files:**
- Modify: `index.html` (add button markup + CSS)

- [ ] **Step 1: Find location for button markup**

Open index.html and locate the opening `<body>` tag (should be after `</head>`).

- [ ] **Step 2: Add floating button markup**

Near the end of `<body>` (before `</body>`), add:

```html
<!-- Floating Feedback Button -->
<button id="feedbackBtn" aria-label="Open feedback form">Feedback</button>
```

- [ ] **Step 3: Add CSS styles for button**

Find the main `<style>` block in index.html (you'll see existing CSS rules). At the END of that `<style>` block (before `</style>`), add:

```css
/* Floating Feedback Button */
#feedbackBtn {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 999;
  padding: 10px 16px;
  background: var(--accent);
  color: white;
  border: none;
  border-radius: 8px;
  font-family: var(--sans);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
}

#feedbackBtn:hover {
  background: var(--coral-dark);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  transform: translateY(-2px);
}

#feedbackBtn:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Dark mode support */
[data-theme="dark"] #feedbackBtn {
  background: var(--accent-soft);
  color: var(--bg);
}

[data-theme="dark"] #feedbackBtn:hover {
  background: var(--coral-soft);
}

/* Mobile responsive */
@media (max-width: 640px) {
  #feedbackBtn {
    padding: 8px 12px;
    font-size: 12px;
    top: 10px;
    right: 10px;
  }
}
```

---

## Task 4: Add Modal Dialog Markup & Styling

**Files:**
- Modify: `index.html` (add dialog markup + CSS)

- [ ] **Step 1: Add dialog HTML markup**

In `<body>`, near where you added the button (before `</body>`), add:

```html
<!-- Feedback Modal Dialog -->
<dialog id="feedbackDialog" aria-labelledby="feedbackTitle">
  <div class="feedbackModalContent">
    <div class="feedbackModalHeader">
      <h2 id="feedbackTitle">Share Your Feedback</h2>
      <button class="closeBtn" aria-label="Close feedback form" type="button">&times;</button>
    </div>
    <form id="feedbackForm" novalidate>
      <textarea 
        id="feedbackText" 
        name="feedback"
        placeholder="Tell us what you think... Any comments about the design, content, or experience?" 
        required
        maxlength="5000"
        rows="6"
      ></textarea>
      <div class="formActions">
        <button type="submit" class="submitBtn">Enviar</button>
        <button type="button" class="cancelBtn" id="cancelBtn">Cerrar</button>
      </div>
    </form>
    <div id="successMessage" class="successMessage" hidden>
      ¡Gracias por tu feedback!
    </div>
  </div>
</dialog>
```

- [ ] **Step 2: Add CSS styles for dialog**

In the main `<style>` block, at the END (before `</style>`), add:

```css
/* Feedback Modal Dialog */
#feedbackDialog {
  border: none;
  border-radius: 12px;
  padding: 0;
  max-width: 500px;
  width: 90vw;
  max-height: 90vh;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

#feedbackDialog::backdrop {
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
}

#feedbackDialog[open] {
  display: flex;
  flex-direction: column;
}

.feedbackModalContent {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px;
  background: var(--bg);
  color: var(--text);
  border-radius: 12px;
}

.feedbackModalHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.feedbackModalHeader h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.closeBtn {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: var(--text-soft);
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.closeBtn:hover {
  color: var(--text);
}

#feedbackForm {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

#feedbackText {
  padding: 12px;
  border: 1px solid var(--border-strong);
  border-radius: 6px;
  font-family: var(--sans);
  font-size: 14px;
  resize: none;
  background: var(--bg-card);
  color: var(--text);
  line-height: 1.5;
}

#feedbackText:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-placeholder-bg);
}

#feedbackText::placeholder {
  color: var(--text-faint);
}

.formActions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.submitBtn,
.cancelBtn {
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  font-family: var(--sans);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.submitBtn {
  background: var(--accent);
  color: white;
}

.submitBtn:hover {
  background: var(--coral-dark);
}

.submitBtn:active {
  transform: scale(0.98);
}

.submitBtn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.cancelBtn {
  background: var(--border-soft);
  color: var(--text);
}

.cancelBtn:hover {
  background: var(--border-strong);
}

.successMessage {
  padding: 12px 16px;
  background: var(--accent-placeholder-bg);
  color: var(--accent-text);
  border-radius: 6px;
  text-align: center;
  font-weight: 500;
}

/* Dark mode support */
[data-theme="dark"] #feedbackDialog {
  background: var(--bg);
}

/* Mobile responsive */
@media (max-width: 640px) {
  #feedbackDialog {
    width: 95vw;
  }

  .feedbackModalContent {
    padding: 20px;
    gap: 16px;
  }

  #feedbackText {
    rows: 4;
  }
}
```

---

## Task 5: Add JavaScript Event Handlers & EmailJS Logic

**Files:**
- Modify: `index.html` (add JavaScript before `</body>`)

- [ ] **Step 1: Add JavaScript code**

Near the end of `<body>` (after all dialog markup, before `</body>`), add:

```html
<script>
  // Feedback System JavaScript
  
  // Get DOM elements
  const feedbackBtn = document.getElementById('feedbackBtn');
  const feedbackDialog = document.getElementById('feedbackDialog');
  const feedbackForm = document.getElementById('feedbackForm');
  const feedbackText = document.getElementById('feedbackText');
  const cancelBtn = document.getElementById('cancelBtn');
  const closeBtn = document.querySelector('.closeBtn');
  const successMessage = document.getElementById('successMessage');
  const submitBtn = feedbackForm.querySelector('[type="submit"]');

  // Open dialog when button is clicked
  feedbackBtn.addEventListener('click', () => {
    feedbackDialog.showModal();
    feedbackText.focus();
  });

  // Close dialog when cancel/close buttons are clicked
  cancelBtn.addEventListener('click', () => {
    feedbackDialog.close();
  });

  closeBtn.addEventListener('click', () => {
    feedbackDialog.close();
  });

  // Close dialog when ESC is pressed (native behavior, but explicit handler)
  feedbackDialog.addEventListener('cancel', () => {
    resetForm();
  });

  // Handle form submission
  feedbackForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate textarea is not empty
    if (!feedbackText.value.trim()) {
      feedbackText.setCustomValidity('Please enter your feedback.');
      feedbackForm.reportValidity();
      return;
    }

    // Clear any previous validation messages
    feedbackText.setCustomValidity('');

    // Disable submit button to prevent duplicate submissions
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    try {
      // Send email via EmailJS
      // Replace SERVICE_ID and TEMPLATE_ID with your actual IDs from Task 1
      await emailjs.send(
        'YOUR_SERVICE_ID',
        'YOUR_TEMPLATE_ID',
        {
          feedback: feedbackText.value.trim(),
          to_email: 'jairmaldonador8@gmail.com'
        }
      );

      // Show success message
      feedbackForm.style.display = 'none';
      successMessage.hidden = false;

      // Auto-close dialog after 2 seconds
      setTimeout(() => {
        feedbackDialog.close();
        resetForm();
      }, 2000);
    } catch (error) {
      // Handle error
      console.error('Error sending feedback:', error);
      submitBtn.disabled = false;
      submitBtn.textContent = 'Enviar';
      feedbackText.setCustomValidity('Error sending feedback. Please try again.');
      feedbackForm.reportValidity();
    }
  });

  // Reset form to initial state
  function resetForm() {
    feedbackForm.reset();
    feedbackForm.style.display = 'flex';
    successMessage.hidden = true;
    submitBtn.disabled = false;
    submitBtn.textContent = 'Enviar';
    feedbackText.setCustomValidity('');
  }
</script>
```

- [ ] **Step 2: Replace EmailJS credentials**

In the script above, find this line:
```javascript
await emailjs.send(
  'YOUR_SERVICE_ID',
  'YOUR_TEMPLATE_ID',
```

Replace with your actual credentials from Task 1:
- `YOUR_SERVICE_ID` → e.g., `service_abc123def456`
- `YOUR_TEMPLATE_ID` → e.g., `template_xyz789klm`

Example:
```javascript
await emailjs.send(
  'service_abc123def456',
  'template_xyz789klm',
```

---

## Task 6: Test Feedback Form

**Files:** None (manual testing)

- [ ] **Step 1: Start local server**

If you have a local server running (http-server, Python SimpleHTTPServer, etc.), open it.
Otherwise, open `index.html` directly in browser: `file:///path/to/index.html`

- [ ] **Step 2: Verify button appears**

Check top-right corner of page. You should see a coral "Feedback" button.
- Button should be clickable
- Hover effect should work (darker color, slight lift)

- [ ] **Step 3: Test modal opens**

Click the "Feedback" button.
- Modal dialog should open with overlay/backdrop
- Textarea should be focused (cursor visible)
- Close button (X) and "Cerrar" button should be visible

- [ ] **Step 4: Test form validation**

- Click "Enviar" without typing anything
- Should see error message: "Please enter your feedback."
- Modal stays open

- [ ] **Step 5: Test successful submission**

Type test feedback in textarea:
```
This is test feedback for the MUVEN landing page.
```

- Click "Enviar"
- Button should show "Enviando..."
- After a moment, success message should appear: "¡Gracias por tu feedback!"
- Modal should auto-close after 2 seconds
- Check your email (jairmaldonador8@gmail.com) — should receive the feedback email

- [ ] **Step 6: Test ESC key**

Click "Feedback" to open modal → press ESC key → modal closes

- [ ] **Step 7: Test on mobile**

Resize browser to 375px width (mobile size).
- Button should be smaller, repositioned appropriately
- Modal should fit screen, scrollable if needed

- [ ] **Step 8: Test dark mode**

If you have dark mode toggle on your site:
- Switch to dark mode
- Feedback button should adjust colors
- Modal should be visible in dark theme

---

## Task 7: Commit Changes (Auto-Commit Enabled)

**Files:**
- Modify: `index.html`
- Add: `docs/ultrapowers/specs/2026-05-11-feedback-system-design.md`
- Add: `docs/ultrapowers/specs/research-brief-feedback-system.md`
- Add: `docs/ultrapowers/plans/2026-05-11-feedback-system.md`
- Add: `.claude/ultrapowers-preferences.json`

- [ ] **Step 1: Stage all changes**

```bash
git add index.html docs/ .claude/ultrapowers-preferences.json
```

- [ ] **Step 2: Create commit**

```bash
git commit -m "feat: add feedback collection widget with EmailJS integration

- Add floating button in top-right corner
- Implement accessible modal dialog with HTML5 <dialog>
- Integrate EmailJS for email delivery to jairmaldonador8@gmail.com
- Support dark mode and mobile responsive design
- Include form validation and success messaging
- Add comprehensive design specs and research brief"
```

- [ ] **Step 3: Push to remote**

```bash
git push origin main
```

---

## Summary

After all tasks complete:
✅ Floating "Feedback" button visible in top-right  
✅ Click opens native HTML dialog with textarea  
✅ Form validates (non-empty feedback required)  
✅ Submit sends email via EmailJS  
✅ Success message displays, dialog auto-closes  
✅ Accessible (dialog, focus management, ARIA labels)  
✅ Responsive (mobile-friendly)  
✅ Dark mode compatible  
✅ All changes committed with auto-push
