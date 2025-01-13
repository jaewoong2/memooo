import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="border-t bg-muted/80 px-4 py-4 translate-y-[65px]">
      <div className="container mx-auto flex flex-col gap-2">
        <ul className="flex gap-2">
          <li className="w-fit whitespace-nowrap text-nowrap">
            <Link
              target="_blank"
              referrerPolicy="no-referrer"
              href="https://woongsworld.notion.site/24-12-25-167944d0c721807db471d8b65c2d76a9"
              className="text-sm"
            >
              개인정보 처리 방침
            </Link>
          </li>
          <li className="w-fit whitespace-nowrap text-nowrap">
            <Link
              target="_blank"
              referrerPolicy="no-referrer"
              href="https://woongsworld.notion.site/167944d0c72180749aafdfabfa5f061f"
              className="text-sm"
            >
              서비스 사용 방침
            </Link>
          </li>
          <li className="w-fit whitespace-nowrap text-nowrap">
            <Link href="mailto:jwisgenius@naver.com" className="text-sm">
              메일
            </Link>
          </li>
        </ul>
        <div className="flex w-full justify-between border-t border-gray-700 py-2 text-sm">
          <p>&copy; {new Date().getFullYear()} Bamtoly.com</p>
          <p>All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
