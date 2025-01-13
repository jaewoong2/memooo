import { Metadata } from "next";

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  logo: "https://images.bamtoly.com/images/bamtoly_logo.png",
  name: "MEMOO",
  description: "이벤트",
  url:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://bamtoly.com",
};

export const siteMetadata: Metadata = {
  title: "밤톨이 | 이벤트 만들고 나눠요",
  description: "밤톨이에서 이벤트를 만들고 선물을 나눌 수 있어요",
  keywords: ["밤톨이", "이벤트", "즉석선물", "선착순이벤트"],
  authors: [{ name: "@Jaewoong2", url: "https://github.com/jaewoong2" }],
  applicationName: "밤톨이 | bamtoly",
  generator: "Next.js 15",
  referrer: "no-referrer",
  openGraph: {
    title: "밤톨이 | 이벤트 만들고 나눠요",
    description: "밤톨이에서 이벤트를 만들고 선물을 나눌 수 있어요",
    url: "https://bamtoly.com",
    type: "website",
    siteName: "밤톨이 | Bamtoly",
    images: [
      {
        url: "https://images.bamtoly.com/ramram.png",
        width: 1200,
        height: 630,
        alt: "밤톨이 | Bamtoly",
      },
    ],
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    site: "@Bamtoly",
    creator: "@Jaewoong2",
    title: "밤톨이 | Bamtoly",
    description: "밤톨이에서 이벤트를 만들고 선물을 나눌 수 있어요",
    images: ["https://images.bamtoly.com/ramram.png"],
  },
  robots: {
    index: true,
    follow: true,
    noarchive: false,
    nocache: false,
  },
};
