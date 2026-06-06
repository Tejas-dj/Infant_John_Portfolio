Okay DJ, now I see the full picture — this is a portfolio site you built for Infant John (nice work btw, the site looks clean). The problem is straightforward: Google doesn't know this site exists yet, and even when it does, it has almost zero signals to rank it for anything. Let me break down what's actually going on and what to do about it.

**The core issue:** The site is on a `vercel.app` subdomain, and the meta tags reference `infantjohna.com` as the OG URL — which I'm guessing either isn't set up yet or doesn't point anywhere. That mismatch alone confuses search engines. Plus, Vercel subdomains are treated as low-authority by Google since thousands of random projects live there.

Here's the SEO gameplan, roughly in priority order:

**1. Get on a custom domain (non-negotiable).** `infantjohna.com` or `infantjohn.in` — whatever's available. A Vercel subdomain will never rank well for competitive queries like "freelance photographer in Bangalore." Vercel makes custom domain setup trivial, you already know this. Cost: ₹500-800/year. This is the single highest-ROI move.

**2. Fix the technical SEO foundation.** Right now the site is a pretty shell with almost no text for Google to chew on. You need to add structured data (JSON-LD `Person` + `LocalBusiness` schema), fix the canonical URL to match the actual domain, add a proper `sitemap.xml` and `robots.txt`, and make sure the site is server-side rendered or at minimum uses proper meta tags that Googlebot can read without JS execution. If this is a Next.js app on Vercel (which I'm betting it is), you're already in a good spot for SSR — just make sure you're not client-rendering the important text content.

**3. Content is king — and right now the kingdom is empty.** The homepage has maybe 150 words of actual indexable text. Google needs *text* to understand what this site is about. Add a proper "About" page with Infant John's full name, "Bangalore" / "Bengaluru" mentioned naturally, the types of shoots he does (wedding photography, product photography, event videography, etc.), and areas he serves. Each service type ideally gets its own page or section. Think about what someone would actually search: "wedding photographer in Bangalore," "product photographer Bangalore," "freelance videographer near me." Those phrases need to exist on the site naturally, not stuffed.

**4. Google Business Profile.** This is free and massively underrated. If John operates as a freelancer in Bangalore, create a Google Business Profile with his name, service area, portfolio link, and category set to "Photographer." This alone can get him showing up in local search results and Google Maps within weeks. This is probably the fastest win after the custom domain.

**5. Backlinks and external signals.** Submit the site to Google Search Console immediately (you can do this even on the Vercel subdomain today — don't wait for the custom domain). Create or optimize profiles on Instagram (already exists), Behance (exists), YouTube (exists), and make sure ALL of them link back to the portfolio site with consistent name + location info. Consider listing on JustDial, Sulekha, UrbanClap/Urban Company, and WedMeGood if he does wedding work — those sites rank insanely well for "photographer in Bangalore" and funnel traffic.

**6. The "who is Infant John A" query.** This is actually the easiest one to win because there's zero competition for that exact name. Once Google indexes the site with proper title tags, meta descriptions, and an about page that literally says "Infant John A is a freelance photographer and videographer based in Bangalore," that query will resolve to this site within a few weeks of indexing. The harder battle is ranking for generic terms like "freelance photographer in Bangalore" — that's a 3-6 month grind minimum against established players.

**Quick wins you can do TODAY:**
Get into Google Search Console → submit the URL for indexing. That alone can get the site showing up in 2-5 days for the name-based query. Everything else is a compounding game.

Want me to generate the JSON-LD schema markup or a sitemap for the site? Or help you draft the SEO-optimized about page copy?