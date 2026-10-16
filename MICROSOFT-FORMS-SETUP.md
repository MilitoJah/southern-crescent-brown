# Microsoft Forms + Power Automate inquiry setup

## Form

Create **Southern Crescent Hospitality — Event Inquiry** at https://forms.office.com/ using the Microsoft 365 account that will own the form and automation.

Description: “Tell us about your gathering. Share the details below so we can discuss suitable options and next steps. Submitting an inquiry does not confirm availability or a booking.”

Create three sections:

### Your contact info

| Question | Microsoft Forms type | Required |
|---|---|---|
| Name | Text, short answer | Yes |
| Email | Text, short answer | Yes |
| Phone | Text, short answer | Yes |
| Company name | Text, short answer | No |
| Address | Text, short answer | Yes |
| Postal code | Text, short answer | Yes |
| City | Text, short answer | Yes |
| State | Text, short answer | Yes |

Microsoft Forms text questions do not necessarily supply the same email validation as a custom HTML email input. Verify the address as part of inquiry handling; do not assume the platform validated it.

### Your gathering

| Question | Microsoft Forms type | Required |
|---|---|---|
| Service of interest | Choice, single selection | No |
| Event date | Date | Yes |
| Event location | Text, short answer | Yes |
| Start time | Text, short answer; include AM/PM in the question subtitle | No |
| End time | Text, short answer; include AM/PM in the question subtitle | No |
| Estimated guest count | Text with whole-number restriction if available; otherwise number restriction | Yes |
| Estimated budget | Text, short answer | Yes |
| Referred by | Text, short answer | Yes |

Service choices: Corporate catering; Meeting catering; Delivered meals / boxed-meal inquiry; Charcuterie & curated grazing; Beverage & dry hire bar; Event planning & management; Staffing & hospitality; Menu planning; A combination / something else.

Budget subtitle: “An estimate or range is helpful. You may enter ‘To discuss.’”

### The details that matter

Question: “Are there any special details you’d like us to know about your event?” Use Text with Long answer enabled, optional. Subtitle: “Include dietary needs, allergies, venue access, meal preferences, or staffing and equipment requests. Please leave out payment information and other sensitive details.”

Settings: choose **Anyone can respond** so external clients can inquire without signing in. Availability depends on tenant policy. Avoid adding file-upload questions because anonymous Forms responses do not support them. Use Preview and submit a test before sharing.

Completion message: “Thank you. Your inquiry has been submitted. This does not confirm availability or a booking. For additional details, email hello@southerncrescenthospitality.com.” Do not claim that an email notification was delivered just because Forms accepted a response.

Use **Collect responses** to copy the public response URL. Share that link with the website editor. Do not share Microsoft passwords, access tokens, or an edit/collaboration link.

## Power Automate notification

At https://make.powerautomate.com/ create an Automated cloud flow named **Southern Crescent — New website inquiry**.

1. Trigger: Microsoft Forms — **When a new response is submitted**. Select the form owned by the signed-in account.
2. Action: Microsoft Forms — **Get response details**. Use the same Form ID; use **Response Id** from the trigger.
3. Action: Office 365 Outlook — **Send an email (V2)**. Set To to the fixed address **hello@southerncrescenthospitality.com**. This action sends from the connected Outlook account; it does not require a shared mailbox solely to receive the notification.
4. Subject: **Website inquiry — [Name] — [Event date]**, using the matching dynamic question answers from Get response details.
5. Body: include the response ID and every question answer, clearly labeled. Insert dynamic values as text; avoid concatenating untrusted answers into executable expressions, URLs, or raw HTML markup.
6. If the action exposes Reply To, use the answer to the **Email** question. Anonymous Forms visitors do not provide the built-in signed-in responder email. Leave From at the connected account unless the account has explicit send-as permission for another mailbox.
7. Save and test with a new Forms response. Verify the response in Forms, the successful flow run, and arrival in the receiving mailbox (including junk/quarantine). This checks three different steps.
8. Do not add an automatic customer reply until its wording and delivery behavior have been agreed and tested. The website must not promise one.

Connector availability, organization policy, and licensing must be confirmed in the actual tenant. The recommended design uses the Forms and Office 365 Outlook connectors rather than a public Power Automate HTTP-trigger URL.

## Website handoff

After receiving the public response URL, embed the form in the existing branded Contact page, provide an accessible iframe title, and include an “Open the inquiry form” fallback link. Microsoft's form fields retain Microsoft Forms styling; the outer page retains Southern Crescent branding. Remove the former draft form from that page only after the hosted form is available and tested.

Before launch, confirm external anonymous access, mobile embedding, completion behavior, form-response storage/retention in Microsoft 365, notification delivery, and a suitable privacy notice. No service has been connected merely by preparing these instructions.
