"use client";

import { Share2 } from "lucide-react";
import {
  WhatsappShareButton,
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  TelegramShareButton,
  WhatsappIcon,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  TelegramIcon,
} from "next-share";
import { useState } from "react";

export default function BeritaShare() {
  const [showShareMenu, setShowShareMenu] = useState(false);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const title = "KEGIATAN FIELD TRIP KELAS IX MENGUNJUNGI MUSEUM SCIENCE";
  const description =
    "Lorem ipsum dolor sit amet consectetur. Nisl purus leo eu augue. Orci viverra facilisi etiam id pretium eu quis.";

  return (
    <div className="flex justify-start mb-5 relative">
      <button
        onClick={() => setShowShareMenu(!showShareMenu)}
        className="flex items-center gap-2 bg-blue-950/90 hover:bg-blue-950 cursor-pointer text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-md"
      >
        <Share2 size={18} />
        <span>Share</span>
      </button>

      {showShareMenu && (
        <div className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg z-10 p-4">
          <div className="flex gap-3 flex-wrap">
            <WhatsappShareButton url={shareUrl} title={title}>
              <WhatsappIcon size={40} round />
            </WhatsappShareButton>

            <FacebookShareButton url={shareUrl} hashtag="#fieldtrip">
              <FacebookIcon size={40} round />
            </FacebookShareButton>

            <TwitterShareButton
              url={shareUrl}
              title={title}
              hashtags={["fieldtrip", "museum", "pendidikan"]}
            >
              <TwitterIcon size={40} round />
            </TwitterShareButton>

            <LinkedinShareButton
              url={shareUrl}
              title={title}
              summary={description}
            >
              <LinkedinIcon size={40} round />
            </LinkedinShareButton>

            <TelegramShareButton url={shareUrl} title={title}>
              <TelegramIcon size={40} round />
            </TelegramShareButton>
          </div>

          {/* Copy Link Button */}
          <div className="mt-3 pt-3 border-t dark:border-gray-600">
            <button
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(shareUrl);
                  alert("Link berhasil disalin!");
                } catch (err) {
                  const textArea = document.createElement("textarea");
                  textArea.value = shareUrl;
                  document.body.appendChild(textArea);
                  textArea.select();
                  document.execCommand("copy");
                  document.body.removeChild(textArea);
                  alert("Link berhasil disalin!");
                }
                setShowShareMenu(false);
              }}
              className="w-full px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
            >
              📋 Copy Link
            </button>
          </div>
        </div>
      )}

      {showShareMenu && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setShowShareMenu(false)}
        />
      )}
    </div>
  );
}
