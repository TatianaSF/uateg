import type { Locale } from "@/content/schema";

const phones = ["+421940261128", "+421904020704"];
const emails = ["peshterianu@gmail.com", "mitsonata4@gmail.com"];

export function ContactOptions({ locale }: { locale: Locale }) {
  const english = locale === "en";
  return <div className="contact-options">
    <h3>{english ? "Email" : "Електронна пошта"}</h3>
    <ul>{emails.map((email) => <li key={email}><a href={"mailto:" + email}>{email}</a></li>)}</ul>
    <h3>{english ? "Phone and SMS" : "Телефон і SMS"}</h3>
    <ul>{phones.map((phone) => <li key={phone}>
      <a href={"tel:" + phone}>{english ? "Call" : "Зателефонувати"} {phone}</a>
      <span aria-hidden="true"> · </span>
      <a href={"sms:" + phone}>SMS {phone}</a>
    </li>)}</ul>
    <small>{english ? "These contact details are reproduced from the historical source with the project owner’s authorization. Their current availability has not been independently reconfirmed." : "Ці контактні дані відтворено з історичного джерела з дозволу власника проєкту. Їхню актуальність незалежно не підтверджено."}</small>
  </div>;
}
