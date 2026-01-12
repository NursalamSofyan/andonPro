import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Import Icons dari react-icons
import {
  MdQrCode2,
  MdNotificationsActive,
  MdSpaceDashboard,
  MdInsights,
  MdFactory,
  MdSpeed,
  MdSecurity
} from 'react-icons/md';
import { FaCheckCircle, FaTelegramPlane, FaArrowRight, FaRobot } from 'react-icons/fa';
import { BiSolidFactory } from 'react-icons/bi';
import { IoIosWarning } from 'react-icons/io';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">

      {/* --- NAVBAR --- */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-slate-900">
            <Image src="/images/logo_1.jpg" alt="Logo" width={150} height={150} />
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="text-slate-600 hover:text-blue-600 font-medium text-sm transition">
              Log In
            </Link>
            <Link href="/auth/register" className="px-5 py-2 bg-blue-600 text-white rounded-full font-bold text-sm hover:bg-blue-700 transition shadow-md">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="relative pt-20 pb-32 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Text Content */}
            <div className="lg:w-1/2 text-center lg:text-left z-10">
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-4 py-1.5 rounded-full mb-6">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                <span className="text-blue-700 font-semibold text-xs tracking-wide uppercase">
                  A Modern Andon System in Simple App
                </span>
              </div>

              <h1 className="text-4xl lg:text-6xl font-extrabold text-slate-900 mb-6 leading-[1.15]">
                Reduce <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">98% Loss Time</span> in Reporting Problems
              </h1>

              <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Real-Time Andon Monitoring System. Improve Response Time, track MTBF/MTTR,
                and boost efficiency at almost <span className="font-bold text-slate-900">zero installation cost</span>.
              </p>

              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                <Link href="/auth/register" className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2">
                  Try Free Now <FaArrowRight />
                </Link>
                <Link href="#contact" className="px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition flex items-center justify-center">
                  Schedule Demo
                </Link>
              </div>

              <p className="mt-6 text-sm text-slate-500 flex items-center justify-center lg:justify-start gap-2">
                <FaCheckCircle className="text-green-500" /> No credit card required for Free Tier
              </p>
            </div>

            {/* Image Content */}
            <div className="lg:w-1/2 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-200 bg-slate-900 aspect-video">
                {/* Placeholder Image: Industrial Dashboard */}
                <Image
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
                  alt="Andon Dashboard Interface"
                  fill
                  className="object-cover opacity-90 hover:scale-105 transition duration-700"
                />

                {/* Floating Badge */}
                <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur px-4 py-3 rounded-lg shadow-lg flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-full text-green-600">
                    <MdSpeed size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold">Efficiency</p>
                    <p className="text-lg font-bold text-slate-900">+34% Boost</p>
                  </div>
                </div>
              </div>

              {/* Decorative Blur */}
              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-500/20 blur-[100px] rounded-full"></div>
            </div>
          </div>
        </div>
      </header>

      {/* --- PAIN POINTS --- */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1 relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 mt-8">
                  <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
                    <IoIosWarning className="text-red-500 text-3xl mb-3" />
                    <h3 className="font-bold text-red-900">Slow Response</h3>
                    <p className="text-sm text-red-700">Manual reporting takes 15-30 mins on average.</p>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <MdFactory className="text-slate-400 text-3xl mb-3" />
                    <h3 className="font-bold text-slate-700">No Data History</h3>
                    <p className="text-sm text-slate-500">Impossible to trace root cause of downtime.</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <FaRobot className="text-slate-400 text-3xl mb-3" />
                    <h3 className="font-bold text-slate-700">Expensive Hardware</h3>
                    <p className="text-sm text-slate-500">Traditional Andon towers cost $500+/point.</p>
                  </div>
                  <div className="bg-blue-600 p-6 rounded-2xl text-white shadow-xl">
                    <FaCheckCircle className="text-white text-3xl mb-3" />
                    <h3 className="font-bold">The Solution</h3>
                    <p className="text-sm text-blue-100">Digital, Real-time, and Analytics-driven.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 md:order-2">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-slate-900">
                Stop managing production with <span className="text-red-500 line-through decoration-4 decoration-red-500/30">shouting</span>
              </h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Manual problem reporting in production is slow, practically impossible to trace, and causes massive downtime.
                Why spend budget on expensive wiring when your team already has the tool in their pocket?
              </p>

              <ul className="space-y-4">
                {[
                  "Real-time alerts on Web Browser, TV, & Tablets",
                  "Instant Telegram Group Notifications",
                  "Smart Analytics: Auto-track MTBF & MTTR",
                  "Digital Workflow: Streamlined resolution process"
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-3 items-center text-slate-700 font-medium">
                    <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                      <FaCheckCircle size={14} />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES --- */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Core Features</h2>
            <p className="text-slate-600">Everything you need to modernize your factory floor without the headache.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<MdQrCode2 size={40} className="text-blue-600" />}
              title="QR Code Deployment"
              desc="Operator scans QR Code to report. No expensive wiring or hardware installation needed."
            />
            <FeatureCard
              icon={<FaTelegramPlane size={40} className="text-blue-600" />}
              title="Instant Notifications"
              desc="Automatic alerts to Telegram groups (Maintenance, Quality, Logistic) managed by you."
            />
            <FeatureCard
              icon={<MdSpaceDashboard size={40} className="text-blue-600" />}
              title="Real-time Dashboard"
              desc="Monitor production status live via Smart-TV or any large screen monitor on the floor."
            />
            <FeatureCard
              icon={<MdInsights size={40} className="text-blue-600" />}
              title="Smart Analytics"
              desc="Detailed auto-reports on machine downtime, Pareto charts, and MTTR tracking."
            />
          </div>
        </div>
      </section>

      {/* --- WORKFLOW --- */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#4b5563 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

        <div className="container mx-auto px-6 relative z-10">
          <h2 className="text-3xl font-bold text-center mb-16">Simple 4-Step Workflow</h2>

          <div className="relative grid md:grid-cols-4 gap-8">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-8 left-0 w-full h-0.5 bg-slate-700 -z-10"></div>

            <Step
              number="1"
              title="Attach QR"
              desc="Print and attach QR codes to your machines."
              icon={<MdQrCode2 />}
            />
            <Step
              number="2"
              title="Scan & Report"
              desc="Operators scan to report issues instantly."
              icon={<IoIosWarning />}
            />
            <Step
              number="3"
              title="Response"
              desc="Teams scan to acknowledge & start repair."
              icon={<FaRobot />}
            />
            <Step
              number="4"
              title="Analyzed"
              desc="Workflow is recorded & reported automatically."
              icon={<MdInsights />}
            />
          </div>
        </div>
      </section>

      {/* --- PRICING --- */}
      <section className="py-24 bg-white" id="pricing">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Transparent Pricing</h2>
            <p className="text-slate-600">Start for free, scale as your production grows.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
            {/* FREE TIER */}
            <div className="p-8 border border-slate-200 rounded-2xl bg-white hover:border-blue-200 transition">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Starter</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-extrabold text-slate-900">Rp 0</span>
                <span className="text-slate-500">/ forever</span>
              </div>
              <ul className="space-y-4 mb-8 text-slate-600 text-sm">
                <li className="flex items-center gap-3"><FaCheckCircle className="text-green-500 shrink-0" /> 1 Location</li>
                <li className="flex items-center gap-3"><FaCheckCircle className="text-green-500 shrink-0" /> Max 5 Machines</li>
                <li className="flex items-center gap-3"><FaCheckCircle className="text-green-500 shrink-0" /> Basic Telegram Alerts</li>
                <li className="flex items-center gap-3"><FaCheckCircle className="text-green-500 shrink-0" /> 7 Days Data Retention</li>
              </ul>
              <Link href="/auth/register?plan=free" className="block w-full py-3 border-2 border-blue-600 text-blue-600 rounded-xl font-bold text-center hover:bg-blue-50 transition">
                Start Free
              </Link>
            </div>

            {/* PRO TIER */}
            <div className="p-8 border-2 border-blue-600 rounded-2xl bg-white shadow-2xl relative scale-105 z-10">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase shadow-lg">
                Most Popular
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Pro Factory</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-extrabold text-slate-900">Rp 750k</span>
                <span className="text-slate-500">/ month</span>
              </div>
              <ul className="space-y-4 mb-8 text-slate-600 text-sm font-medium">
                <li className="flex items-center gap-3"><FaCheckCircle className="text-blue-600 shrink-0" /> Up to 20 Locations</li>
                <li className="flex items-center gap-3"><FaCheckCircle className="text-blue-600 shrink-0" /> 150 Machines</li>
                <li className="flex items-center gap-3"><FaCheckCircle className="text-blue-600 shrink-0" /> Advanced Analytics (MTTR/MTBF)</li>
                <li className="flex items-center gap-3"><FaCheckCircle className="text-blue-600 shrink-0" /> Priority Dashboard TV Mode</li>
                <li className="flex items-center gap-3"><FaCheckCircle className="text-blue-600 shrink-0" /> Unlimited Data History</li>
              </ul>
              <Link href="/auth/register?plan=pro" className="block w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-center hover:bg-blue-700 transition shadow-lg shadow-blue-200">
                Get Pro Access
              </Link>
            </div>

            {/* ENTERPRISE TIER */}
            <div className="p-8 border border-slate-200 rounded-2xl bg-slate-50 hover:bg-white transition">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Enterprise</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-extrabold text-slate-900">Custom</span>
              </div>
              <ul className="space-y-4 mb-8 text-slate-600 text-sm">
                <li className="flex items-center gap-3"><MdSecurity className="text-slate-400 shrink-0" /> Multi-tenant / Unlimited</li>
                <li className="flex items-center gap-3"><MdSecurity className="text-slate-400 shrink-0" /> API Access & Webhooks</li>
                <li className="flex items-center gap-3"><MdSecurity className="text-slate-400 shrink-0" /> Custom Domain</li>
                <li className="flex items-center gap-3"><MdSecurity className="text-slate-400 shrink-0" /> Dedicated Support Manager</li>
              </ul>
              <Link href="mailto:sales@andonsaas.com" className="block w-full py-3 bg-slate-800 text-white rounded-xl font-bold text-center hover:bg-slate-900 transition">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- SOCIAL PROOF / TESTIMONIALS --- */}
      <section className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-12 text-slate-900">Trusted by Modern Manufacturers</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <TestimonialCard
              content="The 98% reduction in report time isn't just a marketing claim. Our maintenance team now responds in seconds, not minutes. It changed our culture."
              author="Budi Santoso"
              role="Plant Manager at AutoParts Indo"
            />
            <TestimonialCard
              content="Switching from physical Andon towers to this QR-based system saved us millions in installation costs. The Telegram integration is genius."
              author="Michael Chen"
              role="Head of Production at TechAssemble"
            />
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 bg-white border-t border-slate-200">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 font-bold text-xl text-slate-900 mb-6">
            <BiSolidFactory className="text-slate-400" />
            <span>Andon<span className="text-blue-600">SaaS</span></span>
          </div>
          <p className="text-slate-500 text-sm mb-8">
            &copy; {new Date().getFullYear()} AndonSaaS. Empowering factories with simple digital tools.
          </p>
          <div className="flex justify-center gap-6 text-sm font-medium text-slate-600">
            <Link href="#" className="hover:text-blue-600">Privacy Policy</Link>
            <Link href="#" className="hover:text-blue-600">Terms of Service</Link>
            <Link href="#" className="hover:text-blue-600">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

// --- SUBCOMPONENTS (Agar kode lebih rapi) ---

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition duration-300">
      <div className="mb-4 bg-blue-50 w-16 h-16 rounded-xl flex items-center justify-center">{icon}</div>
      <h3 className="text-xl font-bold mb-3 text-slate-900">{title}</h3>
      <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
    </div>
  )
}

function Step({ number, title, desc, icon }: { number: string, title: string, desc: string, icon: React.ReactNode }) {
  return (
    <div className="text-center relative group">
      <div className="w-16 h-16 bg-slate-800 text-blue-400 rounded-2xl flex items-center justify-center mx-auto text-2xl mb-6 border border-slate-700 group-hover:scale-110 group-hover:border-blue-500 transition duration-300 relative z-10 shadow-xl">
        {icon}
        <div className="absolute -top-3 -right-3 w-8 h-8 bg-blue-600 text-white text-sm font-bold flex items-center justify-center rounded-full border-4 border-slate-900">
          {number}
        </div>
      </div>
      <h3 className="text-lg font-bold mb-2 text-white">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed px-4">{desc}</p>
    </div>
  )
}

function TestimonialCard({ content, author, role }: { content: string, author: string, role: string }) {
  return (
    <div className="p-8 bg-white rounded-2xl border border-slate-100 shadow-sm">
      <div className="mb-6">
        {[1, 2, 3, 4, 5].map(i => <span key={i} className="text-yellow-400 text-lg">★</span>)}
      </div>
      <p className="mb-6 text-slate-700 font-medium italic text-lg leading-relaxed">"{content}"</p>
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold">
          {author.charAt(0)}
        </div>
        <div>
          <p className="font-bold text-slate-900 not-italic">{author}</p>
          <p className="text-xs text-slate-500 not-italic uppercase tracking-wide">{role}</p>
        </div>
      </div>
    </div>
  )
}