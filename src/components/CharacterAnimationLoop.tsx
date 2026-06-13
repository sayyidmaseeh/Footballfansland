import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Volume2, VolumeX, RefreshCw, Sparkles, HelpCircle } from 'lucide-react';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
}

export default function CharacterAnimationLoop() {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [activeCharacter, setActiveCharacter] = useState<'brazil' | 'argentina'>('brazil');
  const [animationPhase, setAnimationPhase] = useState<'enter' | 'skills' | 'kick' | 'screen_out'>('enter');
  
  // Physics states for ball
  const [ballPos, setBallPos] = useState({ x: 0, y: 0, scale: 1, rotate: 0, opacity: 1, blur: 0 });
  const [leftLegRotation, setLeftLegRotation] = useState<number>(0);
  const [rightLegRotation, setRightLegRotation] = useState<number>(0);
  const [characterRotation, setCharacterRotation] = useState<number>(0);
  const [characterY, setCharacterY] = useState<number>(0);
  const [armRotation, setArmRotation] = useState<number>(0);
  const [headY, setHeadY] = useState<number>(0);

  // FX states
  const [isScreenShaking, setIsScreenShaking] = useState<boolean>(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showGoalFlash, setShowGoalFlash] = useState<boolean>(false);
  const [skillsCounter, setSkillsCounter] = useState<number>(0);
  
  // Sound synthesizer using Web Audio API
  const audioCtxRef = useRef<AudioContext | null>(null);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const playSynthesizedSfx = (type: 'kick' | 'cheer' | 'whoosh' | 'whistle') => {
    if (isMuted) return;
    try {
      initAudio();
      const ctx = audioCtxRef.current;
      if (!ctx) return;

      const dest = ctx.destination;

      if (type === 'kick') {
        // Synthesis of soccer ball kick: low punch oscillator + high click pitch
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(dest);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.15);

        gain.gain.setValueAtTime(0.8, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

        osc.start();
        osc.stop(ctx.currentTime + 0.18);

        // Click element
        const clickOsc = ctx.createOscillator();
        const clickGain = ctx.createGain();
        clickOsc.connect(clickGain);
        clickGain.connect(dest);
        clickOsc.type = 'sine';
        clickOsc.frequency.setValueAtTime(800, ctx.currentTime);
        clickOsc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.03);
        clickGain.gain.setValueAtTime(0.4, ctx.currentTime);
        clickGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.03);
        clickOsc.start();
        clickOsc.stop(ctx.currentTime + 0.04);
      } 
      else if (type === 'whoosh') {
        // Wind sweep whoosh sound
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(dest);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(100, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(450, ctx.currentTime + 0.35);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(300, ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.35);

        gain.gain.setValueAtTime(0.01, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

        osc.start();
        osc.stop(ctx.currentTime + 0.45);
      } 
      else if (type === 'whistle') {
        const osc = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        osc2.connect(gain);
        gain.connect(dest);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(1800, ctx.currentTime);
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(1815, ctx.currentTime);

        gain.gain.setValueAtTime(0.01, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.05);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.25);

        osc.start();
        osc2.start();
        osc.stop(ctx.currentTime + 0.28);
        osc2.stop(ctx.currentTime + 0.28);
      }
      else if (type === 'cheer') {
        // Simulate a crowd roar using bandpass filtered white noise
        const bufferSize = ctx.sampleRate * 1.5; // 1.5 seconds roar
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const noiseNode = ctx.createBufferSource();
        noiseNode.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(350, ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.4);
        filter.Q.value = 1.2;

        const gainObj = ctx.createGain();
        noiseNode.connect(filter);
        filter.connect(gainObj);
        gainObj.connect(dest);

        gainObj.gain.setValueAtTime(0.01, ctx.currentTime);
        gainObj.gain.linearRampToValueAtTime(0.35, ctx.currentTime + 0.3);
        gainObj.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.4);

        noiseNode.start();
        noiseNode.stop(ctx.currentTime + 1.5);
      }
    } catch (err) {
      console.warn("Web Audio API not allowed or failed to play synthesized audio:", err);
    }
  };

  // Spark / Turf particle generator
  const createExplosionParticles = (x: number, y: number, color: string) => {
    const arr: Particle[] = [];
    for (let i = 0; i < 24; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 8;
      arr.push({
        id: Math.random() + i,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2, // slightly upward gravity influence
        size: 2 + Math.random() * 4,
        color,
        alpha: 1
      });
    }
    setParticles(prev => [...prev].concat(arr));
  };

  // Run particle updating frame loop
  useEffect(() => {
    if (particles.length === 0) return;
    const interval = setInterval(() => {
      setParticles(prev => 
        prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.25, // gravity pulls particles downwards
            alpha: p.alpha - 0.04
          }))
          .filter(p => p.alpha > 0)
      );
    }, 16);
    return () => clearInterval(interval);
  }, [particles]);

  const toggleMute = () => {
    setIsMuted(prev => {
      const next = !prev;
      if (!next) {
        // play a warm welcoming whistle
        setTimeout(() => playSynthesizedSfx('whistle'), 100);
      }
      return next;
    });
  };

  const handleManualTrigger = () => {
    setSkillsCounter(0);
    setAnimationPhase('enter');
    setActiveCharacter(prev => prev === 'brazil' ? 'argentina' : 'brazil');
  };

  // State Machine Loop Controller
  useEffect(() => {
    if (!isPlaying) return;

    let pulseTimer: any;
    let frameId: number;
    let timerIndex = 0;

    const tick = () => {
      timerIndex++;
      
      if (animationPhase === 'enter') {
        // Player slides onto pitch, ball drops on player's chest
        setCharacterRotation(0);
        setArmRotation(5);
        setHeadY(0);
        setLeftLegRotation(0);
        setRightLegRotation(0);
        
        const enterProgress = Math.min(timerIndex / 25, 1);
        setCharacterY((1 - enterProgress) * 150); // slide up from bottom
        
        // Ball dropping from the sky
        const ballDropY = -120 + enterProgress * 150;
        setBallPos({
          x: activeCharacter === 'brazil' ? -25 : 25,
          y: ballDropY,
          scale: 1,
          rotate: timerIndex * 15,
          opacity: 1,
          blur: 0
        });

        if (timerIndex >= 25) {
          // Play a soft wind whoosh when ball drops near
          playSynthesizedSfx('whoosh');
          setAnimationPhase('skills');
          setSkillsCounter(0);
          timerIndex = 0;
        }
      } 
      
      else if (animationPhase === 'skills') {
        // Perform beautiful stylized soccer juggling steps
        const bounceCycle = (timerIndex % 20) / 20; // 0 to 1 every 20 frames
        const h = Math.abs(Math.sin(bounceCycle * Math.PI)); // sine wave path
        
        // Character torso bouncing for realism
        setCharacterY(Math.sin(bounceCycle * Math.PI * 2) * 2.5);
        setArmRotation(Math.cos(bounceCycle * Math.PI) * 12);
        setHeadY(Math.sin(bounceCycle * Math.PI) * 1.5);
        
        if (activeCharacter === 'brazil') {
          // Brazil Skills: Juggling on left knee, right foot, and head!
          const skillIndex = Math.floor(skillsCounter / 20) % 3;
          
          if (skillIndex === 0) {
            // Left knee bounce
            setLeftLegRotation(-35 * h);
            setRightLegRotation(0);
            setBallPos({
              x: -25 + Math.sin(bounceCycle * Math.PI) * 5,
              y: 40 - h * 38,
              scale: 0.95,
              rotate: timerIndex * 20,
              opacity: 1,
              blur: 0
            });
            if (timerIndex % 20 === 0) {
              setSkillsCounter(prev => prev + 1);
              playSynthesizedSfx('kick');
              createExplosionParticles(-22, 50, '#eab308'); // yellow grass blast
            }
          } 
          else if (skillIndex === 1) {
            // Right foot bounce
            setLeftLegRotation(0);
            setRightLegRotation(35 * h);
            setBallPos({
              x: 22 - Math.sin(bounceCycle * Math.PI) * 5,
              y: 50 - h * 42,
              scale: 0.95,
              rotate: -timerIndex * 18,
              opacity: 1,
              blur: 0
            });
            if (timerIndex % 20 === 0) {
              setSkillsCounter(prev => prev + 1);
              playSynthesizedSfx('kick');
              createExplosionParticles(20, 58, '#22c55e'); // green turf splash
            }
          } 
          else {
            // Header juggle
            setLeftLegRotation(2);
            setRightLegRotation(-2);
            setBallPos({
              x: 0,
              y: -54 - h * 22,
              scale: 0.95,
              rotate: timerIndex * 10,
              opacity: 1,
              blur: 0
            });
            if (timerIndex % 20 === 0) {
              setSkillsCounter(prev => prev + 1);
              playSynthesizedSfx('kick');
              createExplosionParticles(0, -50, '#3b82f6'); // blue energy speck
            }
          }
        } 
        
        else {
          // Argentina Skills: Chest traps, around the world spin, and heel kicks
          const skillIndex = Math.floor(skillsCounter / 20) % 3;
          
          if (skillIndex === 0) {
            // High juggling overhead
            setCharacterRotation(Math.sin(bounceCycle * Math.PI) * 8);
            setBallPos({
              x: Math.sin(bounceCycle * Math.PI * 2) * 15,
              y: -10 - h * 45,
              scale: 0.95,
              rotate: timerIndex * 22,
              opacity: 1,
              blur: 0
            });
            if (timerIndex % 20 === 0) {
              setSkillsCounter(prev => prev + 1);
              playSynthesizedSfx('kick');
              createExplosionParticles(0, 0, '#ffffff'); // clean white impact
            }
          } 
          else if (skillIndex === 1) {
            // Heel flick up
            setLeftLegRotation(-30 * (1 - h));
            setRightLegRotation(30 * h);
            setBallPos({
              x: -12 + (1 - h) * 15,
              y: 52 - h * 44,
              scale: 0.95,
              rotate: timerIndex * 25,
              opacity: 1,
              blur: 0
            });
            if (timerIndex % 20 === 0) {
              setSkillsCounter(prev => prev + 1);
              playSynthesizedSfx('kick');
              createExplosionParticles(-10, 52, '#38bdf8'); // sky blue blast
            }
          } 
          else {
            // Shoulder/chest roll
            setCharacterRotation(-10 + h * 20);
            setBallPos({
              x: -18 + h * 36,
              y: -28 + Math.sin(bounceCycle * Math.PI) * 8,
              scale: 0.92,
              rotate: timerIndex * 15,
              opacity: 1,
              blur: 0
            });
            if (timerIndex % 20 === 0) {
              setSkillsCounter(prev => prev + 1);
              playSynthesizedSfx('kick');
              createExplosionParticles(15, -20, '#0284c7'); // navy particles
            }
          }
        }

        // Skill juggling lasts about 60 frames (3 full bounces) then player prepares to kick
        if (skillsCounter >= 60) {
          setAnimationPhase('kick');
          timerIndex = 0;
        }
      } 
      
      else if (animationPhase === 'kick') {
        // Player draws leg back, turns torso, and unleashes the kick!
        const windupProgress = Math.min(timerIndex / 16, 1);
        
        if (windupProgress < 0.6) {
          // Drawing leg back, sinking lower
          setCharacterY(4);
          setCharacterRotation(activeCharacter === 'brazil' ? -20 : 20);
          setLeftLegRotation(activeCharacter === 'brazil' ? 45 : -20);
          setRightLegRotation(activeCharacter === 'brazil' ? -20 : 45);
          setBallPos(prev => ({
            ...prev,
            x: activeCharacter === 'brazil' ? -35 : 35,
            y: 42,
            scale: 0.92
          }));
        } 
        else {
          // Kicking leg snaps forward at high speed
          setCharacterRotation(activeCharacter === 'brazil' ? 25 : -25);
          setLeftLegRotation(activeCharacter === 'brazil' ? -55 : 30);
          setRightLegRotation(activeCharacter === 'brazil' ? 30 : -55);
          setCharacterY(-8); // spring up
          
          // Ball begins moving to center & scaling up
          const kickFrac = (windupProgress - 0.6) / 0.4;
          setBallPos({
            x: (activeCharacter === 'brazil' ? -35 : 35) * (1 - kickFrac),
            y: 42 - kickFrac * 60,
            scale: 0.92 + kickFrac * 1.5,
            rotate: timerIndex * 40,
            opacity: 1,
            blur: kickFrac * 4
          });
        }

        if (timerIndex >= 16) {
          // Play loud synthesized kick punch sound
          playSynthesizedSfx('kick');
          playSynthesizedSfx('cheer');
          
          setIsScreenShaking(true);
          setAnimationPhase('screen_out');
          createExplosionParticles(0, 0, activeCharacter === 'brazil' ? '#22c55e' : '#38bdf8');
          timerIndex = 0;
        }
      } 
      
      else if (animationPhase === 'screen_out') {
        // Ball grows exponentially to fill the monitor viewport entirely with rotation & high blur
        const zoomProgress = timerIndex / 16; // 16 frames zoom
        const scaleVal = 1.2 + Math.pow(zoomProgress, 3.2) * 35; // aggressive exponential scaling
        const blurVal = Math.min(zoomProgress * 12, 10);
        
        setBallPos({
          x: 0,
          y: -20 - zoomProgress * 60,
          scale: scaleVal,
          rotate: timerIndex * 45,
          opacity: zoomProgress > 0.85 ? Math.max(1 - (zoomProgress - 0.85) / 0.15, 0) : 1,
          blur: blurVal
        });

        // Shake attenuates
        if (timerIndex === 6) {
          setShowGoalFlash(true);
        }
        if (timerIndex === 14) {
          setShowGoalFlash(false);
          setIsScreenShaking(false);
        }

        if (timerIndex >= 18) {
          // Transition to next player!
          setActiveCharacter(prev => prev === 'brazil' ? 'argentina' : 'brazil');
          setAnimationPhase('enter');
          timerIndex = 0;
        }
      }

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(pulseTimer);
    };
  }, [isPlaying, activeCharacter, animationPhase, skillsCounter]);

  return (
    <div 
      id="anime-character-jearsy-loop"
      className={`relative w-full h-[225px] overflow-hidden rounded-2xl border border-slate-800/60 bg-gradient-to-b from-slate-950 to-[#0e1726] shadow-xl md:shadow-2xl select-none transition-transform duration-100 ${isScreenShaking ? 'animate-[shake_0.22s_infinite]' : ''}`}
    >
      {/* Background Stadium Grid Pitch */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        {/* Grass Grid patterns */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[75%] border-y border-emerald-500/20 bg-emerald-950/10 flex flex-col justify-around">
          <div className="w-full h-px bg-emerald-500/10" />
          <div className="w-full h-px bg-emerald-500/10" />
          <div className="w-full h-px bg-emerald-500/10" />
        </div>
        {/* Center circle and penalty box indicators */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border-2 border-emerald-500/10" />
        {/* Goalpost outline glow behind the player */}
        <div className="absolute left-1/2 top-[10%] -translate-x-1/2 w-[70px] h-20 border-b border-x border-dashed border-emerald-500/15" />
      </div>

      {/* Stadium Light Halos / Brightness */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-40 h-16 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 left-3/4 -translate-x-1/2 w-40 h-16 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Active Team Color Pillar Ambient Glow */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={activeCharacter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.35 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className={`absolute inset-0 pointer-events-none bg-radial ${activeCharacter === 'brazil' ? 'from-yellow-500/15 via-transparent to-transparent' : 'from-sky-400/15 via-transparent to-transparent'}`}
        />
      </AnimatePresence>

      {/* Particles Canvas Container */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {particles.map(p => (
          <div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `calc(50% + ${p.x}px)`,
              top: `calc(55% + ${p.y}px)`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.color,
              opacity: p.alpha,
              transform: 'translate(-50%, -50%)',
              boxShadow: `0 0 6px ${p.color}`
            }}
          />
        ))}
      </div>

      {/* Dynamic Screen Kick Flash Overlay */}
      <div className={`absolute inset-0 z-35 bg-white transition-opacity duration-75 pointer-events-none ${showGoalFlash ? 'opacity-85' : 'opacity-0'}`} />

      {/* Animated Cartoon Character Area */}
      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
        <div className="relative w-44 h-44 flex items-center justify-center">

          {/* Active Player Rendering */}
          <div 
            className="absolute transform transition-transform duration-75 ease"
            style={{
              transform: `translateY(${characterY}px) rotate(${characterRotation}deg)`,
              bottom: '15%',
            }}
          >
            {/* Dynamic Foot Shadow on Pitch */}
            <div 
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-14 h-2 bg-black/45 rounded-full blur-[2px]" 
              style={{
                scale: `${1 - Math.abs(characterY) / 100}`
              }}
            />

            {/* Main Player Figure Wrapper */}
            <div className="relative w-24 h-32 flex flex-col items-center">
              
              {/* Back Hair (if any) */}
              <div className={`absolute w-11 h-11 rounded-full top-1 ${activeCharacter === 'brazil' ? 'bg-amber-950' : 'bg-[#e2e8f0] border border-slate-700'}`} />

              {/* Head */}
              <div 
                className="absolute w-10 h-10 bg-amber-100 rounded-full top-2 flex flex-col items-center justify-center shadow-inner z-20"
                style={{ transform: `translateY(${headY}px)` }}
              >
                {/* Hair Top */}
                <div className={`absolute -top-1 w-11 h-4 rounded-t-full ${activeCharacter === 'brazil' ? 'bg-amber-950' : 'bg-slate-450'}`} />
                
                {/* Face Features (Eyes blinking, mouth smiling) */}
                <div className="flex gap-2.5 mt-2">
                  <div className="w-1.5 h-1.5 bg-slate-900 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-slate-900 rounded-full animate-bounce" />
                </div>
                {/* Mouth */}
                <div className="w-3.5 h-1.5 border-b border-rose-500 rounded-b-full bg-transparent mt-1" />
              </div>

              {/* Body Torso - Dynamic Custom Styled Jersey! */}
              <div className="absolute w-9 h-14 top-11 rounded-t-xl overflow-hidden z-10 flex flex-col items-center shadow-lg border border-slate-900/10">
                {activeCharacter === 'brazil' ? (
                  /* Brazil: Yellow Jersey with green collars & sleeves */
                  <div className="w-full h-full bg-yellow-400 relative flex flex-col items-center justify-center">
                    <div className="absolute top-0 w-full h-2 bg-green-500" />
                    <div className="absolute top-0.5 left-0.5 w-[3px] h-[3px] bg-green-500 rounded-full" />
                    <div className="absolute top-0.5 right-0.5 w-[3px] h-[3px] bg-green-500 rounded-full" />
                    <span className="text-[14px] font-black font-mono text-blue-900 leading-none select-none tracking-tight">10</span>
                    <div className="absolute bottom-0 w-full h-3 bg-blue-700 border-t border-yellow-300" /> {/* Blue shorts */}
                  </div>
                ) : (
                  /* Argentina: Sky Blue & White vertical stripes */
                  <div className="w-full h-full bg-[#f8fafc] relative flex flex-col items-center justify-center">
                    <div className="absolute inset-y-0 left-1 w-2 bg-[#38bdf8]" />
                    <div className="absolute inset-y-0 right-1 w-2 bg-[#38bdf8]" />
                    <span className="text-[14px] font-black font-mono text-black leading-none drop-shadow-md select-none tracking-tight">10</span>
                    <div className="absolute bottom-0 w-full h-3 bg-slate-950" /> {/* Black shorts */}
                  </div>
                )}
              </div>

              {/* Left Arm for balance */}
              <div 
                className="absolute left-4 top-12 w-2.5 h-11 bg-amber-100 rounded-full origin-top z-5"
                style={{
                  transform: `rotate(${-55 - armRotation * 1.2}deg)`,
                  backgroundColor: 'rgb(24efea)'
                }}
              >
                {/* Sleeve */}
                <div className={`w-full h-4 rounded-t-full ${activeCharacter === 'brazil' ? 'bg-yellow-400' : 'bg-[#38bdf8]'}`} />
              </div>

              {/* Right Arm for balance */}
              <div 
                className="absolute right-4 top-12 w-2.5 h-11 bg-amber-100 rounded-full origin-top z-5"
                style={{
                  transform: `rotate(${55 + armRotation}deg)`
                }}
              >
                {/* Sleeve */}
                <div className={`w-full h-4 rounded-t-full ${activeCharacter === 'brazil' ? 'bg-yellow-400' : 'bg-[#38bdf8]'}`} />
              </div>

              {/* Left Leg */}
              <div 
                className="absolute left-6 top-23 w-3 h-12 bg-amber-100 rounded-b-full origin-top z-10"
                style={{
                  transform: `rotate(${leftLegRotation}deg)`
                }}
              >
                {/* Sock / Shoe */}
                <div className="absolute bottom-0 w-full h-4 bg-white rounded-b-full flex flex-col justify-end">
                  <div className={`w-[14px] h-1.5 rounded-full absolute -bottom-0.5 left-1/2 -translate-x-1/2 ${activeCharacter === 'brazil' ? 'bg-green-600' : 'bg-amber-500'}`} />
                </div>
              </div>

              {/* Right Leg */}
              <div 
                className="absolute right-6 top-23 w-3 h-12 bg-amber-100 rounded-b-full origin-top z-10"
                style={{
                  transform: `rotate(${rightLegRotation}deg)`
                }}
              >
                {/* Sock / Shoe */}
                <div className="absolute bottom-0 w-full h-4 bg-white rounded-b-full flex flex-col justify-end">
                  <div className={`w-[14px] h-1.5 rounded-full absolute -bottom-0.5 left-1/2 -translate-x-1/2 ${activeCharacter === 'brazil' ? 'bg-green-600' : 'bg-amber-500'}`} />
                </div>
              </div>

              {/* Country Flag Badge Label */}
              <div className="absolute top-26 bg-slate-900/90 py-0.5 px-2 rounded-full border border-slate-500/20 text-[8px] font-mono font-bold tracking-wider uppercase text-slate-200 z-30 shadow-md">
                {activeCharacter === 'brazil' ? '🇧🇷 BRAZIL' : '🇦🇷 ARGENTINA'}
              </div>

            </div>
          </div>

          {/* Animated 3D-Look Soccer Ball */}
          <div 
            className="absolute z-30 transform pointer-events-none"
            style={{
              left: `calc(50% + ${ballPos.x}px)`,
              top: `calc(55% + ${ballPos.y}px)`,
              transform: `translate(-50%, -50%) scale(${ballPos.scale}) rotate(${ballPos.rotate}deg)`,
              opacity: ballPos.opacity,
              filter: ballPos.blur > 0 ? `blur(${ballPos.blur}px)` : 'none'
            }}
          >
            {/* The Soccer Ball Sphere */}
            <div className="relative w-8 h-8 rounded-full bg-white shadow-[inset_-4px_-4px_10px_rgba(0,0,0,0.6),0_8px_16px_rgba(0,0,0,0.45)] border border-slate-400 overflow-hidden">
              
              {/* Ball shadow overlays to look 3D */}
              <div className="absolute inset-0 bg-radial from-transparent to-black/35 pointer-events-none" />

              {/* Soccer pentagon patterns overlay */}
              <div className="absolute w-2.5 h-2.5 bg-slate-950 rounded-full top-1 left-1.5" />
              <div className="absolute w-2.5 h-2.5 bg-slate-950 rounded-full bottom-1 right-2" />
              <div className="absolute w-2.5 h-2.5 bg-slate-950 rounded-full top-4 left-4" />
              <div className="absolute w-2 h-2 bg-slate-900 rounded-full top-0.5 right-1" />
              <div className="absolute w-2 h-2 bg-slate-900 rounded-full bottom-2 left-0.5" />
              
              {/* Pentagons stitched lines */}
              <div className="absolute inset-0 border-t border-l border-slate-400/40 rounded-full scale-[0.8]" />
              <div className="absolute inset-y-0 left-1/2 w-px bg-slate-400/30" />
              <div className="absolute inset-x-0 top-1/2 h-px bg-slate-400/30" />
            </div>

            {/* Ball Motion Trail (Behind Ball, only when zooming) */}
            {ballPos.scale > 3 && (
              <div 
                className={`absolute inset-0 rounded-full opacity-35 scale-[1.3] pointer-events-none ${activeCharacter === 'brazil' ? 'bg-yellow-400/50' : 'bg-sky-400/50'} blur-[3px]`}
                style={{ transform: 'translateZ(-1px)' }}
              />
            )}
          </div>

        </div>
      </div>

      {/* Header Panel with Control Options (Pause/Play, Mute Oscillators, manual transition) */}
      <div className="absolute bottom-2.5 left-3 right-3 z-30 flex items-center justify-between">
        
        {/* Caption */}
        <div className="flex flex-col text-left">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400/80 flex items-center gap-1 leading-none font-mono">
            <Sparkles className="w-3 h-3 text-amber-500 animate-spin" /> Lobby Rivalry Showreel
          </span>
          <span className="text-[9px] text-slate-450 leading-none font-medium font-mono mt-0.5">
            {activeCharacter === 'brazil' ? "Golden green samba step juggle" : "La Albiceleste magical bicycle kick"}
          </span>
        </div>

        {/* Buttons tray */}
        <div className="flex items-center gap-1.5">
          {/* Synthesizer audio control */}
          <button
            type="button"
            onClick={toggleMute}
            className={`p-1.5 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
              !isMuted 
                ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400' 
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title={isMuted ? "Unmute Synthesized Cheer & Kick Sound effects 🔊" : "Mute Sound FX 🔇"}
            id="anime-mute-synth-btn"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 animate-bounce" />}
          </button>

          {/* Pause / Play */}
          <button
            type="button"
            onClick={() => setIsPlaying(prev => !prev)}
            className="p-1.5 rounded-lg border bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 flex items-center justify-center transition-all cursor-pointer"
            title={isPlaying ? "Pause Screen Loop" : "Play Screen Loop"}
            id="anime-toggle-play-btn"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          {/* Swap Character Manual trigger button */}
          <button
            type="button"
            onClick={handleManualTrigger}
            className="p-1.5 rounded-lg border bg-slate-900/60 border-slate-800 text-slate-400 hover:text-emerald-400 flex items-center justify-center transition-all cursor-pointer"
            title="Next Player Sequence"
            id="anime-trigger-next-btn"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Screen corners stylistic HUD details */}
      <div className="absolute top-2.5 left-3 text-[8px] font-mono font-bold tracking-widest text-[#22c55e] z-30 flex items-center gap-1 pointer-events-none opacity-85">
        <span className="w-1.5 h-1.5 bg-[#22c55e] rounded-full animate-ping" />
        LIVE RETINA SYNERGY HMD
      </div>
      
      <div className="absolute top-2.5 right-3 text-[8.5px] font-mono text-slate-500 font-bold z-30 pointer-events-none opacity-75">
        {activeCharacter === 'brazil' ? 'FPS: 60.0 • BRZ_10' : 'FPS: 60.0 • ARG_10'}
      </div>

    </div>
  );
}
