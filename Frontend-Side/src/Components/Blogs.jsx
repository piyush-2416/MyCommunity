import React from "react";
import {
  Users,
  Quote,
  ThumbsUp,
  MessageCircle,
  ArrowRight,
  Lightbulb,
  MessageSquare,
  Star,
  Heart,
} from "lucide-react";

const voices = [
  {
    id: 1,
    name: "Rahul Sharma",
    flat: "A-101",
    time: "2 hours ago",
    tag: "Suggestion",
    message:
      "Community park mein agar aur plants lagaye jayein toh area aur beautiful lagega. Isse hawa bhi fresh rahegi aur bachchon ke liye bhi behtar hoga.",
    likes: 24,
    comments: 6,
  },
  {
    id: 2,
    name: "Anjali Singh",
    flat: "B-302",
    time: "5 hours ago",
    tag: "Feedback",
    message:
      "The MyCommunity app is really helpful. However, I feel the event section can be more organized. It would be great if we could filter events by date and category.",
    likes: 18,
    comments: 4,
  },
  {
    id: 3,
    name: "Amit Gupta",
    flat: "B-105",
    time: "1 day ago",
    tag: "Appreciation",
    message:
      "A big thank you to our maintenance team for the quick response on the water supply issue. Truly appreciate your hard work and dedication!",
    likes: 32,
    comments: 3,
  },
 
];

const tagStyles = {
  Suggestion: { bg: "bg-emerald-50", text: "text-emerald-600", icon: MessageSquare },
  Feedback: { bg: "bg-sky-50", text: "text-sky-600", icon: MessageCircle },
  Appreciation: { bg: "bg-violet-50", text: "text-violet-600", icon: Star },
  Idea: { bg: "bg-amber-50", text: "text-amber-600", icon: Lightbulb },
  Experience: { bg: "bg-rose-50", text: "text-rose-600", icon: Heart },
};

const avatarColors = [
  "bg-orange-100 text-orange-700",
  "bg-pink-100 text-pink-700",
  "bg-blue-100 text-blue-700",
  "bg-teal-100 text-teal-700",
  "bg-purple-100 text-purple-700",
];

function VoiceCard({ voice, colorIndex }) {
  const tag = tagStyles[voice.tag];
  const TagIcon = tag.icon;

  return (
    <article className="flex flex-col bg-white shadow-sm hover:shadow-md p-5 border border-emerald-100 rounded-2xl h-full transition-shadow duration-300">
      {/* Top row: avatar + name + tag */}
      <div className="flex justify-between items-start gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${avatarColors[colorIndex % avatarColors.length]}`}
          >
            {voice.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-slate-800 text-sm truncate">
              {voice.name}
            </p>
            <p className="text-slate-400 text-xs">
              {voice.flat} &middot; {voice.time}
            </p>
          </div>
        </div>

        <span
          className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${tag.bg} ${tag.text}`}
        >
          <TagIcon size={11} />
          {voice.tag}
        </span>
      </div>

      {/* Message */}
      <div className="flex flex-1 gap-2 mt-4">
        <Quote size={16} className="mt-0.5 text-emerald-300 shrink-0" fill="currentColor" />
        <p className="text-slate-600 text-sm line-clamp-3 leading-6">
          {voice.message}
        </p>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-4 pt-4 border-slate-100 border-t">
        <div className="flex items-center gap-4 text-slate-500 text-xs">
          <span className="flex items-center gap-1.5">
            <ThumbsUp size={14} className="text-emerald-500" />
            {voice.likes}
          </span>
          <span className="flex items-center gap-1.5">
            <MessageCircle size={14} className="text-slate-400" />
            {voice.comments}
          </span>
        </div>

        <button
          type="button"
          className="flex items-center gap-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 focus-visible:outline-offset-2 font-semibold text-emerald-600 hover:text-emerald-700 text-xs transition-colors"
        >
          Read more
          <ArrowRight size={13} />
        </button>
      </div>
    </article>
  );
}

const Blogs = () => {
  const firstRow = voices.slice(0, 3);
  const secondRow = voices.slice(3);

  return (
    <section className="relative bg-gradient-to-b from-emerald-50/70 via-emerald-50/30 to-white py-14 sm:py-18 lg:py-20 w-full overflow-hidden">
      {/* Decorative leaves */}
      <svg
        className="top-10 -right-6 absolute w-28 sm:w-36 h-28 sm:h-36 text-emerald-200/60 pointer-events-none"
        viewBox="0 0 100 100"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M20 80 C 20 40, 60 20, 90 20 C 90 60, 60 90, 20 80 Z"
          fill="currentColor"
        />
      </svg>
      <svg
        className="bottom-6 -left-8 absolute w-24 sm:w-32 h-24 sm:h-32 text-emerald-200/50 pointer-events-none"
        viewBox="0 0 100 100"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M15 85 C 15 50, 45 25, 85 15 C 80 55, 50 85, 15 85 Z"
          fill="currentColor"
        />
      </svg>

      <div className="relative mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex justify-center items-center gap-2 mb-3 font-semibold text-emerald-600 text-xs sm:text-sm tracking-wide">
            <span className="bg-emerald-300 w-6 sm:w-8 h-px" />
            <Users size={15} />
            Community Voices & Blogs
            <span className="bg-emerald-300 w-6 sm:w-8 h-px" />
          </div>

          

          
        </div>

        {/* First row — 3 cards */}
        <div className="gap-5 sm:gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-8 sm:mt-10">
          {firstRow.map((voice, i) => (
            <VoiceCard key={voice.id} voice={voice} colorIndex={i} />
          ))}
        </div>

        {/* Second row — 2 cards, centered to match first row's width */}
        <div className="gap-5 sm:gap-6 grid grid-cols-1 sm:grid-cols-2 mx-auto mt-5 sm:mt-6 max-w-full lg:max-w-[calc(66.6667%+0.75rem)]">
          {secondRow.map((voice, i) => (
            <VoiceCard key={voice.id} voice={voice} colorIndex={i + 3} />
          ))}
        </div>
 </div>
    </section>
  );
};

export default Blogs;
