import { useEffect, useRef, useState } from "react";
import { Music, Upload, Play, Pause, Volume2, VolumeX, X } from "lucide-react";

export default function MusicPlayer() {
  const [track, setTrack] = useState(null); // { name, url }
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [progress, setProgress] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const audioRef = useRef(null);
  const inputRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (track) URL.revokeObjectURL(track.url);
    setTrack({ name: file.name.replace(/\.[^/.]+$/, ""), url });
    setPlaying(false);
    setProgress(0);
  };

  useEffect(() => {
    if (!audioRef.current || !track) return;
    audioRef.current.src = track.url;
    audioRef.current.volume = volume;
    audioRef.current.play();
    setPlaying(true);
  }, [track]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = muted ? 0 : volume;
  }, [volume, muted]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) { audioRef.current.pause(); setPlaying(false); }
    else { audioRef.current.play(); setPlaying(true); }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const pct = (audioRef.current.currentTime / audioRef.current.duration) * 100;
    setProgress(isNaN(pct) ? 0 : pct);
  };

  const handleSeek = (e) => {
    if (!audioRef.current) return;
    const pct = e.target.value / 100;
    audioRef.current.currentTime = audioRef.current.duration * pct;
    setProgress(e.target.value);
  };

  const removeTrack = () => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ""; }
    if (track) URL.revokeObjectURL(track.url);
    setTrack(null);
    setPlaying(false);
    setProgress(0);
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 8,
      }}
    >
      <audio ref={audioRef} loop onTimeUpdate={handleTimeUpdate} onEnded={() => setPlaying(false)} />

      {/* Expanded panel */}
      {expanded && (
        <div
          style={{
            background: "rgba(0,0,15,0.92)",
            border: "1px solid rgba(0,255,204,0.25)",
            borderRadius: 16,
            padding: "16px 18px",
            width: 280,
            backdropFilter: "blur(20px)",
            boxShadow: "0 0 40px rgba(0,255,204,0.1)",
          }}
        >
          {/* Track info */}
          {track ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <div style={{ flex: 1, overflow: "hidden" }}>
                <div style={{ color: "#00ffcc", fontSize: 11, fontFamily: "monospace", letterSpacing: "0.1em", textTransform: "uppercase", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {track.name}
                </div>
              </div>
              <button onClick={removeTrack} style={{ color: "rgba(255,255,255,0.3)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, fontFamily: "monospace", marginBottom: 12, textAlign: "center" }}>
              No track loaded
            </div>
          )}

          {/* Progress bar */}
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleSeek}
            disabled={!track}
            style={{ width: "100%", accentColor: "#00ffcc", marginBottom: 10, cursor: track ? "pointer" : "default" }}
          />

          {/* Controls row */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              onClick={togglePlay}
              disabled={!track}
              style={{
                background: track ? "rgba(0,255,204,0.15)" : "rgba(255,255,255,0.05)",
                border: `1px solid ${track ? "#00ffcc" : "rgba(255,255,255,0.1)"}`,
                borderRadius: "50%",
                width: 36,
                height: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: track ? "pointer" : "default",
                color: track ? "#00ffcc" : "rgba(255,255,255,0.2)",
                boxShadow: playing ? "0 0 16px rgba(0,255,204,0.4)" : "none",
              }}
            >
              {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setMuted(!muted)}
              style={{ background: "none", border: "none", cursor: "pointer", color: muted ? "#ff4466" : "rgba(255,255,255,0.4)", padding: 4 }}
            >
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={muted ? 0 : volume}
              onChange={(e) => { setMuted(false); setVolume(parseFloat(e.target.value)); }}
              style={{ flex: 1, accentColor: "#00ffcc", cursor: "pointer" }}
            />

            {/* Upload */}
            <button
              onClick={() => inputRef.current.click()}
              style={{
                background: "rgba(191,0,255,0.15)",
                border: "1px solid rgba(191,0,255,0.5)",
                borderRadius: 8,
                padding: "4px 10px",
                display: "flex",
                alignItems: "center",
                gap: 4,
                cursor: "pointer",
                color: "#bf00ff",
                fontSize: 10,
                fontFamily: "monospace",
                letterSpacing: "0.1em",
              }}
            >
              <Upload className="w-3 h-3" />
              {track ? "SWAP" : "LOAD"}
            </button>
            <input ref={inputRef} type="file" accept="audio/*" onChange={handleFile} style={{ display: "none" }} />
          </div>
        </div>
      )}

      {/* Floating pill button */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          background: playing ? "rgba(0,255,204,0.15)" : "rgba(0,0,15,0.85)",
          border: `1px solid ${playing ? "#00ffcc" : "rgba(255,255,255,0.15)"}`,
          borderRadius: 40,
          padding: "10px 18px",
          display: "flex",
          alignItems: "center",
          gap: 8,
          cursor: "pointer",
          backdropFilter: "blur(16px)",
          boxShadow: playing ? "0 0 24px rgba(0,255,204,0.3)" : "none",
          transition: "all 0.3s",
        }}
      >
        <Music className="w-4 h-4" style={{ color: playing ? "#00ffcc" : "rgba(255,255,255,0.4)" }} />
        <span style={{ color: playing ? "#00ffcc" : "rgba(255,255,255,0.4)", fontSize: 11, fontFamily: "monospace", letterSpacing: "0.15em" }}>
          {playing ? track?.name?.slice(0, 16) + (track?.name?.length > 16 ? "…" : "") : "MUSIC"}
        </span>
        {playing && (
          <span style={{ display: "flex", gap: 2 }}>
            {[1, 2, 3].map(i => (
              <span key={i} style={{
                width: 2, borderRadius: 2, background: "#00ffcc",
                animation: `musicBar${i} 0.6s ease-in-out infinite alternate`,
                height: 8 + i * 3,
              }} />
            ))}
          </span>
        )}
      </button>

      <style>{`
        @keyframes musicBar1 { from { transform: scaleY(0.3); } to { transform: scaleY(1); } }
        @keyframes musicBar2 { from { transform: scaleY(1); } to { transform: scaleY(0.3); } }
        @keyframes musicBar3 { from { transform: scaleY(0.5); } to { transform: scaleY(1); } }
      `}</style>
    </div>
  );
}