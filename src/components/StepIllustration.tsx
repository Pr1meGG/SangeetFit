export default function StepIllustration({ variant }: { variant: "wardrobe" | "mirror" | "plan" }) {
  return <svg className="sf-step-illustration" data-illustration={variant} viewBox="0 0 180 128" width={180} height={128} fill="none" aria-hidden="true" focusable="false">
    <ellipse cx="90" cy="115" rx="64" ry="6" fill="#eaded6" />
    {variant === "wardrobe" ? <>
      <path d="M35 112V26a6 6 0 0 1 6-6h98a6 6 0 0 1 6 6v86M27 113h16m94 0h16" stroke="#b89b65" strokeWidth="2.5" strokeLinecap="round" />
      <g className="sf-illustration-sway">
        <path d="M57 31c0-8 12-8 12-1 0 4-6 4-6 9l-19 9h38l-19-9" stroke="#997b65" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="m48 48-8 13 9 7 6-8v35h25V60l6 8 9-7-8-13-12-5c-3 8-12 8-15 0Z" fill="#d6dfcb" stroke="#80917b" strokeWidth="1.7" strokeLinejoin="round" />
      </g>
      <g className="sf-illustration-float">
        <path d="M108 30c0-8 12-8 12-1 0 4-6 4-6 9l-19 10h38l-19-10" stroke="#997b65" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="m103 45-6 15 8 8-14 35c15 7 31 7 46 0l-14-35 8-8-6-15-6-2c-2 7-8 7-10 0Z" fill="#6b1e3a" stroke="#6b1e3a" strokeWidth="1.7" strokeLinejoin="round" />
        <path d="M105 68h18m-27 30c11 5 25 5 36 0" stroke="#ebc879" strokeWidth="2" strokeLinecap="round" />
      </g>
      <path className="sf-illustration-spark" d="m151 36 2-6 2 6 6 2-6 2-2 6-2-6-6-2Z" fill="#d6ac51" />
    </> : variant === "mirror" ? <>
      <path d="M112 111h34m-17-13v13" stroke="#b89b65" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="104" y="14" width="53" height="87" rx="26.5" fill="#f9f3e8" stroke="#b89b65" strokeWidth="2.5" />
      <path d="m114 47 29-20m-28 31 16-11" stroke="#eadcc6" strokeWidth="3" strokeLinecap="round" />
      <g className="sf-illustration-sway">
        <circle cx="66" cy="33" r="11" fill="#dfb799" />
        <path d="M55 31c-1-15 24-18 23 1-5-1-10-6-11-10-3 6-7 9-12 9" fill="#49323b" />
        <path d="m53 50-11 25m37-25 11 25" stroke="#dfb799" strokeWidth="6" strokeLinecap="round" />
        <path d="m55 46-6 14 9 14-13 34h43L75 74l9-14-7-14-7-2c-2 6-6 6-8 0Z" fill="#6b1e3a" />
        <path d="M58 74h17m-25 28h33" stroke="#ebc879" strokeWidth="2.5" strokeLinecap="round" />
      </g>
      <g className="sf-illustration-spark" fill="#d6ac51"><path d="m100 43 3-9 3 9 9 3-9 3-3 9-3-9-9-3Z" /><path d="m147 77 2-6 2 6 6 2-6 2-2 6-2-6-6-2Z" /></g>
      <path className="sf-illustration-float" d="M30 43c-8-9-17 3-2 12l2 1 2-1c15-9 6-21-2-12Z" fill="#d9a8b2" />
    </> : <>
      <g className="sf-illustration-sway"><rect x="30" y="39" width="47" height="65" rx="6" transform="rotate(-12 30 39)" fill="#dce3d3" stroke="#9ba88d" strokeWidth="1.7" /><path d="m45 61 13-3m-10 15 13-3m-10 15 13-3" stroke="#9ba88d" strokeWidth="2" strokeLinecap="round" /></g>
      <g className="sf-illustration-float"><rect x="111" y="32" width="43" height="66" rx="6" transform="rotate(12 111 32)" fill="#f0dfb9" stroke="#c6a66c" strokeWidth="1.7" /><path d="m119 54 16 3m-19 10 16 3m-19 10 16 3" stroke="#c6a66c" strokeWidth="2" strokeLinecap="round" /></g>
      <rect x="59" y="22" width="65" height="88" rx="8" fill="#fffaf2" stroke="#6b1e3a" strokeWidth="2" />
      <path d="M59 44h65M74 17v12m34-12v12" stroke="#6b1e3a" strokeWidth="2.5" strokeLinecap="round" />
      <g fill="#d5c3b7"><circle cx="74" cy="58" r="3" /><circle cx="91" cy="58" r="3" /><circle cx="108" cy="58" r="3" /><circle cx="74" cy="74" r="3" /><circle cx="91" cy="74" r="3" /></g>
      <path className="sf-illustration-check" d="m100 73 5 5 9-11" stroke="#73856a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path className="sf-illustration-spark" d="M90 88c-8-9-17 3-2 12l2 1 2-1c15-9 6-21-2-12Z" fill="#6b1e3a" />
      <path className="sf-illustration-spark" d="m143 16 2-6 2 6 6 2-6 2-2 6-2-6-6-2Z" fill="#d6ac51" />
    </>}
  </svg>;
}
