<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="scroll-smooth">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Arya Intaran | Creative Developer</title>
    <link rel="icon" type="image/png" href="{{ asset('favicon.png') }}">
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>

<body class="bg-genz-black text-genz-offwhite font-grotesk selection:bg-genz-lime selection:text-genz-black relative">
    <div id="custom-cursor"></div>

    <!-- Navigation -->
    <nav
        class="fixed top-0 w-full z-50 mix-blend-difference px-6 py-6 flex justify-between items-center backdrop-blur-sm reveal">
        <a href="#"
            class="text-2xl font-bold tracking-tighter hover:text-genz-lime transition-colors magnetic">ARYA.</a>
        <div class="hidden md:flex gap-8 text-sm font-medium uppercase tracking-widest">
            <a href="#work" class="hover:text-genz-pink transition-colors">Work</a>
            <a href="#about" class="hover:text-genz-lime transition-colors">About</a>
            <a href="#contact" class="hover:text-genz-pink transition-colors">Contact</a>
        </div>
        <a href="#contact"
            class="magnetic px-6 py-2 border border-white rounded-full hover:bg-genz-lime hover:border-genz-lime hover:text-black transition-all duration-300 text-sm font-bold uppercase">
            Let's Talk
        </a>
    </nav>

    <!-- Hero Section -->
    <header class="min-h-screen flex flex-col justify-center items-center relative overflow-hidden pt-20">
        <div
            class="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--color-genz-pink)_0%,_transparent_40%)] opacity-10 blur-[100px] animate-float">
        </div>

        <div class="z-10 text-center px-4 reveal">
            <h2 class="text-xl md:text-3xl font-medium mb-4 text-genz-lime tracking-widest uppercase stagger-1">
                {{ $settings['hero_subtitle'] ?? 'Portfolio 2025' }}
            </h2>
            <h1 class="text-6xl md:text-9xl font-black leading-none mb-6 tracking-tighter mix-blend-overlay stagger-2">
                {{ $settings['hero_title_1'] ?? 'CREATIVE' }}<br>
                <span
                    class="text-outline-white hover:text-genz-pink hover:text-outline-none transition-all duration-500 cursor-default">
                    {{ $settings['hero_title_2'] ?? 'DEVELOPER' }}
                </span>
            </h1>
            <p class="max-w-xl mx-auto text-lg md:text-xl text-gray-400 font-light leading-relaxed stagger-3">
                {{ $settings['hero_text'] ?? 'Building digital experiences that are visually stunning and technically refined. Based in Indonesia.' }}
            </p>
        </div>

        <!-- Marquee -->
        <div
            class="w-full mt-20 rotate-[-2deg] bg-genz-lime text-black py-4 border-y-4 border-black box-border overflow-hidden reveal">
            <div class="whitespace-nowrap animate-marquee flex gap-8 font-black text-4xl uppercase items-center">
                @for ($i = 0; $i < 4; $i++)
                    <span>{!! $settings['marquee_text'] ?? 'Web Development * UI/UX Design * Laravel * Tailwind CSS * Creative Coding * Web Development * UI/UX Design * Laravel *' !!}</span>
                @endfor
            </div>
        </div>
    </header>

    <!-- About / Bento Grid -->
    <section id="about" class="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 h-auto md:h-[600px]">

            <!-- Box 1: Intro -->
            <div
                class="reveal md:col-span-2 bg-genz-gray rounded-3xl p-8 flex flex-col justify-between hover:border hover:border-genz-lime border border-transparent transition-all group">
                <div class="flex justify-between items-start">
                    <span class="w-3 h-3 bg-genz-lime rounded-full animate-pulse"></span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="size-8 group-hover:rotate-45 transition-transform duration-500">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                    </svg>
                </div>
                <div>
                    <h3 class="text-3xl font-bold mb-2">
                        {{ $settings['about_title'] ?? 'I create chaos turned into order.' }}
                    </h3>
                    <p class="text-gray-400">
                        {{ $settings['about_text'] ?? 'Specializing in high-performance web applications with a focus on animation and interaction.' }}
                    </p>
                </div>
            </div>

            <!-- Box 2: Photo -->
            <div
                class="reveal stagger-1 bg-genz-dark rounded-3xl overflow-hidden relative group border border-genz-gray">
                <img src="{{ isset($settings['about_image']) ? asset('storage/' . $settings['about_image']) : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop' }}"
                    alt="Profile"
                    class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-110">
                <div
                    class="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs border border-white/20">
                    {{ $settings['about_badge'] ?? 'GEN Z DEV' }}
                </div>
            </div>

            <!-- Box 3: Stack -->
            <div
                class="reveal stagger-2 bg-genz-lime text-black rounded-3xl p-8 flex flex-col justify-center items-center text-center gap-4 hover:scale-[1.02] transition-transform">
                <h4 class="font-black text-2xl">TECH STACK</h4>
                <div class="flex flex-wrap justify-center gap-2 font-bold text-sm">
                    @forelse($techStacks as $stack)
                        <span
                            class="border border-black px-3 py-1 rounded-full magnetic hover:bg-black hover:text-genz-lime transition-colors cursor-default">{{ $stack->name }}</span>
                    @empty
                        <span class="border border-black px-3 py-1 rounded-full magnetic">Laravel</span>
                        <span class="border border-black px-3 py-1 rounded-full magnetic">Tailwind</span>
                        <span class="border border-black px-3 py-1 rounded-full magnetic">Filament</span>
                    @endforelse
                </div>
            </div>

            <!-- Box 4: Location -->
            <div
                class="reveal stagger-3 md:col-span-2 bg-genz-dark border border-genz-gray rounded-3xl p-8 flex items-center justify-between group relative overflow-hidden">
                <div class="z-10">
                    <h3
                        class="text-4xl font-black text-outline-white group-hover:text-genz-pink transition-colors duration-300">
                        {!! $settings['location_text'] ?? 'BASED IN<br>BALI, INDONESIA' !!}
                    </h3>
                </div>
                <div
                    class="text-9xl absolute -right-10 -bottom-10 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-500">
                    {{ $settings['location_emoji'] ?? '🏝️' }}
                </div>
            </div>

        </div>
    </section>

    <!-- Projects Section -->
    <section id="work" class="py-24 px-6 md:px-12 bg-genz-dark">
        <div class="max-w-7xl mx-auto">
            <h2 class="text-5xl md:text-7xl font-black mb-16 text-center reveal"><span
                    class="text-genz-lime">PROJECT</span></h2>

            <div class="space-y-24">
                @forelse($projects as $index => $project)
                    <!-- Project {{ $index + 1 }} -->
                    <a href="{{ $project->url ?? '#' }}"
                        class="block group grid grid-cols-1 md:grid-cols-2 gap-8 items-center reveal">
                        <div class="order-2 {{ $index % 2 == 0 ? 'md:order-1' : '' }}">
                            <h3 class="text-3xl font-bold mb-4 group-hover:text-genz-pink transition-colors">
                                {{ $project->title }}
                            </h3>
                            <p class="text-gray-400 mb-6 text-lg">{{ $project->description }}</p>
                            <div class="flex gap-4 mb-8">
                                @if($project->tags)
                                    @foreach($project->tags as $tag)
                                        <span
                                            class="text-xs font-mono border border-genz-gray px-2 py-1 rounded bg-black uppercase">{{ $tag }}</span>
                                    @endforeach
                                @endif
                            </div>
                            <div
                                class="inline-flex items-center gap-2 text-genz-lime font-bold hover:underline underline-offset-4">
                                VIEW PROJECT <span class="text-xl">→</span>
                            </div>
                        </div>
                        <div
                            class="order-1 {{ $index % 2 == 0 ? 'md:order-2' : '' }} overflow-hidden rounded-2xl border border-genz-gray group-hover:border-genz-lime transition-all duration-500">
                            <img src="{{ $project->image ? asset('storage/' . $project->image) : 'https://placehold.co/800x600/111/FFF?text=' . urlencode($project->title) }}"
                                alt="{{ $project->title }}"
                                class="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700">
                        </div>
                    </a>
                @empty
                    <div class="text-center text-gray-400 py-12">
                        <p class="text-xl">No projects found. Add some from the admin panel!</p>
                    </div>
                @endforelse
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <footer id="contact" class="py-32 px-6 text-center relative overflow-hidden">
        <div
            class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,_var(--color-genz-lime)_0%,_transparent_30%)] opacity-10 blur-[80px]">
        </div>

        <div class="relative z-10">
            <h2 class="text-2xl font-medium mb-8 text-gray-400">GOT A PROJECT?</h2>
            <a href="mailto:{{ $settings['contact_email'] ?? 'hello@aryaintaran.dev' }}"
                class="text-5xl md:text-8xl font-black hover:text-genz-lime transition-colors duration-300 block mb-12">
                {!! $settings['contact_text'] ?? 'HELLO@<br>ARYAINTARAN.DEV' !!}
            </a>

            <div class="flex justify-center gap-8 text-lg font-bold uppercase tracking-widest">
                <a href="{{ $settings['instagram_url'] ?? '#' }}"
                    class="hover:text-genz-pink hover:-translate-y-1 transition-transform">Instagram</a>
                <a href="{{ $settings['linkedin_url'] ?? '#' }}"
                    class="hover:text-genz-pink hover:-translate-y-1 transition-transform">LinkedIn</a>
                <a href="{{ $settings['github_url'] ?? '#' }}"
                    class="hover:text-genz-pink hover:-translate-y-1 transition-transform">GitHub</a>
                @if(isset($settings['gitlab_url']))
                    <a href="{{ $settings['gitlab_url'] }}"
                        class="hover:text-genz-pink hover:-translate-y-1 transition-transform">GitLab</a>
                @endif
                @if(isset($settings['whatsapp_url']))
                    <a href="{{ $settings['whatsapp_url'] }}"
                        class="hover:text-genz-pink hover:-translate-y-1 transition-transform">WhatsApp</a>
                @endif
            </div>

            <p class="mt-20 text-gray-600 text-sm">
                &copy; 2025 ARYA INTARAN. MADE WITH <span class="text-genz-lime">LARAVEL</span> & <span
                    class="text-genz-pink">TAILWIND</span>.
            </p>
        </div>
    </footer>

</body>

</html>