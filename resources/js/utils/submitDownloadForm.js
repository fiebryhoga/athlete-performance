/**
 * Submit a hidden POST form for file downloads without triggering Inertia's
 * navigation listener.
 *
 * Using form.target = '_self' in an Inertia SPA causes Inertia to intercept
 * the navigation on the first submission (before its internal lock is set),
 * resulting in a full page reload instead of a file download. Targeting a
 * hidden <iframe> keeps the POST response entirely out of the main window so
 * Inertia never sees it.
 *
 * @param {string} action - The form action URL (route)
 * @param {Object} fields - Key/value pairs to submit as hidden inputs
 */
export function submitDownloadForm(action, fields) {
 // Reuse or create a dedicated hidden iframe
 const IFRAME_ID = '__download_iframe__';
 let iframe = document.getElementById(IFRAME_ID);
 if (!iframe) {
 iframe = document.createElement('iframe');
 iframe.id = IFRAME_ID;
 iframe.name = IFRAME_ID;
 iframe.style.display = 'none';
 document.body.appendChild(iframe);
 }

 const form = document.createElement('form');
 form.method = 'POST';
 form.action = action;
 form.target = IFRAME_ID; // ← targets the hidden iframe, not _self

 for (const key in fields) {
 const input = document.createElement('input');
 input.type = 'hidden';
 input.name = key;
 input.value = fields[key] ?? '';
 form.appendChild(input);
 }

 document.body.appendChild(form);
 form.submit();
 document.body.removeChild(form);
}
