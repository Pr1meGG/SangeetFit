import { Shirt, Cpu, Zap } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="glass sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
            <Shirt className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg gradient-text">SangeetFit</h1>
            <p className="text-xs text-gray-500">Indian Wedding Styling · YouCam API</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span className="flex items-center gap-1"><Cpu className="w-3 h-3" /> API Ready</span>
          <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> Mock Mode</span>
        </div>
      </div>
    </nav>
  );
}
