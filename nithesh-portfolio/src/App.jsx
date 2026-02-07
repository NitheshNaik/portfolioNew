import React, { useState, useRef, useEffect } from 'react';
import { Github, Linkedin, Mail, ExternalLink, Shield, Zap, Download, Code2, ArrowRight, BookOpen, Briefcase, Terminal, Moon, Sun } from 'lucide-react';
import { motion, useInView, useMotionValue, useSpring, useTransform, useScroll, useTransform as useScrollTransform } from 'framer-motion';

// --- PARTICLE BACKGROUND ---
const ParticleBackground = ({ isDark }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        ctx.fillStyle = isDark
          ? `rgba(96, 165, 250, ${this.opacity})`
          : `rgba(59, 130, 246, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const init = () => {
      particles = [];
      const particleCount = Math.min(Math.floor((canvas.width * canvas.height) / 15000), 100);
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      // Connect nearby particles
      particles.forEach((a, i) => {
        particles.slice(i + 1).forEach(b => {
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            ctx.strokeStyle = isDark
              ? `rgba(96, 165, 250, ${0.15 * (1 - distance / 120)})`
              : `rgba(59, 130, 246, ${0.1 * (1 - distance / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        });
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.4 }}
    />
  );
};



// --- TILT WRAPPER ---
const TiltCard = ({ children, className }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateY, rotateX, transformStyle: "preserve-3d" }}
      className={className}
    >
      <div style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }} className="h-full">
        {children}
      </div>
    </motion.div>
  );
};

