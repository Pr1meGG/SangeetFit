"use client";

import { useState, useCallback } from "react";
import { Share2, X, MessageCircle, Users, CheckCircle } from "lucide-react";
import type { Occasion } from "@/data/outfits";
import type { SessionOutfit } from "@/lib/session";

interface FamilyShareProps {
  occasion: Occasion;
  outfit: SessionOutfit | null;
  shortlist?: SessionOutfit[];
}

interface FamilyMember {
  name: string;
  role: string; // e.g., "Bride", "Groom", "Mother of Bride", etc.
  assigned: Map<string, boolean>; // outfitId -> boolean
}

export default function FamilyShare({ occasion, outfit, shortlist }: FamilyShareProps) {
  const [isSharing, setIsSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [memberName, setMemberName] = useState("");
  const [memberRole, setMemberRole] = useState("");
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [copied, setCopied] = useState(false);

  const createShareUrl = useCallback(() => {
    let url = `${window.location.origin}/?step=3&occasion=${encodeURIComponent(occasion)}`;
    if (outfit && outfit.origin !== "upload") {
      url += `&vto=${encodeURIComponent(outfit.id)}`;
    }
    if (shortlist?.length) {
      url += `&shortlist=${shortlist.map(o => encodeURIComponent(o.id)).join(",")}`;
    }
    return url;
  }, [occasion, outfit, shortlist]);

  const handleShare = useCallback(async () => {
    setIsSharing(true);
    try {
      const url = createShareUrl();
      setShareUrl(url);
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard write failed - url is still available
    } finally {
      setIsSharing(false);
    }
  }, [createShareUrl]);

  const handleInvite = useCallback(() => {
    if (!memberName || !memberRole) return;
    const newMember: FamilyMember = {
      name: memberName,
      role: memberRole,
      assigned: new Map()
    };
    setMembers(prev => [...prev, newMember]);
    setMemberName("");
    setMemberRole("");
    setShowInvite(false);
  }, [memberName, memberRole]);

  const handleWhatsApp = useCallback(() => {
    const url = createShareUrl();
    const text = `I found some amazing outfits for ${occasion}! Check these out and let me know what you think: ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  }, [createShareUrl, occasion]);

  if (!isSharing && !showInvite) {
    return (
      <div className="sf-family-share">
        <button
          className="sf-button sf-button-secondary"
          onClick={() => setIsSharing(true)}
          disabled={!outfit || outfit.origin === "upload"}
        >
          <Share2 size={17} />Share with family
        </button>
      </div>
    );
  }

  if (showInvite) {
    return (
      <div className="sf-family-invite">
        <h4>Invite family member</h4>
        <div className="sf-invite-form">
          <input
            type="text"
            placeholder="Name"
            value={memberName}
            onChange={e => setMemberName(e.target.value)}
            className="sf-input"
          />
          <input
            type="text"
            placeholder="Role (e.g., Bride, Mother)"
            value={memberRole}
            onChange={e => setMemberRole(e.target.value)}
            className="sf-input"
          />
          <button onClick={handleInvite} className="sf-button sf-button-primary">
            Add member
          </button>
          <button onClick={() => setShowInvite(false)} className="sf-icon-button">
            <X size={16} />
          </button>
        </div>
        {members.length > 0 && (
          <div className="sf-members-list">
            {members.map((m, i) => (
              <div key={i} className="sf-member">
                <Users size={14} />
                <span>{m.name} — {m.role}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="sf-family-share-panel">
      <div className="sf-family-header">
        <h4>Share your plan with family</h4>
        <button onClick={() => setIsSharing(false)} className="sf-icon-button">
          <X size={16} />
        </button>
      </div>

      <div className="sf-family-content">
        {shareUrl && (
          <div className="sf-share-link">
            <p>Share link copied!</p>
            <p className="sf-share-note">Family members can open this link to view your outfit selection.</p>
          </div>
        )}

        <div className="sf-family-actions">
          <button
            className="sf-button sf-button-primary"
            onClick={handleShare}
            disabled={isSharing}
          >
            {isSharing ? <CheckCircle size={17} className="animate-spin" /> : <Share2 size={17} />}
            {copied ? "Link Copied!" : "Copy Link"}
          </button>
          <button className="sf-button sf-button-secondary" onClick={handleWhatsApp}>
            <MessageCircle size={17} />WhatsApp
          </button>
          <button className="sf-text-link" onClick={() => setShowInvite(true)}>
            <Users size={14} />Invite family
          </button>
        </div>

        {members.length > 0 && (
          <div className="sf-members-section">
            <h5>Invited family</h5>
            <ul>
              {members.map((m, i) => (
                <li key={i}>
                  <span className="sf-member-badge">{m.role}</span>
                  <span>{m.name}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
