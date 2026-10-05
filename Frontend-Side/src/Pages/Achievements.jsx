import React from "react";
import {
  Trophy,
  Award,
  Star,
  Users,
  Heart,
  Leaf,
  ShieldCheck,
  Medal,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
  Target,
} from "lucide-react";

const Achievement = () => {
  const achievements = [
    {
      title: "Green Community",
      description:
        "Our residents planted more than 500 trees and plants this year.",
      icon: Leaf,
      progress: 100,
      status: "Completed",
      category: "Environment",
    },
    {
      title: "Community Champion",
      description:
        "More than 250 residents actively participated in community activities.",
      icon: Users,
      progress: 84,
      status: "In Progress",
      category: "Participation",
    },
    {
      title: "Safe Community",
      description:
        "Completed safety awareness and emergency preparedness activities.",
      icon: ShieldCheck,
      progress: 100,
      status: "Completed",
      category: "Safety",
    },
    {
      title: "Helping Hands",
      description:
        "Residents volunteered more than 1,000 hours for community activities.",
      icon: Heart,
      progress: 72,
      status: "In Progress",
      category: "Volunteering",
    },
  ];

  const members = [
    {
      name: "Rahul Sharma",
      role: "Community Volunteer",
      points: "1,840",
      badge: "Community Hero",
      initial: "R",
    },
    {
      name: "Ananya Verma",
      role: "Event Coordinator",
      points: "1,620",
      badge: "Event Star",
      initial: "A",
    },
    {
      name: "Aman Gupta",
      role: "Environment Volunteer",
      points: "1,430",
      badge: "Green Champion",
      initial: "A",
    },
  ];

  return (
    <div className="bg-slate-50 p-4 sm:p-6 lg:p-8 min-h-screen">

      {/* ================= HEADER ================= */}
      <div className="mb-8 animate-[fadeIn_.5s_ease-out]">
        <div className="flex sm:flex-row flex-col sm:justify-between sm:items-end gap-4">

          <div>
            <div className="flex items-center gap-2 mb-2 font-semibold text-emerald-600 text-sm">
              <Sparkles size={16} />
              Community Recognition
            </div>

            <h1 className="font-bold text-slate-900 text-2xl sm:text-3xl tracking-tight">
              Achievements
            </h1>

            <p className="mt-2 max-w-2xl text-slate-500 text-sm leading-6">
              Celebrate the people, milestones, and achievements that make
              our community stronger.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white shadow-sm px-4 py-3 border border-emerald-100 rounded-2xl">
            <div className="bg-emerald-50 p-2.5 rounded-xl text-emerald-600">
              <Trophy size={20} />
            </div>

            <div>
              <p className="text-slate-400 text-xs">
                Community Points
              </p>

              <p className="font-bold text-slate-900 text-lg">
                12,840
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* ================= HERO ================= */}
      <div className="relative bg-emerald-600 shadow-lg mb-6 p-6 sm:p-8 rounded-3xl overflow-hidden text-white">

        <div className="-top-20 -right-16 absolute bg-white/10 rounded-full w-64 h-64" />
        <div className="-bottom-24 -left-10 absolute bg-white/10 rounded-full w-64 h-64" />

        <div className="relative lg:items-center gap-8 grid grid-cols-1 lg:grid-cols-3">

          <div className="lg:col-span-2">

            <div className="flex justify-center items-center bg-white/15 mb-4 rounded-2xl w-12 h-12">
              <Trophy size={25} />
            </div>

            <h2 className="max-w-xl font-bold text-2xl sm:text-3xl leading-tight">
              Every contribution creates a stronger community.
            </h2>

            <p className="mt-3 max-w-2xl text-emerald-50 text-sm leading-6">
              From volunteering and environmental activities to community
              events, every effort deserves recognition.
            </p>

            <button className="flex items-center gap-2 bg-white shadow-sm hover:shadow-lg mt-6 px-4 py-2.5 rounded-xl font-semibold text-emerald-700 text-sm transition-all hover:-translate-y-0.5 duration-300">
              View Leaderboard
              <ArrowUpRight size={16} />
            </button>

          </div>

          <div className="hidden lg:flex justify-center">
            <div className="flex justify-center items-center bg-white/10 border border-white/20 rounded-full w-44 h-44">
              <div className="flex justify-center items-center bg-white/10 border border-white/20 rounded-full w-32 h-32">
                <Trophy
                  size={65}
                  strokeWidth={1.5}
                  className="animate-bounce"
                />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ================= STATS ================= */}
      <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 mb-6">

        <div className="group bg-white shadow-sm hover:shadow-lg p-5 border border-slate-200 rounded-2xl transition-all hover:-translate-y-1 duration-300">
          <div className="flex justify-between items-center">
            <div className="bg-amber-50 p-3 rounded-xl text-amber-600">
              <Award size={21} />
            </div>

            <span className="font-semibold text-emerald-600 text-xs">
              +12%
            </span>
          </div>

          <p className="mt-5 text-slate-500 text-sm">
            Achievements Earned
          </p>

          <p className="mt-1 font-bold text-slate-900 text-2xl">
            24
          </p>
        </div>

        <div className="group bg-white shadow-sm hover:shadow-lg p-5 border border-slate-200 rounded-2xl transition-all hover:-translate-y-1 duration-300">
          <div className="bg-purple-50 p-3 rounded-xl w-fit text-purple-600">
            <Medal size={21} />
          </div>

          <p className="mt-5 text-slate-500 text-sm">
            Badges Unlocked
          </p>

          <p className="mt-1 font-bold text-slate-900 text-2xl">
            18
          </p>
        </div>

        <div className="group bg-white shadow-sm hover:shadow-lg p-5 border border-slate-200 rounded-2xl transition-all hover:-translate-y-1 duration-300">
          <div className="bg-blue-50 p-3 rounded-xl w-fit text-blue-600">
            <Users size={21} />
          </div>

          <p className="mt-5 text-slate-500 text-sm">
            Active Contributors
          </p>

          <p className="mt-1 font-bold text-slate-900 text-2xl">
            156
          </p>
        </div>

        <div className="group bg-white shadow-sm hover:shadow-lg p-5 border border-slate-200 rounded-2xl transition-all hover:-translate-y-1 duration-300">
          <div className="bg-rose-50 p-3 rounded-xl w-fit text-rose-600">
            <Heart size={21} />
          </div>

          <p className="mt-5 text-slate-500 text-sm">
            Volunteer Hours
          </p>

          <p className="mt-1 font-bold text-slate-900 text-2xl">
            1,284
          </p>
        </div>

      </div>

      {/* ================= ACHIEVEMENTS ================= */}
      <div className="gap-6 grid grid-cols-1 xl:grid-cols-3">

        <div className="xl:col-span-2 bg-white shadow-sm p-5 sm:p-6 border border-slate-200 rounded-2xl">

          <div className="flex justify-between items-center mb-6">

            <div>
              <h2 className="font-bold text-slate-900 text-lg">
                Community Milestones
              </h2>

              <p className="mt-1 text-slate-500 text-sm">
                Track the progress of community goals.
              </p>
            </div>

            <Target
              size={21}
              className="text-emerald-600"
            />

          </div>

          <div className="space-y-4">

            {achievements.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="group hover:bg-emerald-50/40 hover:shadow-sm p-4 border border-slate-100 hover:border-emerald-100 rounded-2xl transition-all hover:-translate-y-0.5 duration-300"
                  style={{
                    animation: `slideUp .45s ease-out ${index * 0.08}s both`,
                  }}
                >

                  <div className="flex gap-4">

                    <div className="flex justify-center items-center bg-emerald-50 rounded-xl w-11 h-11 text-emerald-600 group-hover:scale-110 transition-transform duration-300 shrink-0">
                      <Icon size={21} />
                    </div>

                    <div className="flex-1 min-w-0">

                      <div className="flex sm:flex-row flex-col sm:justify-between sm:items-start gap-2">

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-bold text-slate-800 text-sm">
                              {item.title}
                            </h3>

                            {item.status === "Completed" ? (
                              <span className="flex items-center gap-1 bg-emerald-100 px-2 py-1 rounded-full font-bold text-[10px] text-emerald-700">
                                <CheckCircle2 size={11} />
                                Completed
                              </span>
                            ) : (
                              <span className="bg-amber-100 px-2 py-1 rounded-full font-bold text-[10px] text-amber-700">
                                In Progress
                              </span>
                            )}
                          </div>

                          <p className="mt-1 text-slate-500 text-xs leading-5">
                            {item.description}
                          </p>
                        </div>

                        <span className="font-bold text-slate-500 text-xs">
                          {item.progress}%
                        </span>

                      </div>

                      <div className="bg-slate-100 mt-4 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-emerald-500 rounded-full h-full transition-all duration-1000"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>

                      <div className="flex justify-between mt-2 text-[10px] text-slate-400">
                        <span>{item.category}</span>
                        <span>
                          {item.progress === 100
                            ? "Goal achieved"
                            : "Keep going"}
                        </span>
                      </div>

                    </div>
                  </div>
                </div>
              );
            })}

          </div>
        </div>

        {/* ================= TOP CONTRIBUTORS ================= */}
        <div className="bg-white shadow-sm p-5 sm:p-6 border border-slate-200 rounded-2xl">

          <div className="flex justify-between items-center mb-6">

            <div>
              <h2 className="font-bold text-slate-900 text-lg">
                Top Contributors
              </h2>

              <p className="mt-1 text-slate-500 text-sm">
                This month's community heroes
              </p>
            </div>

            <Star
              size={21}
              className="fill-amber-400 text-amber-400"
            />

          </div>

          <div className="space-y-4">

            {members.map((member, index) => (
              <div
                key={member.name}
                className="group flex items-center gap-3 hover:bg-emerald-50 p-3 border border-slate-100 hover:border-emerald-100 rounded-xl transition-all duration-300"
              >

                <div className="relative">

                  <div className="flex justify-center items-center bg-emerald-100 rounded-full w-11 h-11 font-bold text-emerald-700">
                    {member.initial}
                  </div>

                  <span className="-right-1 -bottom-1 absolute flex justify-center items-center bg-amber-400 border-2 border-white rounded-full w-5 h-5 font-bold text-[9px] text-white">
                    {index + 1}
                  </span>

                </div>

                <div className="flex-1 min-w-0">

                  <p className="font-bold text-slate-800 text-sm truncate">
                    {member.name}
                  </p>

                  <p className="text-[11px] text-slate-400 truncate">
                    {member.role}
                  </p>

                  <span className="inline-block bg-slate-100 mt-1 px-2 py-0.5 rounded-full font-semibold text-[9px] text-slate-500">
                    {member.badge}
                  </span>

                </div>

                <div className="text-right">
                  <p className="font-bold text-emerald-600 text-sm">
                    {member.points}
                  </p>

                  <p className="text-[10px] text-slate-400">
                    points
                  </p>
                </div>

              </div>
            ))}

          </div>

          <button className="flex justify-center items-center gap-2 hover:bg-emerald-50 mt-5 py-2.5 border border-slate-200 hover:border-emerald-200 rounded-xl w-full font-semibold text-slate-600 hover:text-emerald-700 text-xs transition-all duration-300">
            View All Contributors
            <ArrowUpRight size={14} />
          </button>

        </div>
      </div>

      {/* ================= BADGES ================= */}
      <div className="bg-white shadow-sm mt-6 p-5 sm:p-6 border border-slate-200 rounded-2xl">

        <div className="mb-6">
          <h2 className="font-bold text-slate-900 text-lg">
            Community Badges
          </h2>

          <p className="mt-1 text-slate-500 text-sm">
            Recognition earned through meaningful contributions.
          </p>
        </div>

        <div className="gap-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">

          {[
            {
              icon: Heart,
              name: "Helper",
              count: "248 earned",
            },
            {
              icon: Leaf,
              name: "Eco Warrior",
              count: "126 earned",
            },
            {
              icon: Users,
              name: "Team Player",
              count: "184 earned",
            },
            {
              icon: Star,
              name: "Community Star",
              count: "96 earned",
            },
            {
              icon: ShieldCheck,
              name: "Safety First",
              count: "74 earned",
            },
            {
              icon: Trophy,
              name: "Champion",
              count: "32 earned",
            },
          ].map((badge, index) => {
            const Icon = badge.icon;

            return (
              <div
                key={badge.name}
                className="group flex flex-col items-center hover:bg-emerald-50 hover:shadow-md p-4 border border-slate-100 hover:border-emerald-100 rounded-2xl text-center transition-all hover:-translate-y-1 duration-300"
                style={{
                  animation: `fadeIn .5s ease-out ${index * 0.06}s both`,
                }}
              >

                <div className="flex justify-center items-center bg-emerald-50 rounded-full w-14 h-14 text-emerald-600 group-hover:rotate-6 group-hover:scale-110 transition-all duration-300">
                  <Icon size={25} />
                </div>

                <p className="mt-3 font-bold text-slate-800 text-xs">
                  {badge.name}
                </p>

                <p className="mt-1 text-[10px] text-slate-400">
                  {badge.count}
                </p>

              </div>
            );
          })}

        </div>
      </div>

      {/* ================= CSS ANIMATIONS ================= */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

    </div>
  );
};

export default Achievement;
