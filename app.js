const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('nav[aria-label="Main navigation"]');
const serviceMenu = document.querySelector('.nav-services');
function closeNavigation() {
  nav?.classList.remove('open');
  menu?.setAttribute('aria-expanded', 'false');
  menu?.setAttribute('aria-label', 'Open navigation');
  if (serviceMenu) serviceMenu.open = false;
}
menu?.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  nav?.classList.toggle('open', open);
});
nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeNavigation));
document.addEventListener('click', event => {
  if (serviceMenu && !serviceMenu.contains(event.target)) serviceMenu.open = false;
  if (nav?.classList.contains('open') && !nav.contains(event.target) && !menu.contains(event.target)) closeNavigation();
});
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  if (serviceMenu?.open) { serviceMenu.open = false; serviceMenu.querySelector('summary').focus(); }
  else if (nav?.classList.contains('open')) { closeNavigation(); menu.focus(); }
});
window.matchMedia('(min-width: 601px)').addEventListener('change', closeNavigation);
const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();
document.querySelectorAll('.card-image img').forEach(img => {
  img.addEventListener('error', () => { img.style.visibility = 'hidden'; });
  img.addEventListener('load', () => { img.style.visibility = 'visible'; });
});

const form = document.querySelector('#event-contact-form');
if (form) {
  const summary = document.querySelector('#form-errors');
  const status = document.querySelector('#contact-form-status');
  const review = document.querySelector('#inquiry-review');
  const draft = document.querySelector('#prepared-inquiry');
  const service = document.querySelector('#service');
  const requestedService = new URLSearchParams(location.search).get('service');
  if (service && [...service.options].some(option => option.value === requestedService)) service.value = requestedService;
  const date = document.querySelector('#date');
  const now = new Date();
  date.min = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
  const labels = {name:'Name',email:'Email',phone:'Phone',company:'Company / organization',service:'Service of interest',date:'Event date',location:'Event location',start:'Start time',end:'End time',guests:'Estimated guest count',budget:'Estimated budget',details:'Special details'};
  function clearError(input) {
    input.removeAttribute('aria-invalid');
    const errorId = `${input.name}-error`;
    document.getElementById(errorId)?.remove();
    const descriptions = (input.getAttribute('aria-describedby') || '').split(' ').filter(id => id && id !== errorId);
    if (descriptions.length) input.setAttribute('aria-describedby', descriptions.join(' '));
    else input.removeAttribute('aria-describedby');
  }
  function message(input) {
    const value = input.value.trim();
    if (input.required && !value) return `Enter ${labels[input.name].toLowerCase()}.`;
    if (input.name === 'email' && input.validity.typeMismatch) return 'Enter a valid email address.';
    if (input.name === 'phone' && value && value.replace(/\D/g,'').length < 7) return 'Enter a phone number with at least 7 digits.';
    if (input.name === 'date' && input.validity.rangeUnderflow) return 'Choose today or a future event date.';
    if (!input.validity.valid) return input.name === 'guests' ? 'Enter a whole guest count between 1 and 100,000.' : `Check ${labels[input.name].toLowerCase()}.`;
    return '';
  }
  form.addEventListener('input', event => {
    if (event.target.matches('input,select,textarea') && event.target.getAttribute('aria-invalid') === 'true' && !message(event.target)) clearError(event.target);
    if (review && !review.hidden) { review.hidden = true; status.textContent = 'Your details changed. Press Request my quote to try again.'; }
  });
  const submitButton = form.querySelector('button[type="submit"]');
  const thanks = document.querySelector('#inquiry-sent');
  function buildDraft(data, selected) {
    const lines = Object.entries(labels).map(([key,label]) => {
      let value = String(data.get(key) || '').trim();
      if (key === 'service' && value) value = selected.textContent;
      return `${label}: ${value || 'Not provided'}`;
    });
    draft.value = `Southern Crescent Hospitality — Event Inquiry\n\n${lines.join('\n')}\n\nPlease let me know the available options and next steps.\n`;
    const subject = `Event inquiry — ${data.get('date')}`;
    document.querySelector('#open-email-draft').href = `mailto:hello@southerncrescenthospitality.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(draft.value)}`;
  }
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (submitButton?.disabled) return;
    const inputs = [...form.querySelectorAll('input,select,textarea')].filter(input => !input.readOnly);
    inputs.forEach(clearError);
    const errors = inputs.map(input => ({input,text:message(input)})).filter(error => error.text);
    if (summary) {
      const list = summary.querySelector('ul'); list.replaceChildren();
      summary.hidden = errors.length === 0;
      errors.forEach(({input,text}) => {
        const disclosure = input.closest('details');
        if (disclosure) disclosure.open = true;
        input.setAttribute('aria-invalid','true');
        const note = document.createElement('p'); note.id = `${input.name}-error`; note.className = 'field-error'; note.textContent = text; input.after(note);
        input.setAttribute('aria-describedby', [input.getAttribute('aria-describedby'),note.id].filter(Boolean).join(' '));
        const item = document.createElement('li'); const link = document.createElement('a'); link.href = `#${input.id}`; link.textContent = text;
        link.addEventListener('click', e => { e.preventDefault(); input.focus(); }); item.append(link); list.append(item);
      });
    }
    if (errors.length) { review.hidden = true; status.textContent = ''; summary?.focus(); return; }
    const data = new FormData(form);
    const selected = service?.selectedOptions[0];
    review.hidden = true;
    submitButton.disabled = true;
    status.textContent = 'Sending your inquiry…';
    let sent = false;
    try {
      const response = await fetch('/api/inquiry', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(Object.fromEntries(data))});
      const result = await response.json().catch(() => ({}));
      sent = response.ok && result.ok === true;
    } catch { sent = false; }
    submitButton.disabled = false;
    if (sent) {
      form.reset();
      form.hidden = true;
      if (thanks) { thanks.hidden = false; thanks.focus(); }
      status.textContent = '';
      return;
    }
    buildDraft(data, selected);
    review.hidden = false;
    status.textContent = 'We could not send your inquiry automatically. Your details are below, ready to email to us.';
    review.focus();
  });
  document.querySelector('#copy-inquiry')?.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(draft.value); status.textContent = 'Inquiry copied. Paste it into an email to hello@southerncrescenthospitality.com.'; }
    catch { draft.focus(); draft.select(); status.textContent = 'Select and copy the prepared inquiry, then paste it into your email.'; }
  });
  document.querySelector('#download-inquiry')?.addEventListener('click', () => {
    const url = URL.createObjectURL(new Blob([draft.value], {type:'text/plain;charset=utf-8'}));
    const link = document.createElement('a'); link.href = url; link.download = 'southern-crescent-inquiry.txt'; document.body.append(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url),1000); status.textContent = 'Draft downloaded. It has not been sent.';
  });
}

function revealMenuCategory() {
  let target;
  try { target = document.getElementById(decodeURIComponent(location.hash.slice(1))); } catch { return; }
  if (target?.matches('details.sample-menu')) {
    target.open = true;
    requestAnimationFrame(() => target.scrollIntoView({block: 'start'}));
  }
}
window.addEventListener('hashchange', revealMenuCategory);
revealMenuCategory();
