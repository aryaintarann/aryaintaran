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

            <!-- Swiper Slider Container (Frameless) -->
            <div class="swiper project-slider w-full max-w-5xl mx-auto overflow-hidden">
                <div class="swiper-wrapper">
                    @forelse($projects as $index => $project)
                        <!-- Slide {{ $index + 1 }} -->
                        <div class="swiper-slide w-full min-h-[500px] relative flex items-center justify-center pt-8 pb-16">

                            <div
                                class="flex flex-col items-center justify-center w-full max-w-4xl mx-auto px-6 md:px-12 z-10 h-full text-center">

                                <!-- Image Content (Top) -->
                                <div class="w-full relative group perspective-1000 mb-6 cursor-pointer"
                                    onclick="openDetail({{ $project->id }})" data-swiper-parallax="50%">
                                    <div
                                        class="relative aspect-[16/9] md:aspect-[21/9] w-full rounded-2xl overflow-hidden border border-white/10 bg-black/50 shadow-2xl group-hover:scale-[1.02] transition-transform duration-700">
                                        <img src="{{ $project->image ? asset('storage/' . $project->image) : 'https://placehold.co/1200x600/111/FFF?text=' . urlencode($project->title) }}"
                                            alt="{{ $project->title }}"
                                            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">
                                    </div>
                                    <!-- Glow Effect -->
                                    <div
                                        class="absolute -inset-4 bg-gradient-to-t from-genz-lime/20 to-transparent opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500 -z-10">
                                    </div>
                                </div>

                                <!-- Text Content (Bottom) -->
                                <div class="flex flex-col items-center space-y-3 w-full max-w-2xl mx-auto"
                                    data-swiper-parallax="-200">
                                    <h3
                                        class="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] text-center leading-tight">
                                        {{ $project->title }}
                                    </h3>

                                    <div class="flex flex-wrap justify-center gap-2">
                                        @if($project->tags)
                                            @foreach($project->tags as $tag)
                                                <span
                                                    class="text-xs font-bold border border-genz-lime/50 text-genz-lime px-4 py-1.5 rounded-full uppercase tracking-wider">
                                                    {{ $tag }}
                                                </span>
                                            @endforeach
                                        @endif
                                    </div>

                                    <div class="pt-2">
                                        <a href="{{ $project->url ?? '#' }}" target="_blank"
                                            class="inline-flex items-center gap-2 bg-genz-lime text-black px-8 py-3 rounded-full font-bold text-lg hover:bg-genz-pink hover:text-white transition-all transform hover:scale-105 shadow-[0_0_15px_rgba(204,255,0,0.3)] group">
                                            <span>VIEW PROJECT</span>
                                            <span class="group-hover:translate-x-1 transition-transform">→</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    @empty
                        <div class="swiper-slide flex items-center justify-center">
                            <p class="text-white text-xl">No projects found.</p>
                        </div>
                    @endforelse
                </div>

                <!-- Swiper Controls -->
                <div class="swiper-pagination !bottom-0"></div>
                <div
                    class="swiper-button-prev !text-genz-lime hover:scale-125 transition-transform hidden md:flex after:!text-3xl font-black drop-shadow-[0_0_10px_rgba(204,255,0,0.5)]">
                </div>
                <div
                    class="swiper-button-next !text-genz-lime hover:scale-125 transition-transform hidden md:flex after:!text-3xl font-black drop-shadow-[0_0_10px_rgba(204,255,0,0.5)]">
                </div>
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

            <div
                class="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 text-lg font-bold uppercase tracking-widest">
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

    <!-- Project Detail Modal -->
    <div id="project-modal"
        class="fixed inset-0 z-50 hidden opacity-0 transition-opacity duration-300 flex items-center justify-center"
        role="dialog" aria-modal="true">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/90 backdrop-blur-md" onclick="closeModal()"></div>

        <!-- Modal Content -->
        <div
            class="relative w-full max-w-4xl max-h-[90vh] mx-auto p-4 flex flex-col items-center justify-center pointer-events-none">

            <div class="bg-black/80 border border-white/10 rounded-3xl overflow-hidden w-full shadow-2xl transform scale-95 transition-transform duration-300 pointer-events-auto"
                id="modal-panel">

                <!-- Close Button -->
                <button onclick="closeModal()"
                    class="absolute top-4 right-4 z-20 text-white/50 hover:text-genz-lime transition-colors p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div class="flex flex-col h-full max-h-[80vh] overflow-y-auto custom-scrollbar p-6 space-y-8">
                    <!-- Image Section -->
                    <div class="w-full shrink-0">
                        <img id="modal-image" src="" alt="Project Image"
                            class="w-full h-64 md:h-96 object-cover rounded-2xl border border-white/5 shadow-2xl">
                    </div>

                    <!-- Details Section -->
                    <div class="w-full flex flex-col text-left space-y-6">
                        <div class="text-center">
                            <h2 id="modal-title"
                                class="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none mb-4">
                            </h2>
                            <div id="modal-tags" class="flex flex-wrap gap-2 mb-6 justify-center"></div>
                        </div>

                        <div>
                            <p id="modal-description" class="text-gray-300 text-lg leading-relaxed font-light"></p>
                        </div>

                        <div class="pt-4 pb-4">
                            <a id="modal-link" href="#" target="_blank"
                                class="inline-flex items-center gap-2 bg-genz-lime text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-genz-pink hover:text-white transition-colors w-full justify-center shadow-[0_0_20px_rgba(204,255,0,0.3)]">
                                <span>VISIT WEBSITE</span>
                                <span>→</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- AJAX Modal Script -->
    <script>
        function openDetail(id) {
            const modal = document.getElementById('project-modal');
            const panel = document.getElementById('modal-panel');
            const backdrop = modal.querySelector('.absolute');

            // Show loading state or clear previous data if needed
            // Fetch Data
            fetch(`/projects/${id}`)
                .then(response => response.json())
                .then(data => {
                    // Populate Data
                    document.getElementById('modal-title').textContent = data.title;
                    document.getElementById('modal-description').innerHTML = data.description; // Use innerHTML for Rich Text
                    document.getElementById('modal-image').src = data.image ? `/storage/${data.image}` : `https://placehold.co/800x600/111/FFF?text=${encodeURIComponent(data.title)}`;
                    document.getElementById('modal-link').href = data.url || '#';

                    // Tags
                    const tagsContainer = document.getElementById('modal-tags');
                    tagsContainer.innerHTML = '';
                    if (data.tags) {
                        data.tags.forEach(tag => {
                            const span = document.createElement('span');
                            span.className = 'text-xs font-bold border border-genz-lime/30 text-genz-lime px-3 py-1 rounded-full uppercase';
                            span.textContent = tag;
                            tagsContainer.appendChild(span);
                        });
                    }

                    // Show Modal
                    modal.classList.remove('hidden');
                    // Small delay to allow display:block to apply before opacity transition
                    setTimeout(() => {
                        modal.classList.remove('opacity-0');
                        panel.classList.remove('scale-95');
                        panel.classList.add('scale-100');
                    }, 10);
                })
                .catch(error => console.error('Error fetching project:', error));
        }

        function closeModal() {
            const modal = document.getElementById('project-modal');
            const panel = document.getElementById('modal-panel');

            modal.classList.add('opacity-0');
            panel.classList.remove('scale-100');
            panel.classList.add('scale-95');

            setTimeout(() => {
                modal.classList.add('hidden');
            }, 300);
        }
    </script>
</body>

</html>