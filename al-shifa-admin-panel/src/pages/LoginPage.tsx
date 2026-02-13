import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, User, Lock, Loader2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '../components/ui/Toast';
import { authApi } from '../api/auth';
import { useAuthStore } from '../stores/authStore';

const loginSchema = z.object({
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { setUser } = useAuthStore();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Interactive Magnetic Field Background
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];
        const mouse = { x: -1000, y: -1000 };
        const gap = 35; // Grid spacing

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        class Particle {
            x: number;
            y: number;
            angle: number;
            size: number;
            color: string;

            constructor(x: number, y: number) {
                this.x = x;
                this.y = y;
                this.angle = 0;
                this.size = 2; // Line length
                this.color = '#334155'; // Base slate color
            }

            update() {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxDistance = 300;

                // Calculate angle to look at mouse
                if (distance < maxDistance) {
                    this.angle = Math.atan2(dy, dx);
                    // Color shift based on proximity
                    const intensity = 1 - distance / maxDistance;
                    // Interpolate between slate and emerald/cyan
                    this.color = `rgba(${16 + intensity * 0}, ${185 + intensity * 40}, ${129 + intensity * 100}, ${0.3 + intensity * 0.7})`;
                    this.size = 12 + intensity * 8; // Grow when close
                } else {
                    // Slowly return to base angle (optional drift)
                    this.angle += 0.02;
                    this.color = 'rgba(71, 85, 105, 0.2)';
                    this.size = 6;
                }
            }

            draw() {
                if (!ctx) return;
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.angle);

                ctx.beginPath();
                // Draw a small line or arrow
                ctx.moveTo(-this.size / 2, 0);
                ctx.lineTo(this.size / 2, 0);

                ctx.strokeStyle = this.color;
                ctx.lineWidth = 2;
                ctx.lineCap = 'round';
                ctx.stroke();

                ctx.restore();
            }
        }

        const initParticles = () => {
            particles = [];
            const cols = Math.ceil(canvas.width / gap);
            const rows = Math.ceil(canvas.height / gap);

            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    particles.push(new Particle(i * gap, j * gap));
                }
            }
        };

        const animate = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (const particle of particles) {
                particle.update();
                particle.draw();
            }
            animationFrameId = requestAnimationFrame(animate);
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        const handleMouseLeave = () => {
            mouse.x = -1000;
            mouse.y = -1000;
        }

        window.addEventListener('resize', resizeCanvas);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseout', handleMouseLeave);

        resizeCanvas();
        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseout', handleMouseLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginForm) => {
        setIsLoading(true);
        try {
            const response = await authApi.login(data);
            localStorage.setItem('access_token', response.access_token);
            localStorage.setItem('refresh_token', response.refresh_token);
            setUser(response.user);
            showToast('Login successful! Welcome back.', 'success');
            setTimeout(() => navigate('/dashboard'), 500);
        } catch (error: unknown) {
            const apiError = error as { response?: { data?: { detail?: string } } };
            const errorMessage = apiError.response?.data?.detail || 'Login failed. Please check your credentials.';
            showToast(errorMessage, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-screen w-screen overflow-hidden bg-[#0f172a] flex items-center justify-center relative font-sans">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0f172a] to-black z-0" />

            {/* Magnetic Field Canvas */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 z-0 opacity-80"
            />

            {/* Stacked Glass Card Container */}
            <div className="relative z-10 w-full max-w-md px-4 perspective-1000">
                {/* Back Layer 2 (Deepest) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, rotate: -2 }}
                    animate={{ opacity: 1, scale: 0.9, rotate: -3 }}
                    transition={{ delay: 0.4 }}
                    className="absolute inset-0 bg-emerald-500/10 rounded-[32px] blur-sm transform translate-y-4 translate-x-4 -z-20"
                />

                {/* Back Layer 1 */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.85, rotate: 2 }}
                    animate={{ opacity: 1, scale: 0.95, rotate: 3 }}
                    transition={{ delay: 0.2 }}
                    className="absolute inset-0 bg-cyan-500/10 rounded-[32px] blur-[2px] transform translate-y-2 -translate-x-2 -z-10 border border-white/5"
                />

                {/* Main Glass Card */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
                    className="relative bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 sm:p-10 shadow-2xl shadow-black/50 overflow-hidden"
                >
                    {/* Top Shine */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />

                    {/* Header */}
                    <div className="text-center mb-8 relative">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 mb-5 shadow-lg relative group overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <ShieldCheck className="w-8 h-8 text-emerald-400 relative z-10" />
                        </div>
                        <h1 className="text-3xl font-bold text-white tracking-tight mb-1">
                            Admin Access
                        </h1>
                        <p className="text-slate-400 text-sm flex items-center justify-center gap-1">
                            <Sparkles className="w-3 h-3 text-emerald-500" />
                            Al-Shifa Secure Gateway
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <label className="block text-xs font-semibold text-slate-400 mb-1.5 ml-1 uppercase tracking-wider">
                                Email
                            </label>
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors">
                                    <User className="w-5 h-5" />
                                </span>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    {...register('email')}
                                    className="w-full h-12 pl-12 pr-4 bg-slate-950/50 border border-slate-700/50 rounded-xl text-white placeholder:text-slate-600 focus:bg-slate-900 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all font-medium"
                                />
                            </div>
                            {errors.email && (
                                <p className="text-rose-500 text-xs mt-1.5 pl-1 font-medium">{errors.email.message}</p>
                            )}
                        </motion.div>

                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            <label className="block text-xs font-semibold text-slate-400 mb-1.5 ml-1 uppercase tracking-wider">
                                Password
                            </label>
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors">
                                    <Lock className="w-5 h-5" />
                                </span>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    {...register('password')}
                                    className="w-full h-12 pl-12 pr-12 bg-slate-950/50 border border-slate-700/50 rounded-xl text-white placeholder:text-slate-600 focus:bg-slate-900 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all font-medium"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors p-1"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-rose-500 text-xs mt-1.5 pl-1 font-medium">{errors.password.message}</p>
                            )}
                        </motion.div>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="pt-4"
                        >
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/40 flex items-center justify-center gap-2 disabled:opacity-50 transition-all duration-300 transform active:scale-[0.98] group"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Verifying...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Sign In Now</span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </motion.div>
                    </form>

                    {/* Bottom Links */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="mt-6 flex justify-between px-2"
                    >
                        <a href="#" className="text-xs text-slate-500 hover:text-emerald-400 transition-colors">Forgot Password?</a>
                        <a href="#" className="text-xs text-slate-500 hover:text-emerald-400 transition-colors">Privacy Policy</a>
                    </motion.div>
                </motion.div>
            </div>

            {/* Version Badge */}
            <div className="absolute bottom-6 right-6 text-[10px] text-slate-700 bg-slate-900/50 px-3 py-1 rounded-full border border-white/5 backdrop-blur-sm">
                v2.5.0 build 894
            </div>
        </div>
    );
};
