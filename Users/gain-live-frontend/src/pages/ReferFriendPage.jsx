import { useState, useEffect } from "react";
import { getReferralInfo, isLoggedIn } from "../services/api";

const ReferFriendPage = () => {
  const [data, setData] = useState(null);
  const [copied, setCopied] = useState(false);
  const loggedIn = isLoggedIn();

  useEffect(() => {
    if (loggedIn) {
      getReferralInfo()
        .then((d) => setData(d))
        .catch(() => {});
    }
  }, [loggedIn]);

  const copyCode = () => {
    if (data?.referralCode) {
      navigator.clipboard.writeText(data.referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!loggedIn) {
    return (
      <main className="pt-24 pb-32 px-4 text-center">
        <p className="text-on-surface-variant text-sm mt-20">Please login to access referral program.</p>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-32 px-4">
      <header className="mb-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-primary-container/10 rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined text-primary-container text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            group_add
          </span>
        </div>
        <h1 className="font-headline font-black text-2xl uppercase tracking-tight">
          Refer a <span className="text-primary-container">Friend</span>
        </h1>
        <p className="text-on-surface-variant text-xs mt-2">
          Share your code and earn ৳50 for every friend who joins!
        </p>
      </header>

      {data && (
        <>
          {/* Referral Code Card */}
          <div className="bg-surface-container border border-primary-container/20 rounded-xl p-6 mb-6">
            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Your Referral Code</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-surface-container-high rounded-lg px-4 py-3 text-center">
                <span className="font-headline font-black text-xl text-primary-container tracking-[0.3em]">
                  {data.referralCode || "—"}
                </span>
              </div>
              <button
                onClick={copyCode}
                className="w-12 h-12 bg-primary-container text-on-primary-container rounded-lg flex items-center justify-center active:scale-90 transition-transform"
              >
                <span className="material-symbols-outlined">
                  {copied ? "check" : "content_copy"}
                </span>
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="bg-surface-container border border-outline-variant/10 rounded-lg p-4 text-center">
              <p className="font-headline font-black text-xl text-on-surface">{data.totalReferrals || 0}</p>
              <p className="text-[9px] uppercase tracking-widest text-on-surface-variant mt-1">Friends</p>
            </div>
            <div className="bg-surface-container border border-outline-variant/10 rounded-lg p-4 text-center">
              <p className="font-headline font-black text-xl text-primary-container">
                ৳{data.totalEarnings || 0}
              </p>
              <p className="text-[9px] uppercase tracking-widest text-on-surface-variant mt-1">Earned</p>
            </div>
            <div className="bg-surface-container border border-outline-variant/10 rounded-lg p-4 text-center">
              <p className="font-headline font-black text-xl text-tertiary-fixed-dim">৳50</p>
              <p className="text-[9px] uppercase tracking-widest text-on-surface-variant mt-1">Per Refer</p>
            </div>
          </div>

          {/* How it works */}
          <div className="mb-8">
            <h3 className="font-headline font-bold text-sm uppercase tracking-widest text-primary-container mb-4">
              How It Works
            </h3>
            <div className="space-y-3">
              {[
                { icon: "share", text: "Share your referral code with friends" },
                { icon: "person_add", text: "Your friend signs up using your code" },
                { icon: "payments", text: "You both get ৳50 bonus credited" },
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-3 bg-surface-container-high rounded-lg p-3">
                  <div className="w-8 h-8 bg-primary-container/10 rounded-full flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary-container text-sm">{step.icon}</span>
                  </div>
                  <p className="text-xs text-on-surface">{step.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Referral List */}
          {data.referrals?.length > 0 && (
            <div>
              <h3 className="font-headline font-bold text-sm uppercase tracking-widest text-primary-container mb-4">
                Your Referrals
              </h3>
              <div className="space-y-2">
                {data.referrals.map((r, i) => (
                  <div key={i} className="flex items-center justify-between bg-surface-container rounded-lg p-3">
                    <div>
                      <p className="text-sm font-semibold text-on-surface">{r.referred?.username || "User"}</p>
                      <p className="text-[10px] text-on-surface-variant">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`text-xs font-bold ${r.rewardClaimed ? "text-green-400" : "text-yellow-400"}`}>
                      {r.rewardClaimed ? "৳50 Earned" : "Pending"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default ReferFriendPage;
