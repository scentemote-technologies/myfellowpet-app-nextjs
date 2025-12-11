"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { FaInstagram, FaWhatsapp, FaEnvelope } from "react-icons/fa";

export default function Footer() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function fetchFooterData() {
      try {
        const ref = doc(db, "company_documents", "footer");
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setData(snap.data());
        }
      } catch (err) {
        console.error("Error fetching footer:", err);
      }
    }

    fetchFooterData();
  }, []);

  if (!data) {
    return null; // Or show a loader
  }

  return (
    <footer className="bg-gray-900 text-gray-400 pt-12 pb-6 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 border-b border-gray-700 pb-10">

          {/* COMPANY COLUMN */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href={data.about_us} target="_blank" className="text-sm hover:text-white">
                  About Us
                </Link>
              </li>

              <li>
                <Link href={`mailto:${data.careers}`} className="text-sm hover:text-white">
                  Careers
                </Link>
              </li>

              <li>
                <Link href={data.contact_us} target="_blank" className="text-sm hover:text-white">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* POLICIES COLUMN */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Policies</h3>
            <ul className="space-y-3">
              <li>
                <Link href={data.privacy_policy} target="_blank" className="text-sm hover:text-white">
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link href={data.cancellation_refund} target="_blank" className="text-sm hover:text-white">
                  Cancellation & Refund
                </Link>
              </li>

              <li>
                <Link href={data.terms_of_use} target="_blank" className="text-sm hover:text-white">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href={data.account_deletion} target="_blank" className="text-sm hover:text-white">
                  Account Deletion
                </Link>
              </li>
             
            </ul>
          </div>

          {/* CONNECT COLUMN */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Connect</h3>
            <p className="text-sm italic mb-4">We’d love to hear from you!</p>

            <div className="flex space-x-4 text-white">

              <Link href={data.instagram} target="_blank">
                <FaInstagram size={20} className="hover:text-teal-400 transition" />
              </Link>

              {/* WhatsApp Link */}
<Link
  href={`https://wa.me/${data.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    data.whatsapp_message || ""
  )}`}
  target="_blank"
  aria-label="WhatsApp"
>
  <FaWhatsapp size={20} className="hover:text-teal-400 transition" />
</Link>


              <Link href={`mailto:${data.mail_us}`} target="_blank">
                <FaEnvelope size={20} className="hover:text-teal-400 transition" />
              </Link>
            </div>
          </div>

          {/* EMPTY COLUMN */}
          <div></div>
        </div>

        <div className="text-center pt-6">
          <p className="text-xs">
            Copyright © {new Date().getFullYear()} MyFellowPet - All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
