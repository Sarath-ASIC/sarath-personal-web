import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import ContactPanel from "@/components/ContactPanel";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Sarath K C about RTL design, FPGA and digital systems roles or projects.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        path={[{ label: "contact" }]}
        title="Let's talk hardware."
        lede="Open to conversations about RTL design, FPGA engineering and digital systems roles and projects."
      />
      <section className="frame mt-20 md:mt-28">
        <ContactPanel />
      </section>
    </>
  );
}