// --- MAIN APP ---
const App = () => {
  const [isDark, setIsDark] = useState(true);

  const clickSound = new Audio("/click.mp3");

  const backgroundRef = useRef(null);
  const isBackgroundInView = useInView(backgroundRef, { once: false, amount: 0.2 });

  const { scrollYProgress } = useScroll();
  const heroY = useScrollTransform(scrollYProgress, [0, 0.3], [0, -100]);
  const heroOpacity = useScrollTransform(scrollYProgress, [0, 0.3], [1, 0]);




  const projects = [
    {
      title: "SafeHer",
      tech: ["React", "Node.js", "MongoDB"],
      desc: "A unified platform for women's safety and wellness. Features real-time SOS messaging and health awareness tools.",
      image: "https://images.unsplash.com/photo-1573163715152-498477df6a58?auto=format&fit=crop&q=80&w=1000",
      icon: <Shield className={isDark ? "text-blue-400" : "text-blue-600"} />
    },
    {
      title: "Event Management System",
      tech: ["Node.js", "MySQL", "EJS"],
      desc: "Full-stack scoring platform managing 1000+ students with real-time dashboards for admin and judges.",
      image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=1000",
      icon: <Zap className={isDark ? "text-purple-400" : "text-purple-600"} />
    },
    {
      title: "IBM Hackathon Project",
      tech: ["Java", "DSA", "Algorithms"],
      desc: "Developed high-performance algorithms for complex data processing during the IBM National Hackathon finals.",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000",
      icon: <Code2 className={isDark ? "text-green-400" : "text-green-600"} />
    }
  ];

  // Theme classes
  const bgClass = isDark ? 'bg-[#030712]' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50';
  const textClass = isDark ? 'text-white' : 'text-slate-900';
  const mutedTextClass = isDark ? 'text-slate-400' : 'text-slate-600';
  const glassClass = isDark
    ? 'bg-white/5 backdrop-blur-md border border-white/10'
    : 'bg-white/70 backdrop-blur-md border border-white/40 shadow-lg';



  return (
    <div className={`min-h-screen selection:bg-blue-500/30 pb-20 transition-colors duration-500 ${bgClass} ${textClass} relative`}>
      {/* Animated Background */}
      <ParticleBackground isDark={isDark} />

      {/* Gradient Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className={`absolute inset-0 ${isDark
          ? 'bg-gradient-to-br from-blue-900/10 via-transparent to-purple-900/10'
          : 'bg-gradient-to-br from-blue-100/30 via-transparent to-purple-100/30'}`}
        />
      </div>

      {/* Glass Navbar */}
      <nav className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-[100] w-[95%] md:w-[90%] max-w-4xl">
        <div className={`${glassClass} rounded-2xl px-4 md:px-8 py-3 md:py-4 flex justify-between items-center`}>
          <span className={`font-bold tracking-widest text-sm uppercase ${textClass}`}>Portfolio</span>
          <div className="flex gap-4 md:gap-8 items-center">
            <div className="hidden sm:flex gap-4 md:gap-8 text-xs font-mono uppercase tracking-widest">
              <a href="#about" className={`${mutedTextClass} hover:text-blue-500 transition`}>About</a>
              <a href="#work" className={`${mutedTextClass} hover:text-blue-500 transition`}>Work</a>
              <a href="#contact" className={`${mutedTextClass} hover:text-blue-500 transition`}>Contact</a>
            </div>
            <button
              onClick={() => {
                clickSound.currentTime = 0;
                clickSound.play();
                setIsDark(!isDark);
              }}

              className={`p-2 rounded-lg ${glassClass} hover:bg-white/10 transition-all`}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section with Parallax */}
      <motion.section
        style={{ y: heroY, opacity: heroOpacity }}
        className="min-h-screen flex flex-col justify-center items-center px-6 text-center relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            HI, I'M
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-gradient">
              {" "}NITHESH
            </span>
          </motion.h1>
          <motion.p
            className={`${mutedTextClass} text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            A full-stack developer passionate about crafting bold and innovative solutions.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <a href="/Resume.pdf" className={`${glassClass} px-6 md:px-8 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-white/10 transition`}>
              <Download size={18} /> Resume
            </a>
            <a href="#work" className={`${isDark ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'} px-6 md:px-8 py-3 rounded-xl hover:bg-blue-500 transition shadow-lg ${isDark ? 'shadow-blue-500/20' : 'shadow-blue-600/30'}`}>
              View Projects
            </a>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* About Me Section */}
      <section id="about" className="py-20 md:py-32 px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter mb-8 md:mb-12 uppercase">
            About <span className={isDark ? "text-blue-500" : "text-blue-600"}>Me</span>
          </h2>
          <p className={`${mutedTextClass} text-lg sm:text-xl md:text-2xl leading-relaxed mb-8 md:mb-12 font-light`}>
            With over 2 years of experience in building websites, I specialize in
            <span className={`${textClass} font-medium`}> branding, web design, and user experience</span>.
            I love collaborating with businesses that want to stand out and showcase their best side.
            Let's create something amazing together!
          </p>
          <a
            href="#contact"
            className={`inline-flex items-center gap-2 ${isDark ? 'text-blue-400' : 'text-blue-600'} font-mono uppercase tracking-[0.2em] hover:opacity-70 transition group text-sm md:text-base`}
          >
            Contact Me <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
          </a>
        </motion.div>
      </section>

      {/* My Background Section */}
      <section ref={backgroundRef} className="py-20 px-6 max-w-6xl mx-auto overflow-x-hidden relative z-10">
        <h2 className={`text-xs md:text-sm font-mono uppercase tracking-[0.3em] md:tracking-[0.5em] ${isDark ? 'text-blue-400' : 'text-blue-600'} mb-12 md:mb-16 text-center`}>
          My Background
        </h2>

        <div className="grid md:grid-cols-3 gap-6 auto-rows-fr">

          {/* Experience Card (From Left) */}
          <TiltCard className="h-full">
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={isBackgroundInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={`${glassClass} p-6 md:p-8 rounded-3xl h-full flex flex-col`}
            >
              <Briefcase className={isDark ? "text-green-400" : "text-green-600"} size={32} />
              <h3 className={`text-xl font-bold ${textClass} my-6`}>Experience</h3>
              <div className="flex-1">
                <h4 className={`${isDark ? 'text-slate-200' : 'text-slate-800'} font-semibold text-sm`}>Project Intern</h4>
                <p className={`${mutedTextClass} text-xs mb-3`}>VTU Xcelerator</p>
                <p className={`${mutedTextClass} text-xs leading-relaxed`}>
                  Contributed to the <span className={isDark ? 'text-slate-200' : 'text-slate-800'}>"Incredible Karnataka"</span> project,
                  developing a platform to discover and promote underrated, secret places in Karnataka.
                </p>
              </div>
            </motion.div>
          </TiltCard>

          {/* Education Card (From Bottom) */}
          <TiltCard className="h-full">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={isBackgroundInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className={`${glassClass} p-6 md:p-8 rounded-3xl h-full flex flex-col`}
            >
              <BookOpen className={isDark ? "text-purple-400" : "text-purple-600"} size={32} />
              <h3 className={`text-xl font-bold ${textClass} my-6`}>Education</h3>
              <div className="space-y-6 flex-1">
                <div>
                  <h4 className={`${isDark ? 'text-slate-200' : 'text-slate-800'} font-semibold text-sm`}>B.E. in Computer Science</h4>
                  <p className={`${mutedTextClass} text-xs`}>Sambhram Institute of Technology</p>
                  <p className={`${isDark ? 'text-blue-400' : 'text-blue-600'} font-mono text-xs mt-1`}>8.4 CGPA</p>
                </div>
                <div>
                  <h4 className={`${isDark ? 'text-slate-200' : 'text-slate-800'} font-semibold text-sm`}>Class XII (PUC)</h4>
                  <p className={`${mutedTextClass} text-xs`}>M.E.S P.U College</p>
                  <p className={`${isDark ? 'text-blue-400' : 'text-blue-600'} font-mono text-xs mt-1`}>82%</p>
                </div>
              </div>
            </motion.div>
          </TiltCard>

          {/* Skills Card (From Right) */}
          <TiltCard className="h-full">
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={isBackgroundInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 100 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
              className={`${glassClass} p-6 md:p-8 rounded-3xl h-full flex flex-col`}
            >
              <Terminal className={isDark ? "text-blue-400" : "text-blue-600"} size={32} />
              <h3 className={`text-xl font-bold ${textClass} my-6`}>Technical Skills</h3>
              <div className="space-y-4 text-sm flex-1">
                <div>
                  <p className={`${isDark ? 'text-slate-500' : 'text-slate-600'} font-mono uppercase text-[10px] mb-1`}>Languages</p>
                  <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>Java, JavaScript, HTML/CSS, C, SQL, Python</p>
                </div>
                <div>
                  <p className={`${isDark ? 'text-slate-500' : 'text-slate-600'} font-mono uppercase text-[10px] mb-1`}>Frameworks</p>
                  <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>Node.js, Express, React</p>
                </div>
                <div>
                  <p className={`${isDark ? 'text-slate-500' : 'text-slate-600'} font-mono uppercase text-[10px] mb-1`}>Tools</p>
                  <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>VS Code, Eclipse, Git</p>
                </div>
              </div>
            </motion.div>
          </TiltCard>
        </div>
      </section>

      {/* Stacking Project Section */}
      <section id="work" className="px-6 max-w-4xl mx-auto space-y-20 py-20">
        <h2 className={`text-xs md:text-sm font-mono uppercase tracking-[0.3em] md:tracking-[0.5em] ${isDark ? 'text-blue-400' : 'text-blue-600'} mb-20 text-center`}>
          Selected Projects
        </h2>

        {projects.map((p, i) => (
          <div
            key={i}
            className="sticky"
            style={{ top: `${100 + (i * 40)}px` }}
          >
            <motion.div

              whileHover={{ scale: 0.98 }}
              className={`${glassClass} rounded-3xl md:rounded-[2.5rem] overflow-hidden grid md:grid-cols-2 min-h-[400px] md:min-h-[450px] project-card`}
            >
              {/* Image Side */}
              <div className="relative h-64 md:h-auto overflow-hidden">
                <img
                  src={p.image}
                  alt={p.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                />
                <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-t from-[#030712]' : 'bg-gradient-to-t from-white'} via-transparent to-transparent opacity-60`}></div>
              </div>

              {/* Text Side */}
              <div className="p-6 md:p-10 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className={`p-3 ${isDark ? 'bg-white/5' : 'bg-slate-100'} rounded-2xl border ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                      {p.icon}
                    </div>
                    <a href="#" className={`${mutedTextClass} hover:opacity-70 transition`} aria-label={`View ${p.title} project`}>
                      <ExternalLink size={20} />
                    </a>
                  </div>
                  <h3 className={`text-2xl md:text-3xl font-bold ${textClass} mb-4 tracking-tight`}>{p.title}</h3>
                  <p className={`${mutedTextClass} leading-relaxed mb-6 md:mb-8 text-sm md:text-base`}>
                    {p.desc}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {p.tech.map(t => (
                    <span
                      key={t}
                      className={`text-[10px] font-mono uppercase tracking-widest ${isDark ? 'bg-white/5 border-white/5 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'} px-3 md:px-4 py-2 rounded-full border`}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        ))}
      </section>

      {/* Footer / Contact */}
      <footer id="contact" className="pt-20 md:pt-40 pb-20 text-center px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className={`${glassClass} max-w-2xl mx-auto p-8 md:p-16 rounded-3xl md:rounded-[3rem]`}
        >
          <h2 className={`text-3xl md:text-4xl font-bold ${textClass} mb-6 tracking-tighter`}>Ready to start?</h2>
          <p className={`${mutedTextClass} mb-8 md:mb-10 font-light`}>Reach Out To Me</p>
          <div className="flex justify-center gap-6 md:gap-8">
            <a href="mailto:nitheshbnaik@gmail.com" className="group flex flex-col items-center gap-2" aria-label="Email">
              <div className={`p-3 md:p-4 ${glassClass} rounded-full ${isDark ? 'group-hover:text-blue-400' : 'group-hover:text-blue-600'} transition`}>
                <Mail size={20} />
              </div>
              <span className={`text-[10px] font-mono ${isDark ? 'text-slate-500' : 'text-slate-600'} uppercase`}>Email</span>
            </a>
            <a href="https://github.com/NitheshNaik" className="group flex flex-col items-center gap-2" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <div className={`p-3 md:p-4 ${glassClass} rounded-full ${isDark ? 'group-hover:text-blue-400' : 'group-hover:text-blue-600'} transition`}>
                <Github size={20} />
              </div>
              <span className={`text-[10px] font-mono ${isDark ? 'text-slate-500' : 'text-slate-600'} uppercase`}>GitHub</span>
            </a>
            <a href="https://www.linkedin.com/in/nitheshnaik/" className="group flex flex-col items-center gap-2" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <div className={`p-3 md:p-4 ${glassClass} rounded-full ${isDark ? 'group-hover:text-blue-400' : 'group-hover:text-blue-600'} transition`}>
                <Linkedin size={20} />
              </div>
              <span className={`text-[10px] font-mono ${isDark ? 'text-slate-500' : 'text-slate-600'} uppercase`}>LinkedIn</span>
            </a>
          </div>
        </motion.div>
        <p className={`mt-12 md:mt-20 ${isDark ? 'text-slate-700' : 'text-slate-400'} font-mono text-xs tracking-widest uppercase`}>
          Handcrafted by Nithesh • 2026
        </p>
      </footer>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default App;